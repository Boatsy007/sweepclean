#!/usr/bin/env node
/*
 * Conversion pathway check – every booking and quote CTA goes where it should.
 *
 *   BASE=http://localhost:3100 node scripts/cta-check.cjs
 *
 * 1. Server HTML of every sitemap page: each [data-cta-intent="book"] link → /book-now, each
 *    [data-cta-intent="quote"] link → /quote or #quote. Commercial and bond pages have no booking CTA in
 *    <main>; commercial quote CTAs keep service=commercial-cleaning; bookable (regular) pages lead with
 *    booking; every suburb page offers booking; no page outside the 3 embed pages references BookingKoala.
 * 2. Browser, genuine pointer taps (no DOM clicks), 320–430px + tablet: the sticky bar's primary action
 *    per page type, hidden on form pages; header Book tile, menu buttons and login tile land correctly;
 *    no horizontal overflow.
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

(async () => {
  // ---- 1. Server HTML of every sitemap page
  const sm = await (await fetch(`${BASE}/sitemap.xml`)).text();
  const paths = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
  const counts = { book: 0, quote: 0 };
  for (const p of paths) {
    const html = await (await fetch(BASE + p)).text();
    const all = ctas(html);
    const inMain = ctas(mainOf(html));
    for (const c of all) {
      counts[c.intent] = (counts[c.intent] || 0) + 1;
      if (c.intent === "book" && !/^\/book-now(\?|$)/.test(c.href)) fail(`${p}: booking CTA → ${c.href}`);
      if (c.intent === "quote" && !/^(\/quote(\?|$)|#quote$)/.test(c.href)) fail(`${p}: quote CTA → ${c.href}`);
    }
    const isCommercial = /^\/services\/commercial-cleaning(\/|$)/.test(p);
    const isBond = /^\/services\/bond-cleaning(\/|$)/.test(p) || /^\/cleaning-guides\/(bond-cleaning-cost-|how-long-does-a-professional-bond-clean-take)/.test(p);
    const isRegular = /^\/services\/regular-house-cleaning(\/|$)/.test(p);
    const isSuburb = /^\/areas\/[^/]+\/[^/]+$/.test(p);
    if (isCommercial || isBond) {
      if (inMain.some((c) => c.intent === "book")) fail(`${p}: booking CTA in a quote-first page`);
      if (!inMain.length || inMain[0].intent !== "quote") fail(`${p}: first CTA should be a quote`);
    }
    if (isCommercial && !inMain.filter((c) => c.intent === "quote").every((c) => c.href.includes("service=commercial-cleaning"))) fail(`${p}: commercial quote CTA without service=commercial-cleaning`);
    if (isRegular && (!inMain.length || inMain[0].intent !== "book")) fail(`${p}: first CTA should be Book a clean`);
    if (isSuburb && !inMain.some((c) => c.intent === "book")) fail(`${p}: no booking CTA`);
    if (p === "/" && (!inMain.length || inMain[0].intent !== "book")) fail(`/: hero should lead with Book a clean`);
    if (p !== "/contact" && /bookingkoala\.com/.test(html)) fail(`${p}: references BookingKoala (embeds belong only on /book-now, /login, /contact)`);
  }
  notes.push(`Server HTML: ${paths.length} sitemap pages, ${counts.book} booking CTAs, ${counts.quote} quote CTAs`);

  // ---- 2. Browser: sticky bar per page type + genuine taps
  const browser = await chromium.launch();
  const barExpect = [
    ["/", "book", "/book-now"],
    ["/areas/gold-coast/helensvale", "book", "/book-now"],
    ["/areas/logan", "book", "/book-now"],
    ["/services/regular-house-cleaning/gold-coast", "book", "/book-now"],
    ["/cleaning-guides/how-much-does-house-cleaning-cost-in-logan", "book", "/book-now"],
    ["/services/commercial-cleaning", "quote", "/quote?service=commercial-cleaning"],
    ["/services/commercial-cleaning/brisbane", "quote", "/quote?service=commercial-cleaning"],
    ["/services/bond-cleaning/logan", "quote", "/quote?service=bond-cleaning"],
    ["/cleaning-guides/bond-cleaning-cost-gold-coast", "quote", "/quote?service=bond-cleaning"],
  ];
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true });
  for (const [p, intent, href] of barExpect) {
    const page = await ctx.newPage();
    await page.goto(BASE + p, { waitUntil: "networkidle" });
    const bar = page.locator('[data-mobile-cta-bar] a[data-cta-intent]');
    const got = (await bar.count()) ? { intent: await bar.getAttribute("data-cta-intent"), href: await bar.getAttribute("href") } : null;
    if (!got || got.intent !== intent || got.href !== href) fail(`sticky bar ${p}: expected ${intent} ${href}, got ${JSON.stringify(got)}`);
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
    await page.goto(BASE + "/", { waitUntil: "networkidle" });
    const ov = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    if (ov > 0) fail(`@${w}px: horizontal overflow ${ov}px`);
    // Header Book tile and Customer Login visible without the menu; real taps land on the right pages.
    await tapTo(page.locator('header a[data-cta-intent="book"] >> visible=true'), "/book-now", "header Book a Clean tile");
    await page.goto(BASE + "/areas/gold-coast/helensvale", { waitUntil: "networkidle" });
    await tapTo(page.locator('[data-mobile-cta-bar] a[data-cta-intent="book"]'), "/book-now", "sticky Book a clean");
    await page.goto(BASE + "/services/commercial-cleaning", { waitUntil: "networkidle" });
    await page.locator('[data-mobile-cta-bar] a[data-cta-intent="quote"]').first().tap();
    await page.waitForURL((u) => u.pathname === "/quote" && u.searchParams.get("service") === "commercial-cleaning", { timeout: 8000 }).catch(() => fail(`@${w}px sticky commercial quote → ${page.url()}`));
    await page.goto(BASE + "/", { waitUntil: "networkidle" });
    await page.locator('header button[aria-controls="mobile-nav"]').tap();
    await page.waitForTimeout(500);
    await tapTo(page.locator('#mobile-nav a[data-cta-intent="quote"]'), "/quote", "menu Get a free quote");
    await page.goto(BASE + "/", { waitUntil: "networkidle" });
    await page.locator('header button[aria-controls="mobile-nav"]').tap();
    await page.waitForTimeout(500);
    await tapTo(page.locator('#mobile-nav a[data-cta-intent="book"]'), "/book-now", "menu Book a clean");
    await page.goto(BASE + "/", { waitUntil: "networkidle" });
    await tapTo(page.locator('header a[href="/login"] >> visible=true'), "/login", "header Customer Login");
    notes.push(`@${w}px: taps OK, overflow ${ov}px`);
    await c.close();
  }
  // Desktop: header Book button.
  {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    await page.goto(BASE + "/", { waitUntil: "networkidle" });
    await page.locator('header a[data-cta-intent="book"] >> visible=true').first().click();
    await page.waitForURL((u) => u.pathname === "/book-now", { timeout: 8000 }).catch(() => fail("desktop header Book a clean"));
    await page.close();
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
