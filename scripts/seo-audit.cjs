// Full SEO crawl of the production build. Usage: BASE=http://localhost:3100 node scripts/seo-audit.cjs && python3 scripts/seo-analyse.py
const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");
const BASE = process.env.BASE || "http://localhost:3100";

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ javaScriptEnabled: false, userAgent: "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)" });
  const page = await ctx.newPage();

  const sm = await (await fetch(`${BASE}/sitemap.xml`)).text();
  const sitemapPaths = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);

  // BFS crawl from home (no JS – what a non-rendering crawler sees)
  const depth = new Map([["/", 0]]);
  const inlinks = new Map();
  const queue = ["/"];
  const pages = {};
  while (queue.length) {
    const p = queue.shift();
    const res = await page.goto(BASE + p, { waitUntil: "load" });
    const status = res.status();
    const headers = res.headers();
    const html = await page.content();
    const d = await page.evaluate(() => {
      const q = (s) => document.querySelector(s);
      const meta = (n) => q(`meta[name="${n}"]`)?.content ?? null;
      const prop = (n) => q(`meta[property="${n}"]`)?.content ?? null;
      const main = q("main");
      const text = (main?.innerText || "").replace(/\s+/g, " ").trim();
      const heads = [...document.querySelectorAll("main h1, main h2, main h3, main h4")].map((h) => [Number(h.tagName[1]), h.textContent.trim()]);
      const links = [...document.querySelectorAll("a[href]")].map((a) => ({ href: a.getAttribute("href"), text: (a.innerText || a.getAttribute("aria-label") || a.querySelector("img")?.alt || "").trim(), inMain: !!a.closest("main"), rel: a.rel }));
      const imgs = [...document.querySelectorAll("img")].map((i) => ({ src: i.getAttribute("src"), alt: i.getAttribute("alt"), w: i.getAttribute("width"), h: i.getAttribute("height"), loading: i.loading }));
      const ld = [...document.querySelectorAll('script[type="application/ld+json"]')].map((s) => s.textContent);
      return {
        lang: document.documentElement.lang,
        title: document.title,
        desc: meta("description"),
        robots: meta("robots"),
        canonical: q('link[rel="canonical"]')?.href ?? null,
        og: { title: prop("og:title"), desc: prop("og:description"), url: prop("og:url"), image: prop("og:image"), type: prop("og:type"), site: prop("og:site_name"), locale: prop("og:locale") },
        tw: { card: meta("twitter:card"), image: meta("twitter:image"), title: meta("twitter:title") },
        viewport: meta("viewport"),
        icons: [...document.querySelectorAll('link[rel~="icon"], link[rel="apple-touch-icon"]')].map((l) => l.getAttribute("href")),
        h1: [...document.querySelectorAll("h1")].map((h) => h.textContent.trim()),
        heads,
        words: text ? text.split(" ").length : 0,
        text,
        links,
        imgs,
        ld,
      };
    });
    pages[p] = { status, headers: { "x-robots-tag": headers["x-robots-tag"], "content-type": headers["content-type"], "cache-control": headers["cache-control"] }, bytes: html.length, ...d };
    for (const l of d.links) {
      if (!l.href || !l.href.startsWith("/") || l.href.startsWith("//")) continue;
      const target = l.href.split("#")[0].split("?")[0] || "/";
      if (/\.(xml|txt|png|svg|webp)$/.test(target) || target.startsWith("/_next") || target.startsWith("/api")) continue;
      if (!inlinks.has(target)) inlinks.set(target, []);
      inlinks.get(target).push({ from: p, text: l.text, inMain: l.inMain });
      if (!depth.has(target)) {
        depth.set(target, depth.get(p) + 1);
        queue.push(target);
      }
    }
  }

  // Extra technical probes
  const probe = async (u, opts = {}) => {
    const r = await fetch(BASE + u, { redirect: "manual", ...opts });
    return { status: r.status, location: r.headers.get("location"), type: r.headers.get("content-type"), robots: r.headers.get("x-robots-tag") };
  };
  const probes = {
    robots: { ...(await probe("/robots.txt")), body: await (await fetch(BASE + "/robots.txt")).text() },
    llms: await probe("/llms.txt"),
    notFound: await probe("/this-page-does-not-exist"),
    badSuburb: await probe("/areas/brisbane/not-a-suburb"),
    trailingSlash: await probe("/services/"),
    upperCase: await probe("/Services"),
    redirectEOL: await probe("/end-of-lease-cleaning"),
    redirectAbout: await probe("/about"),
    thanks: await probe("/quote/thanks"),
    ogImage: await probe("/opengraph-image"),
    icon: await probe("/icon.png"),
    apiGet: await probe("/api/quote"),
    sitemap: await probe("/sitemap.xml"),
    wwwHeaders: Object.fromEntries((await fetch(BASE + "/")).headers),
  };

  const out = { sitemapPaths, crawled: Object.keys(pages), depth: Object.fromEntries(depth), inlinks: Object.fromEntries(inlinks), pages, probes };
  fs.writeFileSync(path.join(__dirname, "audit.json"), JSON.stringify(out));
  console.log("crawled", Object.keys(pages).length, "pages; sitemap", sitemapPaths.length);
  await browser.close();
})();
