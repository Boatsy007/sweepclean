#!/usr/bin/env node
/*
 * Conversion pathway check – every CTA leads to the central quote form, with the right preselection.
 *
 *   BASE=http://localhost:3100 node scripts/cta-check.cjs
 *
 * 1. Server HTML of every sitemap page: no booking CTAs; every [data-cta-intent="quote"] link → /quote or
 *    #quote; service pages' quote CTAs in <main> preselect their service; no link to the retired
 *    /book-now; no Swept prices or price structured data outside the educational guides; no BookingKoala
 *    outside /login. The regular cleaning page keeps #prices with weekly/fortnightly/monthly quote cards.
 * 2. Redirects: /book-now (with its query string) and /book → /quote?service=regular-house-cleaning in one hop.
 * 3. Browser, genuine pointer taps, 320–430px + tablet: the sticky bar, header Get a Free Quote tile,
 *    menu and login tile land correctly; no horizontal overflow.
 * 4. The six-field quote form: the approved 8 cleaning types, no tabs or extra questions, preselection
 *    from ?service and ?type, retired ?package shows nothing, validation, and real submissions (residential
 *    on a phone, commercial with a landline, homepage hero "Other / Not Sure") → thank-you page.
 */
const { chromium } = require("playwright");

const BASE = (process.env.BASE || "http://localhost:3100").replace(/\/$/, "");
const failures = [];
const fail = (m) => failures.push(m);
const notes = [];

const decode = (s) => s.replace(/&amp;/g, "&");
const mainOf = (html) => html.slice(html.indexOf("<main"), html.indexOf("</main>"));
function ctas(html) {
  return [...html.matchAll(/<a\s[^>]*>/g)]
    .map((m) => m[0])
    .filter((t) => /data-cta-intent="/.test(t))
    .map((t) => ({ intent: t.match(/data-cta-intent="([^"]+)"/)[1], href: decode((t.match(/href="([^"]*)"/) || [])[1] || "") }));
}
// Swept's retired prices and any price/offer markup. Guides are excluded (market price ranges, kept unchanged).
const SWEPT_PRICE = /\$\s?(97|147|207|67)\b|\+\s?GST|minPrice|PriceSpecification|"price"\s*:|Request booking/i;
const textOf = (html) => html.replace(/<script(?![^>]*application\/ld\+json)[\s\S]*?<\/script>/g, " ").replace(/<style[\s\S]*?<\/style>/g, " ");

(async () => {
  // ---- 1. Server HTML of every sitemap page
  const sm = await (await fetch(`${BASE}/sitemap.xml`)).text();
  const paths = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
  let quoteCtas = 0;
  for (const p of paths) {
    const html = await (await fetch(BASE + p)).text();
    const all = ctas(html);
    const inMain = ctas(mainOf(html));
    for (const c of all) {
      if (c.intent !== "quote") fail(`${p}: ${c.intent} CTA → ${c.href}`);
      else quoteCtas++;
      if (!/^(\/quote(\?|$)|#quote$)/.test(c.href)) fail(`${p}: quote CTA → ${c.href}`);
    }
    if (/href="\/book-now/.test(html)) fail(`${p}: links to the retired /book-now`);
    const svc = p.match(/^\/services\/([^/]+)/)?.[1];
    if (svc && !inMain.every((c) => c.href.includes(`service=${svc}`))) fail(`${p}: a quote CTA in <main> doesn't preselect ${svc}`);
    if (["/", "/services/regular-house-cleaning"].includes(p) || /^\/areas\/[^/]+\/[^/]+$/.test(p)) {
      if (!inMain.length || inMain[0].intent !== "quote") fail(`${p}: first CTA should be Get a free quote`);
    }
    if (!p.startsWith("/cleaning-guides/") && SWEPT_PRICE.test(textOf(html))) fail(`${p}: Swept price, price markup or booking wording found: ${textOf(html).match(SWEPT_PRICE)[0]}`);
    if (p.startsWith("/cleaning-guides/") && /minPrice|PriceSpecification|"price"\s*:/.test(html)) fail(`${p}: price structured data`);
    if (/bookingkoala\.com/.test(html)) fail(`${p}: references BookingKoala (it belongs only on /login)`);
  }
  notes.push(`Server HTML: ${paths.length} sitemap pages, ${quoteCtas} quote CTAs, no booking CTAs, no Swept prices`);
  {
    const html = await (await fetch(BASE + "/services/regular-house-cleaning")).text();
    const sec = html.slice(html.indexOf('id="prices"'), html.indexOf("</section>", html.indexOf('id="prices"')));
    for (const f of ["weekly", "fortnightly", "monthly"]) {
      if (!sec.includes(`href="/quote?service=regular-house-cleaning&amp;frequency=${f}"`)) fail(`#prices: no ${f} quote card`);
      if (!sec.includes(`${f[0].toUpperCase()}${f.slice(1)} house cleaning`)) fail(`#prices: no "${f} house cleaning" title`);
    }
    if (!/Included in every regular clean/.test(sec) || !/Need a little extra\?/.test(sec)) fail("#prices: inclusions or extras box missing");
    notes.push("#prices: anchor kept, weekly/fortnightly/monthly cards → quote with frequency, inclusions + extras kept");
  }

  // ---- 2. Redirects from the retired booking page (one hop, query string kept)
  for (const [from, want] of [
    ["/book-now?package=spotless&frequency=weekly&suburb=Robina&utm_source=google&gclid=TEST123", { service: "regular-house-cleaning", frequency: "weekly", suburb: "Robina", utm_source: "google", gclid: "TEST123" }],
    ["/book-now", { service: "regular-house-cleaning" }],
    ["/book", { service: "regular-house-cleaning" }],
  ]) {
    const r = await fetch(BASE + from, { redirect: "manual" });
    const loc = r.headers.get("location") || "";
    const u = new URL(loc, BASE);
    if (r.status !== 308 || u.pathname !== "/quote") fail(`${from}: ${r.status} → ${loc} (expected 308 → /quote)`);
    for (const [k, v] of Object.entries(want)) if (u.searchParams.get(k) !== v) fail(`${from}: ${k} not kept (${loc})`);
    const r2 = await fetch(u.href, { redirect: "manual" });
    if (r2.status !== 200) fail(`${from}: redirect target ${u.pathname} returned ${r2.status} (chain?)`);
  }
  notes.push("/book-now and /book → 308 → /quote?service=regular-house-cleaning (query kept, single hop)");

  // ---- 3. Browser: sticky bar per page type + genuine taps
  const browser = await chromium.launch();
  const barExpect = [
    ["/", "#quote"],
    ["/areas/gold-coast/helensvale", "#quote"],
    ["/areas/logan", "/quote"],
    ["/services/regular-house-cleaning", "/quote?service=regular-house-cleaning"],
    ["/services/regular-house-cleaning/gold-coast", "/quote?service=regular-house-cleaning"],
    ["/cleaning-guides/how-much-does-house-cleaning-cost-in-logan", null],
    ["/services/commercial-cleaning", "/quote?service=commercial-cleaning"],
    ["/services/commercial-cleaning/brisbane", "/quote?service=commercial-cleaning"],
    ["/services/bond-cleaning/logan", "/quote?service=bond-cleaning"],
    ["/cleaning-guides/bond-cleaning-cost-gold-coast", "/quote?service=bond-cleaning"],
  ];
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true });
  for (const [p, href] of barExpect) {
    const page = await ctx.newPage();
    await page.goto(BASE + p, { waitUntil: "networkidle" });
    const bar = page.locator("[data-mobile-cta-bar] a[data-cta-intent]");
    const got = (await bar.count()) ? { intent: await bar.getAttribute("data-cta-intent"), href: await bar.getAttribute("href") } : null;
    if (!got || got.intent !== "quote" || (href ? got.href !== href : !/^\/quote(\?|$)/.test(got.href))) fail(`sticky bar ${p}: expected quote ${href ?? "/quote…"}, got ${JSON.stringify(got)}`);
    await page.close();
  }
  for (const p of ["/book-now", "/login", "/quote"]) {
    const page = await ctx.newPage();
    await page.goto(BASE + p, { waitUntil: "networkidle" });
    if (await page.locator("[data-mobile-cta-bar] a[data-cta-intent]").count()) fail(`sticky bar visible on ${p}`);
    await page.close();
  }

  for (const w of [320, 360, 375, 390, 414, 430, 768, 820]) {
    const c = await browser.newContext({ viewport: { width: w, height: 800 }, hasTouch: true });
    const page = await c.newPage();
    const tapTo = async (locator, expect, label) => {
      await locator.first().tap();
      await page.waitForURL((u) => u.pathname === expect, { timeout: 8000 }).catch(() => fail(`@${w}px ${label}: did not reach ${expect} (at ${page.url()})`));
    };
    for (const p of ["/", "/quote", "/services/regular-house-cleaning"]) {
      await page.goto(BASE + p, { waitUntil: "networkidle" });
      const ov = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
      if (ov > 0) fail(`@${w}px ${p}: horizontal overflow ${ov}px`);
    }
    await page.goto(BASE + "/", { waitUntil: "networkidle" });
    await tapTo(page.locator('header a[data-cta-intent="quote"] >> visible=true'), "/quote", "header Get a Free Quote tile");
    await page.goto(BASE + "/services/commercial-cleaning", { waitUntil: "networkidle" });
    await page.locator('[data-mobile-cta-bar] a[data-cta-intent="quote"]').first().tap();
    await page.waitForURL((u) => u.pathname === "/quote" && u.searchParams.get("service") === "commercial-cleaning", { timeout: 8000 }).catch(() => fail(`@${w}px sticky commercial quote → ${page.url()}`));
    await page.goto(BASE + "/", { waitUntil: "networkidle" });
    await page.locator('header button[aria-controls="mobile-nav"]').tap();
    await page.waitForTimeout(500);
    await tapTo(page.locator('#mobile-nav a[data-cta-intent="quote"]'), "/quote", "menu Get a free quote");
    await page.goto(BASE + "/", { waitUntil: "networkidle" });
    await tapTo(page.locator('header a[href="/login"] >> visible=true'), "/login", "header Customer Login");
    notes.push(`@${w}px: taps OK, no overflow`);
    await c.close();
  }
  {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    await page.goto(BASE + "/", { waitUntil: "networkidle" });
    await page.locator('header a[data-cta-intent="quote"] >> visible=true').first().click();
    await page.waitForURL((u) => u.pathname === "/quote", { timeout: 8000 }).catch(() => fail("desktop header Get a free quote"));
    await page.close();
  }

  // ---- 4. The quote form (six fields: homepage hero and /quote)
  // (Each suite runs against its own fresh server – npm run test:all – so the quote API rate limit is untouched.)
  {
    const c = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const page = await c.newPage();
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto(BASE + "/quote", { waitUntil: "networkidle" });
    const opts = (await page.locator("#qf-cleaningType option").allTextContents()).filter((o) => o !== "Select one…");
    if (opts.length !== 8) fail(`/quote: expected 8 cleaning types, got ${opts.join(", ")}`);
    if (opts.some((o) => /window|carpet|spring|strata|retail/i.test(o))) fail(`/quote: unapproved option: ${opts.join(", ")}`);
    if (await page.locator('[role="tab"]').count()) fail("/quote: old Residential/Commercial tabs still shown");
    if (await page.locator("text=Bedrooms").count()) fail("/quote: asks about bedrooms");
    // Retired package links show no banner or package name; ?type=commercial preselects Commercial / Office.
    await page.goto(BASE + "/quote?service=regular-house-cleaning&package=spotless", { waitUntil: "networkidle" });
    if (await page.getByText(/Spotless|package|\$\d/i).count()) fail("?package=spotless: package or price shown");
    await page.goto(BASE + "/quote?type=commercial", { waitUntil: "networkidle" });
    if ((await page.inputValue("#qf-cleaningType")) !== "commercial") fail("?type=commercial: Commercial / Office not preselected");
    const canon = await page.locator('link[rel="canonical"]').getAttribute("href");
    if (!/\/quote$/.test(canon || "")) fail(`?type=commercial canonical ${canon}`);
    if (errors.length) fail(`quote form page errors: ${errors.join(" | ")}`);
    await c.close();
  }
  // Residential, from the fortnightly card on the regular cleaning page (phone, real taps), to the real API.
  {
    const c = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true });
    const page = await c.newPage();
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto(BASE + "/services/regular-house-cleaning", { waitUntil: "networkidle" });
    await page.locator('#prices a[href="/quote?service=regular-house-cleaning&frequency=fortnightly"]').tap();
    await page.waitForURL((u) => u.pathname === "/quote" && u.searchParams.get("frequency") === "fortnightly", { timeout: 8000 }).catch(() => fail("fortnightly card → /quote"));
    await page.waitForTimeout(300);
    if ((await page.inputValue("#qf-cleaningType")) !== "regular") fail("fortnightly card: Regular House Cleaning not preselected");
    await page.locator('button[type="submit"]', { hasText: "Get My Free Quote" }).tap();
    const errCount = await page.locator('form [role="alert"]').count();
    if (errCount < 6) fail(`residential: expected 6+ validation errors, got ${errCount}`);
    await page.fill("#qf-firstName", "Test");
    await page.fill("#qf-lastName", "Resident");
    await page.fill("#qf-suburb", "Robina 4226");
    await page.fill("#qf-phone", "0412 345 678");
    await page.fill("#qf-email", "test@example.com");
    await page.locator("#qf-consent").check();
    await page.waitForTimeout(2600); // the API ignores submissions made in under 2.5s (bot trap)
    await page.locator('button[type="submit"]', { hasText: "Get My Free Quote" }).tap();
    await page.waitForURL((u) => u.pathname === "/quote/thanks" && u.searchParams.get("type") === "quote" && u.searchParams.get("service") === "regular-house-cleaning", { timeout: 10000 }).catch(() => fail(`residential quote did not reach the thank-you page (at ${page.url()})`));
    if (/Test/.test(new URL(page.url()).search)) fail("thank-you URL contains the customer's name");
    if (await page.getByText(/booking request|final price|confirm your appointment/i).count()) fail("thank-you page promises a booking confirmation or price");
    if (errors.length) fail(`residential journey page errors: ${errors.join(" | ")}`);
    notes.push("Residential: fortnightly card → Regular preselected → validation → submit (real API) → thank-you OK");
    await c.close();
  }
  // Commercial, from the commercial service page (desktop); and the homepage hero (desktop).
  {
    const c = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const page = await c.newPage();
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto(BASE + "/services/commercial-cleaning", { waitUntil: "networkidle" });
    await page.locator('main a[data-cta-intent="quote"]').first().click();
    await page.waitForURL((u) => u.pathname === "/quote" && u.searchParams.get("service") === "commercial-cleaning", { timeout: 8000 });
    await page.waitForTimeout(300);
    if ((await page.inputValue("#qf-cleaningType")) !== "commercial") fail("commercial preselect: cleaning type not preselected");
    await page.fill("#qf-firstName", "Test");
    await page.fill("#qf-lastName", "Manager");
    await page.fill("#qf-suburb", "4000");
    await page.fill("#qf-phone", "07 3123 4567");
    await page.fill("#qf-email", "test@example.com");
    await page.check("#qf-consent");
    await page.waitForTimeout(2600);
    await page.click('button[type="submit"]');
    await page.waitForURL((u) => u.pathname === "/quote/thanks" && u.searchParams.get("service") === "commercial-cleaning", { timeout: 10000 }).catch(() => fail(`commercial quote did not reach the thank-you page (at ${page.url()})`));
    // Homepage hero: Other / Not Sure (no service).
    await page.goto(BASE + "/", { waitUntil: "networkidle" });
    await page.fill("#hq-firstName", "Test");
    await page.fill("#hq-lastName", "Homeowner");
    await page.selectOption("#hq-cleaningType", "not_sure");
    await page.fill("#hq-suburb", "Tweed Heads");
    await page.fill("#hq-phone", "0412 345 670");
    await page.fill("#hq-email", "test@example.com");
    await page.check("#hq-consent");
    await page.waitForTimeout(2600);
    await page.click('#quote button[type="submit"]');
    await page.waitForURL((u) => u.pathname === "/quote/thanks" && !u.searchParams.get("service"), { timeout: 10000 }).catch(() => fail(`hero quote did not reach the thank-you page (at ${page.url()})`));
    if (errors.length) fail(`commercial/hero journey page errors: ${errors.join(" | ")}`);
    notes.push("Commercial: service page → Commercial / Office preselected → landline → thank-you OK; homepage hero → Other / Not Sure → thank-you OK");
    await c.close();
  }

  await browser.close();

  console.log(notes.join("\n"));
  if (failures.length) {
    console.log(`\n${failures.length} failure(s):\n  ` + failures.slice(0, 60).join("\n  "));
    process.exit(1);
  }
  console.log("\nAll conversion pathway checks passed");
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
