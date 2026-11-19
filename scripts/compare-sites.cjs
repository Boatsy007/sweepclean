#!/usr/bin/env node
/*
 * Page-by-page comparison of two deployments (e.g. live production vs a local build of a branch).
 *
 *   A=https://sweptcleans.com.au B=http://localhost:3100 node scripts/compare-sites.cjs
 *
 * For every URL in A's sitemap: status, canonical, robots meta, X-Robots-Tag, title, description,
 * og:url, JSON-LD (parsed) and the set of internal links. Also compares the sitemap URL list and
 * robots.txt. Exits 1 on any difference.
 * (If A needs a proxy: NODE_USE_ENV_PROXY=1 NODE_EXTRA_CA_CERTS=… )
 */
const A = (process.env.A || "https://sweptcleans.com.au").replace(/\/$/, "");
const B = (process.env.B || "http://localhost:3100").replace(/\/$/, "");

const dec = (s) => s.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
const attr = (tag, name) => (tag.match(new RegExp(`\\s${name}="([^"]*)"`)) || [])[1];
function extract(html, headers, status) {
  const head = html.slice(0, html.indexOf("</head>") + 7);
  const metas = [...head.matchAll(/<meta\s[^>]*>/g)].map((m) => m[0]);
  const meta = (k, v) => metas.filter((t) => attr(t, k) === v).map((t) => dec(attr(t, "content") || ""));
  const ld = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => {
    try { return JSON.stringify(JSON.parse(m[1])); } catch { return "INVALID"; }
  });
  const links = [...new Set([...html.matchAll(/<a\s[^>]*href="(\/[^"#]*)/g)].map((m) => dec(m[1])))].sort();
  return {
    status,
    canonical: [...head.matchAll(/<link rel="canonical" href="([^"]*)"/g)].map((m) => m[1]),
    robotsMeta: meta("name", "robots"),
    xRobots: headers.get("x-robots-tag") || "",
    title: dec((head.match(/<title>([^<]*)<\/title>/) || [])[1] || ""),
    description: meta("name", "description"),
    ogUrl: meta("property", "og:url"),
    jsonld: ld,
    links,
  };
}
async function page(base, path) {
  const r = await fetch(base + path, { redirect: "manual" });
  return extract(r.status === 200 ? await r.text() : "", r.headers, r.status);
}

(async () => {
  const diffs = [];
  const smA = await (await fetch(`${A}/sitemap.xml`)).text();
  const smB = await (await fetch(`${B}/sitemap.xml`)).text();
  const locs = (x) => [...x.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  const la = locs(smA), lb = locs(smB);
  if (JSON.stringify(la) !== JSON.stringify(lb)) diffs.push(`sitemap URL lists differ (${la.length} vs ${lb.length})`);
  const ra = await (await fetch(`${A}/robots.txt`)).text();
  const rb = await (await fetch(`${B}/robots.txt`)).text();
  if (ra !== rb) diffs.push("robots.txt differs");
  const paths = la.map((u) => new URL(u).pathname);
  let n = 0;
  for (const p of paths) {
    const [a, b] = await Promise.all([page(A, p), page(B, p)]);
    n++;
    for (const k of Object.keys(a)) {
      if (JSON.stringify(a[k]) !== JSON.stringify(b[k])) {
        let detail = "";
        if (k === "links") {
          const sa = new Set(a.links), sb = new Set(b.links);
          detail = ` (only in A: ${a.links.filter((x) => !sb.has(x)).slice(0, 5).join(", ")}; only in B: ${b.links.filter((x) => !sa.has(x)).slice(0, 5).join(", ")})`;
        } else if (k !== "jsonld") detail = ` (A: ${JSON.stringify(a[k]).slice(0, 120)} | B: ${JSON.stringify(b[k]).slice(0, 120)})`;
        diffs.push(`${p}: ${k} differs${detail}`);
      }
    }
  }
  console.log(`Compared ${n} sitemap URLs + sitemap list (${la.length}) + robots.txt between\n  A ${A}\n  B ${B}`);
  if (diffs.length) {
    console.log(`\n${diffs.length} difference(s):\n  ` + diffs.slice(0, 60).join("\n  "));
    process.exit(1);
  }
  console.log("No differences: status, canonical, robots meta, X-Robots-Tag, title, description, og:url, structured data and internal links all identical.");
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
