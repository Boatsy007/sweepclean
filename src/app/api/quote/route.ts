import { NextResponse } from "next/server";
import { FREQUENCY_OPTIONS, SERVICE_OPTIONS, labelFor, sanitise, validateContact, type QuoteRequest } from "@/lib/quote";
import { postcodeInArea } from "@/lib/areas";
import { site } from "@/lib/site";
import { leadFrom, leadTo } from "@/lib/leads";

export const runtime = "nodejs";

/* Best-effort per-instance rate limit (5 requests / 10 min / IP). */
const hits = new Map<string, number[]>();
function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 10 * 60_000);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > 5;
}

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

function summary(q: QuoteRequest) {
  const rows: [string, string | undefined][] = [
    ["Type", q.kind === "callback" ? "Call-back request" : "Quote request"],
    ["Service", q.service ? labelFor(SERVICE_OPTIONS, q.service) : undefined],
    ["Frequency", q.frequency ? labelFor(FREQUENCY_OPTIONS, q.frequency) : undefined],
    ["Property", q.propertyType],
    ["Bedrooms / bathrooms", q.bedrooms || q.bathrooms ? `${q.bedrooms ?? "?"} bed / ${q.bathrooms ?? "?"} bath` : undefined],
    ["Premises size", q.size],
    ["Pets", q.pets],
    ["Add-ons", q.extras?.length ? q.extras.join(", ") : undefined],
    ["Preferred date", q.startDate],
    ["Time of day", q.timePref],
    ["Suburb", [q.suburb, q.postcode].filter(Boolean).join(" ")],
    ["In usual area", q.postcode ? (postcodeInArea(q.postcode) ? "Yes" : "Check – outside usual postcodes") : "Unknown (no postcode)"],
    ["Name", q.name],
    ["Phone", q.phone],
    ["Email", q.email],
    ["Contact preference", q.contactPref],
    ["Notes", q.notes],
    ["Source", q.source],
  ];
  return rows.filter(([, v]) => v);
}

async function sendEmail(to: string, subject: string, html: string, replyTo?: string) {
  const key = process.env.RESEND_API_KEY;
  const from = leadFrom();
  if (!key || !from) return false;
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to: [to], subject, html, ...(replyTo ? { reply_to: replyTo } : {}) }),
  });
  if (!res.ok) console.error("[lead] resend failed", res.status, await res.text().catch(() => ""));
  return res.ok;
}

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (limited(ip)) return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });

  let raw: Record<string, unknown>;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad_json" }, { status: 400 });
  }

  // Spam traps: honeypot filled, or submitted impossibly fast. Pretend success.
  if ((typeof raw.website === "string" && raw.website.length > 0) || (typeof raw.elapsed === "number" && raw.elapsed < 2500)) {
    return NextResponse.json({ ok: true });
  }

  const q = sanitise(raw);
  const errors = validateContact(q, q.kind);
  if (q.kind === "quote" && !SERVICE_OPTIONS.some((o) => o.value === q.service)) errors.service = "invalid";
  if (Object.keys(errors).length) return NextResponse.json({ ok: false, errors }, { status: 422 });

  const rows = summary(q);
  const title = `${q.kind === "callback" ? "Call back" : "Quote"}: ${q.service ? labelFor(SERVICE_OPTIONS, q.service) : "General"} – ${q.suburb}`;
  const table = `<table cellpadding="6" style="border-collapse:collapse;font-family:sans-serif;font-size:14px">${rows
    .map(([k, v]) => `<tr><td style="color:#4a5578;vertical-align:top"><strong>${esc(k)}</strong></td><td>${esc(v!).replace(/\n/g, "<br>")}</td></tr>`)
    .join("")}</table>`;

  const delivered: string[] = [];
  const to = leadTo();
  try {
    if (to && (await sendEmail(to, title, `<h2 style="font-family:sans-serif">${esc(title)}</h2>${table}`, q.email))) delivered.push("email");
    const hook = process.env.LEAD_WEBHOOK_URL;
    if (hook) {
      const r = await fetch(hook, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...q, receivedAt: new Date().toISOString(), summary: Object.fromEntries(rows) }) });
      if (r.ok) delivered.push("webhook");
      else console.error("[lead] webhook failed", r.status);
    }
  } catch (err) {
    console.error("[lead] delivery error", err);
  }

  if (!delivered.length) {
    if (process.env.NODE_ENV !== "production" || process.env.LEAD_DEV_LOG === "1") {
      console.info("[lead] (no delivery configured – logged only)", JSON.stringify(Object.fromEntries(rows)));
      return NextResponse.json({ ok: true, delivered: ["log"] });
    }
    console.error("[lead] NOT DELIVERED – configure RESEND_API_KEY (and verify swept.com.au in Resend) or LEAD_WEBHOOK_URL", JSON.stringify(Object.fromEntries(rows)));
    return NextResponse.json({ ok: false, error: "delivery_failed" }, { status: 502 });
  }

  // Customer confirmation (non-blocking for success).
  if (q.email && process.env.RESEND_API_KEY) {
    const first = esc(q.name.split(" ")[0] ?? "");
    await sendEmail(
      q.email,
      "We've got your request – Swept Cleaning",
      `<div style="font-family:sans-serif;font-size:15px;color:#0b1a3a;line-height:1.55"><p>Hi ${first},</p><p>Thanks for asking Swept about your clean. We'll be in touch ${esc(site.quoteResponse)} with your tailored quote.</p><p>Here's what you told us:</p>${table}<p>Need to change something? Just reply to this email.</p><p>– The Swept team</p></div>`,
      to,
    ).catch(() => false);
  }

  return NextResponse.json({ ok: true, delivered });
}
