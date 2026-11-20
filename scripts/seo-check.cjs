#!/usr/bin/env node
/*
 * Technical SEO regression check – crawls the running site and fails on any regression.
 *
 *   BASE=http://localhost:3100 SITE_URL=https://sweptcleans.com.au node scripts/seo-check.cjs
 *
 * BASE      where to fetch pages from (a local `next start`, or a deployed URL).
 * SITE_URL  the production origin every canonical, sitemap URL and structured-data URL must use.
 * PREVIEW=1 expect a non-production build: every page must be noindex and robots.txt must disallow all.
 *
 * What it does:
 *  1. Crawls every page reachable through internal <a href> links from "/" (independent of the sitemap).
 *  2. Reads /sitemap.xml and /robots.txt and reconciles them with the crawl.
 *  3. Per page: HTTP status, exactly one canonical (absolute, production host, self-referencing),
 *     robots meta + X-Robots-Tag, title, description, one H1, Open Graph URL/image,
 *     JSON-LD validity, @id references resolve, no foreign hostnames (e.g. *.vercel.app).
 *  4. Every internal link target returns 200 without redirecting.
 *  5. Invalid routes return a real 404 (no soft 404s); known redirects are single-hop 308s.
 * Writes scripts/seo-check.json (per-page inventory) and exits 1 on any failure.
 */
const fs = require("fs");
const path = require("path");

const BASE = (process.env.BASE || "http://localhost:3100").replace(/\/$/, "");
const SITE = (process.env.SITE_URL || "https://sweptcleans.com.au").replace(/\/$/, "");
const PREVIEW = process.env.PREVIEW === "1";
const FORBIDDEN_HOSTS = /vercel\.app|localhost|swept\.com\.au(?!\w)/;

const failures = [];
const warnings = [];
const fail = (m) => failures.push(m);
const warn = (m) => warnings.push(m);

const decode = (s) => s.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
const attr = (tag, name) => {
  const m = tag.match(new RegExp(`\\s${name}="([^"]*)"`));
  return m ? decode(m[1]) : null;
};
const metas = (html, key, val) => [...html.matchAll(/<meta\s[^>]*>/g)].map((m) => m[0]).filter((t) => attr(t, key) === val).map((t) => attr(t, "content"));

async function get(url, redirect = "manual") {
  const r = await fetch(url, { redirect });
  return { status: r.status, headers: r.headers, location: r.headers.get("location"), text: r.status === 200 ? await r.text() : "" };
}

function inspect(p, html, headers) {
  const head = html.slice(0, html.indexOf("</head>") + 7);
  const canon = [...html.matchAll(/<link\s[^>]*rel="canonical"[^>]*>/g)].map((m) => attr(m[0], "href"));
  const robotsMeta = metas(html, "name", "robots").concat(metas(html, "name", "googlebot"));
  const xRobots = headers.get("x-robots-tag");
  const noindex = robotsMeta.some((r) => /noindex/i.test(r)) || /noindex/i.test(xRobots || "");
  const title = (head.match(/<title>([^<]*)<\/title>/) || [])[1];
  const description = metas(head, "name", "description")[0];
  const h1 = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/g)].map((m) => decode(m[1].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim()));
  const ogUrl = metas(head, "property", "og:url")[0];
  const ogImage = metas(head, "property", "og:image")[0];
  const ld = [];
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try {
      ld.push(JSON.parse(m[1]));
    } catch (e) {
      fail(`${p}: invalid JSON-LD (${e.message})`);
    }
  }
  const links = [...new Set([...html.matchAll(/<a\s[^>]*href="([^"]+)"/g)].map((m) => decode(m[1])))];
  const mainHtml = html.slice(html.indexOf("<main"), html.indexOf("</main>"));
  const words = mainHtml.replace(/<script[\s\S]*?<\/script>/g, "").replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
  const visibleText = decode(html.replace(/<script[\s\S]*?<\/script>/g, " ").replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ");
  return { canon, robotsMeta, xRobots, noindex, title, description, h1, ogUrl, ogImage, ld, links, words, visibleText };
}

/** Flatten JSON-LD into nodes, collecting declared @ids, references, types and every URL string. */
function walkLd(ld) {
  const ids = new Set(), refs = new Set(), types = new Set(), urls = [];
  const visit = (n) => {
    if (Array.isArray(n)) return n.forEach(visit);
    if (!n || typeof n !== "object") {
      if (typeof n === "string" && /^https?:\/\//.test(n)) urls.push(n);
      return;
    }
    const keys = Object.keys(n);
    if (n["@type"]) [].concat(n["@type"]).forEach((t) => types.add(t));
    if (n["@id"] && keys.length === 1) refs.add(n["@id"]);
    else if (n["@id"]) ids.add(n["@id"]);
    for (const k of keys) if (k !== "@context") visit(n[k]);
  };
  visit(ld);
  return { ids, refs, types, urls };
}

(async () => {
  // ---- robots.txt
  const robots = await get(`${BASE}/robots.txt`);
  if (robots.status !== 200) fail(`robots.txt status ${robots.status}`);
  // Previews stay crawlable so Google can see their noindex; neither environment may block the whole site.
  if (/Disallow:\s*\/\s*$/m.test(robots.text)) fail("robots.txt disallows the whole site (hides noindex from Google)");
  if (!robots.text.includes(`Sitemap: ${SITE}/sitemap.xml`)) fail(`robots.txt sitemap line should be ${SITE}/sitemap.xml`);
  const disallows = [...robots.text.matchAll(/Disallow:\s*(\S+)/g)].map((m) => m[1]);
  const blocked = (p) => disallows.some((d) => p.startsWith(d));

  // ---- sitemap
  const sm = await get(`${BASE}/sitemap.xml`);
  if (sm.status !== 200) fail(`sitemap status ${sm.status}`);
  if (!/xml/.test(sm.headers.get("content-type") || "")) fail(`sitemap content-type ${sm.headers.get("content-type")}`);
  if (!sm.text.startsWith('<?xml version="1.0" encoding="UTF-8"?>')) fail("sitemap missing XML declaration");
  if (!sm.text.includes('xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"')) fail("sitemap namespace missing");
  if (/<html/i.test(sm.text)) fail("sitemap contains HTML");
  const locs = [...sm.text.matchAll(/<loc>([^<]*)<\/loc>/g)].map((m) => decode(m[1]));
  const lastmods = [...sm.text.matchAll(/<lastmod>([^<]*)<\/lastmod>/g)].map((m) => m[1]);
  if (/<priority>|<changefreq>/.test(sm.text)) warn("sitemap still has priority/changefreq (ignored by Google)");
  const dupLocs = locs.filter((l, i) => locs.indexOf(l) !== i);
  if (dupLocs.length) fail(`sitemap duplicates: ${dupLocs.join(", ")}`);
  const smPaths = new Set();
  for (const l of locs) {
    if (!l.startsWith(`${SITE}/`) && l !== SITE) fail(`sitemap URL on wrong host: ${l}`);
    else smPaths.add(l.slice(SITE.length) || "/");
  }
  const today = new Date().toISOString().slice(0, 10);
  const todayCount = lastmods.filter((d) => d.startsWith(today)).length;
  if (lastmods.length && todayCount === lastmods.length) warn("every sitemap lastmod is today – looks like build time, not content dates");

  // ---- crawl
  const pages = new Map();
  const queue = ["/", ...smPaths];
  const linkTargets = new Map(); // path -> set of pages linking to it
  while (queue.length) {
    const p = queue.shift();
    if (pages.has(p)) continue;
    const r = await get(BASE + p);
    const rec = { path: p, status: r.status, location: r.location, inSitemap: smPaths.has(p) };
    pages.set(p, rec);
    if (r.status !== 200) continue;
    if (!/text\/html/.test(r.headers.get("content-type") || "")) {
      rec.file = true; // e.g. /sitemap.xml linked from the footer – not a page
      continue;
    }
    Object.assign(rec, inspect(p, r.text, r.headers));
    for (const raw of rec.links) {
      let u;
      try {
        u = new URL(raw, BASE + p);
      } catch {
        continue;
      }
      const internal = u.origin === BASE || u.origin === SITE;
      if (!internal) {
        if (FORBIDDEN_HOSTS.test(u.host) && u.protocol.startsWith("http")) fail(`${p}: link to forbidden host ${raw}`);
        continue;
      }
      if (u.origin === SITE && !raw.startsWith("/")) warn(`${p}: absolute internal link ${raw}`);
      const target = u.pathname;
      if (!linkTargets.has(target)) linkTargets.set(target, new Set());
      if (target !== p) linkTargets.get(target).add(p);
      if (!pages.has(target) && !queue.includes(target)) queue.push(target);
    }
  }

  // ---- per-page assertions
  const titles = new Map(), descs = new Map(), canons = new Map();
  const allIds = new Set();
  const pageLd = new Map();
  const breadcrumbTargets = new Set();
  for (const rec of pages.values()) {
    const p = rec.path;
    if (rec.status === 308 || rec.status === 301) {
      fail(`${p}: internal link leads to a redirect (${rec.status} → ${rec.location})`);
      continue;
    }
    if (rec.status !== 200) {
      fail(`${p}: status ${rec.status}`);
      continue;
    }
    if (rec.file) continue;
    const indexable = !rec.noindex;
    rec.indexable = indexable;
    if (PREVIEW) {
      if (indexable) fail(`${p}: preview page is indexable`);
    } else if (rec.inSitemap && !indexable) fail(`${p}: in sitemap but noindex`);
    if (rec.inSitemap && blocked(p)) fail(`${p}: in sitemap but blocked by robots.txt`);
    if (indexable || PREVIEW ? rec.canon.length !== 1 : rec.canon.length > 1) fail(`${p}: ${rec.canon.length} canonical tags`);
    const c = rec.canon[0];
    if (c) {
      const expected = SITE + (p === "/" ? "/" : p);
      // "https://host" and "https://host/" are the same URL (empty path = "/"); Next.js writes the former.
      if (c !== expected && !(p === "/" && c === SITE)) fail(`${p}: canonical ${c} ≠ ${expected}`);
      if (indexable) {
        if (canons.has(c)) fail(`${p}: duplicate canonical with ${canons.get(c)}`);
        canons.set(c, p);
      }
    }
    if (indexable && !PREVIEW && !rec.inSitemap) fail(`${p}: indexable page missing from sitemap`);
    if (!rec.title) fail(`${p}: no <title>`);
    else if (indexable) {
      if (titles.has(rec.title)) fail(`${p}: duplicate title with ${titles.get(rec.title)}`);
      titles.set(rec.title, p);
      if (rec.title.length > 65) warn(`${p}: long title (${rec.title.length})`);
      if ((rec.title.match(/Swept/g) || []).length > 1 && /\| Swept.*\| Swept/.test(rec.title)) fail(`${p}: doubled brand suffix`);
    }
    if (!rec.description) fail(`${p}: no meta description`);
    else if (indexable) {
      if (descs.has(rec.description)) fail(`${p}: duplicate description with ${descs.get(rec.description)}`);
      descs.set(rec.description, p);
    }
    if (rec.h1.length !== 1) fail(`${p}: ${rec.h1.length} H1s`);
    if (c && rec.ogUrl && rec.ogUrl !== c && rec.ogUrl.replace(/\/$/, "") !== (c || "").replace(/\/$/, "")) fail(`${p}: og:url ${rec.ogUrl} ≠ canonical`);
    if (!rec.ogImage) fail(`${p}: no og:image`);
    else if (!rec.ogImage.startsWith(SITE + "/")) fail(`${p}: og:image not on ${SITE}: ${rec.ogImage}`);
    if (indexable && rec.words < 120) warn(`${p}: thin main content (${rec.words} words)`);
    const w = walkLd(rec.ld);
    rec.types = [...w.types].sort();
    w.ids.forEach((i) => allIds.add(i));
    pageLd.set(p, w);
    for (const u of w.urls) {
      if (FORBIDDEN_HOSTS.test(new URL(u).host)) fail(`${p}: structured data URL on wrong host ${u}`);
      if (u.startsWith("http://")) fail(`${p}: http URL in structured data ${u}`);
    }
    if (/AggregateRating|"Review"/.test(JSON.stringify(rec.ld))) fail(`${p}: review/rating markup present`);
    for (const node of rec.ld.flat()) {
      // FAQ markup must match visible content.
      if (node["@type"] === "FAQPage")
        for (const q of node.mainEntity || []) if (!rec.visibleText.includes(q.name.replace(/\s+/g, " "))) fail(`${p}: FAQ question not visible on page: "${q.name.slice(0, 60)}"`);
      // Breadcrumbs: positions 1..n, items are real pages on the production host, last item is this page.
      if (node["@type"] === "BreadcrumbList") {
        const items = node.itemListElement || [];
        items.forEach((it, i) => {
          if (it.position !== i + 1) fail(`${p}: breadcrumb position ${it.position} at index ${i}`);
          if (!String(it.item).startsWith(SITE)) fail(`${p}: breadcrumb item on wrong host ${it.item}`);
          else breadcrumbTargets.add(new URL(it.item).pathname);
        });
        const last = items.at(-1);
        if (last && new URL(last.item).pathname !== p) fail(`${p}: last breadcrumb ${last.item} is not this page`);
      }
    }
  }
  for (const b of breadcrumbTargets) if (!pages.get(b) || pages.get(b).status !== 200) fail(`breadcrumb target ${b} is not a 200 page`);
  // @id references must resolve to an entity declared on the same page (Google reads pages independently).
  for (const [p, w] of pageLd) for (const r of w.refs) if (!w.ids.has(r)) fail(`${p}: JSON-LD reference ${r} not declared on the page`);

  // ---- sitemap entries that weren't reachable by links (orphans) and links to unknown pages
  for (const p of smPaths) {
    const rec = pages.get(p);
    if (!rec || rec.status !== 200 || rec.file) fail(`sitemap entry ${p} is not a 200 HTML page`);
    if (p !== "/" && !(linkTargets.get(p) && linkTargets.get(p).size)) fail(`orphan: ${p} is in the sitemap but no page links to it`);
  }

  // ---- 404s and redirects
  const must404 = ["/this-page-does-not-exist", "/services/not-a-service", "/services/bond-cleaning/not-an-area", "/areas/not-a-region", "/areas/gold-coast/not-a-suburb", "/areas/brisbane/helensvale", "/cleaning-guides/not-a-guide", "/services/carpet-cleaning/tweed-heads-x"];
  for (const p of must404) {
    const r = await get(BASE + p);
    if (r.status !== 404) fail(`${p}: expected 404, got ${r.status}`);
    else if (r.text && !/noindex/.test(r.text)) fail(`${p}: 404 page without noindex`);
  }
  const thanks = await get(BASE + "/quote/thanks");
  if (thanks.status !== 200 || !/<meta name="robots" content="noindex/.test(thanks.text)) fail("/quote/thanks must be 200 + noindex");
  if (smPaths.has("/quote/thanks")) fail("/quote/thanks is in the sitemap");
  // Customer login (BookingKoala): reachable, noindex, follow, not in the sitemap.
  // (/book-now is retired – a single 308 to /quote, checked with the redirects below.)
  for (const p of ["/login"]) {
    const r = await get(BASE + p);
    if (r.status !== 200 || !/<meta name="robots" content="noindex, follow"/.test(r.text)) fail(`${p} must be 200 + noindex, follow`);
    if (smPaths.has(p)) fail(`${p} is in the sitemap`);
    if (/rel="canonical"/.test(r.text)) fail(`${p}: noindex page has a canonical`);
  }
  const notFoundHtml = await (await fetch(BASE + "/this-page-does-not-exist")).text();
  if (/rel="canonical"/.test(notFoundHtml)) fail("404 page has a canonical tag");
  const redirects = { "/about": "/why-swept", "/book": "/quote", "/book-now": "/quote", "/get-a-quote": "/quote", "/end-of-lease-cleaning": "/services/bond-cleaning", "/services/end-of-lease-cleaning": "/services/bond-cleaning" };
  for (const [from, to] of Object.entries(redirects)) {
    const r = await get(BASE + from);
    const loc = r.location ? new URL(r.location, BASE).pathname : null;
    if (r.status !== 308 || loc !== to) fail(`${from}: expected 308 → ${to}, got ${r.status} → ${r.location}`);
    else {
      const r2 = await get(BASE + to);
      if (r2.status !== 200) fail(`${from}: redirect chain (${to} returned ${r2.status})`);
    }
  }
  // Trailing slash: one hop to the slash-less URL.
  const ts = await get(BASE + "/services/bond-cleaning/");
  if (![308, 301].includes(ts.status) || new URL(ts.location, BASE).pathname !== "/services/bond-cleaning") fail(`trailing slash: expected redirect to /services/bond-cleaning, got ${ts.status} ${ts.location}`);
  // Tracking parameters keep the clean canonical.
  const utm = await get(BASE + "/services/bond-cleaning?utm_source=test&gclid=1");
  const utmCanon = (utm.text.match(/rel="canonical" href="([^"]+)"/) || [])[1];
  if (utmCanon !== `${SITE}/services/bond-cleaning`) fail(`UTM URL canonical ${utmCanon}`);
  // Development / API routes must not be indexable pages.
  for (const p of ["/api/quote", "/api/lead-status"]) {
    const r = await get(BASE + p);
    if (r.status === 200 && /<html/i.test(r.text)) fail(`${p}: API route serves HTML`);
  }
  if (!blocked("/api/")) warn("robots.txt does not disallow /api/");

  // ---- report
  const all = [...pages.values()];
  const ok = all.filter((r) => r.status === 200 && !r.file);
  const indexable = ok.filter((r) => r.indexable);
  const report = {
    base: BASE,
    site: SITE,
    preview: PREVIEW,
    crawled: all.length,
    ok200: ok.length,
    indexable: indexable.length,
    sitemap: locs.length,
    noindexPages: ok.filter((r) => !r.indexable).map((r) => r.path),
    structuredDataTypes: [...new Set(ok.flatMap((r) => r.types || []))].sort(),
    failures,
    warnings,
    pages: all.map((r) => ({ path: r.path, status: r.status, inSitemap: r.inSitemap, indexable: r.indexable, canonical: r.canon && r.canon[0], title: r.title, description: r.description, h1: r.h1 && r.h1[0], types: r.types, words: r.words, inlinks: linkTargets.get(r.path) ? linkTargets.get(r.path).size : 0 })),
  };
  fs.writeFileSync(path.join(__dirname, "seo-check.json"), JSON.stringify(report, null, 1));
  console.log(`Crawled ${all.length} URLs · ${ok.length} × 200 · ${indexable.length} indexable · sitemap ${locs.length}`);
  console.log(`Noindex: ${report.noindexPages.join(", ") || "none"}`);
  console.log(`Structured data types: ${report.structuredDataTypes.join(", ")}`);
  if (warnings.length) console.log(`\n${warnings.length} warning(s):\n  ` + [...new Set(warnings)].slice(0, 40).join("\n  "));
  if (failures.length) {
    console.log(`\n${failures.length} failure(s):\n  ` + [...new Set(failures)].slice(0, 80).join("\n  "));
    process.exit(1);
  }
  console.log("\nAll SEO checks passed");
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
