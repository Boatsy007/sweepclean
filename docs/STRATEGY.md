# Swept Cleaning – website strategy

_Prepared November 2026. Residential cleaning, Brisbane → Tweed Heads. New business with no existing web presence, reviews or credentials yet._

## 1. Business goal

The site's one job is **qualified quote requests**, with the commercial priority on **recurring** (weekly / fortnightly / monthly) work. One-off detailed and bond cleans feed the recurring base.

Every page is measured against: _does it move a visitor closer to a quote request, and towards a recurring plan?_

## 2. Market research (evidence, not assumptions)

| Finding | Source | What we did about it |
|---|---|---|
| National brands (Simply Maid, Calibre, Maid2Match) lead on **fast online quotes / booking**, **same cleaner each visit**, **no lock-in**, and **recurring discounts**. | Their Brisbane / Gold Coast / Tweed pages (searched Nov 2026) | Fast 4-step quote, "no lock-in" up front, optional `recurringOffer` setting. Same-cleaner promise left out until the owner can keep it. |
| Marketplaces (Airtasker, Oneflare) dominate search results for "house cleaning Brisbane" and suburb terms. Job prices vary widely. | Airtasker / Oneflare listings | Position Swept as the consistent, accountable alternative: written checklist, written quote, one standard. |
| The biggest hesitation people have about hiring a cleaner is **trust**: having someone in the house, belongings, whether the job gets done. Negative reviews focus on **no-shows, last-minute cancellations and surprise final prices**. | Industry blogs and negative-review analyses (indicative, not survey data) | "Written quote before anything is booked", visible checklist, a "Letting someone into your home is a big deal" section, no invented social proof. |
| QLD bond cleaning is judged against the **Entry condition report (Form 1a)** vs **Exit condition report (Form 14a)**. | rta.qld.gov.au | Bond page built around cleaning against the entry report. No "bond-back guarantee", which no cleaner can honestly promise. |
| Bond-cleaner failures in SEQ have made Fair Trading news. | qld.gov.au Fair Trading media statement | Honest FAQ: "Do you guarantee I'll get my bond back?" → no, and here's what we do instead. |
| **Tweed Heads is NSW**: NSW tenancy law, and an hour ahead of QLD during daylight saving (Oct–Apr). Competitors' Tweed pages ignore this. | General knowledge, verified locally relevant | The Tweed Heads page covers both points. This is genuinely local content that competitors lack. |

**Reference site.** bloomcleaning.com.au could not be reached from the build environment (DNS failure), and its copy was deliberately **not** copied. Duplicate content is a copyright problem and is filtered by Google. All copy is original, following the structure of the supplied mockup.

## 3. Positioning

> **A beautifully clean home. More time for you.** Flexible, tailored residential cleaning from Brisbane to Tweed Heads, with a written quote and a written checklist so you always know what you're getting.

Differentiators we can claim on day one (all owner-controlled in `src/lib/site.ts`):
1. Written quote before anything is booked
2. No lock-in contracts
3. Same written checklist every visit
4. Priorities kept on file

Differentiators to **earn** and then switch on: insurance, police checks, reviews, same-cleaner promise, recurring discount.

## 4. Information architecture and keyword map

| URL | Primary intent / keyword | Secondary |
|---|---|---|
| `/` | house cleaning Brisbane to Tweed Heads | home cleaning Gold Coast, cleaners Brisbane |
| `/services/regular-house-cleaning` | regular house cleaning, fortnightly cleaner | weekly cleaning service, monthly house clean |
| `/services/deep-cleaning` | deep cleaning house | spring clean, detailed house cleaning, new build clean |
| `/services/ndis-cleaning` | NDIS cleaning | home care cleaning, aged care cleaning, Support at Home |
| `/services/bond-cleaning` | bond cleaning | end of lease cleaning, move out clean, Form 14a |
| `/areas/brisbane` | house cleaning Brisbane | northside / southside / inner city cleaners |
| `/areas/logan` | house cleaning Logan | Springwood, Yarrabilba, new build cleaning |
| `/areas/gold-coast` | house cleaning Gold Coast | bond cleaning Gold Coast, apartment cleaning |
| `/areas/tweed-heads` | house cleaning Tweed Heads | Banora Point, Terranora cleaners |
| `/quote` | get a cleaning quote | – (conversion page) |
| `/faq`, `/why-swept`, `/contact` | support / trust | – |

To avoid cannibalisation, each page owns one intent. Service pages target the service, area pages target the place. **No suburb doorway pages.** Suburbs are listed inside region pages until there is genuinely local content to justify separate pages (see roadmap).

Every page is within two clicks of home. Service and area pages cross-link. Breadcrumbs are on every page.

## 5. Conversion funnel

```
Search / ad → service or area landing page → value prop + checklist (trust)
   → CTA (hero quick-start, inline, schedule cards, band, sticky mobile bar)
   → 4-step quote: Service → Home → Timing → Details
   → /quote/thanks (noindex, next steps, recurring nudge)
   → email to owner + confirmation email to customer (Resend) and/or webhook to CRM
```

- **Ready to buy:** "Book a clean" in the header goes straight to `/quote`. Schedule cards deep-link with the service and frequency pre-filled (`/quote?service=…&frequency=…`), so step 1 is skipped.
- **Low effort first:** the hero asks only for a suburb. That one field starts the quote and pre-fills it.
- **Researching:** service pages carry the full checklist, how pricing works, process and FAQs.
- **Prefers a person:** a call-back option is in step 1 of the quote and on `/contact` (3 fields).
- **Abandonment:** progress is saved in the browser and restored with a "Welcome back" notice.
- **Lead quality:** the soft postcode check flags out-of-area leads without blocking them. Every lead records its source.
- **Spam:** honeypot field, minimum time-to-submit, per-IP rate limit, server-side validation.

## 6. Analytics events (dataLayer / GA4)

| Event | When |
|---|---|
| `cta_click` (cta, href) | Any tracked CTA |
| `quote_quickstart` | Hero or area suburb box submitted |
| `quote_start` | First interaction with the form |
| `quote_step` (step, step_name, service) | Each step completed |
| `quote_step_error` (step, fields) | Validation blocked a step (shows where friction is) |
| `generate_lead` (lead_type, service, frequency, recurring, in_area) | Successful submission: **mark as a key event in GA4** |
| `callback_mode`, `click_to_call`, `quote_submit_error` | Secondary signals |

## 7. Design system

- **Brand:** purple `#5b35d5`, navy `#0b1a3a`, the logo's orchid→electric-blue gradient (used only in the mark), lavender surfaces.
- **Type:** Outfit (display), Inter (body), Nunito Black (wordmark). Self-hosted via `next/font`.
- **Layout:** follows the supplied mockup section by section. The swirl watermark appears on purple bands.
- **Imagery:** flat brand illustrations stand in for photography (no photo source was available, and a stock "staff member" in a Swept shirt would mislead customers). Replace them with real photos of real work as soon as possible.

## 8. Multidisciplinary audit (after build)

Scores are judgements backed by the evidence listed. Lighthouse numbers are from local production builds (`next start`, Lighthouse 13.6, simulated throttling), **not** field data.

| Discipline | Score | Evidence and reasoning |
|---|---|---|
| Creative direction | 7/10 | On-brand, consistent, follows the mockup, distinctive purple bands. Held back by illustrations instead of real photography. The hero lacks the human warmth of the mockup photo. |
| UX / UI | 8/10 | Clear hierarchy, 44px+ touch targets, sticky mobile CTA, accessible multi-step form (fieldsets, focus management, inline errors). No horizontal overflow at 360/768/1366. |
| Conversion | 7/10 | Multiple intent-matched entry points, prefill, save/resume, call-back path, thank-you page. Biggest gaps: **no phone number, no reviews, no visible pricing**. All need owner input. |
| SEO | 8/10 | Unique titles and descriptions (automated check), canonicals, sitemap, robots, breadcrumbs, LocalBusiness/Service/FAQ/Breadcrumb JSON-LD, local content on each area page. New domain with no backlinks or Google Business Profile yet. |
| Copy | 8/10 | Original, Australian English, specific (Form 1a/14a, NSW daylight saving, Queenslander timber floors). No unsupported claims. |
| Performance | 9/10 | First pass: home mobile 92 (TBT 330 ms). After fixes, mobile 98–100 and desktop 100 on the 5 audited pages. LCP 0.8–0.9 s mobile (simulated), CLS ≤ 0.001, TBT 50–160 ms. Field data unavailable until launch. |
| QA | 8/10 | `scripts/smoke.cjs` passes: 16 pages crawled, 24 internal links, validation, full quote and call-back flows, API rejection and honeypot, mobile nav, zero console errors. Not yet run on real iOS/Android devices or against production email delivery. |

**Top five improvements identified, and what happened to each:**
1. ✅ Mobile hero and service cards compacted, and the sticky CTA appears only after scrolling past the hero (it previously duplicated the hero button).
2. ✅ Accessibility: contrast fixes and accessible-name fix. Lighthouse accessibility went from 96 to 100 on the home and quote pages, and is 100 on all 5 re-audited pages.
3. ✅ Title and meta description lengths cut to fit Google's display (they were truncated on 5 pages).
4. ✅ Quote form save/resume with a "Welcome back / Start over" notice.
5. ✅ Security headers and SEO-safe redirects for likely alternative URLs.

Blocked on owner input (highest remaining commercial impact): phone number, real photos, first reviews, insurance, pricing.

## 9. Roadmap (by expected impact ÷ effort)

**Before launch (blocking):** see `docs/LAUNCH-CHECKLIST.md`.

**First 30 days**
1. **Google Business Profile** as a service-area business (no public address). Probably the single biggest local-SEO lever. Use the same name, phone and URL as the site.
2. **Real photography:** before/after shots, the team in uniform, branded kit. Swap into the hero and service cards.
3. **First 5–10 reviews** from early customers via a GBP review link. Then add a reviews section and `aggregateRating` schema (only with real reviews).
4. **Search Console:** verify, submit the sitemap, watch which queries appear.
5. **Phone number** in `site.ts`. It enables click-to-call on the sticky bar and contact surfaces.

**30–90 days**
6. **Instant price estimate** ("from $X") in step 2 of the quote. This is the conversion experiment with the most upside, because competitors advertise fast pricing. Needs owner price tables.
7. **Recurring offer** test (e.g. a discount on fortnightly). Measure the share of leads that are recurring via the `generate_lead.recurring` parameter.
8. **Content:** "Bond cleaning checklist for Queensland renters" and "NSW end-of-lease checklist (Tweed)" guides, "How often should you get your house cleaned?", "What does a deep clean include?". These match informational intent and link to service pages.
9. **Google Ads landing pages:** `/lp/bond-cleaning-gold-coast` etc., noindex, single CTA, with UTM source recorded on the lead.

**90+ days**
10. **Suburb pages** for the top 10–15 suburbs by lead volume, but only with genuinely local content (jobs done there, local photos, reviews from that suburb).
11. **CRM** (HubSpot or similar) via `LEAD_WEBHOOK_URL`, with automated follow-up: quote sent → day-2 nudge → booked → review request after the 2nd clean.
12. **Online booking and payments** for repeat customers once operations are stable.
13. **Field Core Web Vitals:** monitor through Vercel Speed Insights or the CrUX report once there is traffic.
