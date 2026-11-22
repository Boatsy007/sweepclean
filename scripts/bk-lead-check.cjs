#!/usr/bin/env node
/*
 * BookingKoala lead form on /quote.
 *
 *   BASE=http://localhost:3100 node scripts/bk-lead-check.cjs
 *
 * A. REAL (our side): the iframe is exactly as supplied; BookingKoala's resizer script is requested
 *    once per visit; one form after client-side navigation away and back and after a refresh; quote
 *    links keep their parameters; service/frequency reminder; no analytics events from the form; no
 *    horizontal overflow from 320px; no layout shift. (BookingKoala itself blocks this test machine, so
 *    its form content can't load here – the iframe shows BookingKoala's block page.)
 * B. SIMULATED resizer: BookingKoala's iframeResizer.min.js can't be read from here, so both ways it
 *    might work are simulated – (1) it only defines iFrameResize(), (2) it also sizes #iFrameResizer0
 *    itself when it loads – to check every iframe is set up exactly once in both cases.
 * A2. REAL: the homepage hero shows the same form inside the existing hero card.
 * Skipped (with a note) when /quote shows the site's own form (NEXT_PUBLIC_QUOTE_FORM=native).
 */
const { chromium, devices } = require("playwright");

const BASE = (process.env.BASE || "http://localhost:3100").replace(/\/$/, "");
const FORM_SRC = "https://sweptresidentialandcommercialcleaning.bookingkoala.com/leads/form/8a30eb91-5b26-4ddf-ac12-29ff53bba421?embed=true";
const RESIZER = "https://sweptresidentialandcommercialcleaning.bookingkoala.com/resources/iframeResizer.min.js";
const failures = [];
const notes = [];
const ok = (c, m, d = "") => (c ? notes.push("✓ " + m) : failures.push(m + (d ? ` – ${d}` : "")));

async function ctx(browser, opts, { stub } = {}) {
  const c = await browser.newContext({ ignoreHTTPSErrors: true, ...opts });
  await c.addInitScript(() => { window.__ev = []; window.gtag = (...a) => window.__ev.push(a); });
  const resizerRequests = [];
  c.on("request", (r) => r.url() === RESIZER && resizerRequests.push(r.url()));
  if (stub) {
    await c.route(FORM_SRC, (r) => r.fulfill({ status: 200, contentType: "text/html", body: "<!doctype html><body><h2>SIMULATED form</h2></body>" }));
    await c.route(RESIZER, (r) => r.fulfill({
      status: 200,
      contentType: "application/javascript",
      body: `window.__resizeCalls = window.__resizeCalls || [];
        window.iFrameResize = function (opts, el) { var f = typeof el === "string" ? document.querySelector(el) : el; window.__resizeCalls.push(f && f.id); if (f) f.iFrameResizer = { removeListeners: function () { window.__removed = (window.__removed || 0) + 1; } }; };
        ${stub === "auto" ? 'window.iFrameResize({}, "#iFrameResizer0");' : ""}`,
    }));
  }
  return { c, resizerRequests };
}
const events = (page) => page.evaluate(() => window.__ev.filter((e) => e[0] === "event").map((e) => e[1]));

(async () => {
  const html = await (await fetch(`${BASE}/quote`)).text();
  if (!html.includes('id="iFrameResizer0"')) {
    console.log("/quote shows the site's own form (native build) – BookingKoala lead form checks skipped");
    return;
  }
  const browser = await chromium.launch(process.env.HTTPS_PROXY ? { proxy: { server: process.env.HTTPS_PROXY, bypass: "localhost,127.0.0.1" } } : {});

  // ---- A. REAL
  {
    const { c, resizerRequests } = await ctx(browser, { viewport: { width: 1366, height: 900 } });
    const page = await c.newPage();
    await page.goto(`${BASE}/quote?service=regular-house-cleaning&frequency=fortnightly&utm_source=google&gclid=TEST1`, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(2500);
    const f = await page.evaluate(() => [...document.querySelectorAll("iframe")].map((x) => ({ id: x.id, src: x.getAttribute("src"), height: x.getAttribute("height"), width: x.getAttribute("width"), scrolling: x.getAttribute("scrolling"), border: x.style.border, title: x.title })));
    ok(f.length === 1 && f[0].id === "iFrameResizer0" && f[0].src === FORM_SRC && f[0].height === "1000px" && f[0].width === "100%" && f[0].scrolling === "yes" && /0/.test(f[0].border), "iframe exactly as supplied (id, src, border 0, height 1000px, width 100%, scrolling yes)", JSON.stringify(f));
    ok(!!f[0]?.title, "iframe has an accessible title");
    // The page's own <script defer> (as in BookingKoala's snippet). Here BookingKoala blocks this test machine, so the
    // script can't load and the component adds one backup copy; with a working script there's no copy.
    ok(await page.locator('script#bookingkoala-iframe-resizer[src="' + RESIZER + '"][defer]').count() === 1 && await page.locator('script[data-bk-dynamic]').count() <= 1 && resizerRequests.length <= 2, `BookingKoala's iframeResizer.min.js in the page as supplied (<script defer>), at most one backup copy (${resizerRequests.length} requests)`);
    ok(await page.locator('script[src*="bookingkoala.com/resources/embed.js"]').count() === 0, "embed.js (login only) not loaded on /quote");
    ok(/regular home cleaning/i.test(await page.locator("[data-chosen-service]").innerText().catch(() => "")) && /fortnightly/i.test(await page.locator("[data-chosen-service]").innerText().catch(() => "")), "service and frequency from the link shown as a reminder above the form");
    ok(page.url().includes("utm_source=google") && page.url().includes("gclid=TEST1"), "quote link parameters kept in the page URL");
    ok(!(await events(page)).some((e) => ["generate_lead", "quote_start", "quote_step"].includes(e)), "no lead or form events when the form loads");
    // Client-side navigation away and back, then refresh.
    await page.locator('header a[href="/"]').first().click();
    await page.waitForURL((u) => u.pathname === "/", { timeout: 10000 });
    await page.waitForTimeout(600);
    ok(await page.locator("iframe").count() === 1 && await page.locator("#quote iframe#iFrameResizer0").count() === 1 && await page.locator("[data-chosen-service]").count() === 0, "leaving /quote for the homepage: /quote's form removed, the homepage hero's form shown (one form)");
    await page.locator('header a[data-cta-intent="quote"] >> visible=true').first().click();
    await page.waitForURL((u) => u.pathname === "/quote", { timeout: 10000 });
    await page.waitForTimeout(1500);
    ok(await page.locator("iframe#iFrameResizer0").count() === 1, "client-side navigation back to /quote → exactly one form");
    ok(await page.locator('script[data-bk-dynamic]').count() <= 1, `no more than one backup script copy after navigating back (${resizerRequests.length} requests in total)`);
    await page.reload({ waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1500);
    ok(await page.locator("iframe#iFrameResizer0").count() === 1, "refresh → exactly one form");
    ok(!(await events(page)).some((e) => e === "generate_lead"), "no generate_lead from loading or navigating");
    await c.close();
  }
  for (const [label, opts] of [["320px", { viewport: { width: 320, height: 700 }, hasTouch: true }], ["phone", { ...devices["iPhone 13"] }], ["tablet 820", { viewport: { width: 820, height: 1180 }, hasTouch: true }], ["laptop 1280", { viewport: { width: 1280, height: 800 } }]]) {
    const { c } = await ctx(browser, opts);
    const page = await c.newPage();
    await page.addInitScript(() => { window.__cls = 0; new PerformanceObserver((l) => l.getEntries().forEach((e) => { if (!e.hadRecentInput) window.__cls += e.value; })).observe({ type: "layout-shift", buffered: true }); });
    await page.goto(`${BASE}/quote?service=bond-cleaning`, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(3000);
    const m = await page.evaluate(() => { const f = document.getElementById("iFrameResizer0"); const r = f.getBoundingClientRect(); return { ov: document.documentElement.scrollWidth - innerWidth, w: Math.round(r.width), vw: innerWidth, cls: window.__cls }; });
    ok(m.ov <= 0 && m.w <= m.vw, `${label}: no horizontal overflow; form ${m.w}px wide`, JSON.stringify(m));
    ok(m.cls < 0.1, `${label}: layout shift ${m.cls.toFixed(3)}`);
    await c.close();
  }

  // ---- A2. REAL: homepage hero (same component, hero variant)
  {
    const homeHtml = await (await fetch(`${BASE}/`)).text();
    ok(/<h2[^>]*id="hq-title"[^>]*>Request your free quote<\/h2>/.test(homeHtml) && homeHtml.includes('id="quote"'), "homepage hero card keeps its heading and #quote anchor");
    for (const [label, opts] of [["desktop 1366", { viewport: { width: 1366, height: 900 } }], ["laptop 1280", { viewport: { width: 1280, height: 800 } }], ["tablet 820", { viewport: { width: 820, height: 1180 }, hasTouch: true }], ["phone", { ...devices["iPhone 13"] }], ["320px", { viewport: { width: 320, height: 700 }, hasTouch: true }]]) {
      const { c } = await ctx(browser, opts);
      const page = await c.newPage();
      await page.addInitScript(() => { window.__cls = 0; new PerformanceObserver((l) => l.getEntries().forEach((e) => { if (!e.hadRecentInput) window.__cls += e.value; })).observe({ type: "layout-shift", buffered: true }); });
      await page.goto(`${BASE}/`, { waitUntil: "domcontentloaded" });
      await page.waitForTimeout(3000);
      const m = await page.evaluate(() => {
        const frames = document.querySelectorAll("iframe");
        const f = document.querySelector("#quote iframe#iFrameResizer0");
        const card = document.getElementById("quote");
        return { frames: frames.length, inCard: !!f, w: f ? Math.round(f.getBoundingClientRect().width) : 0, cardW: Math.round(card.getBoundingClientRect().width), cardH: Math.round(card.getBoundingClientRect().height), ov: document.documentElement.scrollWidth - innerWidth, cls: window.__cls, quickForm: !!document.getElementById("hq-name") };
      });
      ok(m.frames === 1 && m.inCard && !m.quickForm, `homepage ${label}: one BookingKoala form, inside the hero card (quick form replaced)`, JSON.stringify(m));
      ok(m.w === m.cardW, `homepage ${label}: form spans the hero card edge to edge (${m.w}px of ${m.cardW}px); card ${m.cardH}px tall at the 1000px starting height`);
      ok(m.ov <= 0, `homepage ${label}: no horizontal overflow`, `${m.ov}px`);
      ok(m.cls < 0.1, `homepage ${label}: layout shift ${m.cls.toFixed(3)}`);
      await c.close();
    }
    // Home → /quote → home without reloading: one form on each page, never two.
    const { c, resizerRequests } = await ctx(browser, { viewport: { width: 1366, height: 900 } });
    const page = await c.newPage();
    await page.goto(`${BASE}/`, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1500);
    await page.locator('header a[data-cta-intent="quote"] >> visible=true').first().click();
    await page.waitForURL((u) => u.pathname === "/quote", { timeout: 10000 });
    await page.waitForTimeout(1200);
    const onQuote = await page.locator("iframe#iFrameResizer0").count();
    await page.goBack();
    await page.waitForURL((u) => u.pathname === "/", { timeout: 10000 });
    await page.waitForTimeout(1500);
    const backHome = await page.evaluate(() => ({ frames: document.querySelectorAll("iframe").length, inCard: !!document.querySelector("#quote iframe#iFrameResizer0") }));
    ok(onQuote === 1 && backHome.frames === 1 && backHome.inCard, "home → /quote → Back (client-side): exactly one form on each page", `${onQuote} / ${JSON.stringify(backHome)}`);
    ok(await page.locator("script[data-bk-dynamic]").count() <= 1 && resizerRequests.length <= 2, `resizer script not duplicated across pages (${resizerRequests.length} requests – blocked here, so one backup copy is expected)`);
    ok(!(await events(page)).some((e) => e === "generate_lead"), "no generate_lead from loading the homepage form");
    await c.close();
  }

  // ---- B. SIMULATED resizer (both possible behaviours)
  for (const stub of ["function", "auto"]) {
    const { c } = await ctx(browser, { viewport: { width: 1366, height: 900 } }, { stub });
    const page = await c.newPage();
    await page.goto(`${BASE}/quote`, { waitUntil: "networkidle" });
    await page.waitForTimeout(800);
    const first = await page.evaluate(() => window.__resizeCalls);
    ok(JSON.stringify(first) === '["iFrameResizer0"]', `simulated resizer (${stub === "auto" ? "sizes the iframe itself" : "function only"}): iframe set up exactly once on a direct visit`, JSON.stringify(first));
    await page.locator('header a[href="/"]').first().click();
    await page.waitForURL((u) => u.pathname === "/", { timeout: 10000 });
    await page.waitForTimeout(500);
    const removed = await page.evaluate(() => window.__removed || 0);
    await page.locator('header a[data-cta-intent="quote"] >> visible=true').first().click();
    await page.waitForURL((u) => u.pathname === "/quote", { timeout: 10000 });
    await page.waitForTimeout(1000);
    const second = await page.evaluate(() => window.__resizeCalls);
    // /quote → homepage (its hero form) → /quote: three iframes in turn, each set up exactly once, the previous one released.
    const removedAfter = await page.evaluate(() => window.__removed || 0);
    ok(removed === 1 && removedAfter === 2 && JSON.stringify(second) === '["iFrameResizer0","iFrameResizer0","iFrameResizer0"]', `simulated resizer (${stub}): each iframe (/quote, homepage, /quote) set up exactly once, the previous one released`, `removed ${removed}/${removedAfter}, calls ${JSON.stringify(second)}`);
    await c.close();
  }

  await browser.close();
  console.log(notes.join("\n"));
  if (failures.length) { console.log(`\n${failures.length} failure(s):\n  ` + failures.join("\n  ")); process.exit(1); }
  console.log("\nAll BookingKoala lead form checks passed (part B uses a SIMULATED resizer; BookingKoala's real form can't load on this machine)");
})().catch((e) => { console.error(e); process.exit(1); });
