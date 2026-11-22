# BookingKoala lead form on /quote

**Status:** branch `bookingkoala-lead-form`, preview only – not deployed. `/quote` and the homepage hero show BookingKoala's lead enquiry form (form `8a30eb91-5b26-4ddf-ac12-29ff53bba421`); enquiries made there go straight into BookingKoala as leads. Everything else on the site is unchanged.

## What's built
- `src/components/BookingKoalaLeadForm.tsx` renders the iframe exactly as supplied (id `iFrameResizer0`, src, `border:0`, height `1000px`, width `100%`, `scrolling="yes"`) plus an accessible title, inside a card in the site's style with no inner padding. There is only ever one form per page.
- Layout: the form uses the full content width of `/quote` (about 1,134px on desktop, 958px at 1024px, full width on tablets and phones), with "Your details are safe" below it; the heading, introduction and three process cards are unchanged. Whether BookingKoala shows its two-column layout depends on its own breakpoints inside the iframe. With `NEXT_PUBLIC_QUOTE_FORM=native` the original two-column page layout (form 1.6 : 1 sidebar) is used.
- Preview diagnostics: `/quote?bkdebug=1` on a non-production host shows whether the resizer started, the size messages and other message types BookingKoala's form sends, and the iframe's width × height. Never shown on the production domain; nothing is tracked or sent.
- BookingKoala's `iframeResizer.min.js` is loaded once per visit. Its contents couldn't be checked (BookingKoala blocks the test machine), so the component handles both possibilities: if the script sizes `#iFrameResizer0` itself when it loads, nothing more is done; if it only provides `iFrameResize()`, that is applied to the iframe – including after a client-side visit away from `/quote` and back, when the script has already run. Its listeners are removed when the visitor leaves. If the script doesn't work, the form still works at its 1000px starting height with scrolling.
- Links like `/quote?service=…&frequency=…` show a reminder above the form ("You're asking about … – please select this in the form below"), because prefilling BookingKoala's form from the link hasn't been verified. UTM tags and click IDs stay in the page URL, but they aren't passed into BookingKoala.
- The site sends no analytics events for the form.

- **Homepage hero:** the same component (`variant="hero"`) inside the existing hero card – same card, photo on phones, "Request your free quote" heading, trust line and promise note; BookingKoala's form replaces the quick form's fields, edge to edge in the card (486px wide on desktop). The quick form's "Use the full quote form" link is dropped, since both places now show the same form. Suburb pages keep the quick quote form (the shared `HeroQuoteForm` component is unchanged).
- Preview-only tools (non-production host): `/quote?bkdebug=1` (resizer status, BookingKoala's messages, iframe size) and `&bkwidth=860` (try a narrower form card on `/quote`).

## Not changed (decisions needed)
- **Suburb page heroes** (`HeroQuoteForm`, 112 pages) still show the site's quick quote form.
- **Hero height:** until BookingKoala's resizer works, the iframe keeps its 1000px starting height, so the homepage hero card is about 1,198px tall on desktop (the quick form card was 804px). Once resizing works, the card follows the form's real height.
- **Contact page call-back form**: phone-based and not a quote form – recommended to keep as is (it goes to the business inbox via Resend and to BookingKoala via Make.com).

## Which forms go where
| Form | Where | Goes to |
|---|---|---|
| BookingKoala lead form | `/quote` (and `/book-now`, which redirects there) and the homepage hero | BookingKoala directly – the site's `/api/quote`, Resend and the Make.com webhook are not involved, so there are no duplicate leads |
| Quick quote form | suburb page heroes | `/api/quote` → Resend email + Make.com webhook → BookingKoala lead |
| Call-back form | `/contact` | `/api/quote` → Resend email + Make.com webhook |

## Conversion tracking (release-blocking – not solved)
`generate_lead` is **not** sent for BookingKoala form submissions, and nothing fires on load, Next or Submit. The form is a cross-origin iframe: the page can't see its steps or a successful submission, and no submission message from BookingKoala has been verified. Until fixed, Google Ads and GA4 will not count `/quote` enquiries (the quick quote and call-back forms still send `generate_lead`).

Options, in order of preference:
1. **Redirect after submission.** If BookingKoala's lead form settings allow redirecting to a URL after a successful submission, redirect to a Swept thank-you page (e.g. `https://sweptcleans.com.au/quote/thanks?type=lead`). That page is on Swept's own domain, so it can record `generate_lead` exactly once and show itself full-page. This needs a small, testable change once you confirm the setting exists.
2. **BookingKoala's own tracking settings** for lead forms (Google Analytics / Google Ads), if available – test in GA4 DebugView / Google Ads that exactly one conversion arrives per submission.
3. **Server-side from BookingKoala leads** (Make.com "new lead" → GA4 Measurement Protocol / Google Ads offline conversion). Reliable counting, but the ad click (gclid) isn't stored on BookingKoala leads from this form, so Google Ads couldn't attribute them.

## Manual tests (BookingKoala blocks automated tests – a normal browser is needed)
1. Preview `/quote` on desktop, laptop, tablet, phone and a 320px window: the form shows, fits, has no cut-off fields, no inner scrollbar once resized, and no large blank space.
2. Go through every step to the thank-you page: the frame resizes at each step.
3. From another page click a quote button, then Back, Forward and Refresh: one form each time.
4. Submit one test lead marked as a test: check the BookingKoala lead has service, frequency, suburb, requirements, first and last name, email and phone; check the customer email and your admin notification; check BookingKoala shows one lead only.
5. Try `?service=…&frequency=…` on the iframe's own URL in a browser tab to see whether BookingKoala prefills anything.
6. GA4 Realtime: no `generate_lead` from these tests (expected until tracking is solved).

## Rollback (no rebuild)
- Vercel → Deployments → the current production deployment (commit `6649070`) → **Instant Rollback** / Promote. This switches back immediately without building.
- Alternatively `NEXT_PUBLIC_QUOTE_FORM=native` makes `/quote` and the homepage hero show the site's own forms again (requires a redeploy).
- Resend, `/api/quote`, the webhook and all form components are untouched.

## Tests
- `npm run test:all` – all suites on the BookingKoala build, including `bk-lead` (real checks on our side + a simulated resizer).
- `npm run test:native` – builds the site's-own-form version into `.next-native` and runs every suite against it (the rollback path).
