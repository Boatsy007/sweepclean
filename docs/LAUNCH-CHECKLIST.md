# Launch checklist

Nothing below is optional. The site hides anything that isn't set, but it can't take leads until **lead delivery** is configured.

## 1. Business facts – `src/lib/site.ts`
- [x] `phone`: 0490 216 363 (click-to-call everywhere)
- [x] `email` – hey@swept.com.au
- [ ] `abn` and `legalName` once registered
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
- [ ] Connect swept.com.au in Vercel (Domains) and redirect the `vercel.app` address to it. Optionally set `NEXT_PUBLIC_SITE_URL` = https://swept.com.au – otherwise the production domain Vercel reports is used for canonicals, the sitemap and structured data
- [ ] Resend account with swept.com.au verified → set `RESEND_API_KEY` in Vercel. Leads go to hey@swept.com.au from quotes@swept.com.au by default (`LEAD_TO_EMAIL` / `LEAD_FROM_EMAIL` override). Check `/api/lead-status` shows `"ready": true`
- [ ] and/or `LEAD_WEBHOOK_URL` (Zapier, Make, HubSpot, Google Sheets)
- [ ] Submit a real test quote on production and confirm the email arrives (owner copy and customer confirmation)

If neither delivery method is set in production, the API returns an error and the visitor sees a "didn't send" message. Leads are never silently lost: the failed lead is written to the Vercel function log.

## 4. Brand assets
- [ ] Add the master logo files to `public/brand/` and swap them into `SweptMark.tsx` (the current SVG is a close redraw)
- [ ] Real photos → replace the illustrations in `Scenes.tsx` usage with `next/image`

## 5. Analytics and search
- [ ] GA4 property → `NEXT_PUBLIC_GA_ID` (or a GTM container → `NEXT_PUBLIC_GTM_ID`)
- [ ] In GA4, mark `generate_lead` as a key event
- [ ] Google Search Console: verify the domain, submit `/sitemap.xml`
- [ ] Google Business Profile (service-area business) using the exact same name and phone

## 6. Final QA
- [ ] `npm run build` then `LEAD_DEV_LOG=1 npx next start -p 3100` and `npm run test:smoke`
- [ ] Test on a real iPhone and Android phone
- [ ] Run Lighthouse on the production URL
