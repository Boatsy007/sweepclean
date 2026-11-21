#!/usr/bin/env node
/*
 * Jobber embedded request form on /quote.
 *
 *   BASE=http://localhost:3100 node scripts/jobber-check.cjs
 *
 * A. Real network: Jobber's snippet is fetched from its CDN and runs (it requests the form with the
 *    right client hub, form id and ad attribution). Wherever Jobber's form host can't be reached (it
 *    blocks some networks, e.g. cloud servers), Jobber shows its error and the backup form appears.
 * B. SIMULATED Jobber success: the form request is answered locally with an iframe in Jobber's format
 *    (no real Jobber form is loaded and nothing is submitted to Jobber). Checks the form shows, resizes,
 *    runs again after client-side navigation away and back, survives a refresh, fits phones, and that
 *    loading or using it never fires generate_lead.
 * A real Jobber submission can only be tested in a normal browser (see the report / docs).
 */
const { chromium, devices } = require("playwright");

const BASE = (process.env.BASE || "http://localhost:3100").replace(/\/$/, "");
const HUB = "9f3975e1-6497-4cc8-b29f-1f42950d978f-5384111";
const FORM = /clienthub\.getjobber\.com\/client_hubs\/9f3975e1-6497-4cc8-b29f-1f42950d978f\/public\/work_request\/embedded_work_request_form/;
const FRAME_URL = "https://clienthub.getjobber.com/__simulated_jobber_frame";
const failures = [];
const notes = [];
const ok = (c, m, d = "") => (c ? notes.push("✓ " + m) : failures.push(m + (d ? ` – ${d}` : "")));

async function context(browser, opts, { simulate }) {
  const c = await browser.newContext({ ignoreHTTPSErrors: true, ...opts });
  await c.addInitScript(() => {
    window.__ev = [];
    window.gtag = (...a) => window.__ev.push(a);
  });
  const formRequests = [];
  c.on("request", (r) => { if (FORM.test(r.url())) formRequests.push(r.url()); });
  if (simulate) {
    // Jobber's form endpoint returns an HTML document containing iframe.jobber-work-request.
    await c.route(FORM, (route) => route.fulfill({
      status: 200,
      headers: { "Content-Type": "text/html", "Access-Control-Allow-Origin": new URL(BASE).origin, "Access-Control-Allow-Credentials": "true" },
      body: `<html><body><iframe class="jobber-work-request" src="${FRAME_URL}" scrolling="no"></iframe></body></html>`,
    }));
    // The simulated form inside the iframe asks the page to resize it, like Jobber's does.
    await c.route(FRAME_URL, (route) => route.fulfill({ status: 200, contentType: "text/html", body: `<!doctype html><html><body style="margin:0;font-family:sans-serif"><h2 id="sim">Simulated Jobber form</h2><input id="name" placeholder="Name"><button id="next">Next</button><script>setTimeout(()=>parent.postMessage("950px","*"),300);document.getElementById("next").onclick=()=>parent.postMessage("1100px","*")</script></body></html>` }));
  }
  return { c, formRequests };
}
const events = (page) => page.evaluate(() => window.__ev.filter((e) => e[0] === "event").map((e) => ({ name: e[1], params: e[2] || {} })));

(async () => {
  const browser = await chromium.launch(process.env.HTTPS_PROXY ? { proxy: { server: process.env.HTTPS_PROXY, bypass: "localhost,127.0.0.1" } } : {});

  // ---- A. Real network
  {
    const { c, formRequests } = await context(browser, { viewport: { width: 1280, height: 900 } }, { simulate: false });
    const page = await c.newPage();
    const scripts = []; page.on("request", (r) => r.url().includes("work_request_embed_snippet.js") && scripts.push(r.url()));
    await page.goto(`${BASE}/quote?service=regular-house-cleaning&frequency=fortnightly&utm_source=google&utm_medium=cpc&gclid=TEST-GCLID-1`, { waitUntil: "domcontentloaded" });
    await page.waitForSelector("[data-jobber-form]", { state: "attached", timeout: 10000 }).catch(() => {});
    await page.waitForFunction((id) => document.getElementById(id)?.classList.contains("jobber-inline-work-request"), HUB, { timeout: 15000 }).catch(() => {});
    ok(await page.evaluate((id) => document.getElementById(id)?.classList.contains("jobber-inline-work-request"), HUB), "Jobber's snippet loaded from its CDN and ran (it set up the form container)");
    ok(scripts.length === 1, `snippet requested once (${scripts.length})`);
    await page.waitForTimeout(1500);
    const u = formRequests[0] ? new URL(formRequests[0]) : null;
    ok(u && u.searchParams.get("form_id") === "5384111", "form requested from Jobber with form_id 5384111", formRequests[0] || "no request");
    ok(u && u.searchParams.get("utm_source") === "google" && u.searchParams.get("gclid") === "TEST-GCLID-1", "UTM tags and gclid from the URL passed to Jobber");
    ok(await page.locator("[data-chosen-service]").count() === 1 && /regular home cleaning/i.test(await page.locator("[data-chosen-service]").innerText()) && /fortnightly/i.test(await page.locator("[data-chosen-service]").innerText()), "service and frequency from the button shown as a reminder above the form");
    const loaded = await page.locator("iframe.jobber-work-request").count();
    if (loaded) notes.push("ℹ Jobber's real form loaded on this network");
    else {
      await page.waitForSelector("text=didn't load", { timeout: 20000 }).catch(() => {});
      ok(await page.getByText(/didn.t load/).count() > 0 && await page.locator('[role="tablist"]').count() === 1, "Jobber unreachable here (Cloudflare) → backup form shown with a message and the phone number");
      ok((await events(page)).some((e) => e.name === "quote_form_fallback"), "quote_form_fallback event recorded (no personal data)");
    }
    ok(!(await events(page)).some((e) => e.name === "generate_lead"), "no generate_lead on page load");
    await c.close();
  }

  // ---- B. Simulated Jobber success
  for (const [label, opts] of [["desktop", { viewport: { width: 1366, height: 900 } }], ["phone", { ...devices["iPhone 13"] }], ["320px", { viewport: { width: 320, height: 700 }, hasTouch: true }]]) {
    const { c, formRequests } = await context(browser, opts, { simulate: true });
    const page = await c.newPage();
    const errors = []; page.on("pageerror", (e) => errors.push(e.message));
    // Land on an ad landing page, then go to /quote by client-side navigation (header CTA).
    await page.goto(`${BASE}/services/bond-cleaning?utm_source=google&utm_medium=cpc&utm_campaign=bond&gclid=TEST-GCLID-2`, { waitUntil: "networkidle" });
    await page.locator('main a[data-cta-intent="quote"]').first().click();
    await page.waitForURL((x) => x.pathname === "/quote" && x.searchParams.get("service") === "bond-cleaning", { timeout: 10000 });
    await page.waitForSelector("iframe.jobber-work-request", { state: "attached", timeout: 15000 }).catch(() => {});
    await page.waitForTimeout(1500);
    const shown = await page.evaluate(() => { const f = document.querySelector("iframe.jobber-work-request"); return f ? { vis: getComputedStyle(f).visibility, h: f.offsetHeight, w: f.getBoundingClientRect().width } : null; });
    ok(shown && shown.vis === "visible", `${label}: client-side navigation to /quote → Jobber form shown`, JSON.stringify(shown));
    ok(shown && Math.round(shown.h) === 950, `${label}: form resized by Jobber's height message (950px)`, JSON.stringify(shown));
    const u1 = formRequests[0] ? new URL(formRequests[0]) : null;
    ok(u1 && u1.searchParams.get("utm_campaign") === "bond" && u1.searchParams.get("gclid") === "TEST-GCLID-2", `${label}: ad attribution from the landing page passed to Jobber after internal navigation`, formRequests[0]);
    ok(await page.getByText(/didn.t load/).count() === 0 && await page.locator('[role="tablist"]').count() === 0, `${label}: no backup form when Jobber loads`);
    const ov = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    ok(ov <= 0, `${label}: no horizontal overflow`, `${ov}px`);
    ok(shown && shown.w <= (opts.viewport?.width ?? 390), `${label}: form fits the screen width (${Math.round(shown?.w ?? 0)}px)`);
    // Using the (simulated) form: Next → a new height message. Must not count as a lead.
    const frame = page.frames().find((f) => f.url() === FRAME_URL);
    if (frame) { await frame.click("#next"); await page.waitForTimeout(500); }
    ok(Math.round(await page.evaluate(() => document.querySelector("iframe.jobber-work-request")?.offsetHeight ?? 0)) === 1100, `${label}: form grows when Jobber asks (1100px)`);
    // Away and back again without a reload: the snippet must run again (a new form request).
    await page.locator('header a[href="/"]').first().click();
    await page.waitForURL((x) => x.pathname === "/", { timeout: 10000 });
    await page.waitForTimeout(800);
    ok(await page.locator("iframe.jobber-work-request").count() === 0, `${label}: form removed when leaving /quote`);
    await page.goBack();
    await page.waitForURL((x) => x.pathname === "/quote", { timeout: 10000 });
    await page.waitForSelector("iframe.jobber-work-request", { state: "attached", timeout: 15000 }).catch(() => {});
    await page.waitForTimeout(1200);
    ok(formRequests.length === 2 && await page.locator("iframe.jobber-work-request").count() === 1, `${label}: back to /quote (client-side) → form loaded again, exactly one form on the page`, `${formRequests.length} requests`);
    await page.reload({ waitUntil: "networkidle" });
    await page.waitForSelector("iframe.jobber-work-request", { state: "attached", timeout: 15000 }).catch(() => {});
    await page.waitForTimeout(1200);
    ok(await page.locator("iframe.jobber-work-request").count() === 1, `${label}: refresh → exactly one form`);
    const ev = await events(page);
    ok(!ev.some((e) => e.name === "generate_lead"), `${label}: no generate_lead from loading, navigating or clicking Next`);
    ok(!ev.some((e) => /@|0412|test-gclid/i.test(JSON.stringify(e.params))), `${label}: no personal data in analytics`);
    ok(!errors.length, `${label}: no page errors`, errors.join(" | "));
    await c.close();
  }

  // ---- C. Layout shift while the form loads (simulated success, phone)
  {
    const { c } = await context(browser, { ...devices["iPhone 13"] }, { simulate: true });
    const page = await c.newPage();
    await page.addInitScript(() => { window.__cls = 0; new PerformanceObserver((l) => l.getEntries().forEach((e) => { if (!e.hadRecentInput) window.__cls += e.value; })).observe({ type: "layout-shift", buffered: true }); });
    await page.goto(`${BASE}/quote`, { waitUntil: "networkidle" });
    await page.waitForTimeout(3000);
    const cls = await page.evaluate(() => window.__cls);
    ok(cls < 0.1, `/quote layout shift while Jobber's form loads: ${cls.toFixed(3)} (< 0.1)`);
    await c.close();
  }

  await browser.close();
  console.log(notes.join("\n"));
  if (failures.length) { console.log(`\n${failures.length} failure(s):\n  ` + failures.join("\n  ")); process.exit(1); }
  console.log("\nAll Jobber embed checks passed (B and C use a SIMULATED Jobber response)");
})().catch((e) => { console.error(e); process.exit(1); });
