# Swept Cleaning website – notes for Claude

Next.js 16 (App Router) + Tailwind 4 site for Swept Cleaning (residential cleaning, Brisbane / Logan / Gold Coast / Tweed Heads). Business facts live in `src/lib/site.ts`, services in `src/lib/services.ts`, suburbs in `src/lib/suburbs.ts`.

## "Create a new Cleaning Guide titled …"

Follow `docs/CLEANING-GUIDES.md` exactly:

1. Write original, accurate content in Australian English. No invented stats, reviews or guarantees, and nothing copied from other sites. Include prices or rates only when the owner asks, sourced and dated. No promotions.
2. Create `src/content/guides/<slug>.ts` exporting `const guide: Guide`. Set a `description` of 110–160 characters, a `metaTitle` ending "| Swept Cleaning" if `${title} | Swept Cleaning` would be over 60 characters, and a `sources` list for every fact or price taken from elsewhere.
3. Register it in `src/content/guides/index.ts`.
4. Add internal links to the relevant service pages (`services: [...]` plus inline `[text](/services/...)` links), and to other guides or area pages where natural. For a location-specific guide, set `areas: [...]` so it appears on that area's suburb pages. Never make per-suburb copies.
5. Don't create custom page layouts. The template at `src/app/cleaning-guides/[slug]/page.tsx` handles every guide.
6. Build, run `scripts/smoke.cjs` and the SEO audit (`scripts/seo-audit.cjs` + `scripts/seo-analyse.py`), then commit and push.

The sitemap, `llms.txt`, structured data, related guides and the guides listing update automatically.

## Other conventions

- Brand: coastal blue #527C91 (primary – buttons, links, icons, logo mark), dark navy #061B49 (headings/text), white, subtle background #F3F8F9, light accent #E5EFF2 – as tokens in `src/app/globals.css` (token names are historical: `violet` = coastal blue, `violet-ink` = deeper blue for small text on tinted backgrounds, `lavender` = subtle background, `lilac` = light accent). No purple anywhere. Mostly white pages, no large coloured panels or heavy gradients. Logo files are in `public/brand/` (`swept-logo`, `swept-logo-white` for the navy footer, `swept-mark`).
- Every page's metadata goes through `pageMeta()` in `src/lib/seo.ts`.
- Don't change the homepage, branding, forms or lead API unless asked.
- Chrome on iPhone has a header workaround (`html.crios` in `globals.css` and `layout.tsx`). Leave it in place until Chrome fixes the iOS 26 bug.
