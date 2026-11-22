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
  // Six-field form – homepage hero.
  await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
  await resetGtag();
  {
    const n = await page.locator("#quote input:not([type=checkbox]):not([name=website]), #quote select, #quote textarea").count();
    if (n === 6) ok("hero form has exactly six fields"); else fail(`hero form has ${n} fields`);
    const labels = await page.$$eval("#quote label[for]", (ls) => ls.map((l) => l.textContent.trim()));
    const want = ["First Name", "Last Name", "What type of cleaning do you need?", "What suburb is the property in?", "Phone Number", "Email"];
    if (JSON.stringify(labels) === JSON.stringify(want)) ok("hero form labels exactly as specified"); else fail(`hero labels ${JSON.stringify(labels)}`);
    const opts = await page.$$eval("#hq-cleaningType option", (os) => os.map((o) => o.textContent.trim()).filter((t) => t !== "Select one…"));
    if (opts.join("|") === "Regular House Cleaning|One-Off House Cleaning|Deep Cleaning|Bond / End of Lease Cleaning|Airbnb / Holiday Rental Cleaning|Commercial / Office Cleaning|NDIS / Home Care Cleaning|Other / Not Sure") ok("cleaning type options exactly as specified"); else fail(`options ${opts.join("|")}`);
    const attrs = await page.evaluate(() => ["firstName", "lastName", "suburb", "phone", "email"].map((k) => { const e = document.getElementById("hq-" + k); return `${k}:${e.type}:${e.autocomplete}:${e.inputMode || ""}`; }).join(" "));
    if (attrs === "firstName:text:given-name: lastName:text:family-name: suburb:text:address-level2: phone:tel:tel:tel email:email:email:email") ok("input types, autocomplete and mobile keyboards"); else fail(`attrs ${attrs}`);
    if ((await page.textContent("#quote button[type=submit]")).trim() === "Get My Free Quote") ok("button says Get My Free Quote"); else fail("button text");
    // Three rows of two on desktop; one column where the hero card is narrow (1024–1151px) and on phones.
    const cols = async (w) => { await page.setViewportSize({ width: w, height: 900 }); return page.evaluate(() => getComputedStyle(document.querySelector("#hq-firstName").closest(".gap-x-4")).gridTemplateColumns.split(" ").length); };
    const got = [await cols(1366), await cols(1152), await cols(1100), await cols(390)];
    await page.setViewportSize({ width: 1366, height: 900 });
    if (got.join() === "2,2,1,1") ok("hero form: 2 columns at 1152px+, 1 column at 1100px and on phones"); else fail(`hero form columns at 1366/1152/1100/390: ${got.join()}`);
  }
  // No errors before interaction; leaving an empty field shows nothing; a wrong value shows on leaving it.
  await page.focus("#hq-firstName");
  await page.keyboard.press("Tab");
  if (!(await page.locator("#quote [role=alert]").count())) ok("no validation errors before interacting / on leaving an empty field"); else fail("errors shown too early");
  await page.fill("#hq-phone", "555");
  await page.focus("#hq-email");
  if (await page.isVisible("#hq-phone-error")) ok("invalid phone flagged after leaving the field"); else fail("phone not flagged on blur");
  await page.fill("#hq-phone", "");
  await page.click("#quote button[type=submit]");
  for (const k of ["firstName", "lastName", "cleaningType", "suburb", "phone", "email", "consent"]) if (!(await page.isVisible(`#hq-${k}-error`))) fail(`no required error for ${k}`);
  ok("all six fields (and consent) required on submit");
  if (count(await gtagEvents(), "generate_lead") === 0) ok("no lead event when validation fails"); else fail("generate_lead fired on a failed submit");
  await page.fill("#hq-firstName", "Zelda");
  await page.fill("#hq-lastName", "Person");
  await page.selectOption("#hq-cleaningType", "airbnb");
  await page.fill("#hq-suburb", "Burleigh Heads 4220");
  await page.fill("#hq-phone", "07 5555 1234");
  if (!(await page.isVisible("#hq-phone-error"))) ok("landline accepted (error clears as you type)"); else fail("landline rejected");
  await page.fill("#hq-email", "hero@example.com");
  await page.check("#hq-consent");
  await page.waitForTimeout(2600);
  await page.click("#quote button[type=submit]");
  await page.waitForURL(/\/quote\/thanks/, { timeout: 10000 }).then(() => ok("hero form → thank-you page"), () => fail("hero form did not submit"));
  {
    const ev = await gtagEvents();
    allEvents.push(...ev);
    const gl = ev.filter((e) => e.name === "generate_lead");
    if (gl.length === 1 && gl[0].params.lead_type === "quote_hero" && gl[0].params.cleaning_type === "airbnb" && gl[0].params.service === "airbnb-cleaning" && gl[0].params.form_location === "homepage_hero") ok("hero form success → exactly one generate_lead (quote_hero, airbnb)"); else fail(`hero form generate_lead ${JSON.stringify(gl)}`);
  }
  if (await page.isVisible("text=Thanks! We've received your enquiry.") && await page.isVisible("text=Our team will be in touch within 1 hour during business hours")) ok("thank-you message as specified"); else fail("thank-you message");
  if (/Zelda|Person|example/.test(page.url())) fail("thank-you URL contains personal details"); else ok("thank-you URL has no personal details");
  await page.waitForFunction(() => (document.querySelector('meta[name="robots"]')?.content || "").includes("noindex"), null, { timeout: 4000 }).catch(() => {});
  if ((await page.evaluate(() => document.querySelector('meta[name="robots"]')?.content || "")).includes("noindex")) ok("thank-you page is noindex"); else fail("thank-you page indexable");
  // A direct visit to the thank-you page is not a lead.
  await page.goto(`${BASE}/quote/thanks?type=quote`, { waitUntil: "networkidle" });
  await resetGtag();
  await page.reload({ waitUntil: "networkidle" });
  if (count(await gtagEvents(), "generate_lead") === 0) ok("direct visit / refresh of the thank-you page sends no generate_lead"); else fail("thank-you page sent generate_lead");

  // Six-field form – /quote, from the regular cleaning page's Weekly card with ad parameters.
  await page.goto(`${BASE}/quote`, { waitUntil: "networkidle" });
  await page.evaluate(() => sessionStorage.removeItem("swept:attribution"));
  await page.goto(`${BASE}/quote?service=regular-house-cleaning&frequency=weekly&utm_source=smoketest&gclid=SMOKE1`, { waitUntil: "networkidle" });
  await resetGtag();
  if ((await page.inputValue("#qf-cleaningType")) === "regular") ok("?service= preselects the cleaning type"); else fail("cleaning type not preselected");
  if ((await page.locator("main form").count()) === 1 && !(await page.locator("iframe").count())) ok("/quote shows one native form, no iframe"); else fail("/quote form/iframe count");
  await page.fill("#qf-firstName", "Test");
  if (count(await gtagEvents(), "quote_start") === 1) ok("quote_start sent on first interaction"); else fail("quote_start missing");
  await page.fill("#qf-lastName", "Person");
  await page.fill("#qf-suburb", "Robina 4226");
  await page.fill("#qf-phone", "123");
  await page.click("main button[type=submit]");
  if (await page.isVisible("#qf-phone-error") && await page.isVisible("#qf-email-error")) ok("phone and email validation shown"); else fail("phone/email validation missing");
  await page.fill("#qf-phone", "+61 412 345 678");
  await page.fill("#qf-email", "test@example.com");
  await page.check("#qf-consent");
  await page.waitForTimeout(2600);
  const bodies = [];
  mockedApiError = true;
  await page.route("**/api/quote", (r) => { bodies.push(JSON.parse(r.request().postData() || "{}")); r.fulfill({ status: 502, contentType: "application/json", body: '{"ok":false}' }); });
  await page.click("main button[type=submit]");
  await page.waitForSelector("text=your request didn", { timeout: 5000 }).catch(() => {});
  if (count(await gtagEvents(), "generate_lead") === 0) ok("no generate_lead when the submission fails"); else fail("generate_lead fired on a failed submission");
  if (await page.isEnabled("main button[type=submit]")) ok("button usable again after a failure"); else fail("button stuck after failure");
  await page.unroute("**/api/quote");
  // Retry: double-click on a slow answer sends one request, with the same enquiry ID as the failed try.
  await page.route("**/api/quote", async (r) => { bodies.push(JSON.parse(r.request().postData() || "{}")); await new Promise((x) => setTimeout(x, 800)); r.fulfill({ status: 200, contentType: "application/json", body: '{"ok":true}' }); });
  await page.dblclick("main button[type=submit]");
  if (await page.isDisabled("main button[type=submit]") && /Sending/.test(await page.textContent("main button[type=submit]"))) ok("button disabled with Sending… while submitting"); else fail("no submitting state");
  await page.click("main button[type=submit]", { force: true }).catch(() => {});
  await page.waitForURL(/\/quote\/thanks/, { timeout: 10000 }).then(() => ok("submission → thank-you page"), () => fail("did not reach thank-you page"));
  await page.unroute("**/api/quote");
  mockedApiError = false;
  {
    if (bodies.length === 2) ok("double-click / repeat click sent one request"); else fail(`${bodies.length - 1} requests on retry`);
    const sent = bodies[bodies.length - 1];
    if (bodies[0].enquiryId && sent.enquiryId === bodies[0].enquiryId) ok("retry keeps the same enquiry ID"); else fail("enquiry ID changed on retry");
    const want = { kind: "quote", formLocation: "quote_page", firstName: "Test", lastName: "Person", cleaningType: "regular", suburb: "Robina", postcode: "4226", phone: "+61 412 345 678", email: "test@example.com", frequency: "weekly", consent: true };
    const bad = Object.entries(want).filter(([k, v]) => sent[k] !== v);
    if (!bad.length && sent.attribution?.gclid === "SMOKE1" && sent.source === "smoketest" && /\/quote\?service=regular/.test(sent.pageUrl) && !("notes" in sent) && !("bedrooms" in sent)) ok("request body: six fields + frequency from the link, page, enquiry ID, attribution"); else fail(`request body: ${JSON.stringify(bad)} ${JSON.stringify(sent)}`);
    const ev = await gtagEvents();
    allEvents.push(...ev);
    const gl = ev.filter((e) => e.name === "generate_lead");
    if (gl.length === 1 && gl[0].params.lead_type === "quote" && gl[0].params.customer_type === "residential" && gl[0].params.service === "regular-house-cleaning" && gl[0].params.cleaning_type === "regular" && gl[0].params.frequency === "weekly") ok("success → exactly one generate_lead (quote, regular, weekly)"); else fail(`generate_lead ${JSON.stringify(gl)}`);
    if (count(ev, "booking_request") === 0) ok("no booking_request"); else fail("booking_request fired");
    if (count(ev, "quote_step_error") >= 1) ok("validation errors tracked as quote_step_error (field names only)"); else fail("quote_step_error missing");
  }
  // Back from the thank-you page: the form is fresh and nothing is counted again.
  await resetGtag();
  await page.goBack({ waitUntil: "networkidle" });
  if (count(await gtagEvents(), "generate_lead") === 0) ok("Back from the thank-you page counts nothing"); else fail("generate_lead on Back");
  for (const [q, v] of [["type=commercial", "commercial"], ["service=commercial-cleaning", "commercial"], ["service=bond-cleaning", "bond"], ["service=ndis-cleaning", "ndis_home_care"], ["service=carpet-cleaning", "not_sure"], ["", ""]]) {
    await page.goto(`${BASE}/quote${q ? "?" + q : ""}`, { waitUntil: "networkidle" });
    const got = await page.inputValue("#qf-cleaningType");
    if (got !== v) fail(`/quote?${q} preselects "${got}" (want "${v}")`);
  }
  ok("quote links preselect the matching cleaning type");
  if (await page.evaluate(() => window.dataLayer === undefined)) ok("no dataLayer events from the site outside production"); else fail("site wrote to dataLayer");

  // /quote: the quick call-back option (same call-back form as /contact), and back to the quote form.
  await page.goto(`${BASE}/quote`, { waitUntil: "networkidle" });
  await page.click("text=Request a quick call back");
  if (await page.isVisible("h2:has-text('Request a call back')") && !(await page.locator("#qf-firstName").count())) ok("/quote: Request a quick call back opens the call-back form"); else fail("/quote call-back link");
  await page.click("text=Back to the online quote");
  if (await page.isVisible("#qf-firstName")) ok("/quote: back to the quote form"); else fail("/quote: back from call-back");
  await page.goto(`${BASE}/quote?mode=callback`, { waitUntil: "networkidle" });
  if (await page.isVisible("h2:has-text('Request a call back')")) ok("/quote?mode=callback opens the call-back form"); else fail("?mode=callback");

  // Suburb page: the same form, suburb prefilled, real submission.
  await page.goto(`${BASE}/areas/gold-coast/burleigh-heads`, { waitUntil: "networkidle" });
  await resetGtag();
  {
    const n = await page.locator("#quote input:not([type=checkbox]):not([name=website]), #quote select, #quote textarea").count();
    const title = (await page.textContent("#hq-title")).trim();
    if (n === 6 && title === "Get a quote in Burleigh Heads" && (await page.inputValue("#hq-suburb")) === "Burleigh Heads 4220") ok("suburb page: six-field form, heading kept, suburb prefilled"); else fail(`suburb form: ${n} fields, "${title}", suburb ${await page.inputValue("#hq-suburb")}`);
  }
  let suburbBody = null;
  page.on("request", (r) => { if (r.url().endsWith("/api/quote") && r.method() === "POST") suburbBody = JSON.parse(r.postData() || "{}"); });
  await page.fill("#hq-firstName", "Suburbia");
  await page.fill("#hq-lastName", "Person");
  await page.selectOption("#hq-cleaningType", "deep");
  await page.fill("#hq-phone", "0412 345 611");
  await page.fill("#hq-email", "suburb@example.com");
  await page.check("#hq-consent");
  await page.waitForTimeout(2600);
  await page.click("#quote button[type=submit]");
  await page.waitForURL(/\/quote\/thanks/, { timeout: 10000 }).then(() => ok("suburb form → thank-you page (real API)"), () => fail("suburb form did not submit"));
  {
    const ev = await gtagEvents();
    allEvents.push(...ev);
    const gl = ev.filter((e) => e.name === "generate_lead");
    if (gl.length === 1 && gl[0].params.form_location === "suburb_hero" && gl[0].params.lead_type === "quote_hero" && gl[0].params.cleaning_type === "deep") ok("suburb success → exactly one generate_lead (suburb_hero)"); else fail(`suburb generate_lead ${JSON.stringify(gl)}`);
    if (suburbBody?.formLocation === "suburb_hero" && suburbBody.suburb === "Burleigh Heads" && suburbBody.postcode === "4220" && suburbBody.pageUrl === "/areas/gold-coast/burleigh-heads") ok("suburb request: form location, suburb + postcode, page"); else fail(`suburb body ${JSON.stringify(suburbBody)}`);
  }

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
    const pii = ["zelda", "suburbia", "suburb@example.com", "0412 345 611", '"person"', '"test"', "hero@example.com", "0412", "5555", "test@example.com", "call me", "0400111222", "burleigh", "robina", "tweed heads"];
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
