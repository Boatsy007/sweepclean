#!/usr/bin/env node
/*
 * Enquiry delivery check – SIMULATED email (no Resend account, nothing is sent).
 *
 *   npm run build && node scripts/delivery-check.cjs
 *
 * Starts the built site several times with different delivery settings. A local mock stands in for
 * Resend's API (scripts/lib/resend-mock-preload.cjs redirects https://api.resend.com to it) and a local
 * receiver stands in for the Make.com webhook. Checks that:
 *  - every enquiry is emailed to the business inbox (hey@sweptcleans.com.au) with the customer as reply-to,
 *    and the customer gets an acknowledgement (quotes always have an email; call-backs may not);
 *  - email and webhook are independent: either one failing, timing out or missing doesn't stop the other;
 *  - when nothing is delivered the visitor gets an error (502), never a false success – including when
 *    LEAD_DEV_LOG is set on a Vercel production deployment by mistake;
 *  - a failed submission in the browser shows the error, stays on the form and fires no generate_lead.
 * It does NOT prove real delivery: that needs the live Resend setup (see docs/LEAD-WEBHOOK.md).
 */
const http = require("http");
const path = require("path");
const { spawn } = require("child_process");
const { chromium } = require("playwright");

const root = path.join(__dirname, "..");
const PRELOAD = path.join(__dirname, "lib", "resend-mock-preload.cjs");
const RESEND_PORT = 3599, HOOK_PORT = 3598, HUNG_PORT = 3597;
const BUSINESS = "hey@sweptcleans.com.au";
const failures = [];
const notes = [];
const fail = (m) => failures.push(m);

// ---- Mock Resend + webhook receiver
let resendMode = "ok", hookMode = "ok";
let emails = [], hooks = [];
const body = (req) => new Promise((r) => { let b = ""; req.on("data", (c) => (b += c)); req.on("end", () => r(b)); });
const resendSrv = http.createServer(async (req, res) => {
  const b = JSON.parse((await body(req)) || "{}");
  if (resendMode === "hang") return; // never answers – the site must time out
  emails.push({ ...b, auth: !!req.headers.authorization });
  if (resendMode === "fail") { res.writeHead(500, { "Content-Type": "application/json" }); return res.end('{"message":"simulated failure"}'); }
  res.writeHead(200, { "Content-Type": "application/json" }); res.end(`{"id":"sim-${emails.length}"}`);
});
const hookSrv = http.createServer(async (req, res) => {
  hooks.push(JSON.parse((await body(req)) || "{}"));
  res.writeHead(hookMode === "fail" ? 500 : 200); res.end(hookMode === "fail" ? "error" : "Accepted");
});

let port = 3610;
async function withServer(env, fn) {
  const p = port++;
  const server = spawn(process.execPath, [require.resolve("next/dist/bin/next", { paths: [root] }), "start", "-p", String(p)], {
    cwd: root,
    env: { PATH: process.env.PATH, HOME: process.env.HOME, NODE_ENV: "production", PORT: String(p), NODE_OPTIONS: `--require ${PRELOAD}`, ...env },
    stdio: "ignore",
  });
  try {
    const t = Date.now();
    for (;;) { try { if ((await fetch(`http://localhost:${p}/robots.txt`)).ok) break; } catch {} if (Date.now() - t > 30000) throw new Error("server did not start"); await new Promise((r) => setTimeout(r, 300)); }
    emails = []; hooks = [];
    await fn(`http://localhost:${p}`);
  } finally { server.kill(); }
}
const quote = { kind: "quote", customerType: "residential", cleaningType: "regular", service: "regular-house-cleaning", frequency: "weekly", bedrooms: "2", bathrooms: "1", suburb: "Robina", postcode: "4226", name: "Delivery Test", phone: "0412 345 678", email: "customer@example.com", consent: true };
const six = { kind: "quote", formLocation: "homepage_hero", enquiryId: "test-enquiry-0001", firstName: "Sixfield", lastName: "Tester", cleaningType: "bond", suburb: "Southport", postcode: "4215", phone: "0412 345 680", email: "six@example.com", consent: true, pageUrl: "/", source: "hero:direct" };
const callback = { kind: "callback", name: "Call Test", phone: "0400 111 222", suburb: "Logan Central", consent: true };
const post = async (base, b) => { const r = await fetch(`${base}/api/quote`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ website: "", elapsed: 4000, ...b }) }); return { status: r.status, json: await r.json().catch(() => ({})) }; };
const RESEND = { RESEND_API_KEY: "re_test_not_a_real_key", RESEND_MOCK_URL: `http://127.0.0.1:${RESEND_PORT}` };
const HOOK = { LEAD_WEBHOOK_URL: `http://127.0.0.1:${HOOK_PORT}/hook` };
const DEAD = `http://127.0.0.1:${HUNG_PORT + 50}`; // nothing listens here (connection refused)
const expect = (label, cond, detail) => (cond ? notes.push(`✓ ${label}`) : fail(`${label}: ${detail}`));

(async () => {
  await new Promise((r) => resendSrv.listen(RESEND_PORT, "127.0.0.1", r));
  await new Promise((r) => hookSrv.listen(HOOK_PORT, "127.0.0.1", r));

  // 1. Resend only (no Make.com webhook) – the launch set-up.
  resendMode = "ok"; hookMode = "ok";
  await withServer({ ...RESEND }, async (base) => {
    const q = await post(base, quote);
    const biz = emails.find((e) => e.to?.[0] === BUSINESS), ack = emails.find((e) => e.to?.[0] === "customer@example.com");
    expect("Resend only: quote → 200, delivered by email", q.status === 200 && JSON.stringify(q.json.delivered) === '["email"]', JSON.stringify(q));
    expect("Resend only: business email to hey@sweptcleans.com.au, reply-to the customer, from quotes@sweptcleans.com.au", biz && biz.reply_to === "customer@example.com" && /quotes@sweptcleans\.com\.au/.test(biz.from) && biz.auth, JSON.stringify(biz));
    expect("Resend only: customer acknowledgement sent, reply-to the business", ack && ack.reply_to === BUSINESS && /We've got your request/.test(ack.subject), JSON.stringify(ack));
    expect("Resend only: no webhook call", hooks.length === 0, `${hooks.length} webhook calls`);
    emails = [];
    const c = await post(base, callback);
    expect("Resend only: call-back without email → 200, business email only (no acknowledgement)", c.status === 200 && emails.length === 1 && emails[0].to[0] === BUSINESS, `${c.status} ${emails.length} emails`);
    emails = [];
    const noEmail = await post(base, { ...quote, email: undefined });
    expect("Resend only: quote without email → 422 (server-side), nothing sent", noEmail.status === 422 && noEmail.json.errors?.email && emails.length === 0, JSON.stringify(noEmail));
  });

  // 2. Resend + webhook – both channels.
  await withServer({ ...RESEND, ...HOOK }, async (base) => {
    const q = await post(base, quote);
    expect("Resend + webhook: delivered by both", q.status === 200 && JSON.stringify(q.json.delivered) === '["email","webhook"]' && hooks.length === 1 && hooks[0].type === "quote_request" && hooks[0].customer.email === "customer@example.com", JSON.stringify(q));
    // The six-field form: every field reaches the business email, the acknowledgement and the webhook.
    emails = []; hooks = [];
    const s6 = await post(base, six);
    const biz = emails.find((e) => e.to?.[0] === BUSINESS), ack = emails.find((e) => e.to?.[0] === "six@example.com"), h = hooks[0];
    expect("Six-field form: delivered by email and webhook", s6.status === 200 && JSON.stringify(s6.json.delivered) === '["email","webhook"]', JSON.stringify(s6));
    expect("Six-field form: business email has name, cleaning type, suburb, phone and email", biz && ["Sixfield Tester", "Bond / End of Lease Cleaning", "Southport 4215", "0412 345 680", "six@example.com", "test-enquiry-0001"].every((x) => biz.html.includes(x)) && /Bond \/ End of Lease Cleaning – Southport/.test(biz.subject), JSON.stringify(biz).slice(0, 400));
    expect("Six-field form: customer acknowledgement sent (Hi Sixfield, reply within 1 hour during business hours)", ack && /Hi Sixfield/.test(ack.html) && /within 1 hour during business hours/.test(ack.html), JSON.stringify(ack).slice(0, 300));
    expect("Six-field form: webhook carries first/last name, cleaning type, suburb, phone, email, enquiry ID, form location, lead notes",
      h && h.type === "quote_request" && h.customer.first_name === "Sixfield" && h.customer.last_name === "Tester" && h.customer.phone === "0412 345 680" && h.customer.email === "six@example.com" && h.cleaning_type?.label === "Bond / End of Lease Cleaning" && h.property.suburb === "Southport" && h.service?.slug === "bond-cleaning" && h.enquiry_id === "test-enquiry-0001" && h.form_location === "homepage_hero" && /Cleaning type: Bond/.test(h.lead_notes) && /Suburb: Southport 4215/.test(h.lead_notes),
      JSON.stringify(h).slice(0, 600));
    emails = []; hooks = [];
    const again = await post(base, six);
    expect("Six-field form: the same enquiry sent again → 200 (duplicate), no second email or webhook", again.status === 200 && again.json.duplicate === true && emails.length === 0 && hooks.length === 0, `${JSON.stringify(again)} ${emails.length} emails ${hooks.length} hooks`);
    const noLast = await post(base, { ...six, enquiryId: "test-enquiry-0002", lastName: "" });
    expect("Six-field form: missing last name → 422 (server-side)", noLast.status === 422 && noLast.json.errors?.lastName, JSON.stringify(noLast));
  });

  // 3. Webhook failing (500) or unreachable – the email still goes.
  hookMode = "fail";
  await withServer({ ...RESEND, ...HOOK }, async (base) => {
    const q = await post(base, quote);
    expect("Webhook returns 500: email still delivered, visitor sees success", q.status === 200 && JSON.stringify(q.json.delivered) === '["email"]' && emails.some((e) => e.to[0] === BUSINESS), JSON.stringify(q));
  });
  hookMode = "ok";
  await withServer({ ...RESEND, LEAD_WEBHOOK_URL: `${DEAD}/hook` }, async (base) => {
    const q = await post(base, quote);
    expect("Webhook unreachable: email still delivered", q.status === 200 && JSON.stringify(q.json.delivered) === '["email"]', JSON.stringify(q));
  });

  // 4. Resend failing – the webhook still goes (when set); with no webhook the visitor gets an error.
  resendMode = "fail";
  await withServer({ ...RESEND }, async (base) => {
    const q = await post(base, quote);
    expect("Resend returns 500, no webhook: 502 error (no false success), no acknowledgement", q.status === 502 && q.json.error === "delivery_failed" && !emails.some((e) => e.to[0] === "customer@example.com"), JSON.stringify(q));
    // Browser: the visitor sees the error, stays on the form, and no generate_lead is recorded.
    const b = await chromium.launch();
    const page = await b.newPage({ viewport: { width: 1280, height: 900 } });
    await page.addInitScript(() => { window.__ev = []; window.gtag = (...a) => window.__ev.push(a); });
    await page.goto(`${base}/`, { waitUntil: "networkidle" });
    await page.evaluate(() => { window.gtag = (...a) => window.__ev.push(a); });
    await page.fill("#hq-firstName", "Browser"); await page.fill("#hq-lastName", "Test"); await page.fill("#hq-phone", "0412 345 679"); await page.fill("#hq-email", "browser@example.com");
    await page.fill("#hq-suburb", "Robina 4226"); await page.selectOption("#hq-cleaningType", "deep"); await page.check("#hq-consent");
    await page.waitForTimeout(2700);
    await page.click("#quote button[type=submit]");
    await page.waitForTimeout(2500);
    const shown = await page.getByText(/didn.t send/i).count();
    const leads = await page.evaluate(() => window.__ev.filter((e) => e[0] === "event" && e[1] === "generate_lead").length);
    expect("Browser, delivery failed: error shown with phone/email, stays on the form, no generate_lead", shown > 0 && !/\/quote\/thanks/.test(page.url()) && leads === 0, `error shown ${shown}, url ${page.url()}, generate_lead ${leads}`);
    await b.close();
  });
  await withServer({ RESEND_API_KEY: "re_test_not_a_real_key", RESEND_MOCK_URL: DEAD, ...HOOK }, async (base) => {
    const q = await post(base, quote);
    expect("Resend unreachable, webhook set: delivered by webhook (the channels are independent)", q.status === 200 && JSON.stringify(q.json.delivered) === '["webhook"]' && hooks.length === 1, JSON.stringify(q));
  });
  hookMode = "fail";
  await withServer({ ...RESEND, ...HOOK }, async (base) => {
    const q = await post(base, quote);
    expect("Resend 500 and webhook 500: 502 error", q.status === 502, JSON.stringify(q));
  });
  hookMode = "ok";

  // 5. Resend not answering – the site gives up after 10 s and reports the failure.
  resendMode = "hang";
  await withServer({ RESEND_API_KEY: "re_test_not_a_real_key", RESEND_MOCK_URL: `http://127.0.0.1:${RESEND_PORT}` }, async (base) => {
    const t = Date.now();
    const q = await post(base, quote);
    const s = (Date.now() - t) / 1000;
    expect(`Resend not answering: 502 after ${s.toFixed(1)} s (10 s timeout, no hang)`, q.status === 502 && s < 20, JSON.stringify(q));
  });
  resendMode = "ok";

  // 6. Nothing configured (today's live set-up) – an error, never a false success.
  await withServer({}, async (base) => {
    const q = await post(base, quote);
    expect("Nothing configured (production build): 502 error", q.status === 502 && q.json.error === "delivery_failed", JSON.stringify(q));
  });
  await withServer({ LEAD_DEV_LOG: "1", VERCEL_ENV: "production" }, async (base) => {
    const q = await post(base, quote);
    expect("LEAD_DEV_LOG set on a Vercel production deployment by mistake: still a 502 error (log-only success is blocked)", q.status === 502, JSON.stringify(q));
  });

  resendSrv.close(); hookSrv.close();
  console.log("SIMULATED delivery (local mock in place of Resend – no real email sent):\n  " + notes.join("\n  "));
  if (failures.length) { console.log(`\n${failures.length} failure(s):\n  ` + failures.join("\n  ")); process.exit(1); }
  console.log("\nAll delivery checks passed (simulated)");
})().catch((e) => { console.error(e); process.exit(1); });
