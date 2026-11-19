# Conversion optimisation report – booking first, quotes second

_19 November 2026 · branch `conversion-optimisation`, built on `bookingkoala-integration` (`7e544be`). Not merged; production unchanged._

**Principle:** residential customers who are ready to buy go straight to **Book a clean → `/book-now`** (BookingKoala). Anyone who wants a written price, has a custom scope, or needs **bond or commercial** cleaning keeps the **free quote** pathway. All pathways are driven from one setting in `src/lib/bookingKoala.ts`:

```ts
export const BOOKABLE_SERVICES = ["regular-house-cleaning"];
```

Only **Regular house cleaning** is set as bookable, because it's the only service with advertised packages and prices. I can't see your BookingKoala configuration (its Cloudflare blocks this environment), so the rest stay quote-first until you confirm them:

| Service | Pathway | Why |
|---|---|---|
| Regular house cleaning | **Book first**, quote second | Packages with advertised prices |
| Deep cleaning, Airbnb, NDIS, Carpet | Quote first (unchanged) – **please review** | No advertised standard price; scope varies. Add the slug to `BOOKABLE_SERVICES` once it's set up in BookingKoala, and every page, band and sticky bar switches automatically |
| Bond cleaning | Quote first (unchanged) | Scope depends on the property and entry report – avoids under-priced bookings |
| Commercial cleaning | Quote first (`/quote?service=commercial-cleaning`) + Call | Tailored quotation |

## 1. CTA changes (before → after)

| Template / location | Before | After | Why |
|---|---|---|---|
| **Header, desktop** | "Book a clean" → `/book-now` | Unchanged | Already correct |
| **Header, mobile tile** | "Request a Free Quote" → `/quote` | **"Book a Clean" → `/book-now`** (same tile, icon and size) | Primary residential action visible without the menu. Customer Login tile unchanged; no new tile; no overflow 320–820px |
| **Mobile sticky bar** | Call + "Get a free quote" (all pages) | Residential pages: Call + **"Book a clean"**. Commercial pages: Call + "Get a free quote" (commercial preselected). Bond and other quote-first services, and bond guides: Call + "Get a free quote" (service preselected) | Matches intent. Same design, proportions and position; still hidden on `/quote`, `/book-now`, `/login` |
| **Mobile menu** | "Get a free quote" button + Customer login | **"Book a clean"** (filled) + "Get a free quote" (outline) + Customer login | Two clearly different pathways |
| **Homepage hero** | "Get my free quote" (button) → quote form | **"Book a clean" → `/book-now`** (same button), plus a line underneath: "Prefer a written price first? Get a free quote" → the quote form | Booking is primary above the fold. The quote form is untouched (beside the hero on desktop, directly below on phones) |
| **Homepage schedule cards** | "Quote weekly / fortnightly / monthly" → `/quote?…&frequency=` | **"Book weekly / fortnightly / monthly" → `/book-now?frequency=…`** | Recurring customers book directly; the booking page reminds them which frequency to pick |
| **Closing band (`CtaBand`) – home, Why Swept, services, areas, FAQ, contact, Promise, guides hub** | "Request a quote" → `/quote` | **"Book a clean" → `/book-now`**, with "Prefer a written price first? Get a free quote" | Booking first on general residential pages |
| **Regular service page** (hero, FAQ block, band) | "Get a free quote" (primary) + "What's included" | **"Book a clean"** (primary) + "Get a free quote" (outline). "What's included" moves to the line underneath. FAQ block: Book + "or get a free quote". Band: "Ready to book your regular house cleaning?" | Bookable service |
| **Regular × Brisbane / Logan / Gold Coast / Tweed** (service × area hero and band) | Quote primary | **Book primary**, quote secondary (as above) | Bookable service |
| Other service and service × area pages (deep, NDIS, bond, Airbnb, carpet, commercial – 30 pages) | Quote primary | **Unchanged** | Quote-first services |
| **Package cards** | "Request booking" → `/book-now` | **"Book Regular" / "Book Spotless" / "Book Ultimate Platinum" → `/book-now?package=…`**, plus a line under the cards: "Booking online? Choose the same package and your home's size in the booking form." | Clear next step; the booking page repeats the chosen package |
| **Services overview `/services`** | Every card: "Get a quote" | Regular: **"Book a clean"** + "Learn more" + "or get a quote". Others unchanged | Bookable service |
| **Suburb pages (112)** | Hero: quote form only. Cards: "Get a quote". Band: quote | Hero: the quote form stays + a **"Book a clean"** button ("or get a free quote below / with the form"). Fit and service cards: "**Book online**" added for regular cleaning, "Get a quote" kept on all. Band: **Book**, with the suburb-prefilled quote as the secondary link | Direct booking without submitting a quote. No BookingKoala resources loaded; no prices; local content untouched |
| **Region pages (4)** | Quick-start → quote. Band "Get a cleaning quote in {Region}" | Quick-start unchanged + "**Ready to book? Book a clean online**". Band "**Book a clean in {Region}**" → `/book-now` (+ quote link) | Quick-start kept as asked; booking made visible |
| **Guides – regular cleaning, pricing, hiring and renting (8)** | Sidebar and band: "Get My Free Quote" → `/quote` | Sidebar: **"Book a Clean"** + "or get a free quote". Band: Book + quote link | First service is regular cleaning |
| **Guides – bond (5) and emergency (1)** | Same as above | **Quote kept**, now preselecting the guide's service (`/quote?service=bond-cleaning`); sticky bar → quote | Bond scope varies |
| **Swept Promise** | Hero "Get a free quote" + phone | Hero **"Book a clean"** + phone. Band wording no longer mentions "a written quote" | General residential page |
| **Footer** | "Get a free quote" (white button) | **"Book a clean"** (white button) + "Get a free quote" link | Both pathways on every page |
| **`/quote`** | H1 "Book a clean – get your free quote" | H1 "**Get a free cleaning quote**". Adds "No obligation – a quote isn't a booking" and "Want to book a home clean straight away? Book online" | Makes clear a quote isn't a booking (the title was already "Free House Cleaning Quote") |
| **`/book-now`** | Quote and phone links above the form; login link at the bottom | "Already a customer? **Log in**" beside the H1. One-line intro. Package or frequency reminder when arriving from a card. Quote, phone and commercial links moved **below** the form | Fewer distractions before the form |
| Contact page, quote forms, hero quote form, callback form, login page | – | **Unchanged** (Resend still used) | Preserved |

**Unchanged:**
- package prices, inclusions and GST presentation;
- all SEO content, titles, descriptions, canonicals, sitemap and structured data;
- the homepage design;
- the suburb local content;
- URL paths.

## 2. Journeys

**Residential (mobile or desktop):** search, ad or referral → any residential page:
1. They tap **Book a clean** (header tile, hero, sticky bar, package card or band) → `/book-now`.
2. If they came from a card, they're reminded which package or frequency to pick.
3. In BookingKoala they choose the service, frequency, home details and date, review the price and confirm. This is all BookingKoala's form.
4. They manage future cleans through **Customer Login**, which is visible in the header on every page.

**Customers wanting a written price:** they use "Get a free quote" (hero form, secondary links, menu, footer) → the quote form → the thank-you page → you send a quote.

**Commercial:** commercial pages → **Get a free quote** (hero, FAQ, band, sticky bar) → `/quote?service=commercial-cleaning`, or Call. Commercial pages have no booking button in their content; the global header and footer still show "Book a clean" for residential visitors.

**Bond:** bond pages and bond guides → **Get a free quote** with bond preselected, or Call.

**Mobile specifically:**
- From any residential page, booking is one tap away (the header tile or the sticky bar).
- The quote is one tap away on pages with the hero form, or two via the menu.
- Login is one tap away.
- Customers never have to submit a quote to book.

## 3. Conversion tracking

All events go to the existing `dataLayer` / gtag helper and contain **no personal data**.

| Event | When | Parameters |
|---|---|---|
| `booking_cta_click` | Any "Book a clean" click | `cta_location` (e.g. `home_hero`, `header_mobile`, `mobile_bar`, `package_card`, `suburb_hero`, `guide_sidebar`), `destination`, `page_type`, `service`, `region`, `suburb`, `package`, `frequency` (where relevant) |
| `quote_cta_click` | Any "Get a free quote" click, and quick-start submits | same set |
| `booking_form_view` | The booking iframe loaded on `/book-now` (a view, **not** a booking) | `form`, plus `package` / `frequency` carried from the card |
| `generate_lead` | Quote or callback **successfully** submitted (server confirmed) | existing: `lead_type`, `service`, `frequency`, `recurring`, `in_area` |
| `click_to_call` | Phone link tapped | `location` |
| `login_click` | Customer Login link | `location` |
| `contact_form_view` / `customer_login_view` | Those iframes loaded | `form` |
| **Completed booking** | **Pending.** Only BookingKoala can report it (see section 5) | – |
| **BookingKoala contact enquiry submitted** | **Pending** – same | – |

Booking-page visits are the standard GA4 `page_view` of `/book-now`. Device, Google Ads vs organic, and region or suburb all come from GA4's own dimensions together with these parameters, so after launch you can compare:
- booking clicks → form views → completed bookings, against quote clicks → `generate_lead`;
- by device, page type, service, suburb and channel.

Recurring vs one-off is only measurable if BookingKoala's conversion data includes the frequency.

## 4. Regression results (final build)

| Check | Result |
|---|---|
| Build / typecheck | pass / pass |
| `npm run test:seo` | **pass**:<br>- 174 indexable = 174 in the sitemap<br>- noindex: `/login`, `/book-now`<br>- page-by-page comparison with the previous branch: **no title, description, canonical, indexability or sitemap changes on any page**; the only field change is the `/quote` H1 (intended)<br>- structured data types identical |
| `npm run test:smoke` | **pass** (quote form, hero form, callback, thank-you, honeypot, rate limit, menu, overflow) |
| `scripts/bookingkoala-check.cjs` | **pass**:<br>- 0 BookingKoala requests on ordinary pages<br>- 1 script and 1 iframe per embed page<br>- client navigation now uses **genuine pointer clicks**<br>- `/book-now` CLS 0 |
| **New `npm run test:cta`** | **pass**:<br>- all 174 sitemap pages: 1,338 booking CTAs all → `/book-now`, 1,732 quote CTAs all → `/quote` or `#quote`<br>- commercial and bond pages have **no** booking CTA in their content; commercial quotes keep `service=commercial-cleaning`<br>- regular pages and the homepage lead with booking; all 112 suburbs offer booking<br>- BookingKoala referenced only on `/contact`, `/book-now` and `/login`<br>- sticky bar correct on 9 page types and hidden on `/book-now`, `/login`, `/quote`<br>- **genuine taps** at 320, 360, 375, 390, 414, 430, 768 and 820px (header Book tile, sticky Book, sticky commercial quote, menu Book, menu quote, header login) and the desktop header Book button land on the right pages, with 0px horizontal overflow |
| Lighthouse (mobile / desktop), before → after | Home 96→95 · LCP 2.8→2.8s / 100→100. Gold Coast region 100→100. Helensvale 100→100. Bond guide 97→97. Quote 100→100 (desktop CLS 0.014→0.006). Book-now 99→100. Regular service: 100 · 0.9s / 100 · 0.6s. Accessibility 100 on all; CLS 0 |
| Visual regression vs previous branch | Changes confined to the CTA areas (< 1.6% of pixels per page; page height changes of 6–80px where a line or button was added or moved). No layout, colour, font or logo changes |

**Not verified here:**
- BookingKoala's form itself: rendering, resizing, choosing services and frequency, price review, payment, confirmation. Its Cloudflare blocks this environment.
- Safari (WebKit isn't installed here).

## 5. BookingKoala configuration needed (your account – I changed nothing)

1. **Services and pricing to match the site:** Regular, Spotless and Ultimate Platinum, named exactly as on the site, starting at $97 / $147 / $207 for the stated sizes. Extra hour $67, bed making $5 per bed, linen change $10 per bed. Customers are told to pick the package by name.
2. **Frequencies:** weekly, fortnightly, monthly and one-off, with any recurring discount you choose. The site's schedule cards send people to pick these in the form.
3. **Price shown before confirming.** Make sure the booking summary shows the total (including GST, see section 6) before the customer confirms, and that confirmation emails go to the customer and to you.
4. **Payments:** decide when the card is charged (at booking, or after the clean), so no manual invoicing is needed.
5. **Completed-booking tracking:** under Settings → Tracking & Conversion, set:
   - the same GA4 ID as the site;
   - the Google Ads conversion tag.

   Then ask BookingKoala support which event fires on a completed **embedded** booking, and test it with a 100%-discount booking. Without this, completed bookings can't be counted on our side.
6. **After-booking redirect.** If BookingKoala offers one, a Swept "booking received" page could carry the conversion tag.
7. **Other services.** If deep, NDIS, Airbnb or carpet cleaning are set up with standard pricing, tell me and I'll add them to `BOOKABLE_SERVICES`.
8. **Form colours:** set them to `#527C91` / `#061B49`.

## 6. Pricing compliance flag (no change made)

The packages show prices as "**From $97 +GST**". Under the Australian Consumer Law, prices shown to consumers generally have to include a **single total price**: the minimum quantifiable amount, including GST. Showing "+GST" separately to residential customers may not comply. The ACCC's guidance on component pricing applies, so check with your accountant or adviser.

If you decide to change it, the GST-inclusive figures would be $106.70, $161.70 and $227.70, with the extra hour at $73.70. I haven't changed the prices or their presentation, as instructed. BookingKoala should show the same basis.

## 7. Manual acceptance tests (on the preview)

On an iPhone (Safari and Chrome), an Android phone and a desktop:
1. Home → tap the hero **Book a clean** → the booking form loads and grows to full height, with no inner scrollbar.
2. Regular cleaning page → package card **Book Spotless** → the booking page says "You chose the Spotless package". Choose Spotless and fortnightly in the form, and check the price before the confirm step. **Stop before paying,** or use a 100% discount code.
3. A suburb page (e.g. Helensvale) → sticky **Book a clean** → booking page. Also tap the hero **Book a clean**.
4. Commercial page → sticky **Get a free quote** → the quote form with "Commercial" preselected. Submit one test quote and confirm the email arrives.
5. A bond guide → sticky **Get a free quote** → the quote form with "Bond" preselected.
6. Menu → **Book a clean** and **Get a free quote** both work; **Customer login** → the login form works.
7. If GA4 is connected: in Realtime, see `booking_cta_click`, `booking_form_view` and `quote_cta_click`, and no names or emails in any event.

## 8. Files changed

- **New:**
  - `src/components/CtaLink.tsx` (tracked booking or quote link)
  - `src/components/BookHint.tsx` (package or frequency reminder on `/book-now`)
  - `scripts/cta-check.cjs` (`npm run test:cta`)
  - this report
- **Changed:**
  - `src/lib/bookingKoala.ts`: `BOOKABLE_SERVICES`, `bookHref`, `quoteHref`, `primaryCta`
  - `src/components/CtaBand.tsx`: booking or quote intent
  - `src/components/MobileCtaBar.tsx`: intent per page
  - `src/components/Header.tsx`: mobile Book tile, menu buttons, `login_click`
  - `src/components/Footer.tsx`
  - `src/components/RegularPackages.tsx`
  - `src/components/QuickStart.tsx`
  - `src/components/BookingKoalaEmbed.tsx`: package and frequency on `booking_form_view`
  - `src/app/page.tsx`
  - `src/app/services/page.tsx`
  - `src/app/services/[slug]/page.tsx`
  - `src/app/services/[slug]/[area]/page.tsx`
  - `src/app/areas/[slug]/page.tsx`
  - `src/app/areas/[slug]/[suburb]/page.tsx`
  - `src/app/cleaning-guides/page.tsx`
  - `src/app/cleaning-guides/[slug]/page.tsx`
  - `src/app/swept-promise/page.tsx`
  - `src/app/quote/page.tsx`
  - `src/app/book-now/page.tsx`
  - `scripts/bookingkoala-check.cjs`: genuine clicks
  - `package.json`: `test:cta`
  - `CLAUDE.md`
