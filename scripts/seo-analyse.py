import json, re, statistics, sys, os, itertools, collections
D = json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "audit.json")))  
P = D["pages"]
def section(t): print(f"\n=== {t} ===")

def tmpl(p):
    if p.count("/") == 3 and p.startswith("/areas/"): return "suburb"
    if p.startswith("/areas/") : return "area"
    if p.startswith("/services/"): return "service"
    return "core"

section("Coverage")
sm, cr = set(D["sitemapPaths"]), set(D["crawled"])
print("in sitemap not crawled:", sorted(sm - cr))
print("crawled not in sitemap:", sorted(cr - sm))
print("non-200:", [(p, v["status"]) for p, v in P.items() if v["status"] != 200])
print("noindex pages:", [p for p, v in P.items() if v["robots"] and "noindex" in v["robots"]])

section("Titles")
tl = collections.defaultdict(list)
for p, v in P.items(): tl[v["title"]].append(p)
print("duplicates:", [(t, ps) for t, ps in tl.items() if len(ps) > 1])
long = [(len(v["title"]), p) for p, v in P.items() if len(v["title"]) > 60]
print(f"over 60 chars: {len(long)} pages; longest:", sorted(long)[-5:])
print("under 30 chars:", [(p, v["title"]) for p, v in P.items() if len(v["title"]) < 30])
print("sample:", {k: P[k]["title"] for k in ["/", "/services", "/faq", "/contact", "/quote"]})

section("Meta descriptions")
dl = collections.defaultdict(list)
for p, v in P.items(): dl[v["desc"]].append(p)
print("missing:", [p for p, v in P.items() if not v["desc"]])
print("duplicates:", [ps for d, ps in dl.items() if len(ps) > 1])
lens = [len(v["desc"] or "") for v in P.values()]
print("length min/median/max:", min(lens), statistics.median(lens), max(lens))
print("over 160:", [(len(v["desc"]), p) for p, v in P.items() if len(v["desc"] or "") > 160])
print("under 110:", [(len(v["desc"]), p) for p, v in P.items() if len(v["desc"] or "") < 110])

section("Canonicals / lang / viewport")
bad = [(p, v["canonical"]) for p, v in P.items() if not v["canonical"] or not v["canonical"].rstrip("/").endswith(p.rstrip("/"))]
print("canonical mismatches:", bad[:10])
print("canonical host(s):", {re.match(r"https?://[^/]+", v["canonical"]).group(0) for v in P.values() if v["canonical"]})
print("lang values:", {v["lang"] for v in P.values()})
print("viewport:", {v["viewport"] for v in P.values()})

section("Headings")
print("h1 != 1:", [(p, v["h1"]) for p, v in P.items() if len(v["h1"]) != 1])
skips = []
for p, v in P.items():
    prev = 0
    for lvl, txt in v["heads"]:
        if prev and lvl > prev + 1: skips.append((p, prev, lvl, txt[:40])); break
        prev = lvl
print(f"heading-level skips: {len(skips)}", skips[:8])
print("first heading not h1:", [(p, v["heads"][0]) for p, v in P.items() if v["heads"] and v["heads"][0][0] != 1][:5])

section("Open Graph / Twitter")
print("missing og:image:", [p for p, v in P.items() if not v["og"]["image"]][:10], "count", sum(1 for v in P.values() if not v["og"]["image"]))
print("og:image values:", collections.Counter(v["og"]["image"] for v in P.values()).most_common(3))
print("missing og:title:", sum(1 for v in P.values() if not v["og"]["title"]), " og:title==title:", sum(1 for v in P.values() if v["og"]["title"] == v["title"]))
print("missing og:url:", sum(1 for v in P.values() if not v["og"]["url"]), " og:type:", collections.Counter(v["og"]["type"] for v in P.values()))
print("og:site_name/locale missing:", sum(1 for v in P.values() if not v["og"]["site"]), sum(1 for v in P.values() if not v["og"]["locale"]))
print("twitter card:", collections.Counter(v["tw"]["card"] for v in P.values()), " twitter:image missing:", sum(1 for v in P.values() if not v["tw"]["image"]))
print("icons:", P["/"]["icons"])

section("Content depth (words in <main>)")
by = collections.defaultdict(list)
for p, v in P.items(): by[tmpl(p)].append((v["words"], p))
for k, arr in by.items():
    w = sorted(x for x, _ in arr)
    print(f"{k:8} n={len(arr):3} min={w[0]} median={statistics.median(w)} max={w[-1]}  thinnest={sorted(arr)[:3]}")

section("Suburb page similarity (5-word shingles of <main>)")
def sh(t):
    w = re.findall(r"[a-z0-9']+", t.lower()); return {" ".join(w[i:i+5]) for i in range(len(w) - 4)}
subs = [p for p in P if tmpl(p) == "suburb"]
S = {p: sh(P[p]["text"]) for p in subs}
pairs = []
for a, b in itertools.combinations(subs, 2):
    j = len(S[a] & S[b]) / len(S[a] | S[b]); pairs.append((j, a, b))
js = [x for x, _, _ in pairs]
print(f"pairwise Jaccard: mean={statistics.mean(js):.2f} max={max(js):.2f}  most similar:", sorted(pairs)[-2:])
# share of each page's shingles that appear on NO other suburb page
allc = collections.Counter(s for p in subs for s in S[p])
uniq = sorted((sum(1 for s in S[p] if allc[s] == 1) / len(S[p]), p) for p in subs)
print(f"unique-shingle share: min={uniq[0][0]:.0%} ({uniq[0][1]}) median={statistics.median(u for u,_ in uniq):.0%} max={uniq[-1][0]:.0%}")
# vs area page
for p in subs[:1]:
    a = "/" + "/".join(p.split("/")[1:3])
    print("example suburb vs its area page Jaccard:", round(len(S[p] & sh(P[a]["text"])) / len(S[p] | sh(P[a]["text"])), 2))

section("Internal linking")
inl = D["inlinks"]
cnt = {p: len({x["from"] for x in inl.get(p, [])}) for p in P}
print("pages with fewest distinct linking pages:", sorted((c, p) for p, c in cnt.items())[:8])
print("suburb pages linking-page count: min/median/max", min(cnt[p] for p in subs), statistics.median(cnt[p] for p in subs), max(cnt[p] for p in subs))
print("depth distribution:", collections.Counter(D["depth"][p] for p in P))
print("deepest:", sorted(((D["depth"][p], p) for p in P), reverse=True)[:4])
gen = collections.Counter(x["text"].lower() for p in P for x in inl.get(p, []) if x["inMain"])
print("generic anchor texts in main:", [(t, c) for t, c in gen.items() if t in ("learn more", "click here", "read more", "here", "more", "")][:10])
links_per = sorted((len(v["links"]), p) for p, v in P.items())
print("links per page min/median/max:", links_per[0], statistics.median(x for x, _ in links_per), links_per[-1])
ext = collections.Counter(l["href"] for v in P.values() for l in v["links"] if l["href"].startswith("http"))
print("external links:", ext.most_common(5))
hash_only = [(p, l["href"]) for p, v in P.items() for l in v["links"] if l["href"].startswith("#")]
print("in-page anchors:", collections.Counter(h for _, h in hash_only).most_common(5))
# check anchors resolve to ids
missing_ids = []
for p, v in P.items():
    pass

section("Images")
im = [(p, i) for p, v in P.items() for i in v["imgs"]]
print("total <img>:", len(im), " missing alt attr:", [(p, i["src"][:60]) for p, i in im if i["alt"] is None][:5])
print("empty alt (decorative):", sum(1 for _, i in im if i["alt"] == ""), " with alt text:", sum(1 for _, i in im if i["alt"]))
print("alt texts used:", collections.Counter(i["alt"] for _, i in im if i["alt"]).most_common(8))
print("missing width/height:", sum(1 for _, i in im if not i["w"] and not i["h"]))

section("Structured data")
types = collections.Counter(); errs = []; faqq = collections.Counter()
biz = None
for p, v in P.items():
    for raw in v["ld"]:
        try: d = json.loads(raw)
        except Exception as e: errs.append((p, str(e))); continue
        for x in (d if isinstance(d, list) else [d]):
            types[x.get("@type")] += 1
            if x.get("@type") == "HomeAndConstructionBusiness": biz = x
            if x.get("@type") == "FAQPage":
                for q in x["mainEntity"]: faqq[q["name"]] += 1
print("JSON-LD parse errors:", errs)
print("types:", dict(types))
print("business keys:", sorted(biz.keys()))
for k in ["telephone", "email", "address", "geo", "openingHoursSpecification", "priceRange", "sameAs", "hasOfferCatalog", "aggregateRating"]:
    print(f"  business.{k}:", "present" if k in biz else "MISSING")
print("FAQ questions repeated across pages (top):", [(q, c) for q, c in faqq.most_common(6) if c > 1])

section("Technical probes")
for k, v in D["probes"].items():
    if k == "wwwHeaders": continue
    print(f"{k:14}", {kk: vv for kk, vv in v.items() if kk != "body"})
print("robots.txt:\n" + D["probes"]["robots"]["body"])
h = D["probes"]["wwwHeaders"]
print("security/SEO headers:", {k: h.get(k) for k in ["strict-transport-security", "x-content-type-options", "referrer-policy", "x-frame-options", "content-security-policy", "cache-control", "x-robots-tag", "link"]})
print("HTML bytes: home", P["/"]["bytes"], " max", max((v["bytes"], p) for p, v in P.items()))

section("Keyword targeting (title + h1)")
checks = {
    "/": ["house cleaning", "brisbane", "tweed"],
    "/services/regular-house-cleaning": ["regular", "house cleaning"],
    "/services/deep-cleaning": ["deep clean"],
    "/services/bond-cleaning": ["bond clean"],
    "/services/ndis-cleaning": ["ndis"],
    "/areas/gold-coast": ["house cleaning", "gold coast"],
    "/areas/gold-coast/robina": ["house cleaning", "robina"],
}
for p, kws in checks.items():
    t = (P[p]["title"] + " | " + P[p]["h1"][0]).lower()
    print(f"{p:38}", {k: (k in t) for k in kws}, "| H1:", P[p]["h1"][0][:60])
