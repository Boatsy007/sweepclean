# Website enquiries: Resend email (now) and Make.com → BookingKoala (later)

**Status (20 November 2026):** none of the delivery channels is configured on the live site yet (`/api/lead-status` → `"ready": false`), so the live site currently shows "Sorry – your request didn't send" (with the phone number and email) for every enquiry. **Set up Resend before the next production deployment** (see "Resend set-up" below). Make.com and BookingKoala will be added later; the webhook below is ready for them.

## What happens to an enquiry

Every enquiry form posts to `/api/quote`, which:
1. validates the request on the server: name, phone and **email are required on every quote form** (residential, commercial and the homepage/suburb quick quote); the call-back form is phone-based (email optional). Plus the spam honeypot, 2.5-second timing trap and rate limit of 5 requests per 10 minutes per IP;
2. emails it to the business inbox, `LEAD_TO_EMAIL` (default **hey@sweptcleans.com.au**), via **Resend**, with the customer's email as reply-to – the primary record of every enquiry;
3. at the same time, and independently, POSTs the JSON below to `LEAD_WEBHOOK_URL` if it's set (e.g. a Make.com custom webhook);
4. once the enquiry has been delivered, emails the customer an acknowledgement ("We've got your request – Swept Cleaning", with a copy of what they sent; replies go to the business inbox). Its own failure doesn't fail the enquiry.

Delivery rules:
- The email and the webhook are **independent**: either one failing, timing out (10 seconds) or not being configured never stops the other.
- The visitor sees the thank-you page only if at least one channel confirmed delivery. Otherwise they see "Sorry – your request didn't send" with the phone number and email address, no `generate_lead` is recorded, and the enquiry is written to the Vercel function log (`[lead] NOT DELIVERED`).
- If Resend fails but the webhook delivers, the visitor sees success (the lead is stored in Make.com) and `[lead] email NOT sent` is logged.
- "Log only" (no delivery) is allowed only in local development and automated tests – never on a Vercel production deployment, even if `LEAD_DEV_LOG` is set by mistake.
- No placeholder email addresses are ever created.

**No prices.** Swept quotes every clean personally (since the quote-only change, November 2026). The website never calculates or sends a price, package or estimate.

| Form | Where | `type` | `customer_type` |
|---|---|---|---|
| Quote – Residential tab | `/quote` (and `/book-now`, which now redirects there) | `quote_request` | `residential` |
| Quote – Commercial tab | `/quote?service=commercial-cleaning` or `/quote?type=commercial` | `quote_request` | `commercial` |
| Quick quote (unchanged) | homepage and suburb page hero forms | `quote_request` | from the service (`commercial` for commercial cleaning, else `residential`) |
| Call-back (unchanged) | `/contact`, `/quote` (call-back mode) | `callback_request` | from the service, or `null` |

The retired booking request form (`/book-now?package=…`) no longer exists. A request from a browser tab that was still open on it is accepted as a regular-cleaning `quote_request` (never priced); the summary row "Old booking page" records the package and extras it named, and `details.legacy_booking` is `true`.

## Payload (version 1)

```json
{
  "version": 1,
  "type": "quote_request",
  "submitted_at": "2026-11-20T04:54:26.681Z",
  "customer_type": "commercial",
  "cleaning_type": { "value": "strata", "label": "Strata / common area cleaning" },
  "customer": { "name": "Sam Citizen", "first_name": "Sam", "last_name": "Citizen", "email": "sam@example.com", "phone": "0412345678", "contact_preference": null, "business_name": "Example Body Corporate" },
  "property": { "address": null, "suburb": "Southport", "postcode": "4215", "state": "QLD", "in_service_area": true, "type": "Other", "bedrooms": null, "bathrooms": null, "premises_size": null, "pets": null },
  "service": { "slug": "commercial-cleaning", "name": "Commercial / office cleaning" },
  "package": null,
  "frequency": null,
  "extra_hours": null,
  "extras": { "bed_making_beds": null, "linen_change_beds": null, "quote_add_ons": [] },
  "preferred_date": null,
  "preferred_time": null,
  "estimate": null,
  "notes": "Lobby and lifts",
  "source": "google",
  "attribution": { "gclid": "…", "utm_source": "google", "utm_medium": "cpc", "landing_page": "/services/commercial-cleaning" },
  "details": {
    "frequency": { "value": "several_weekly", "label": "Several times a week" },
    "premises_type": "Strata / common areas",
    "floor_area": "Not sure",
    "preferred_times": "After hours / overnight",
    "legacy_booking": null
  },
  "summary": { "Type": "Quote request", "Customer type": "Commercial", "Cleaning type": "Strata / common area cleaning", "Service": "Commercial / office cleaning", "Business name": "Example Body Corporate", "Frequency": "Several times a week", "Property": "Strata / common areas", "Premises size": "Not sure", "Time of day": "After hours / overnight", "…": "…" }
}
```

### Compatibility with an existing Make.com scenario

The quote-only change keeps payload **version 1** and only **adds** fields:
- `customer_type`, `cleaning_type`, `customer.business_name` and `details` are new.
- `summary` keeps its row names and may contain new rows: "Customer type", "Cleaning type", "Business name", "Old booking page". Its values are free text and carry the customer's exact answers.

Every field that existed before keeps its name and type, and only carries values it could already carry for a quote or call-back request:
- `frequency` is `weekly` / `fortnightly` / `monthly` / `once`, or `null`. "Not sure yet" and "Several times a week" are only in `details.frequency` and `summary`.
- `property.type` is one of the residential or premises values it always had ("Strata / common areas" is sent as "Other"; the exact answer is in `details.premises_type`).
- `property.premises_size` is Small / Medium / Large or `null` ("Not sure" is in `details.floor_area`).
- `preferred_time` is Morning / Afternoon / Flexible or `null` (commercial "Business hours" and "After hours / overnight" are in `details.preferred_times`).
- `package`, `estimate`, `extra_hours`, `extras.bed_making_beds` and `extras.linen_change_beds` are `null` – as they always were for quote and call-back requests. Only the retired booking request filled them.
- `service` is `null` for "Other residential cleaning" (as for a call-back without a service).
- `customer.email` is always filled in for quote requests (email is required). It can be `null` only for call-back requests, which are phone-based.

`npm run test:all` checks all of this against the real API (`scripts/webhook-check.cjs`, with a local capture server in place of Make.com).

**What can't be verified from the website:** the Make.com scenario and BookingKoala's "Create a Lead" module themselves. When you build them:
- route on `type` = `quote_request` / `callback_request` (`booking_request` is no longer sent);
- if BookingKoala's lead module requires an email, call-back requests (phone-based, `customer.email` may be `null`) need their own route or handling – never a placeholder address;
- map `summary` (or the new fields) into the lead's notes so every detail reaches BookingKoala;
- turn on Make's error handling (store incomplete executions, an error handler on the BookingKoala module, error notifications). Make's webhook answers "Accepted" as soon as it receives a lead, so the website can't see a later BookingKoala failure.

## Make.com scenario (future set-up)

1. **Webhooks → Custom webhook.** Create it, copy its URL, and click "Redetermine data structure".
2. In **Vercel → Project → Settings → Environment Variables**, set `LEAD_WEBHOOK_URL` to that URL. Use Preview first, then Production. Redeploy.
3. On the preview, send one test quote (one per tab) with your own details, so Make learns the structure.
4. Add the **BookingKoala → Create a Lead** module (Make.com's official BookingKoala app). Map the fields:
   - first name, last name, email, phone;
   - address, suburb, postcode, state;
   - service, `cleaning_type.label`, `customer_type` and frequency (`details.frequency.label` has the customer's exact answer);
   - `summary` and `notes` into the lead's notes or comments field.
   - Map only fields the module actually offers; don't invent custom fields.
5. **Optional:** add a router on `type` (`quote_request` / `callback_request`) or `customer_type` (`residential` / `commercial`) to tag leads differently.
6. Turn the scenario on. Check `https://<site>/api/lead-status` shows `"webhook": true`. Submit one test from each form and confirm the leads appear in BookingKoala.
7. Keep `RESEND_API_KEY` set: the email is independent of Make.com, so you still get every enquiry if Make.com or BookingKoala is down.

**Not done here:** no BookingKoala API is called directly from the website, and no credentials are stored. Lead creation happens entirely in Make.com, using its supported BookingKoala integration.

## Resend set-up (email delivery)

1. Create a Resend account (resend.com) and add the domain **sweptcleans.com.au** (Domains → Add domain; pick the region closest to Australia that Resend offers).
2. Resend shows DNS records (an SPF TXT and MX record on a `send` subdomain, and a DKIM TXT record `resend._domainkey`). Add them exactly as shown wherever the domain's DNS is managed, then click Verify and wait for "Verified".
3. In Resend → API Keys, create a key with **Sending access** only, restricted to sweptcleans.com.au. Copy it once; don't save it anywhere else or paste it into chat or email.
4. In Vercel → Project → Settings → Environment Variables, add `RESEND_API_KEY` = that key, for **Production** (and Preview if you want to test there). Optional – defaults are already right:
   - `LEAD_TO_EMAIL` – business inbox (default `hey@sweptcleans.com.au`);
   - `LEAD_FROM_EMAIL` – sender (default `Swept Cleaning <quotes@sweptcleans.com.au>`; must be on the verified domain).
   Do **not** set `LEAD_DEV_LOG` in Vercel.
5. Redeploy, then open `https://sweptcleans.com.au/api/lead-status` – it should show `"email": true`.
6. Send one real test from the quote form with your own name and email: check hey@sweptcleans.com.au receives the enquiry (reply-to = your address) and your address receives the acknowledgement. Check Resend → Emails shows both as delivered, and look in spam folders the first time.

## Testing safely

- Locally: run any small HTTP receiver, start the site with `LEAD_WEBHOOK_URL=http://localhost:<port>`, and submit a form. This is how the payload above was produced and checked.
- The API ignores submissions made in under 2.5 seconds, and any with the hidden honeypot field filled. They appear to succeed but send nothing.
- It's rate-limited to 5 requests per 10 minutes per IP address.
- `npm run test:all` includes two webhook suites (`webhook-a`, `webhook-b`), each on its own fresh server, and `delivery` (`scripts/delivery-check.cjs`): email and webhook success/failure combinations with a **simulated** Resend (a local mock – no real email is sent). Real delivery is only proven by the live test in step 6 above.
