/*
 * End-to-end smoke test. Usage:
 *   npm run build && LEAD_DEV_LOG=1 npx next start -p 3100 &
 *   BASE=http://localhost:3100 node scripts/smoke.cjs
 * Requires the `playwright` package (npm i -D playwright) or a global install.
 */
const { chromium, devices } = require("playwright");
const BASE = process.env.BASE || "http://localhost:3100";
let failures = 0;
const fail = (m) => { failures++; console.log("  ✗ " + m); };
const ok = (m) => console.log("  ✓ " + m);

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1366, height: 900 } });
  const page = await ctx.newPage();
  const consoleErrors = [];
  page.on("console", (m) => m.type() === "error" && consoleErrors.push(`${page.url()}: ${m.text()}`));
  page.on("pageerror", (e) => consoleErrors.push(`${page.url()}: ${e.message}`));

  // 1. Crawl from sitemap
  console.log("Crawl + SEO checks");
  const sm = await (await fetch(`${BASE}/sitemap.xml`)).text();
  const urls = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
  if (urls.length < 10) fail(`sitemap has only ${urls.length} URLs`); else ok(`sitemap lists ${urls.length} URLs`);
  const titles = new Map(), descs = new Map(), links = new Set();
  for (const path of urls) {
    const res = await page.goto(BASE + path, { waitUntil: "networkidle" });
    if (res.status() !== 200) fail(`${path} → ${res.status()}`);
    const info = await page.evaluate(() => ({
      title: document.title,
      desc: document.querySelector('meta[name="description"]')?.content || "",
      canonical: document.querySelector('link[rel="canonical"]')?.href || "",
      h1: document.querySelectorAll("h1").length,
      imgsNoAlt: [...document.querySelectorAll("img")].filter((i) => !i.hasAttribute("alt")).length,
      ld: [...document.querySelectorAll('script[type="application/ld+json"]')].map((s) => { try { JSON.parse(s.textContent); return true; } catch { return false; } }),
      hrefs: [...document.querySelectorAll("a[href^='/']")].map((a) => a.getAttribute("href").split("#")[0]).filter(Boolean),
    }));
    if (info.h1 !== 1) fail(`${path} has ${info.h1} <h1>`);
    if (!info.desc || info.desc.length < 70 || info.desc.length > 170) fail(`${path} meta description length ${info.desc.length}`);
    if (!info.canonical.endsWith(path === "/" ? "/" : path)) fail(`${path} canonical ${info.canonical}`);
    if (info.title.length > 75) fail(`${path} title too long (${info.title.length}): ${info.title}`);
    if (info.imgsNoAlt) fail(`${path} has ${info.imgsNoAlt} <img> without alt`);
    if (info.ld.some((x) => !x)) fail(`${path} has invalid JSON-LD`);
    titles.set(info.title, [...(titles.get(info.title) || []), path]);
    descs.set(info.desc, [...(descs.get(info.desc) || []), path]);
    info.hrefs.forEach((h) => links.add(h));
  }
  for (const [t, p] of titles) if (p.length > 1) fail(`duplicate title "${t}" on ${p.join(", ")}`);
  for (const [d, p] of descs) if (p.length > 1) fail(`duplicate description on ${p.join(", ")}`);
  ok(`checked titles, descriptions, canonicals, h1, JSON-LD on ${urls.length} pages`);

  console.log("Internal links");
  for (const href of links) {
    const r = await fetch(BASE + href, { redirect: "manual" });
    if (r.status >= 400) fail(`broken link ${href} → ${r.status}`);
  }
  ok(`${links.size} unique internal links resolve`);

  // 2. Responsive overflow
  console.log("Responsive overflow");
  for (const vp of [{ width: 360, height: 780 }, { width: 768, height: 1024 }, { width: 1366, height: 900 }]) {
    await page.setViewportSize(vp);
    for (const path of urls) {
      await page.goto(BASE + path, { waitUntil: "load" });
      const ow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      if (ow > 0) fail(`${path} overflows horizontally by ${ow}px at ${vp.width}px`);
    }
  }
  ok("no horizontal overflow at 360 / 768 / 1366");
  await page.setViewportSize({ width: 1366, height: 900 });

  // 3. Quote funnel
  console.log("Quote funnel");
  const events = () => page.evaluate(() => (window.dataLayer || []).map((e) => e.event).filter(Boolean));
  await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
  await page.fill("#qs-hero", "Robina");
  await page.click("form >> text=Get a free quote");
  await page.waitForURL(/\/quote\?suburb=Robina/);
  await page.click("text=Continue");
  if (await page.isVisible("text=Choose the type of clean you need.")) ok("step 1 validation shown"); else fail("step 1 validation missing");
  await page.click("label:has-text('Regular home cleaning')");
  await page.click("text=Continue");
  await page.click("text=Continue");
  if (await page.isVisible("text=How many bedrooms?")) ok("step 2 validation shown"); else fail("step 2 validation missing");
  await page.click("fieldset:has-text('Property type') label:has-text('House')");
  await page.click("fieldset:has-text('Bedrooms') label:has-text('3')");
  await page.click("fieldset:has-text('Bathrooms') label:has-text('2')");
  await page.click("label:has-text('Inside oven')");
  await page.click("text=Continue");
  await page.click("text=Continue");
  if (await page.isVisible("text=How often would you like us to come?")) ok("frequency validation shown"); else fail("frequency validation missing");
  await page.click("label:has-text('Fortnightly')");
  await page.click("text=Continue");
  if ((await page.inputValue("#suburb")) === "Robina") ok("suburb prefilled from hero"); else fail("suburb not prefilled");
  await page.fill("#postcode", "4226");
  await page.fill("#name", "Test Person");
  await page.fill("#phone", "123");
  await page.fill("#email", "test@example.com");
  await page.click("button:has-text('Get my free quote')");
  if (await page.isVisible("text=Please enter an Australian phone number")) ok("phone validation shown"); else fail("phone validation missing");
  await page.fill("#phone", "0412 345 678");
  await page.check("input[type=checkbox] >> nth=-1");
  await page.waitForTimeout(2600); // pass the bot timing trap
  await page.click("button:has-text('Get my free quote')");
  await page.waitForURL(/\/quote\/thanks/, { timeout: 10000 }).then(() => ok("submission → thank-you page"), () => fail("did not reach thank-you page"));
  if (await page.isVisible("text=Thanks, Test")) ok("thank-you personalised"); else fail("thank-you not personalised");
  const ev = await events().catch(() => []);
  // dataLayer resets on navigation in the new page; check events on the quote page via sessionless approach:
  const robots = await page.evaluate(() => document.querySelector('meta[name="robots"]')?.content || "");
  if (robots.includes("noindex")) ok("thank-you page is noindex"); else fail("thank-you page indexable");

  // Event tracking (fresh run, intercept before navigation)
  await page.goto(`${BASE}/quote?service=deep-cleaning`, { waitUntil: "networkidle" });
  if (await page.isVisible("text=Tell us about your home")) ok("?service= deep-links to step 2"); else fail("service deep-link failed");
  await page.click("fieldset:has-text('Property type') label:has-text('Apartment')");
  const e2 = await events();
  if (e2.includes("quote_start")) ok("quote_start event pushed to dataLayer"); else fail("quote_start missing: " + e2.join(","));

  // Callback flow
  await page.goto(`${BASE}/contact`, { waitUntil: "networkidle" });
  await page.fill("#name", "Call Me");
  await page.fill("#phone", "0400111222");
  await page.fill("#suburb", "Tweed Heads");
  await page.check("input[type=checkbox]");
  await page.waitForTimeout(2600);
  await page.click("button:has-text('Request a call back')");
  await page.waitForURL(/thanks\?type=callback/, { timeout: 10000 }).then(() => ok("callback → thank-you"), () => fail("callback flow failed"));

  // API hardening
  const bad = await fetch(`${BASE}/api/quote`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ kind: "quote", name: "x" }) });
  if (bad.status === 422) ok("API rejects invalid payload (422)"); else fail(`API invalid payload → ${bad.status}`);
  const bot = await fetch(`${BASE}/api/quote`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ website: "spam" }) });
  if (bot.status === 200) ok("honeypot silently accepted"); else fail(`honeypot → ${bot.status}`);

  // 4. Mobile nav
  console.log("Mobile navigation");
  const m = await browser.newContext({ ...devices["iPhone 13"] });
  const mp = await m.newPage();
  await mp.goto(`${BASE}/`, { waitUntil: "networkidle" });
  await mp.click("button[aria-label='Open menu']");
  await mp.click("#mobile-nav >> text=Bond cleaning");
  await mp.waitForURL(/bond-cleaning/).then(() => ok("mobile menu navigates"), () => fail("mobile menu failed"));
  await m.close();

  if (consoleErrors.length) consoleErrors.forEach((e) => fail("console: " + e)); else ok("no console errors");
  await browser.close();
  console.log(failures ? `\n${failures} failure(s)` : "\nAll checks passed");
  process.exit(failures ? 1 : 0);
})();
