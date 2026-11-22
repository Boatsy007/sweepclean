# Analytics and conversion tracking

**Google tag:** Tag Manager container `GTM-MFN3G8TW`. Its published version contains the GA4 Google tag `G-WX83B5MFH0` and its settings (enhanced measurement, conversion marking, Ads link). Code: `src/components/Analytics.tsx` (loader), `src/lib/analytics.ts` (`track()`), `src/components/AnalyticsListeners.tsx` (phone and email clicks, ad attribution).

## How it loads
- **Where:** production domain only (`sweptcleans.com.au`). Previews, `*.vercel.app` and localhost load nothing and send nothing.
- **Code:** Google's snippet, unchanged:
  - `dataLayer`
  - `gtag()`
  - `gtag('js', new Date())`
  - `gtm.js?id=GTM-MFN3G8TW`, loaded async
- **Don't add the classic GTM `gtm.start` / `event: 'gtm.js'` push.** This container fires its page view on the gtag `js` command, so the extra push would count every page view twice.
- **Timing:**
  - `gtag` is ready as soon as the page is interactive.
  - `gtm.js` downloads on the visitor's first tap, key press or scroll, or once the page has loaded and the browser is idle, whichever comes first.
  - It doesn't affect LCP or CLS.
- **Early events:** the container ignores `gtag('event')` calls made before it has loaded. So `track()` holds them in `window.__sweptTag.queue` and sends each exactly once when `gtm.js` has loaded, with `origin_path` set to the page the event happened on.
- **Page views:** come from the container's GA4 enhanced measurement, including in-site (client-side) navigation via history events. The site never sends its own `page_view`.

## Events the site sends (GA4)

| Event | When | Parameters (never personal data) |
|---|---|---|
| `generate_lead` | Quote (the quote form on `/quote`, the homepage hero or a suburb page) or call-back **successfully** submitted (server confirmed) – exactly once per enquiry (the six-field form also remembers each enquiry ID in the tab, so a retry or Back never counts it twice), never on a failed or rejected submission, a direct visit to `/quote/thanks` or a refresh of it | `lead_type` (`quote` = /quote, `quote_hero` = homepage hero or suburb page form, `callback`), `form_location` (`quote_page` / `homepage_hero` / `suburb_hero`), `customer_type` (`residential` / `commercial`), `cleaning_type` (six-field form: `regular`, `one_off`, `deep`, `bond`, `airbnb`, `commercial`, `ndis_home_care`, `not_sure`), `service`, `frequency` (incl. `not_sure`, `several_weekly`), `recurring`, `in_area` |
| `quote_cta_click` | Any "Get a free quote" button, or quick-start submit (a click) | `cta_location`, `destination`, `page_type`, `service`, `region`, `suburb`, `frequency` |
| `click_to_call` | Any `tel:` link (one site-wide listener) | `link_location` (`header`, `mobile_bar`, `mobile_menu`, `footer`, `page`) |
| `click_email` | Any `mailto:` link | `link_location` |
| `login_click` | Customer login links | `location` |
| `customer_login_view` | Login iframe loaded | `form` |
| `quote_start` / `quote_step` / `quote_step_error` / `quote_submit_error` | Quote form funnel (field **names** only on errors) | `step`, `step_name`, `service`, `mode`, `customer_type` |

**Retired (quote-only change, November 2026):** `booking_request` and `booking_cta_click` are no longer sent – nothing is booked or priced on the website, and every booking button became "Get a free quote". Their history stays in GA4. A browser tab left open on the old booking page could still send one `booking_request` from its old code; the new site never sends `booking_request` and `generate_lead` for the same enquiry.

The GA4 enhanced measurement built into the container also sends `page_view`, `scroll`, `form_start`/`form_submit` (when a form is interacted with or submitted), outbound clicks, file downloads and video events. Use `generate_lead` as the conversion, not `form_submit`.

**Google Ads after the quote-only change (do this in Google Ads – the website doesn't change account settings):** Goals → Conversions → Summary → open the `booking_request` conversion action → set it to **Secondary** (or remove it from the goals used for bidding) so bidding doesn't optimise towards a conversion that no longer happens. Keep the action (don't delete it) so its history stays. Make sure `generate_lead` is **Primary**; it has no value, so give it a default value in its settings if you use value-based bidding. In GA4 you can later un-mark `booking_request` as a key event (history is kept). Register `customer_type` and `cleaning_type` as event-scoped custom dimensions if you want to report on them.

## Required in Google (not done from the website)

1. **Turn off automatic user-provided data collection.** The container has *"user-provided data: automatic detection"* on, for email, phone and address. Google could scan the forms and send that data (hashed) to Google.
   - **Where:** Google tag settings (Tag Manager → the Google tag → Configure tag settings → *Include user-provided data from your website* / *Automatically detect user-provided data*), or GA4 Admin → Data collection.
   - The site never sends personal data itself. No hashed user data appeared in testing, but turn it off to be sure.
2. **Replace the `ads_conversion_Contact_Us_1` conversion.**
   - It's created from **every page view of `/contact`** and marked as a key event, so a visit counts as a Google Ads conversion. Testing confirmed the GA4 event and the Ads conversion ping both fire on a plain `/contact` page view.
   - Delete that event rule in GA4 (Admin → Events → Create event), and remove or demote the "Contact Us" conversion action in Google Ads.
3. **GA4 → Admin → Key events:** mark `generate_lead` (`booking_request` is retired – see above). Optionally mark `click_to_call` as secondary.
4. **GA4 → Admin → Custom definitions:** register event-scoped dimensions:
   - `lead_type`, `customer_type`, `cleaning_type`, `service`, `frequency`, `cta_location`, `page_type`, `region`, `suburb`, `link_location`, `origin_path` (`package` only for historical data);
   - and a `value` metric if you want it.
5. **Google Ads:** GA4 is already linked (the container has the Ads link). Use `generate_lead` as the primary conversion; `booking_request` should be secondary (retired). Keep `click_to_call` as secondary.
6. **Confirmed (paid) bookings – offline conversions.**
   - Bookings are confirmed in BookingKoala, not on the website, so the website can't see them.
   - Every enquiry's webhook payload now includes `attribution`: `gclid` / `gbraid` / `wbraid` plus the UTM tags and landing page of the visit (see `LEAD-WEBHOOK.md`).
   - In Make.com: store the `gclid` on the BookingKoala lead (notes or a custom field). When the booking is confirmed (for example via a BookingKoala "new booking" trigger), send Google Ads **Upload click conversion**, with that `gclid`, the confirmation time and the booking value.
   - BookingKoala's own "Tracking & Conversion" settings apply only to its own booking form, which the site no longer uses.

## Privacy and consent
- No names, emails, phone numbers, addresses, business names or notes/requirements are ever sent in events. This is checked automatically by `npm run test:smoke`, and was checked against the real container.
- The thank-you URL has no personal details.
- The ad attribution (click IDs and UTMs) is kept in this browser tab's `sessionStorage` and sent only with an enquiry.
- **Australia:** the privacy policy already says analytics collects anonymous usage information.
  - **Recommended (needs your approval, since it's a content change):** add that this uses Google Analytics and Google Tag Manager, which set cookies.
  - If you start advertising to the EU/UK, add a consent banner with Google Consent Mode.
- The container already disables Google signals in all regions (`GOOGLE_SIGNALS` redacted).

## Known compromises
- **Mobile blocking time:** in a lab test, the container's ~600 KB script adds about 110–215 ms of mobile Total Blocking Time. LCP and CLS are unchanged, and desktop is unaffected. This is inherent to any Google tag set-up.
- **Very early navigation:** if a visitor taps a link to another page before `gtm.js` has finished downloading (typically the first ~0.5–1 s, since the download starts on their first interaction):
  - that click event and the landing page's `page_view` aren't recorded;
  - the visit starts at the next page.

  Early clicks that *don't* change page (phone, email) are queued and sent. Quote submissions always happen long after the tag has loaded.

## Testing
- `npm run test:all`: each suite on its own fresh server (rate limits untouched). The smoke test installs a recording `gtag` and checks exact event counts, parameters and the absence of personal data.
- **To test against the real container locally:**
  1. `NEXT_PUBLIC_ANALYTICS_TEST_HOST=localhost npm run build`
  2. Load pages through the network proxy, and intercept `/g/collect` (answer it locally, so nothing is sent to Google).
  3. **Never set that variable in Vercel.**
