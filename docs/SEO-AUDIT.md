# SEO audit – Swept Cleaning

_Audited 4 November 2026 against the production build (`next build && next start`), commit after `8a05cff`. The live Vercel site could not be reached from the audit environment, so live-only checks (real domain, HTTPS, CDN headers, Search Console data) are listed under "Still to do" rather than marked as passed._

**How it was audited:** `scripts/seo-audit.cjs` crawls the site like Googlebot, starting at the home page with JavaScript disabled and following every internal link. It then runs technical probes (status codes, redirects, robots.txt). `scripts/seo-analyse.py` checks titles, descriptions, canonicals, headings, Open Graph, structured data, content depth, duplication between suburb pages, internal linking and images. Lighthouse 13.6 was run on mobile on one page of each type. To re-run:

```bash
npm run build && npx next start -p 3100 &
BASE=http://localhost:3100 node scripts/seo-audit.cjs && python3 scripts/seo-analyse.py
```

## Scorecard (after fixes)

| Area | Result | Evidence |
|---|---|---|
| Crawlability | ✅ Pass | 128 pages crawled from the home page = 128 in the sitemap. None orphaned or missing. All return 200. Everything is reachable within 2 clicks. |
| Indexability | ✅ Pass | No accidental `noindex`. Only `/quote/thanks` is noindexed (intended). Preview deployments are blocked by robots.txt. |
| Titles | ✅ Pass | 128 unique, all ≤ 60 characters, primary keyword first on service, area and suburb pages. |
| Meta descriptions | ✅ Pass | 128 unique, 110–160 characters. |
| Canonicals | ✅ Pass | Every page self-canonicalises. Host depends on `NEXT_PUBLIC_SITE_URL` (see "Still to do"). |
| Headings | ✅ Pass | Exactly one H1 per page, no skipped levels. The home H1 now contains "House cleaning · Brisbane to Tweed Heads". |
| Social / Open Graph | ✅ Pass | og:image, og:type, og:site_name, og:locale and Twitter large-image cards on all 128 pages. Service pages use their own photo. |
| Structured data | ✅ Pass (partial by design) | Valid JSON-LD on every page: business, WebSite, Service, FAQPage, BreadcrumbList. Phone, address and profiles are not added until they exist. |
| Internal linking | ✅ Pass | 696 internal links, all working. Each suburb is linked from 6–12 other pages (median 10). Descriptive anchor text. |
| Images | ✅ Pass | All 396 `<img>` have an alt attribute: descriptive for photos, empty for decorative ones. Modern formats, responsive sizes, no layout shift. |
| Mobile and speed | ✅ Pass | Lighthouse mobile: Performance 99–100, Accessibility 100, Best Practices 100, SEO 100 on home, service, area, suburb and FAQ pages. LCP 0.9–1.0s, CLS 0. |
| Redirects and errors | ✅ Pass | Trailing slash → 308 to clean URL. Legacy paths (`/end-of-lease-cleaning`, `/about`, `/book`, `/get-a-quote`) → 308. Unknown pages return a real 404. |
| AI discoverability | ✅ Pass | `/llms.txt` lists services, 4 areas and 112 suburbs with postcodes and councils. Fact tables and FAQ markup on every suburb page. AI crawlers are not blocked. |
| Suburb page uniqueness | ⚠️ Acceptable | Median 34% of each suburb page's wording is unique to it (lowest 25%). The rest is mostly the quote form and fact-table labels. Real local proof is the way to raise this (see roadmap). |

## Issues found and fixed

| # | Issue | Impact | Fix |
|---|---|---|---|
| 1 | **120 of 128 pages had no share image**, og:type, site name or locale. Child-page Open Graph settings replaced the site defaults instead of adding to them. | High: links shared on Facebook, LinkedIn, Messages and in AI tools showed no picture or brand. | New `src/lib/seo.ts` `pageMeta()` helper gives every page complete Open Graph and Twitter data. Service pages use their own photo. |
| 2 | **Home H1 had no keyword**: "A beautifully clean home. More time for you." | High: the strongest on-page signal on the most important page. | The "House cleaning · Brisbane to Tweed Heads" badge is now part of the H1, read as "House cleaning · Brisbane to Tweed Heads – A beautifully clean home…". Looks the same. |
| 3 | **Suburb pages too similar**: median 24% unique wording, 16% at worst. | High: doorway-page / scaled-content risk across 112 pages. | Removed the region notes repeated on every suburb page (now a link to the area page). Removed the identical service descriptions. Added a suburb-specific FAQ built from each suburb's housing note. Median now 34%, worst 25%. |
| 4 | **6 suburbs linked from only 2 pages** (Albany Creek, Bridgeman Downs, Calamvale, Graceville, Ashmore, Coolangatta). | Medium: weakly linked pages get crawled and ranked less. | "Nearby suburbs" now uses a symmetric window around each suburb, so every suburb is linked from at least 6 others. |
| 5 | **83 titles over 60 characters**, cut off in Google. | Medium: lower click-through. | Shortened the patterns: "House Cleaning {Suburb} {Postcode} \| Swept Cleaning", area and service titles 48–58 characters. |
| 6 | **8 descriptions over 160 characters** and one under 110 (Privacy). | Low–medium: truncated snippets. | Rewritten to 110–160. |
| 7 | **Business schema missing hours and services.** | Medium: weaker local/entity understanding. | Added opening hours, a service catalogue, a "request a quote" action, slogan, and `sameAs` (fills automatically from `site.profiles`). |
| 8 | **Duplicate FAQ markup**: home repeated `/faq`, and `/faq` repeated every service FAQ. | Low: confusing duplicate signals. | Removed FAQ markup from home. `/faq` marks up only the general FAQs; service FAQs are marked up on their own pages. |
| 9 | **Sitemap `lastmod` = build time on every page.** | Low: Google learns to ignore fake dates. | Uses `site.contentUpdated`. Update it when content meaningfully changes. |
| 10 | Contact page H1 "Talk to Swept". | Low | Now "Contact Swept Cleaning". |

## Still to do (needs you, or the live site)

In priority order:

1. **Connect your domain and set `NEXT_PUBLIC_SITE_URL=https://swept.com.au`** in Vercel, then redeploy. Canonicals, the sitemap, `llms.txt` and structured data all use this. If it's left unset, they point at the `*.vercel.app` address. **This is the single most important SEO item.**
2. **Google Business Profile** as a service-area business (hide your address, list Brisbane, Logan, Gold Coast and Tweed Heads). Use exactly the same name, phone and website as the site. Then add the profile URL to `site.profiles`.
3. **Phone number** in `src/lib/site.ts`. It flows into the business schema, `llms.txt`, the footer and click-to-call. Name, address and phone (NAP) must match everywhere.
4. **Google Search Console**: verify the domain, submit `/sitemap.xml`, and use URL Inspection on the home page, one service page and a few suburbs.
5. **Bing Webmaster Tools**: verify and submit the sitemap. Bing's index powers Copilot and other AI search tools, so this matters for AI visibility.
6. **Citations**: create consistent listings on True Local, Yellow Pages, Hotfrog, Yelp, hipages, Oneflare and Airtasker (business profile), plus Facebook and Instagram. Add each URL to `site.profiles`.
7. **Reviews**: ask every early customer for a Google review. When there are real reviews, add a reviews section and `aggregateRating` schema. Never add ratings that aren't genuine.
8. **Local proof on suburb pages**: for the suburbs with the most leads, add a real job photo, a one-line case note ("fortnightly clean, 4-bed home") and reviews from that suburb. This lifts suburb pages above competitors' templated ones.
9. **Live checks after launch**: Lighthouse on the real domain, Google's Rich Results Test on a suburb page, and the PageSpeed Insights field data once there's traffic.

## Lower-priority notes

- **Uppercase URLs** (e.g. `/Services`) return 404 rather than redirecting. That's harmless unless someone links that way; a lowercase redirect can be added if it shows up in Search Console.
- **Thin utility pages**: `/contact` (47 words) and `/quote` (85 words) are short by design. They're conversion pages, not ranking targets.
- **No Content-Security-Policy header.** It's a security hardening item, not an SEO factor.
- **Rankings and AI citations can't be guaranteed.** This audit confirms the site gives search engines and AI assistants everything they need; authority (reviews, citations, links, time) does the rest.
