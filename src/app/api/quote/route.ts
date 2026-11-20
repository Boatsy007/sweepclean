import { NextResponse } from "next/server";
import { SERVICE_OPTIONS, cleaningTypeBy, frequencyLabel, labelFor, sanitise, validateContact, type QuoteRequest } from "@/lib/quote";
import { LEGACY_PACKAGE_NAMES } from "@/lib/regularCleaning";
import { services } from "@/lib/services";
import { buildLeadPayload } from "@/lib/leadPayload";
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

// Row names are kept from before the quote-only change (an automation may read them); new rows are only added.
function summary(q: QuoteRequest) {
  const ct = cleaningTypeBy(q.cleaningType);
  const rows: [string, string | undefined][] = [
    ["Type", q.kind === "callback" ? "Call-back request" : "Quote request"],
    ["Customer type", q.customerType === "commercial" ? "Commercial" : q.customerType === "residential" ? "Residential" : undefined],
    ["Cleaning type", ct?.label],
    ["Service", q.service ? labelFor(SERVICE_OPTIONS, q.service) : undefined],
    ["Business name", q.businessName],
    ["Old booking page", q.legacyBooking ? `Sent from an old booking page${q.package && LEGACY_PACKAGE_NAMES[q.package] ? ` (${LEGACY_PACKAGE_NAMES[q.package]} package)` : ""}${Number(q.extraHours) > 0 ? `, ${q.extraHours} extra hour(s)` : ""}${Number(q.bedMaking) > 0 ? `, bed making ${q.bedMaking} bed(s)` : ""}${Number(q.linenChange) > 0 ? `, linen change ${q.linenChange} bed(s)` : ""} – no price quoted` : undefined],
    ["Address", q.address],
    ["Frequency", q.frequency ? frequencyLabel(q.frequency) : undefined],
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

/** Resend email. Never throws: a network error or timeout counts as "not sent". */
async function sendEmail(to: string, subject: string, html: string, replyTo?: string) {
  const key = process.env.RESEND_API_KEY;
  const from = leadFrom();
  if (!key || !from || !to) return false;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to: [to], subject, html, ...(replyTo ? { reply_to: replyTo } : {}) }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) console.error("[lead] resend failed", res.status, await res.text().catch(() => ""));
    return res.ok;
  } catch (err) {
    console.error("[lead] resend error", err);
    return false;
  }
}

/** Optional webhook (e.g. Make.com → BookingKoala). Never throws; independent of the email. */
async function sendWebhook(url: string, body: unknown) {
  try {
    const r = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body), signal: AbortSignal.timeout(10_000) });
    if (!r.ok) console.error("[lead] webhook failed", r.status);
    return r.ok;
  } catch (err) {
    console.error("[lead] webhook error", err);
    return false;
  }
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
  if (q.kind === "quote") {
    if (q.legacyBooking) {
      // A stale /book-now tab (retired booking form): keep the enquiry as a regular-cleaning quote.
      q.service = "regular-house-cleaning";
      q.cleaningType = "regular";
      q.customerType = "residential";
    } else if (q.cleaningType) {
      // Central quote form: the cleaning type decides the service and customer type.
      const ct = cleaningTypeBy(q.cleaningType);
      if (!ct) errors.cleaningType = "invalid";
      else {
        q.service = ct.service;
        q.customerType = ct.customer;
      }
    } else if (!SERVICE_OPTIONS.some((o) => o.value === q.service)) errors.service = "invalid";
  }
  if (!q.customerType && q.service) q.customerType = services.find((s) => s.slug === q.service)?.commercial ? "commercial" : "residential";
  if (q.customerType !== "commercial") q.businessName = undefined;
  if (Object.keys(errors).length) return NextResponse.json({ ok: false, errors }, { status: 422 });

  const rows = summary(q);
  const what = q.cleaningType ? cleaningTypeBy(q.cleaningType)?.label : q.service ? labelFor(SERVICE_OPTIONS, q.service) : "General";
  const title = `${q.kind === "callback" ? "Call back" : q.customerType === "commercial" ? "Commercial quote" : "Quote"}: ${what} – ${q.suburb}`;
  const table = `<table cellpadding="6" style="border-collapse:collapse;font-family:sans-serif;font-size:14px">${rows
    .map(([k, v]) => `<tr><td style="color:#4a5578;vertical-align:top"><strong>${esc(k)}</strong></td><td>${esc(v!).replace(/\n/g, "<br>")}</td></tr>`)
    .join("")}</table>`;

  // Two independent channels, sent in parallel: the Resend email to the business inbox (the
  // primary record of every enquiry) and, when configured, the webhook (Make.com → BookingKoala).
  // A missing or failing webhook never stops the email, and vice versa.
  const to = leadTo();
  const hook = process.env.LEAD_WEBHOOK_URL;
  const [emailed, hooked] = await Promise.all([
    sendEmail(to, title, `<h2 style="font-family:sans-serif">${esc(title)}</h2>${table}`, q.email),
    hook ? sendWebhook(hook, buildLeadPayload(q, Object.fromEntries(rows))) : Promise.resolve(false),
  ]);
  const delivered = [...(emailed ? ["email"] : []), ...(hooked ? ["webhook"] : [])];

  if (!delivered.length) {
    // Local development and automated tests only: log instead of sending. Never on a Vercel
    // production deployment, so the live site can't report success without delivering.
    const logOnly = process.env.VERCEL_ENV !== "production" && (process.env.NODE_ENV !== "production" || process.env.LEAD_DEV_LOG === "1");
    if (logOnly) {
      console.info("[lead] (no delivery configured – logged only)", JSON.stringify(Object.fromEntries(rows)));
      return NextResponse.json({ ok: true, delivered: ["log"] });
    }
    // The visitor is told it didn't send (with the phone number and email address to use instead).
    console.error("[lead] NOT DELIVERED – check RESEND_API_KEY (sweptcleans.com.au verified in Resend) and LEAD_WEBHOOK_URL", JSON.stringify(Object.fromEntries(rows)));
    return NextResponse.json({ ok: false, error: "delivery_failed" }, { status: 502 });
  }
  if (process.env.RESEND_API_KEY && !emailed) console.error("[lead] email NOT sent – lead delivered by webhook only", JSON.stringify(Object.fromEntries(rows)));

  // Customer acknowledgement (only once the enquiry itself has been delivered; its own failure
  // doesn't fail the request). Replies go to the business inbox.
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
