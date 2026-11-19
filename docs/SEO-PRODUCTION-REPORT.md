# Production technical SEO report – sweptcleans.com.au

_Prepared 19 November 2026 on branch `seo-production-launch`. Baseline: commit `d0ac5ec` (tag `baseline-pre-seo-launch`). Not merged to `main` and not deployed to production – awaiting owner review._

All results below come from runs in the development environment, against a production build (`next build && next start`). Live checks (the real domain, DNS, HTTPS certificate, Vercel headers, Search Console, email delivery) can't be run until the domain is connected. They're listed as **pending**, not passed.

## A. Executive summary

**What was wrong or incomplete before**
1. **No production domain.** Canonical URLs, the sitemap, Open Graph tags and every structured-data URL took their host from `VERCEL_PROJECT_PRODUCTION_URL`, so a Vercel build would have published the `*.vercel.app` address. Local builds used `http://localhost:3000`. Baseline crawl against `https://sweptcleans.com.au`: 0 of 174 canonicals correct, and 4,726 structured-data URLs plus 174 og:image URLs on the wrong host.
2. **Business email and identity out of date.** The site used `hey@swept.com.au`, and the registered business name and ABN weren't published.
3. **Business entity invalid for Google.** It was marked up as `HomeAndConstructionBusiness`, a LocalBusiness type. Google requires a street address for LocalBusiness, and Swept doesn't publish one.
4. **The 404 page carried a canonical pointing at the homepage.** It inherited `canonical: "/"` from the root layout.
5. **Previews were protected only by robots.txt.** A disallow-all robots.txt stops Google crawling a page, which also stops it seeing a `noindex`. There was no noindex header or tag.
6. **`/quote/thanks` was blocked in robots.txt as well as noindex,** so Google couldn't see its noindex.
7. **The sitemap sent `priority` on every URL, which Google ignores.** It also gave every page except the guides the same hand-set `lastmod` date (2026-11-04) rather than a real per-page date.
8. A stray junk file (`ritten by seo-audit.cjs#`) was committed to the repo root.

**What was fixed:** all eight. See section F for the files changed.

**What was already correct and left alone**
- The route structure and URL paths.
- All 174 pages: every page links into the site, none is orphaned, and the crawl matches the sitemap exactly.
- Titles and descriptions: unique on every page, with exactly one H1 each.
- Real 404s for invalid routes.
- Single-hop 308 redirects for legacy URLs, and removal of trailing slashes.
- Tracking parameters (`?utm_*`, `gclid`) don't create new canonicals.
- Breadcrumbs, FAQ markup, guide BlogPosting markup and their citations.
- Server-rendered content, so all SEO content is in the initial HTML.

**Ready for Google indexing?** The code is ready. The site is **not launch-ready** until the blockers in section G are cleared: the domain must be connected with the www redirect, quote email delivery needs a real test, and the branch needs your review and merge.

## B. Before and after

| Measure | Before (`d0ac5ec`) | After |
|---|---|---|
| Public HTML pages (crawled from `/` by following links) | 174 | 174 |
| Indexable pages | 174 | 174 |
| Sitemap entries | 174 | 174 |
| Pages in sitemap but not linked (orphans) | 0 | 0 |
| Pages with a correct production canonical | 0 / 174 (host from Vercel/localhost) | 174 / 174 |
| Wrong-host URLs in canonicals, og:url, og:image and sitemap | 174 + 174 + 174 + 174 | 0 |
| Wrong-host URLs in structured data | 4,726 | 0 |
| Structured data valid against the Schema.org vocabulary | not measured | 507 / 507 distinct JSON-LD nodes (all 174 pages) |
| Invalid LocalBusiness entity (Google: address required) | on every page | 0 (Organization) |
| Unresolved `@id` references | 0 | 0 |
| Missing titles / descriptions / H1 | 0 / 0 / 0 | 0 / 0 / 0 |
| Duplicate titles / descriptions / canonicals | 0 / 0 / 0 | 0 / 0 / 0 |
| Broken internal links | 0 | 0 |
| Internal links that redirect | 0 | 0 |
| Unexpected noindex pages | 0 | 0 (only `/quote/thanks` and the 404 page are noindex, as intended) |
| 404 page with a canonical | yes (→ homepage) | no |
| Invalid-URL tests returning a real 404 | 8 / 8 | 8 / 8 |
| Preview deployments noindex | robots.txt only | X-Robots-Tag + robots meta on all 174 pages (tested) |
| `npm run build` / typecheck | pass / pass | pass / pass |
| `npm run test:smoke` | pass | pass |
| `npm run test:seo` (new) | – | pass (1 warning: `/quote` has 86 words of main content – it's a form page) |

## C. Structured data inventory

| Type | Where | Why | Notes |
|---|---|---|---|
| `Organization` (`/#organization`) | Every page (root layout) – one entity with one ID | The single business identity: name, legal name, ABN (`taxID`), logo, phone, email, contact hours (`contactPoint.hoursAvailable`), areas served, services offered | Not a LocalBusiness: there's no public address, and none is invented. `sameAs` is filled automatically once you add real profiles to `site.profiles`. |
| `WebSite` (`/#website`) | Every page | Site name ("Swept Cleaning", alternate "Swept") and its publisher | No SearchAction (the sitelinks search box is retired). |
| `Service` | Service, service × area, region and suburb pages | Describes what's offered on each page, with Swept as the provider and the suburb or region as `areaServed` | Suburbs are service areas, not business locations: there are no geo-coordinates or branches. Prices appear only on the regular-cleaning pages that visibly show them, as "from" prices (`minPrice`). |
| `BreadcrumbList` | All pages except home, `/quote` and `/privacy` | Mirrors the visible breadcrumbs | Tested: positions run 1…n, every item is a 200 page, and the last item is the page itself. |
| `BlogPosting` | 13 guides | Headline, description, image, genuine published and updated dates, `en-AU`, "Swept Cleaning team" byline, citations | Dates come from each guide file and are never set to the build date. |
| `CollectionPage` + `ItemList` | `/cleaning-guides` | Lists the guides | |
| `ContactPage` | `/contact` | Points to the Organization | |
| `FAQPage` | Service, area, suburb and guide pages, plus FAQ, Promise and contact | Marks up the FAQs that are visible on the page | Tested: every marked-up question appears in the visible text. Google currently shows FAQ rich results only for authoritative government and health sites, so expect no FAQ snippets. The markup is still valid. |

**Validation**
- All 507 distinct JSON-LD nodes on the 174 pages type-check against the Schema.org vocabulary, using `schema-dts` 2.1.0. A negative test confirmed the check rejects an invalid property and an invalid type.
- The JSON is escaped (`<` → `<`), so page content can't break out of the script tag.
- No review, rating, testimonial or award markup exists, and `test:seo` fails the build if any appears.
- Google's Rich Results Test and the Schema.org validator couldn't be reached from the build environment. **Run both on the live URLs after launch** (section 17 below).

**Rich-result limits.** Organization markup helps Google's knowledge of the business but isn't a rich result. Breadcrumbs are eligible. BlogPosting can help article appearance. Without a public address, Swept can't get LocalBusiness rich results; the Google Business Profile is the right channel for local results.

## D. Sitemap

- **URL:** `https://sweptcleans.com.au/sitemap.xml`. It's one file, generated from the same data as the pages, so new services, areas, suburbs and guides are added automatically.
- **174 URLs.** All return 200 with a self-referencing canonical, are indexable, appear once each, and use HTTPS on the production host. It's served as `application/xml` and passes the XML and namespace checks.
- **`lastmod`** appears only where there's a genuine content date: each guide (published or updated), and the guides hub (the date of its newest guide). Other pages omit it rather than claim a fake date. There's no `priority` or `changefreq`.
- **Excluded, and why:**
  - `/quote/thanks`: confirmation page, noindex.
  - `/api/quote` and `/api/lead-status`: API endpoints.
  - `/llms.txt`, `/opengraph-image`, the icons: files, not pages.
  - The 5 legacy redirects (`/about`, `/book`, `/get-a-quote`, `/end-of-lease-cleaning`, `/services/end-of-lease-cleaning`).
  - Any 404.
- **Growth:** one sitemap holds up to 50,000 URLs. Past that, Next.js `generateSitemaps()` splits it into an index without changing the pages.

## E. Local SEO

- **All 112 suburb pages are accounted for:** 48 Brisbane, 23 Logan, 33 Gold Coast and 8 Tweed Heads (counted from the crawl, which matches the suburb data in `src/lib/suburbs.ts`). All 4 regions and all 28 service × area pages are retained. No URL changed.
- **No suburb pricing boxes and no prices.** A scan of all 112 suburb pages found 0 dollar figures, hourly rates or "What cleaning costs near…" sections, in either the visible text or the meta descriptions.
- **Local information** comes from the existing suburb data (postcode, council, local notes). This work didn't change any of it.
- **Content quality and doorway risk.** This is an honest assessment, not a blocker:
  - Suburb pages run 818–1,035 words.
  - Measured as 5-word overlap, the average similarity between any two suburb pages is 0.36 and the highest is 0.61 (Mermaid Beach vs Palm Beach; Kingston vs Woodridge is 0.60).
  - The median share of each page's wording that's unique to it is **25%** (lowest 20%, Tweed Heads), down from 34% in the 4 November audit.
  - The shared part is mostly the quote form, the service list and the fact-table labels. Each page also has genuine local notes, a postcode, council and nearby suburbs, so they're not empty keyword swaps.
  - But Google's scaled-content and doorway policies target exactly this pattern once the local part gets thin.
  - **Recommendation (needs your approval; no change made):** prioritise genuinely local material as it becomes real. Examples: notes from completed jobs in that suburb, local photos, building access notes, and real reviews from the suburb. Start with the pages that measure most similar. Don't add filler.

## F. Technical implementation

**Files changed**
- `src/lib/siteConfig.ts` (new): the production origin `https://sweptcleans.com.au` and the rules for when indexing is on. An invalid `NEXT_PUBLIC_SITE_URL` (http, www, `*.vercel.app`, a path) **fails the build**; this was tested.
- `src/lib/site.ts`:
  - `siteUrl()` now comes from `siteConfig.ts`; the Vercel and localhost fallbacks are gone.
  - New `absoluteUrl()` helper. It handles the homepage, nested and dynamic paths, duplicate and trailing slashes, and encoding.
  - New `indexable` flag.
  - Email set to hey@sweptcleans.com.au, plus the registered name and ABN.
  - The unused `contentUpdated` date is removed.
- `src/lib/seo.ts`:
  - Canonical and og:url are absolute production URLs.
  - Non-production builds are noindex.
  - Explicitly noindex pages carry no canonical.
- `src/app/layout.tsx`: removed the inherited `canonical: "/"` and `og:url`; non-production builds are noindex.
- `src/app/not-found.tsx`: its own title. Next.js returns the 404 status and noindex, and there's no canonical.
- `src/app/robots.ts`:
  - Production disallows only `/api/`.
  - `/quote/thanks` is unblocked so Google can see its noindex.
  - Previews allow crawling and rely on noindex.
- `next.config.ts`:
  - Validates the domain at build time.
  - Non-production builds send `X-Robots-Tag: noindex, nofollow`.
  - Production served on any host other than `sweptcleans.com.au` (such as the `vercel.app` alias) sends `X-Robots-Tag: noindex`.
- `src/app/sitemap.ts`: genuine `lastmod` only, no priority, documented exclusions.
- `src/lib/schema.ts`:
  - Organization entity `/#organization`, with exported `orgId` / `orgRef` / `websiteId` helpers.
  - Contact point with enquiry hours, legal name and `taxID`.
  - Service `@id`s.
- References to the business entity were moved from the old hard-coded `/#business` to `orgRef()` in 7 files: `RegularPackages`, the guide page and guides hub, service × area, contact, region and suburb pages.
- `src/lib/leads.ts`, `src/app/api/quote/route.ts`: default sender `quotes@sweptcleans.com.au`, and the error message now names `sweptcleans.com.au`.
- `src/content/guides/how-to-avoid-getting-scammed-by-cleaning-services.ts`: the contact email in the text is corrected to hey@sweptcleans.com.au.
- `scripts/seo-check.cjs` (new) and `npm run test:seo`: the regression suite (see below). `.gitignore` covers its output.
- Removed the junk file `ritten by seo-audit.cjs#`.
- `docs/LAUNCH-CHECKLIST.md`, `docs/SEO-AUDIT.md` (marked superseded), `CLAUDE.md`, and this report.

**The new `test:seo` check crawls every page by following links from `/`.** It checks:
- robots.txt, and that sitemap XML, host, duplicates, content type and namespace are valid;
- status 200 for every page, and sitemap/crawl reconciliation with no orphans;
- exactly one absolute, self-referencing production canonical per page;
- no duplicate titles, descriptions or canonicals, and one H1 per page;
- og:url and og:image;
- valid JSON-LD with resolving `@id` references, and no foreign hosts (`vercel.app`, `localhost`, `swept.com.au`);
- no review or rating markup;
- FAQ markup matches the visible text, and breadcrumbs are valid;
- 8 invalid-URL tests return 404 with noindex, and the 404 page has no canonical;
- 5 legacy redirects are single-hop 308s;
- trailing slashes redirect;
- UTM URLs keep the clean canonical;
- `/quote/thanks` is noindex and not in the sitemap;
- API routes don't serve HTML.

`PREVIEW=1` mode checks instead that every page is noindex. It exits non-zero on any failure.

**Tests run on the final build**

| Test | Result |
|---|---|
| Production build | pass |
| Typecheck | pass |
| `test:seo` | pass |
| `test:smoke` (pages, links, responsive overflow, both quote forms, callback, honeypot, rate limit, mobile menu, console errors) | pass |
| Preview build (`VERCEL_ENV=preview`), `test:seo` with `PREVIEW=1` | pass: 174 / 174 pages noindex by header and meta |
| Production build (`VERCEL_ENV=production`) | localhost host gets `X-Robots-Tag: noindex`; `Host: sweptcleans.com.au` is indexable |
| Invalid domain override | build fails with a clear message |
| Schema.org vocabulary check | 507 / 507 nodes valid |

**Visual regression:** 9 pages on desktop and mobile, full-page screenshots before and after. The only differences are the footer and contact text (new email, plus the registered name and ABN). On phones the footer line wraps, adding 20 px of height. The layout, logo, colours, typography and navigation are unchanged.

**Performance (Lighthouse 13, lab, simulated mobile throttling)**

| Page | Mobile perf / LCP | Desktop perf / LCP | SEO | Accessibility |
|---|---|---|---|---|
| Home | 90 / 3.6 s | 100 / 0.2 s | 100 | 100 |
| Bond cleaning service | 100 / 0.9 s | 100 / 0.7 s | 100 | 100 |
| Gold Coast region | 100 / 0.9 s | 100 / 0.2 s | 100 | 100 |
| Helensvale suburb | 100 / 0.9 s | 100 / 0.2 s | 100 | 100 |
| Guides hub | 92 / 3.4 s | 100 / 0.7 s | 100 | 100 |
| Bond cost guide (Brisbane) | 94 / 3.1 s | 100 / 0.7 s | 100 | 100 |
| Quote | 100 / 0.8 s | 100 / 0.2 s | 100 | 96 |

CLS is 0 to 0.014 everywhere, and total blocking time is 0–70 ms. These are **lab results only**. There's no real-user (field) Core Web Vitals data yet, because the site has no traffic; it appears in Search Console after launch.
- **Mobile LCP over 2.5 s on 3 pages.** On the homepage it's the full-screen mobile hero photo, which is already eager and high priority, so the time is download size. The guide pages are slow for a similar image reason. The 4 November audit measured the homepage at 0.9–1.0 s, before that hero photo was added. The SEO changes didn't touch rendering.
  - **Recommendation (needs approval, visual asset):** a smaller or more compressed mobile hero image.
- **Quote page, desktop accessibility 96.** One small blue step label has low contrast. Pre-existing; fixing it changes a colour, so it's left for your approval.

**Environment variables**
- **Required for leads:** `RESEND_API_KEY`, with `sweptcleans.com.au` verified in Resend.
- **Optional:**
  - `LEAD_TO_EMAIL` (default hey@sweptcleans.com.au)
  - `LEAD_FROM_EMAIL` (default `Swept Cleaning <quotes@sweptcleans.com.au>`)
  - `LEAD_WEBHOOK_URL`
  - `NEXT_PUBLIC_GA_ID` or `NEXT_PUBLIC_GTM_ID`
  - `NEXT_PUBLIC_SITE_URL`: not needed; if set, it must be `https://sweptcleans.com.au`.
  - `SITE_INDEXING=on|off`: override, for testing only.
- **Remove** any old `NEXT_PUBLIC_SITE_URL=https://swept.com.au` from Vercel if one was ever set: an https value on another domain passes validation but would make every canonical wrong.

**Vercel settings required**
- **Domains:** `sweptcleans.com.au` as primary. `www.sweptcleans.com.au` → **308 redirect to `sweptcleans.com.au`**. Don't pick "redirect to www": canonicals are non-www.
- HTTPS is automatic on Vercel.
- **Deployment Protection:** keep Standard Protection, so previews need a login.

## G. Launch blockers

1. **Domain not connected yet.** The DNS for sweptcleans.com.au and the Vercel domain and www redirect need setting up (I haven't touched DNS). After that, run `BASE=https://sweptcleans.com.au npm run test:seo` against the live site.
2. **Quote email delivery is unverified.** This environment has no `RESEND_API_KEY` (`/api/lead-status` reports `ready: false` here). To verify:
   - Verify `sweptcleans.com.au` in Resend.
   - Set the key in Vercel.
   - Submit one real test quote yourself and confirm both emails arrive: the business copy and the customer confirmation.
3. **Branch review.** `seo-production-launch` needs your review, then a merge to `main`.
4. **Business claims to confirm for launch day:**
   - insured, and every cleaner police-checked (flags set in `site.ts`, confirmed 4 November);
   - a quote reply "within one business day";
   - enquiry hours Monday–Saturday, 7am–6pm;
   - The Swept Promise re-clean;
   - commercial and office cleaning capability, which has a service page and is in the logo.

Not blockers, but due before turning on analytics: the thank-you URL carries the customer's first name (`?name=`), which would be sent to Google Analytics as part of the page address. Fixing it means changing the form hand-off, which needs your approval.

## H. Remaining opportunities (not implemented)

- **Google Business Profile.** Set it up as a service-area business with no address shown, using exactly "Swept Cleaning", 0490 216 363 and the website URL. Then add the profile URL to `site.profiles`, which feeds `sameAs`.
- **Genuine reviews.** Ask real customers after each job. Show them only once they exist. Never mark up your own reviews for stars.
- **Citations.** Consistent name, phone and website on reputable Australian directories (True Local, Yelp AU, Hotfrog, Word of Mouth), plus Bing Places and Apple Business Connect.
- **Backlinks.** Local suppliers, real estate agencies and property managers (bond cleans), community and sporting sponsorships, NDIS plan managers.
- **Content.** Local material on the most similar suburb pages (section E). New guides only for questions customers actually ask.
- **Search Console.** Once Search Console is set up, watch indexing, which canonical Google chooses, Core Web Vitals, and impressions and clicks (see the checklist below).
- **Analytics.** GA4 with `generate_lead` as a key event. It already fires only after a successful submission, with no personal data in event parameters. Fix the thank-you URL first.
- **Conversion.** Compress the mobile hero image (LCP); fix the quote-page label contrast.

## Search Console launch checklist

URLs:
- Home: `https://sweptcleans.com.au/`
- Sitemap: `https://sweptcleans.com.au/sitemap.xml`
- Robots: `https://sweptcleans.com.au/robots.txt`
- Service: `https://sweptcleans.com.au/services/regular-house-cleaning`
- Region: `https://sweptcleans.com.au/areas/gold-coast`
- Suburb: `https://sweptcleans.com.au/areas/gold-coast/helensvale`
- Guide: `https://sweptcleans.com.au/cleaning-guides/how-long-does-a-professional-bond-clean-take`

1. **Verify ownership.** Add a **Domain property** for `sweptcleans.com.au` and verify it with the DNS TXT record Google gives you, at your domain registrar. Nothing in the site code is needed for this.
2. **Submit the sitemap.** Sitemaps → submit `https://sweptcleans.com.au/sitemap.xml`. Expect 174 discovered URLs.
3. **Inspect live URLs.** URL Inspection → test the home, service, region, suburb and guide URLs above. Check "Page fetch: successful" and "Indexing allowed", and look at the rendered HTML.
4. **Request indexing** for the homepage and a few key pages only. Let the sitemap and internal links do the rest. Don't use the Indexing API or third-party indexing services.
5. **Check canonicals.** In URL Inspection, the "Google-selected canonical" should equal the "User-declared canonical".
6. **Watch page indexing.** Indexing → Pages, weekly for the first two months. Investigate "Duplicate, Google chose different canonical", "Crawled – currently not indexed" and "Discovered – currently not indexed", especially for suburb pages.
7. **Monitor Google-selected canonicals.** If Google picks a different canonical for suburb pages, that's a sign those pages look too similar (section E).
8. **Core Web Vitals.** The report fills in once there's enough real traffic. Aim for LCP ≤ 2.5 s, INP ≤ 200 ms and CLS ≤ 0.1, at the 75th percentile.
9. **Structured data.** Watch the Breadcrumbs report, and run the Rich Results Test and validator.schema.org on the 5 URLs above.
10. **Performance.** Watch impressions, clicks and queries by page. Compare service × area and suburb pages after 8–12 weeks.
