# Launch readiness report – sweptcleans.com.au

_19 November 2026. Branch `bookingkoala-integration`, built on top of `seo-production-launch` (the approved SEO work, commit `04df225`). Neither branch is merged to `main`; production is unchanged. Recover the previous states from `main` (`d0ac5ec`, before any of this) or `seo-production-launch` (SEO only)._

Every result below comes from the final build (`next build && next start`) in the development environment. **This environment can't reach BookingKoala:** its Cloudflare protection blocks the environment's IP address ("Sorry, you have been blocked"), both for the booking site and for help.bookingkoala.com. So whether the embedded forms **render, resize, log in and submit** has not been verified here. That's a live check for you on the preview (section 9). Everything on Swept's side of the integration has been tested.

## 1. Summary

| Area | Status |
|---|---|
| Approved SEO work | Preserved. All 174 indexable pages, the canonicals, sitemap, robots and structured data are unchanged (regression suite passes). |
| BookingKoala booking, login and contact forms | Integrated with the official embed codes. Swept's side is tested; the live form behaviour still needs your check. |
| Customer Login in header (mobile tile, desktop), menu and footer | Done, on every public page, with no overflow from 320px to 1440px. |
| Mobile LCP (hero and guides) | Improved: lab simulation 3.1–3.6s → 2.6–2.8s; with applied throttling 1.7–2.0s. See section 5. |
| Quote step label contrast | Fixed: quote page accessibility 96 → 100. |
| Customer name in thank-you URL | Removed. The name now goes via tab-only storage that's deleted on read. |
| Domain validation | Strict: only `https://sweptcleans.com.au` is accepted. |
| Quote forms and Resend | All preserved and working. Resend is still required (section 6). |
| Business details | Consistent everywhere (section 7). |
| **Launch blockers** | **5 remaining** – see section 10. |

## 2. Files changed (this branch)

**New**
- `src/lib/bookingKoala.ts`: the official BookingKoala addresses, form paths, default heights and fallback links.
- `src/components/BookingKoalaEmbed.tsx`: the reusable embed component (booking, login and contact).
- `src/app/book-now/page.tsx`: the booking page.
- `src/app/login/page.tsx`: the customer login page.
- `src/lib/thanksName.ts` and `src/components/ThanksName.tsx`: pass the first name to the thank-you page without using the URL.
- `scripts/bookingkoala-check.cjs`: browser test for the integration.
- `docs/LAUNCH-READINESS-REPORT.md`: this report.

**Changed**
- `src/components/Header.tsx`:
  - The desktop "Book a clean" button now goes to `/book-now`.
  - Customer Login links: a mobile tile, a desktop account icon (with its label at 1536px+), and a link in the mobile menu.
  - Mobile tile labels are 0.66rem below 390px wide, so four tiles fit.
- `src/components/Footer.tsx`: a Customer login link in the bottom row.
- `src/components/RegularPackages.tsx`: the package "Request booking" buttons and their structured-data offer URLs now point to `/book-now`.
- `src/components/MobileCtaBar.tsx`: hidden on `/book-now` and `/login`, as on the quote form, so it can't cover the form.
- `src/components/Icon.tsx`: a `user` icon in the existing line style.
- `src/app/contact/page.tsx`:
  - New "Send us a message" section with the BookingKoala contact form.
  - The callback-form placeholder is sized to the real form.
- `src/components/QuoteForm.tsx`:
  - Step-label contrast fixed.
  - Starts in callback mode when asked, so there's no layout shift.
  - First name goes via sessionStorage.
- `src/components/HeroQuoteForm.tsx`: first name goes via sessionStorage.
- `src/app/quote/thanks/page.tsx`: the name comes from `<ThanksName />` and no longer from `?name=`.
- `src/components/SweptMark.tsx`: one responsive header logo instead of separate phone and desktop copies, so phones download one logo, not two.
- `src/app/cleaning-guides/[slug]/page.tsx` and `src/components/GuideCard.tsx`: `fetchPriority="high"` on the main image.
- `next.config.ts`:
  - AVIF image format, with WebP as the fallback.
  - `/book` now redirects to `/book-now` (it used to redirect to `/quote`).
- `src/lib/siteConfig.ts`: strict domain check.
- `scripts/seo-check.cjs`:
  - `/login` and `/book-now` must be noindex, follow and out of the sitemap.
  - `/book` → `/book-now`.
  - og:url is only compared on pages with a canonical.
- `scripts/smoke.cjs`:
  - Asserts the thank-you URL contains no personal details.
  - Waits for the client-side greeting.
  - Reports BookingKoala's own console messages separately from ours.
- `docs/LAUNCH-CHECKLIST.md`, `CLAUDE.md`.

## 3. Routes

| Route | Status | Indexing | Notes |
|---|---|---|---|
| `/book-now` | **New** | noindex, follow; not in sitemap | Booking page with native H1, 3 steps, trust points, booking embed and fallback link |
| `/login` | **New** | noindex, follow; not in sitemap | Customer login embed; BookingKoala handles authentication |
| `/contact` | Changed | Unchanged (indexable, same canonical and metadata) | Adds the BookingKoala contact form. The callback form and all contact details stay. |
| `/book` | Redirect changed | – | 308 → `/book-now` (was → `/quote`) |
| All 174 existing indexable pages | Unchanged URLs | Unchanged | 48 Brisbane + 23 Logan + 33 Gold Coast + 8 Tweed Heads suburbs; 4 regions; 7 services; 28 service × area; 13 guides; other pages |

**Why `/book-now` is noindex.** It's a transactional utility page. Its main content is a third-party iframe, which Google doesn't credit to our page, and the native text is a short introduction. Indexing it would add a thin page competing with the service and area pages for "book a cleaner" searches. Those pages already rank for the intent and link to booking. It stays fully crawlable (`follow`) and linked from the header, so customers always find it.

**Suburbs:** none were rewritten or merged. Note for the planned local-content work: **Yatala has no page today.** The 33 Gold Coast suburb pages include Coomera and Upper Coomera, but not Yatala. Adding it is a separate decision: a new page that needs its own genuinely local content.

## 4. Booking and enquiry buttons

| Button | Destination |
|---|---|
| Header "Book a clean" (desktop) | `/book-now` (event `booking_cta_click`) |
| Regular package cards "Request booking" (regular cleaning hub) | `/book-now` |
| Header "Request a Free Quote" (mobile tile), "Get a free quote" (menu, sticky bar, footer, CTA bands, guides) | `/quote` – unchanged (quote pathway) |
| Commercial / office cleaning | `/quote?service=commercial-cleaning` – unchanged (commercial jobs are quoted, never sent to the residential booking form) |
| Homepage hero form, region and suburb quick-start | Unchanged (Resend) |
| Customer Login (mobile tile, desktop icon, mobile menu, footer, booking page) | `/login` |

**Check in BookingKoala:** the package cards now send customers to the booking form, so its services and prices must match the advertised packages: Regular from $97, Spotless from $147, Ultimate Platinum from $207 (+GST), extra hour $67, bed making $5, linen change $10. The package choice isn't passed into BookingKoala (no supported URL parameter is documented), so customers choose it inside the form.

## 5. Performance (Lighthouse 13, lab)

Before = the SEO build (`04df225`). After = this branch. Format: Performance | LCP | CLS | TBT | Accessibility | Best Practices | SEO.

| Page | Before | After |
|---|---|---|
| Home mobile | 90 · 3.6s · 0 · 40ms · 100 · 100 · 100 | 96 · 2.8s · 0 · 60ms · 100 · 100 · 100 |
| Home desktop | 100 · 0.2s · 0 · 0 · 100 · 100 · 100 | 100 · 0.2s · 0 · 0 · 100 · 100 · 100 |
| Bond cleaning service mobile / desktop | 100 · 0.9s / 100 · 0.7s | 100 · 0.9s / 100 · 0.7s |
| Gold Coast region mobile / desktop | 100 · 0.9s / 100 · 0.2s | 100 · 0.9s / 100 · 0.2s |
| Helensvale suburb mobile / desktop | 100 · 0.9s / 100 · 0.2s | 100 · 0.9s / 100 · 0.2s |
| Guides hub mobile | 92 · 3.4s · 0 | 96 · 2.7s · 0 |
| Bond cost guide (Brisbane) mobile | 94 · 3.1s · 0 | 97 · 2.6s · 0 |
| Quote mobile / desktop | 100 / 100 (a11y 96 desktop) | 100 / 100 (a11y **100**) |
| Contact mobile | 100 · 0.9s · CLS 0 · BP 100 | 100 · 0.9s · CLS 0 · BP 77 |
| Contact desktop | 100 · 0.2s · CLS 0.013 · BP 100 | 100 · 0.2s · CLS **0** · BP 77 |
| Book now mobile / desktop | – | 99 · 0.8s · 0 / 100 · 0.2s · 0 (SEO 66 = noindex, intended; BP 77) |
| Login mobile / desktop | – | 99 · 0.8s · 0 / 100 · 0.2s · 0 (SEO 66 = noindex, intended; BP 77) |

- **No regressions on ordinary pages.** BookingKoala loads only on `/book-now`, `/login` and `/contact`. The integration test confirms zero BookingKoala requests on home, service, suburb, guide, quote and regular cleaning pages, including after scrolling.
- **Best Practices 77 on the three embed pages** comes from BookingKoala's own cookie inside its iframe, which Chrome counts as a third-party cookie, plus the blocked requests in this environment. We can't change it from our side.
- **Mobile LCP: what changed and what's left.**
  - **Changes:**
    - Images are served as AVIF. The hero went from 31 → 17 KB, guide images 23 → 13 KB, and the logo 14 → 8 KB. It's the same image at the same size and placement, with WebP still served to browsers without AVIF.
    - Phones no longer download a hidden second copy of the logo.
    - Guide images get the high-priority hint Lighthouse asked for.
  - **Result:**
    - In Lighthouse's default simulated mode, the one PageSpeed Insights uses, the figure is **2.6–2.8 s**, down from 3.1–3.6 s; one guides-hub run measured 3.4 s, showing run-to-run noise.
    - With **applied** throttling (the same slow-4G and CPU limits, actually enforced), it's **1.7–2.0 s** on home, the guides hub and a guide.
    - The real paint in these runs happens at 0.12–0.23 s.
  - **Why the simulated figure stays above 2.5 s.** It charges the hero image with every file that starts before it paints, including fonts and the framework JavaScript. Cutting those would mean changing fonts or how images load, i.e. the design, so I stopped there. Google ranks on real visitors' Core Web Vitals, which Search Console reports once there's traffic.
  - **AVIF quality check.** Measured against the original photos, AVIF is 33.2–34.4 dB PSNR versus 35.0–36.0 dB for the WebP previously served. That's a small objective difference that isn't visible at viewing size (side-by-side crops compared). Revert by removing `formats` in `next.config.ts` if you prefer.
  - **AVIF encoding cost.** Each image's AVIF is created once, on its first request, and then cached by Vercel's CDN. Encoding takes a little longer than WebP that first time only.

## 6. Quote forms, Resend and BookingKoala

- **Still on Resend (`/api/quote`):**
  - the homepage hero form;
  - `/quote` (full quote form), which is also reached from every region and suburb page's quick-start box;
  - the contact page's callback form.
  - **Resend must stay**, and `RESEND_API_KEY` is still a launch requirement.
- **BookingKoala's forms** (booking, contact) are separate submissions that BookingKoala stores and notifies on. **No form posts to both systems,** so there are no duplicate leads.
- **Contact page.** Both forms are shown: "Request a call back" (Resend) at the top, and "Send us a message" (BookingKoala) below. The callback form is kept until you've confirmed the BookingKoala form delivers. Then decide whether to keep both.
- **Recommendation for the homepage and suburb quote forms (not implemented).** Keep them on Resend for now: they collect quote requests, not bookings, and they work. When you want one system:
  - use **Zapier's BookingKoala integration** or BookingKoala's lead/contact features to create a lead in BookingKoala from `/api/quote`, behind the existing `LEAD_WEBHOOK_URL` (already supported by the API);
  - keep the Resend email as a backup until the BookingKoala lead is verified;
  - don't replace the forms with iframes on suburb pages: it would hurt page speed and add nothing for SEO.

## 7. Business details – consistency check

| Detail | Value | Where |
|---|---|---|
| Customer-facing brand | Swept Cleaning ("Swept") | Header logo, titles (`… \| Swept Cleaning`), Organization `name` / `alternateName`, Open Graph `site_name` |
| Registered business name | Swept Residential and Commercial Cleaning | Footer, privacy policy, Organization `legalName`; matches the BookingKoala account name |
| ABN | 80 230 927 825 | Footer, Organization `taxID` (80230927825) |
| Email | hey@sweptcleans.com.au | Footer, contact page, privacy, structured data, `llms.txt`, scam guide; lead email default; Resend sender quotes@sweptcleans.com.au |
| Phone | 0490 216 363 (`tel:+61490216363`) | Header, sticky bar, footer, contact, booking and login pages, structured data, scam guide |

The phone number and email appear as hard-coded text in only one place, the "avoid scams" guide, and they match `site.ts`. Everything else reads from `src/lib/site.ts`. The old `swept.com.au` email appears only as a history note in `SEO-PRODUCTION-REPORT.md`.

## 8. Tests run on the final build

| Test | Result |
|---|---|
| `npm run build` | pass |
| `npm run typecheck` | pass |
| `npm run test:seo` | **pass**:<br>- 177 URLs crawled, 176 HTML pages<br>- **174 indexable = 174 in the sitemap**<br>- noindex: `/login`, `/book-now` only<br>- 1 warning (`/quote`: 86 words – a form page) |
| Schema.org vocabulary check (`schema-dts`) | 507 / 507 distinct JSON-LD nodes valid across all 176 pages |
| `npm run test:smoke` | **pass**:<br>- pages, links and overflow<br>- hero form, full form, callback form, honeypot, rate limit<br>- mobile menu<br>- the thank-you page still shows "Thanks, Test", and **its URL contains no name**<br>- BookingKoala's own console messages (blocked here) are reported separately |
| `scripts/bookingkoala-check.cjs` | **pass**:<br>- 0 BookingKoala requests on 6 ordinary pages<br>- exactly 1 embed.js and 1 iframe (with title, reserved height and fallback link) on each embed page, at 320/390/768/1440px<br>- client-side navigation home → login → book → back keeps exactly 1 script<br>- Customer Login visible without the menu at 9 widths (320–1440px); touch targets 56–76 × 76px on phones, 44 × 44px on desktop; accessible name "Customer login"<br>- header height unchanged (77 / 97px), no overflow<br>- `/book-now` CLS 0 |
| Visual regression vs SEO build (9 pages × desktop/mobile) | Every page differs by **< 0.4%** of pixels: header login tile or icon, footer link, AVIF photos, quote label colour. The contact page is taller only by the new section. Layout, colours, typography and logo are unchanged. |
| Domain validation | Only `https://sweptcleans.com.au` (any case, optional trailing slash) passes. Rejected: `swept.com.au`, `sweptclean.com.au`, www, `*.vercel.app`, http. The build fails on any of them. |
| Safari / WebKit | **Not tested.** WebKit isn't installed in this environment. Check on a real iPhone (section 9). |

## 9. What only you can verify (on the Vercel preview of this branch)

The branch's preview deployment is noindex and protected. Open it on a desktop and on an iPhone (Safari and Chrome):
1. `/book-now`:
   - Does the booking form appear and **grow to its full height**, with no inner scrollbar and nothing cut off?
   - Can you reach every field and the final confirmation button?
   - Choose a service and a date, but **stop before paying**.
2. `/login`: does the login form show and fit? Try "forgot password" to confirm it works inside the frame.
3. `/contact` → "Send us a message": submit one test message to yourself and confirm it arrives in BookingKoala and by email.
4. Navigate **Home → Customer Login → Book a clean** using the site's links, not a page reload, and check each form loads.
5. If a form shows an inner scrollbar or is cut off, tell me. The component switches to normal scrolling automatically if embed.js fails, and every form also has an "Open … in a new tab" link.

## 10. Launch blockers

1. **The domain isn't connected.** In Vercel → Project → Settings → Domains:
   - add `sweptcleans.com.au` and `www.sweptcleans.com.au`;
   - make **`sweptcleans.com.au` primary**;
   - set **www → 308 redirect to `sweptcleans.com.au`**. Don't choose "redirect to www".
   - At your registrar, add the DNS records Vercel shows (typically an A record for the apex and a CNAME for www). I haven't changed any DNS.
2. **Quote email delivery is unverified.**
   - In Resend, verify the domain `sweptcleans.com.au` (add Resend's DNS records).
   - In Vercel, set `RESEND_API_KEY` for Production.
   - After deploying, check that `https://sweptcleans.com.au/api/lead-status` shows `"ready": true`.
   - Submit one real quote and confirm both emails arrive.
3. **The BookingKoala live check (section 9) hasn't been done.** Also confirm that BookingKoala's services and prices match the advertised packages (section 4).
4. **Branch review and merge.** Review the preview of `bookingkoala-integration`, which already contains `seo-production-launch`, then merge it into `main`. Vercel deploys `main` to production.
5. **Business claims to confirm for launch day:**
   - insured, and every cleaner police-checked;
   - a quote reply within one business day;
   - enquiry hours Monday–Saturday, 7am–6pm;
   - The Swept Promise re-clean;
   - commercial cleaning capability.

**Not blockers, but due before advertising:**
- Set up conversion tracking (section 11).
- Check BookingKoala's own website settings (section 12).

## 11. Conversion tracking (prepared, not switched on)

| Stage | How it's measured | Status |
|---|---|---|
| Clicks "Book a clean" | `booking_cta_click` (header) and `cta_click` (package cards, `cta: package_book_*`) | Live in code; reaches GA4 once `NEXT_PUBLIC_GA_ID` (or GTM) is set |
| Booking form opened | `booking_form_view` when the booking iframe loads (`customer_login_view` and `contact_form_view` for the other two) | Live in code; **a view, never a conversion** |
| Booking completed | **Only BookingKoala can report this.** It happens inside their iframe on their domain. | Needs BookingKoala configuration (below) |
| Contact enquiry submitted (BookingKoala form) | Same as above: inside BookingKoala | Needs BookingKoala configuration |
| Quote / callback submitted (Swept forms) | `generate_lead`, fired only after the server confirms the enquiry was received | Live in code |

**What's required for completed-booking tracking.** BookingKoala's help documents a **Tracking & Conversion** settings tab with a Google Analytics ID field and a Google Ads conversion (global site tag plus event snippet, with the booking amount as the value):
- [help: Google Analytics](https://help.bookingkoala.com/help/google-analytics)
- [help: Google Ads](https://help.bookingkoala.com/help/google-adwords)

Those articles predate GA4 and don't name the event fired on a completed booking. Before relying on them:
1. In BookingKoala → Settings → Tracking & Conversion, enter the **same GA4 Measurement ID** the website uses, and the Google Ads conversion tag, if offered.
2. Ask BookingKoala support which event and page fire on a **completed booking** inside the embedded form, and whether it fires when embedded.
3. Make one test booking with a 100% discount code (no real payment), and check GA4 → Realtime.
4. Mark that event as a key event in GA4 and import it into Google Ads.

Because the form runs on BookingKoala's domain inside an iframe, GA4 may count the booking as a separate session from the website visit. Cross-domain measurement can't be configured from our side without BookingKoala support. No cross-frame messaging has been invented here.

**Privacy.**
- No event carries names, emails, phone numbers or addresses.
- The thank-you URL no longer contains the name.
- BookingKoala handles login, card details and personal data inside its own iframe.
- No Content Security Policy change was needed: the site sends no CSP, and `X-Frame-Options: SAMEORIGIN` only controls who can frame *our* pages. Existing security headers are unchanged.

## 12. BookingKoala settings to review (I changed nothing in your account)

- **Its hosted website.** BookingKoala also serves pages at `sweptresidentialandcommercialcleaning.bookingkoala.com`. To keep Google focused on sweptcleans.com.au, check BookingKoala's website / SEO settings for an option to hide or noindex its hosted site, or to send visitors to your own domain. I couldn't open BookingKoala's settings or help pages from here, so I can't confirm which option exists. Ask support if it isn't obvious.
- **After-booking redirect.** If BookingKoala offers a "redirect after booking" URL, a Swept confirmation page could carry the conversion tracking instead. We can add one (noindex) if you want it.
- **Branding.** Set the form's colours to Swept's coastal blue `#527C91` and navy `#061B49`, so the embedded forms match the site. Iframe content can't be styled from our side.

## 13. Steps to launch

1. Do the section 9 checks on the preview of `bookingkoala-integration` and tell me the results.
2. Merge `bookingkoala-integration` → `main` (I can do this on your go-ahead).
3. **Vercel → Domains:** add the apex and www domains, apex primary, www → 308 to the apex. Add the DNS records at your registrar. Wait for the green "Valid configuration".
4. **Vercel → Environment Variables (Production):**
   - `RESEND_API_KEY` (required);
   - optional: `LEAD_WEBHOOK_URL`, and `NEXT_PUBLIC_GA_ID` or `NEXT_PUBLIC_GTM_ID`;
   - **don't** set `NEXT_PUBLIC_SITE_URL` to anything but `https://sweptcleans.com.au`, or leave it unset.
   - Redeploy.
5. **Resend:** verify `sweptcleans.com.au`; check `/api/lead-status` shows ready; submit one real quote.
6. **Live checks:**
   - Run `BASE=https://sweptcleans.com.au npm run test:seo` and `BASE=https://sweptcleans.com.au node scripts/bookingkoala-check.cjs`; I can run them once the domain resolves.
   - Open `https://www.sweptcleans.com.au` and `http://sweptcleans.com.au` and confirm both land on `https://sweptcleans.com.au/` in one redirect.
7. **Search Console:** a Domain property verified by DNS TXT; submit `https://sweptcleans.com.au/sitemap.xml` (expect 174 URLs). Inspect the 5 representative URLs in `SEO-PRODUCTION-REPORT.md`, and run Google's Rich Results Test on them.
8. **Google Business Profile** (service-area business, no address shown, same name and phone). Add its URL to `site.profiles`.
9. **BookingKoala:** set up conversion tracking (section 11) and the website and branding settings (section 12).
