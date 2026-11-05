# Cleaning Guides – how to add an article

The Cleaning Guides section (`/cleaning-guides`) is driven entirely by data. Adding a guide means creating **one file** and adding **one line**. Everything else is automatic:

- The guide appears on `/cleaning-guides`, newest first.
- It gets an article page at `/cleaning-guides/<slug>` using the shared template.
- The title, meta description, canonical URL and Open Graph tags (type `article`, image, published and modified dates) are generated.
- Structured data is added: `BlogPosting`, `BreadcrumbList`, and `FAQPage` if the guide has FAQs.
- The guide is added to `sitemap.xml` (with its updated date) and `llms.txt`.
- Related guides are linked, using shared categories or the `related` list. Linked services are shown and quote CTAs are included.
- With `areas`, the guide is featured under "Helpful guides" on that area page and every suburb page in it. Use this for location-specific guides only.
- The reading time is calculated automatically.

While **no guides exist**, `/cleaning-guides` shows an empty state, is set to `noindex, follow`, and is left out of the sitemap. It switches to indexable as soon as the first guide is published.

## 1. Create the file

`src/content/guides/<slug>.ts`, where the slug is lowercase words separated by hyphens and matches the `slug` field:

```ts
import type { Guide } from "@/lib/guides";
import { photos } from "@/lib/photos"; // optional – reuse site photos, or import a new image

export const guide: Guide = {
  slug: "how-often-should-you-clean-your-home",
  title: "How Often Should You Clean Your Home?",
  // metaTitle: "Optional shorter <title> | Swept Cleaning",   // keep ≤ 60 characters, always end "| Swept Cleaning"
  description: "One or two sentences (110–160 characters). Shown under the title, on the card and as the meta description.",
  published: "2026-11-20",
  // updated: "2026-12-05",
  categories: ["Regular cleaning", "Tips & how-to"],
  image: photos.cleaner, // or { src: importedImage, alt: "Describe the photo" }
  services: ["regular-house-cleaning"], // service slugs to link at the end
  // areas: ["brisbane"],               // feature on that area page + all its suburb pages
  // related: ["another-guide-slug"],    // otherwise picked by shared category
  sources: [                              // every fact or price that came from somewhere else
    { title: "Rental bonds fact sheet", url: "https://www.rta.qld.gov.au/…", publisher: "Residential Tenancies Authority (QLD)" },
  ],
  body: [
    { type: "p", text: "Opening paragraph. Links look like [this](/services/regular-house-cleaning); **bold** works too." },
    { type: "h2", text: "A main section" },          // h2s build the 'In this guide' contents list
    { type: "p", text: "…" },
    { type: "h3", text: "A sub-section" },
    { type: "ul", items: ["Point one", "Point two"] },
    { type: "ol", items: ["Step one", "Step two"] },
    { type: "tip", title: "Swept tip", text: "A highlighted tip." },
    { type: "image", src: photos.bathroom.src, alt: "Describe the photo", caption: "Optional caption" },
  ],
  faqs: [
    { q: "A real question customers ask?", a: "A clear, accurate answer." },
  ],
};
```

New images go in `public/images/` (WebP, about 1400–1600px wide) and are imported like the existing ones in `src/lib/photos.ts`.

## 2. Register it

In `src/content/guides/index.ts`:

```ts
import { guide as howOften } from "./how-often-should-you-clean-your-home";
export const guideList: Guide[] = [howOften /*, …other guides */];
```

## 3. Check and publish

```bash
npm run build
npx next start -p 3100 &
node scripts/smoke.cjs
BASE=http://localhost:3100 node scripts/seo-audit.cjs && python3 scripts/seo-analyse.py
```

Commit and push. Vercel deploys automatically.

## Writing standards

- **Accurate and original.** Don't invent statistics, prices, reviews, guarantees or credentials. Don't copy text from other sites, including Bloom's.
- **Prices and rates:** only when the owner asks for them, backed by current sources (e.g. the Fair Work award and published market guides). Review them every July after the Annual Wage Review. No promotions.
- **Show your sources.** List every external source in `sources` – it renders as a "Sources" list under the article (government and tenant-advocacy links are followed, commercial sites are `nofollow`) and as `citation` in the structured data. Every guide carries the "Swept Cleaning team" byline automatically.
- **Don't duplicate another guide's topic.** If a price guide touches on bond cleaning, keep it to a short summary and link to the area's bond cleaning guide (and the reverse), so each question has one clear page.
- **Australian English.** For bond cleaning, use QLD (RTA Form 1a/14a) and NSW (Tweed) specifics where relevant.
- **Link internally.** Link to at least one relevant service page and, where natural, an area page or another guide.
- **One topic per guide,** so guides don't compete with each other or with service pages for the same search. Never create one guide per suburb. Instead, tag a city-wide guide with `areas` and link to a few relevant suburb pages from the text.
- **Suggested categories** (reuse them so related guides link up): Regular cleaning · Deep cleaning · Bond cleaning · NDIS & home care · Airbnb hosting · Carpets · Kitchens · Bathrooms · Tips & how-to.
