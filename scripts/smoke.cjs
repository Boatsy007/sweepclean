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
  // Analytics: on localhost the real Google tag never loads (production domain only), so record exactly
  // what the site would send to gtag() – event names, counts and parameters.
  await ctx.addInitScript(() => {
    window.gtag = function () {
      try {
        const l = JSON.parse(sessionStorage.getItem("__gtag") || "[]");
        l.push(Array.from(arguments));
        sessionStorage.setItem("__gtag", JSON.stringify(l));
      } catch {}
    };
    // tel:/mailto: clicks are tracked, but don't let the browser try to open a dialler/mail app.
    window.addEventListener("click", (e) => { const a = e.target && e.target.closest && e.target.closest('a[href^="tel:"],a[href^="mailto:"]'); if (a) e.preventDefault(); });
  });
  const page = await ctx.newPage();
  const gtagEvents = async () => (await page.evaluate(() => JSON.parse(sessionStorage.getItem("__gtag") || "[]"))).filter((c) => c[0] === "event").map((c) => ({ name: c[1], params: c[2] || {} }));
  const resetGtag = () => page.evaluate(() => sessionStorage.removeItem("__gtag"));
  const count = (list, name, where = () => true) => list.filter((e) => e.name === name && where(e.params)).length;
  const allEvents = [];
  const consoleErrors = [];
  // Errors raised by the third-party BookingKoala embed (its own iframe/network) are reported separately:
  // they depend on BookingKoala, not on our code (e.g. its Cloudflare blocks some data-centre IPs).
  const thirdParty = [];
  const bkFailed = new Set(); // HTTP statuses of failed BookingKoala responses on the current page
  page.on("response", (r) => { if (/bookingkoala\.com/.test(r.url()) && r.status() >= 400) bkFailed.add(r.status()); });
  page.on("framenavigated", (f) => { if (f === page.mainFrame()) bkFailed.clear(); });
  let mockedApiError = false; // true while this suite answers /api/quote with an error on purpose
  page.on("console", (m) => {
    if (m.type() !== "error") return;
    if (mockedApiError && /status of (502|422)/.test(m.text())) return;
    const where = (m.location() && m.location().url) || "";
    const status = Number((m.text().match(/status of (\d{3})/) || [])[1]);
    if (/bookingkoala\.com/.test(where + m.text()) || (status && bkFailed.has(status))) thirdParty.push(`${page.url()}: ${m.text()}`);
    else consoleErrors.push(`${page.url()}: ${m.text()}`);
  });
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
  // Hero form (home page)
  await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
  await resetGtag();
  await page.click("#quote button[type=submit]");
  if (await page.isVisible("#hq-name-error")) ok("hero form validation shown"); else fail("hero form validation missing");
  if (count(await gtagEvents(), "generate_lead") === 0) ok("no lead event when validation fails"); else fail("generate_lead fired on a failed submit");
  await page.fill("#hq-name", "Hero Person");
  await page.fill("#hq-phone", "0412 345 678");
  await page.fill("#hq-email", "hero@example.com");
  await page.fill("#hq-suburb", "Burleigh Heads 4220");
  await page.selectOption("#hq-service", "regular-house-cleaning");
  await page.selectOption("#hq-frequency", "weekly");
  await page.check("#hq-consent");
  await page.waitForTimeout(2600);
  await page.click("#quote button[type=submit]");
  await page.waitForURL(/\/quote\/thanks/, { timeout: 10000 }).then(() => ok("hero form → thank-you page"), () => fail("hero form did not submit"));
  {
    const ev = await gtagEvents();
    allEvents.push(...ev);
    const n = count(ev, "generate_lead", (p) => p.lead_type === "quote_hero");
    if (n === 1 && count(ev, "generate_lead") === 1) ok("hero form success → exactly one generate_lead (quote_hero)"); else fail(`hero form generate_lead count ${count(ev, "generate_lead")}`);
  }

  // Central quote form – Residential tab, arriving with a suburb pre-filled. Email left blank (optional).
  await page.goto(`${BASE}/quote?suburb=Robina`, { waitUntil: "networkidle" });
  await page.evaluate(() => localStorage.clear());
  await page.goto(`${BASE}/quote?suburb=Robina`, { waitUntil: "networkidle" });
  await resetGtag();
  await page.click("text=Continue");
  if (await page.isVisible("text=Choose the type of cleaning you need.")) ok("step 1 validation shown"); else fail("step 1 validation missing");
  await page.selectOption("#cleaningType", "spring");
  if (await page.locator('input[name="frequency"]').count()) fail("spring clean asks how often (should be one-off)"); else ok("one-off cleaning type skips the frequency question");
  await page.selectOption("#cleaningType", "regular");
  await page.click("text=Continue");
  if (await page.isVisible("text=How often would you like us to come?")) ok("frequency validation shown"); else fail("frequency validation missing");
  await page.click("label:has-text('Fortnightly')");
  await page.click("text=Continue");
  if ((await page.inputValue("#suburb")) === "Robina") ok("suburb prefilled from URL"); else fail("suburb not prefilled");
  await page.click("text=Continue");
  if (await page.isVisible("text=How many bedrooms?")) ok("step 2 validation shown"); else fail("step 2 validation missing");
  await page.click("fieldset:has-text('Bedrooms') label:has-text('3')");
  await page.click("fieldset:has-text('Bathrooms') label:has-text('2')");
  await page.fill("#suburb", "Robina 4226");
  await page.click("text=Continue");
  await page.fill("#notes", "Please focus on the oven");
  await page.click("text=Continue");
  await page.fill("#name", "Test Person");
  await page.fill("#phone", "123");
  await page.click("button:has-text('Request My Free Quote')");
  if (await page.isVisible("text=Please enter an Australian phone number")) ok("phone validation shown"); else fail("phone validation missing");
  if (await page.isVisible("#email-error")) fail("email required (should be optional)"); else ok("email optional");
  await page.fill("#phone", "0412 345 678");
  await page.check("input[type=checkbox] >> nth=-1");
  await page.waitForTimeout(2600); // pass the bot timing trap
  // A failed delivery (server error) must not count as a lead.
  mockedApiError = true;
  await page.route("**/api/quote", (r) => r.fulfill({ status: 502, contentType: "application/json", body: '{"ok":false}' }));
  await page.click("button:has-text('Request My Free Quote')");
  await page.waitForSelector("text=your request didn", { timeout: 5000 }).catch(() => {});
  if (count(await gtagEvents(), "generate_lead") === 0) ok("no generate_lead when the submission fails"); else fail("generate_lead fired on a failed submission");
  await page.unroute("**/api/quote");
  mockedApiError = false;
  await page.click("button:has-text('Request My Free Quote')");
  await page.waitForURL(/\/quote\/thanks/, { timeout: 10000 }).then(() => ok("submission → thank-you page"), () => fail("did not reach thank-you page"));
  {
    const ev = await gtagEvents();
    allEvents.push(...ev);
    if (count(ev, "quote_start") === 1 && count(ev, "quote_start", (p) => p.customer_type === "residential")) ok("quote_start sent once (customer_type residential)"); else fail(`quote_start ${JSON.stringify(ev.filter((e) => e.name === "quote_start"))}`);
    if (count(ev, "quote_step") >= 3) ok("quote_step sent per step"); else fail(`quote_step count ${count(ev, "quote_step")}`);
    const gl = ev.filter((e) => e.name === "generate_lead");
    if (gl.length === 1 && gl[0].params.lead_type === "quote" && gl[0].params.customer_type === "residential" && gl[0].params.service === "regular-house-cleaning" && gl[0].params.cleaning_type === "regular" && gl[0].params.frequency === "fortnightly") ok("residential success → exactly one generate_lead (quote, residential, regular, fortnightly)"); else fail(`residential generate_lead ${JSON.stringify(gl)}`);
    if (count(ev, "booking_request") === 0) ok("no booking_request"); else fail("booking_request fired");
    if (count(ev, "quote_step_error") >= 1) ok("validation errors tracked as quote_step_error (field names only)"); else fail("quote_step_error missing");
    if (!ev.some((e) => e.name === "quote_step_error" && e.params.step === 4 && /name/.test(e.params.fields || ""))) ok("no premature last-step errors"); else fail("the details step was submitted before it was filled in");
  }
  // The first name is handed over in sessionStorage and rendered just after the page loads.
  if (await page.waitForSelector("text=Thanks, Test", { timeout: 4000 }).then(() => true, () => false)) ok("thank-you personalised"); else fail("thank-you not personalised");
  if (/[?&]name=/.test(page.url()) || /Test/.test(new URL(page.url()).search)) fail("thank-you URL contains the customer's name"); else ok("thank-you URL has no personal details");
  // Client navigations (with the page crossfade) update <head> a moment after the URL changes – wait for it.
  await page.waitForFunction(() => (document.querySelector('meta[name="robots"]')?.content || "").includes("noindex"), null, { timeout: 4000 }).catch(() => {});
  const robots = await page.evaluate(() => document.querySelector('meta[name="robots"]')?.content || "");
  if (robots.includes("noindex")) ok("thank-you page is noindex"); else fail("thank-you page indexable");

  // Commercial tab. The API answer is supplied in the browser here (this suite's real submissions stay
  // within the API rate limit); cta-check and webhook-check submit commercial quotes to the real API.
  await page.goto(`${BASE}/quote?service=commercial-cleaning`, { waitUntil: "networkidle" });
  await page.evaluate(() => { localStorage.clear(); sessionStorage.removeItem("swept:attribution"); });
  await page.goto(`${BASE}/quote?service=commercial-cleaning&utm_source=smoketest&gclid=SMOKE1`, { waitUntil: "networkidle" });
  await resetGtag();
  await page.selectOption("#cleaningType", "office");
  await page.click("label:has-text('Office') >> nth=0");
  await page.click("text=Continue");
  await page.click("label:has-text('Medium')");
  await page.fill("#suburb", "Southport 4215");
  await page.click("text=Continue");
  await page.click("label:has-text('Several times a week')");
  await page.click("label:has-text('After hours / overnight')");
  await page.click("text=Continue");
  await page.fill("#businessName", "Secretbiz Holdings");
  await page.fill("#name", "Commercial Contact");
  await page.fill("#phone", "0412 999 888");
  await page.fill("#email", "biz@example.com");
  await page.fill("#notes", "Alarm code needed");
  await page.check("input[type=checkbox] >> nth=-1");
  await page.waitForTimeout(2600);
  let sent = null;
  mockedApiError = true;
  await page.route("**/api/quote", (r) => { sent = JSON.parse(r.request().postData() || "{}"); r.fulfill({ status: 422, contentType: "application/json", body: '{"ok":false}' }); });
  await page.click("button:has-text('Request My Free Quote')");
  await page.waitForSelector("text=your request didn", { timeout: 5000 }).catch(() => {});
  if (count(await gtagEvents(), "generate_lead") === 0) ok("no generate_lead when the server rejects the submission"); else fail("generate_lead fired on a rejected submission");
  await page.unroute("**/api/quote");
  mockedApiError = false;
  await page.route("**/api/quote", (r) => { sent = JSON.parse(r.request().postData() || "{}"); r.fulfill({ status: 200, contentType: "application/json", body: '{"ok":true}' }); });
  await page.click("button:has-text('Request My Free Quote')");
  await page.waitForURL(/\/quote\/thanks/, { timeout: 10000 }).then(() => ok("commercial → thank-you page"), () => fail("commercial did not reach thank-you page"));
  await page.unroute("**/api/quote");
  {
    const ev = await gtagEvents();
    allEvents.push(...ev);
    const gl = ev.filter((e) => e.name === "generate_lead");
    if (gl.length === 1 && gl[0].params.customer_type === "commercial" && gl[0].params.service === "commercial-cleaning" && gl[0].params.cleaning_type === "office" && gl[0].params.frequency === "several_weekly" && gl[0].params.recurring === true) ok("commercial success → exactly one generate_lead (commercial, office, several_weekly)"); else fail(`commercial generate_lead ${JSON.stringify(gl)}`);
    const want = { kind: "quote", customerType: "commercial", cleaningType: "office", service: "commercial-cleaning", businessName: "Secretbiz Holdings", propertyType: "Office", size: "Medium (150–400m²)", frequency: "several_weekly", timePref: "After hours / overnight", suburb: "Southport", postcode: "4215", name: "Commercial Contact" };
    const bad = Object.entries(want).filter(([k, v]) => !sent || sent[k] !== v);
    if (!bad.length && sent.attribution?.gclid === "SMOKE1" && !("bedrooms" in sent)) ok("commercial request body carries the commercial answers (and no residential ones)"); else fail(`commercial request body: ${JSON.stringify(bad)} ${JSON.stringify(sent)}`);
  }

  // Event tracking (fresh run, intercept before navigation)
  await page.goto(`${BASE}/quote?service=deep-cleaning`, { waitUntil: "networkidle" });
  if (await page.isVisible("text=Tell us about your home")) ok("?service= deep-links to step 2"); else fail("service deep-link failed");
  await resetGtag();
  await page.click("fieldset:has-text('Bedrooms') label:has-text('2')");
  if (count(await gtagEvents(), "quote_start") === 1) ok("quote_start sent on first interaction"); else fail("quote_start missing");
  if (await page.evaluate(() => window.dataLayer === undefined)) ok("no dataLayer events from the site outside production"); else fail("site wrote to dataLayer");

  // Callback flow
  await page.goto(`${BASE}/contact`, { waitUntil: "networkidle" });
  await resetGtag();
  // Email link on the contact page → one click_email.
  await page.click('main a[href^="mailto:"] >> nth=0');
  {
    const ev = await gtagEvents();
    allEvents.push(...ev);
    if (count(ev, "click_email") === 1 && count(ev, "click_email", (p) => p.link_location === "page")) ok("email link → exactly one click_email"); else fail(`click_email ${JSON.stringify(ev)}`);
  }
  await resetGtag();
  await page.fill("#name", "Call Me");
  await page.fill("#phone", "0400111222");
  await page.fill("#suburb", "Tweed Heads");
  await page.check("input[type=checkbox]");
  await page.waitForTimeout(2600);
  await page.click("button:has-text('Request a call back')");
  await page.waitForURL(/thanks\?type=callback/, { timeout: 10000 }).then(() => ok("callback → thank-you"), () => fail("callback flow failed"));
  {
    const ev = await gtagEvents();
    allEvents.push(...ev);
    if (count(ev, "generate_lead") === 1 && count(ev, "generate_lead", (p) => p.lead_type === "callback")) ok("callback success → exactly one generate_lead (callback)"); else fail(`callback generate_lead ${JSON.stringify(ev.filter((e) => e.name === "generate_lead"))}`);
  }
  // Header phone and Get a free quote (desktop) → one event each.
  await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
  await resetGtag();
  await page.click('header a[href^="tel:"] >> visible=true');
  await page.click('header a[data-cta-intent="quote"] >> visible=true');
  await page.waitForURL(/\/quote/, { timeout: 8000 }).catch(() => {});
  {
    const ev = await gtagEvents();
    allEvents.push(...ev);
    if (count(ev, "click_to_call") === 1 && count(ev, "click_to_call", (p) => p.link_location === "header")) ok("header phone → exactly one click_to_call"); else fail(`click_to_call ${JSON.stringify(ev.filter((e) => e.name === "click_to_call"))}`);
    if (count(ev, "quote_cta_click") === 1 && count(ev, "quote_cta_click", (p) => p.cta_location === "header") && count(ev, "booking_cta_click") === 0) ok("header Get a free quote → exactly one quote_cta_click"); else fail(`quote_cta_click ${JSON.stringify(ev.filter((e) => /cta_click/.test(e.name)))}`);
  }
  // No personal details in any analytics parameter.
  {
    const pii = ["hero person", "hero@example.com", "0412", "test person", "test@example.com", "call me", "0400111222", "burleigh heads 4220", "secretbiz", "commercial contact", "biz@example.com", "alarm code", "focus on the oven", "robina 4226", "southport"];
    const leaked = allEvents.filter((e) => pii.some((x) => JSON.stringify(e.params).toLowerCase().includes(x)));
    if (!leaked.length && allEvents.length) ok(`no personal details in ${allEvents.length} analytics events`); else fail(`personal details in analytics: ${JSON.stringify(leaked).slice(0, 200)}`);
  }

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
  if (thirdParty.length) console.log(`  · ${thirdParty.length} console message(s) from the BookingKoala embed (third party, not our code) – e.g. ${thirdParty[0].slice(0, 160)}`);
  await browser.close();
  console.log(failures ? `\n${failures} failure(s)` : "\nAll checks passed");
  process.exit(failures ? 1 : 0);
})();
