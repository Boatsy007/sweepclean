# Launch checklist

Nothing below is optional. The site hides anything that isn't set, but it can't take leads until **lead delivery** is configured.

## 1. Business facts – `src/lib/site.ts`
- [x] `phone`: 0490 216 363 (click-to-call everywhere)
- [x] `email` – hey@sweptcleans.com.au (confirmed 2026-11-19)
- [x] `legalName` – Swept Residential and Commercial Cleaning (registered business name, confirmed 2026-11-19)
- [x] `abn` – 80 230 927 825 (confirmed 2026-11-19; passes the ABN checksum)
- [ ] `quoteResponse` / `responseHours`: only promise what you can keep
- [ ] Review each of the 4 `commitments`. Delete any you won't honour every time.
- [x] `insured: true` **only** once public liability cover is active (owner confirmed 2026-11-04)
- [x] `policeChecked: true` **only** if every cleaner has a current check (owner confirmed 2026-11-04)
- [ ] `recurringOffer` if you want to offer one (e.g. "10% off every fortnightly clean")

## 2. Operational claims to confirm (in `src/lib/services.ts` and `areas.ts`)
- [ ] Each service checklist matches what your team will actually do
- [ ] Deep clean includes the inside of the oven (currently stated as included)
- [ ] Skipping a regular visit carries no charge (stated in a regular-cleaning FAQ)
- [ ] You bring your own equipment and products (FAQ)
- [ ] NDIS: you are **not** a registered NDIS provider (stated). Update if that changes.
- [ ] Bond: carpet steam cleaning (the FAQ says "we'll confirm")
- [ ] Service-area edges: Ipswich? Redland islands? Kingscliff and south of Tweed? Adjust suburb lists and `postcodeInArea()`.

## 3. Lead delivery (Vercel → Project → Settings → Environment Variables)
- [ ] Vercel → Project → Settings → Domains: add `sweptcleans.com.au` **and** `www.sweptcleans.com.au`. Make `sweptcleans.com.au` the primary domain and set `www` to **redirect (308) to `sweptcleans.com.au`**. Don't choose the opposite direction – canonicals use the non-www domain.
- [ ] The canonical domain is built in (`src/lib/siteConfig.ts`): no environment variable is needed. `NEXT_PUBLIC_SITE_URL` is optional; if set, it must be exactly `https://sweptcleans.com.au` (an invalid value fails the build).
- [ ] Vercel → Settings → Deployment Protection: keep **Standard Protection** on, so preview deployments need a Vercel login. Previews also send `X-Robots-Tag: noindex` automatically.
- [ ] Resend account with **sweptcleans.com.au** verified (DNS records from Resend) → set `RESEND_API_KEY` in Vercel. Leads go to hey@sweptcleans.com.au from quotes@sweptcleans.com.au by default (`LEAD_TO_EMAIL` / `LEAD_FROM_EMAIL` override). Check `https://sweptcleans.com.au/api/lead-status` shows `"ready": true`
- [ ] and/or `LEAD_WEBHOOK_URL` (Zapier, Make, HubSpot, Google Sheets)
- [ ] Submit a real test quote on production and confirm the email arrives (owner copy and customer confirmation)

If neither delivery method is set in production, the API returns an error and the visitor sees a "didn't send" message. Leads are never silently lost: the failed lead is written to the Vercel function log.

## 3b. BookingKoala and lead flow
- [ ] On the branch preview: customer login loads and works on desktop and iPhone (Safari + Chrome)
- [ ] Make.com: custom webhook → BookingKoala "Create a Lead" (docs/LEAD-WEBHOOK.md); set `LEAD_WEBHOOK_URL` in Vercel; `/api/lead-status` shows `"webhook": true`
- [ ] Submit one booking request, one quote and one call-back on the preview; confirm each arrives by email (Resend) and as a BookingKoala lead
- [ ] BookingKoala services and prices match the website packages (Regular $97, Spotless $147, Ultimate Platinum $207 + GST; extra hour $67, bed making $5, linen change $10) for when you convert requests into bookings

## 4. Brand assets
- [x] Master logo in `public/brand/` (updated 2026-11-19)
- [ ] Replace the remaining stock or old-uniform photos as real job photos become available

## 5. Analytics and search
- [ ] GA4 property → `NEXT_PUBLIC_GA_ID` (or a GTM container → `NEXT_PUBLIC_GTM_ID`)
- [ ] In GA4, mark `generate_lead` as a key event
- [ ] Google Search Console: Domain property for `sweptcleans.com.au` verified with a DNS TXT record, then submit `https://sweptcleans.com.au/sitemap.xml` (see docs/SEO-PRODUCTION-REPORT.md)
- [x] The thank-you URL no longer contains the customer's name (handed over in sessionStorage)
- [ ] Google Business Profile (service-area business) using the exact same name and phone

## 6. Final QA
- [ ] `npm run build` then `LEAD_DEV_LOG=1 npx next start -p 3100`, `npm run test:smoke` and `BASE=http://localhost:3100 npm run test:seo`
- [ ] `BASE=http://localhost:3100 node scripts/bookingkoala-check.cjs`
- [ ] After the domain is live: `BASE=https://sweptcleans.com.au npm run test:seo` and the BookingKoala check
- [ ] Test on a real iPhone and Android phone
- [ ] Run Lighthouse on the production URL
