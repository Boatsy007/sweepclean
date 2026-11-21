# Jobber request form on /quote

**Status:** branch `jobber-quote`, not deployed. `/quote` shows Jobber's official embedded work request form (form 5384111). Enquiries made there go straight into Jobber.

## How it works
- `src/components/JobberQuoteForm.tsx` adds Jobber's snippet and stylesheet (values in `src/lib/jobber.ts`, from the embed code in Jobber) each time `/quote` is shown, and removes them when the visitor leaves. `next/script` isn't used: it loads a given script only once per visit, so after a client-side visit away from `/quote` and back, Jobber's snippet wouldn't run again and the form would be empty.
- Jobber's snippet sends the page's `utm_*`, `gclid` and `fbclid` to Jobber, where they're stored with the request. When the visitor arrived on another page (e.g. an ad landing page) and then came to `/quote`, the component adds the stored attribution for the visit to the form URL, so Jobber still records it.
- **Preselection:** Jobber's embed has no supported way to prefill answers; the snippet only forwards UTM tags and click IDs. So `/quote?service=…&frequency=…` shows a reminder above the form ("You're asking about regular home cleaning – fortnightly – please include this in the form below"). Every existing quote link keeps working.
- **Backup form:** if Jobber reports an error, or hasn't shown its form within 15 seconds, the visitor sees "Our online request form didn't load" with the phone number, and the site's own quote form (→ `/api/quote` → Resend email to hey@sweptcleans.com.au). A `quote_form_fallback` event (reason only, no personal data) is sent to GA4 so you can see how often it happens.
- **Untouched:** the homepage and suburb quick quote forms, the contact call-back form, `/api/quote`, Resend and webhook support.

## Rollback
- **Fastest:** Vercel → Deployments → the previous production deployment → Instant Rollback.
- **Without Jobber:** set `NEXT_PUBLIC_QUOTE_FORM=native` in Vercel (Production) and redeploy. `/quote` then shows the site's own form again. Remove the variable to return to Jobber.

## Conversion tracking (decision needed)
`generate_lead` is **not** sent for Jobber submissions. The embed doesn't tell the page when a request is submitted. Jobber's snippet only receives `close`, `scrolltop`, `recaptcha-setup` and height messages, and the form is a cross-origin iframe, so the page can't see a submission. Guessing from height changes would count partial forms and errors, so it isn't done.

Options to verify before choosing:
1. **Jobber's own Google Analytics support.** The snippet passes the visitor's GA client and session IDs to Jobber, but only if the page has a `gtag('config', …)` command. The site loads GA4 through Google Tag Manager, which doesn't create one, so they aren't passed today. Check in Jobber whether request forms can send events to GA4. If so, test in GA4 DebugView that one event arrives per submitted request.
2. **From Jobber's records (recommended):** Jobber stores the `gclid` and UTM tags passed by the embed with each request. A "new request" trigger (Make.com / Zapier / Jobber's API) can send a Google Ads offline conversion and/or a GA4 Measurement Protocol event, once per real request. This needs a Jobber automation connection to be set up and tested.

Until one of these is set up and verified, Google Ads and GA4 only see `generate_lead` from the quick quote forms, call-backs and the backup form. Adjust bidding expectations accordingly.

## Manual test checklist (needs a normal browser – Jobber blocks cloud servers)
1. Open the preview or production `/quote` on desktop and phone. Jobber's form shows inside the page, there's no sideways scrolling, and the page's header, footer and explainer are unchanged.
2. Click a service button (e.g. Bond cleaning) on another page. `/quote` opens with the reminder, and the Jobber form loads (also after Back, Forward and Refresh).
3. Submit one test request with your own details, labelled as a test. In Jobber → Requests, check every answer, the source/UTM fields and any attachments arrived. Check the customer confirmation email and your new-request notification.
4. Repeat with `?utm_source=test&gclid=TEST123` on the landing page, and check Jobber shows them on the request.
5. Check GA4 Realtime: no `generate_lead` for the Jobber test (expected), and `page_view` as usual.
