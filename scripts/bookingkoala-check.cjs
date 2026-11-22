#!/usr/bin/env node
/*
 * BookingKoala integration check (browser).
 *
 *   BASE=http://localhost:3100 node scripts/bookingkoala-check.cjs
 *
 * Verifies what our site controls:
 *  - ordinary pages make no requests to BookingKoala (no global script);
 *  - each embed page has exactly one embed.js and one iframe with the official URL, a title and reserved space;
 *  - client-side navigation between embed pages keeps exactly one copy of embed.js;
 *  - the header Customer Login link is visible without the menu, ≥ 44px touch target, and doesn't
 *    change header height or cause horizontal overflow from 320px to 1440px;
 *  - layout shift on /quote and console errors from our own code.
 * Whether BookingKoala's own form renders, resizes and submits can only be confirmed where
 * BookingKoala is reachable (see BK_REACHABLE below) – this environment's IP is blocked by its Cloudflare.
 */
const { chromium } = require("playwright");

const BASE = (process.env.BASE || "http://localhost:3100").replace(/\/$/, "");
const BK = "sweptresidentialandcommercialcleaning.bookingkoala.com";
const failures = [];
const notes = [];
const fail = (m) => failures.push(m);

// BookingKoala is embedded on the customer login page only (booking and contact use our own forms).
const embeds = [{ path: "/login", src: `https://${BK}/login?embed=true`, height: 650 }];
const plain = ["/services/bond-cleaning", "/areas/gold-coast/helensvale", "/cleaning-guides/bond-cleaning-cost-brisbane", "/services/regular-house-cleaning", "/contact"];
// The homepage, /quote (and /book-now, which redirects there): by default BookingKoala's lead form – checked separately below.
const LEAD_FORM = "/leads/form/8a30eb91-5b26-4ddf-ac12-29ff53bba421";

async function inspectEmbed(page, e, label) {
  if (e.scrollTo) await page.locator(e.scrollTo).scrollIntoViewIfNeeded();
  await page.waitForSelector(`iframe[src="${e.src}"]`, { timeout: 10000 }).catch(() => {});
  await page.waitForTimeout(1500);
  const info = await page.evaluate((src) => {
    const frames = [...document.querySelectorAll("iframe")];
    const f = frames.find((x) => x.getAttribute("src") === src);
    const box = f?.parentElement?.getBoundingClientRect();
    return {
      scripts: document.querySelectorAll('script[src*="bookingkoala.com/resources/embed.js"]').length,
      iframes: frames.filter((x) => (x.getAttribute("src") || "").includes("bookingkoala.com")).length,
      title: f?.getAttribute("title"),
      scrolling: f?.getAttribute("scrolling"),
      frameHeight: f ? Math.round(f.getBoundingClientRect().height) : 0,
      wrapperHeight: box ? Math.round(box.height) : 0,
      fallback: !!document.querySelector(`a[href="${src.replace("?embed=true", "")}"]`),
      overflow: document.documentElement.scrollWidth - innerWidth,
    };
  }, e.src);
  if (info.scripts !== 1) fail(`${label}: ${info.scripts} copies of embed.js (expected 1)`);
  if (info.iframes !== 1) fail(`${label}: ${info.iframes} BookingKoala iframes (expected 1)`);
  if (!info.title) fail(`${label}: iframe has no title`);
  if (info.wrapperHeight < Math.min(e.height, 400)) fail(`${label}: reserved height ${info.wrapperHeight}px`);
  if (!info.fallback) fail(`${label}: no direct-link fallback`);
  if (info.overflow > 0) fail(`${label}: horizontal overflow ${info.overflow}px`);
  return info;
}

(async () => {
  const browser = await chromium.launch();

  // 1b. Homepage and /quote: the lead form iframe and BookingKoala's iframe resizer only (never embed.js), or nothing
  //     at all in the native build.
  for (const p of ["/", "/quote", "/book-now?package=spotless"]) {
    const page = await browser.newPage();
    const bk = [];
    page.on("request", (r) => r.url().includes("bookingkoala.com") && bk.push(r.url()));
    await page.goto(BASE + p, { waitUntil: "networkidle" });
    await page.waitForTimeout(800);
    const frames = await page.locator('iframe[src*="bookingkoala.com"]').evaluateAll((fs) => fs.map((f) => f.getAttribute("src")));
    const bkQuote = frames.length > 0;
    const unexpected = bk.filter((u) => !u.includes(LEAD_FORM) && !u.includes("/resources/iframeResizer.min.js"));
    if (bkQuote && (frames.length !== 1 || !frames[0].includes(LEAD_FORM) || unexpected.length)) fail(`${p}: expected only the lead form + iframe resizer, got ${frames.length} iframe(s), ${unexpected.join(" ")}`);
    if (!bkQuote && bk.length) fail(`${p}: BookingKoala requests in the native build`);
    notes.push(`${p}: ${bkQuote ? "BookingKoala lead form only (" + bk.length + " BookingKoala requests: form + resizer)" : "site's own form, no BookingKoala"}`);
    await page.close();
  }

  // 1. Ordinary pages: zero BookingKoala requests.
  for (const p of plain) {
    const page = await browser.newPage();
    const bk = [];
    page.on("request", (r) => r.url().includes("bookingkoala.com") && bk.push(r.url()));
    await page.goto(BASE + p, { waitUntil: "networkidle" });
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(800);
    if (bk.length) fail(`${p}: ${bk.length} BookingKoala request(s) on a page without an embed`);
    await page.close();
  }

  // 2. Embed pages, direct loads at phone, tablet and desktop widths.
  let reachable = null;
  for (const w of [320, 390, 768, 1440]) {
    for (const e of embeds) {
      const page = await browser.newPage({ viewport: { width: w, height: 900 }, hasTouch: w < 1024 });
      const errors = [];
      page.on("console", (m) => m.type() === "error" && !/bookingkoala|403|Failed to load resource/i.test(m.text()) && errors.push(m.text()));
      page.on("pageerror", (err) => errors.push(err.message));
      page.on("response", (r) => { if (r.url().includes(`${BK}/resources/embed.js`)) reachable = r.status() === 200; });
      await page.goto(BASE + e.path, { waitUntil: "networkidle" });
      const info = await inspectEmbed(page, e, `${e.path} @${w}px`);
      if (errors.length) fail(`${e.path} @${w}px: console errors: ${errors.slice(0, 2).join(" | ")}`);
      if (w === 390) notes.push(`${e.path}: iframe ${info.frameHeight}px, scrolling=${info.scrolling}, wrapper ${info.wrapperHeight}px`);
      await page.close();
    }
  }

  // 3. Client-side navigation: home → login (header link) → booking request page → back to login.
  for (const [w, sel] of [[390, 'header a[href="/login"] >> visible=true'], [1440, 'header a[href="/login"] >> visible=true']]) {
    const page = await browser.newPage({ viewport: { width: w, height: 900 }, isMobile: w < 1024, hasTouch: w < 1024 });
    const bkOnBook = [];
    await page.goto(BASE + "/", { waitUntil: "networkidle" });
    // Genuine pointer click (fails if anything covers the link).
    await page.locator(sel).first().click();
    await page.waitForURL("**/login");
    await inspectEmbed(page, embeds[0], `client nav → /login @${w}px`);
    // Leaving the login page: the embed (and its script) must not follow onto the quote form.
    await page.goto(BASE + "/services/regular-house-cleaning", { waitUntil: "networkidle" });
    page.on("request", (r) => r.url().includes("bookingkoala.com") && bkOnBook.push(r.url()));
    await page.locator('#prices a[href="/quote?service=regular-house-cleaning&frequency=fortnightly"]').first().click();
    await page.waitForURL("**/quote?service=regular-house-cleaning&frequency=fortnightly");
    await page.waitForTimeout(1200);
    const left = await page.evaluate(() => ({ embedJs: document.querySelectorAll('script[src*="bookingkoala.com/resources/embed.js"]').length, loginFrames: document.querySelectorAll('iframe[src*="bookingkoala.com/login"]').length, leadFrames: document.querySelectorAll('iframe[src*="/leads/form/"]').length }));
    const stray = bkOnBook.filter((u) => !u.includes(LEAD_FORM) && !u.includes("/resources/iframeResizer.min.js"));
    if (left.loginFrames || left.embedJs || stray.length || left.leadFrames > 1) fail(`client nav → /quote @${w}px: login embed still present or duplicated forms (${JSON.stringify(left)}, ${stray.length} other requests)`);
    await page.goBack();
    await page.goBack();
    await page.waitForURL("**/login");
    await inspectEmbed(page, embeds[0], `history back → /login @${w}px`);
    await page.close();
  }

  // 4. Header: Customer Login visible without the menu; size, contrast, header height, overflow.
  for (const w of [320, 360, 375, 390, 414, 768, 1024, 1280, 1440]) {
    // No isMobile here: mobile emulation lets the layout viewport grow to fit, which hides overflow.
    const page = await browser.newPage({ viewport: { width: w, height: 800 }, hasTouch: w < 1024 });
    await page.goto(BASE + "/areas/gold-coast/helensvale", { waitUntil: "networkidle" });
    const h = await page.evaluate(() => {
      const a = [...document.querySelectorAll('header a[href="/login"]')].find((x) => x.offsetParent !== null);
      const r = a?.getBoundingClientRect();
      return {
        visible: !!a,
        w: r ? Math.round(r.width) : 0,
        hgt: r ? Math.round(r.height) : 0,
        name: a ? (a.getAttribute("aria-label") || a.textContent).replace(/\s+/g, " ").trim() : "",
        header: Math.round(document.querySelector("header").getBoundingClientRect().height),
        overflow: document.documentElement.scrollWidth - innerWidth,
        color: a ? getComputedStyle(a).color : "",
      };
    });
    if (!h.visible) fail(`header @${w}px: Customer Login not visible without opening the menu`);
    if (h.w < 44 || h.hgt < 44) fail(`header @${w}px: login touch target ${h.w}×${h.hgt}`);
    if (!/customer login/i.test(h.name)) fail(`header @${w}px: login accessible name "${h.name}"`);
    if (h.header !== (w < 1024 ? 77 : 97)) fail(`header @${w}px: height ${h.header}px changed`);
    if (h.overflow > 0) fail(`header @${w}px: horizontal overflow ${h.overflow}px`);
    notes.push(`header @${w}px: login ${h.w}×${h.hgt}, "${h.name}", ${h.color}`);
    await page.close();
  }

  // 5. Layout shift on the quote page (the central form).
  {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    await page.addInitScript(() => {
      window.__cls = 0;
      new PerformanceObserver((l) => l.getEntries().forEach((e) => { if (!e.hadRecentInput) window.__cls += e.value; })).observe({ type: "layout-shift", buffered: true });
    });
    await page.goto(BASE + "/quote?service=regular-house-cleaning", { waitUntil: "networkidle" });
    await page.waitForTimeout(3000);
    const cls = await page.evaluate(() => window.__cls);
    notes.push(`/quote CLS (mobile, first 3s): ${cls.toFixed(3)}`);
    if (cls > 0.1) fail(`/quote: CLS ${cls.toFixed(3)} > 0.1`);
    await page.close();
  }

  await browser.close();
  notes.push(`BookingKoala reachable from this machine: ${reachable === null ? "unknown" : reachable ? "yes" : "NO (blocked) – live form behaviour not verified here"}`);
  console.log(notes.join("\n"));
  if (failures.length) {
    console.log(`\n${failures.length} failure(s):\n  ` + failures.join("\n  "));
    process.exit(1);
  }
  console.log("\nAll BookingKoala integration checks passed");
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
