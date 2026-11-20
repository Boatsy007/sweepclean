# Website leads → BookingKoala (via Make.com)

**Status:** the website sends leads. Make.com and BookingKoala are **not yet configured or tested**. Nothing reaches BookingKoala until you set `LEAD_WEBHOOK_URL` and build the scenario below.

## What sends a lead

Every enquiry form posts to `/api/quote`, which:
1. validates the request on the server (spam honeypot, 2.5-second timing trap, rate limit of 5 requests per 10 minutes per IP);
2. emails it to `LEAD_TO_EMAIL` (default hey@sweptcleans.com.au) via **Resend** – kept as the backup channel;
3. if `LEAD_WEBHOOK_URL` is set, POSTs the JSON below to it (e.g. a Make.com custom webhook);
4. emails the customer a copy, if they gave an email address (email is optional on the quote form).

The request succeeds if **either** channel delivers. If neither is configured in production, the visitor sees "didn't send" and the lead is written to the Vercel function log.

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
  "customer": { "name": "Sam Citizen", "first_name": "Sam", "last_name": "Citizen", "email": null, "phone": "0412345678", "contact_preference": null, "business_name": "Example Body Corporate" },
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
- `service` is `null` for "Other residential cleaning" (as for a call-back without a service). `customer.email` is `null` when the customer leaves it blank (as for call-backs).

`npm run test:all` checks all of this against the real API (`scripts/webhook-check.cjs`, with a local capture server in place of Make.com).

**What can't be verified from the website:** the Make.com scenario and BookingKoala's "Create a Lead" module themselves. Things to check in Make.com before relying on new leads:
- if a router or filter only lets `booking_request` through, quotes now arrive as `quote_request`;
- if BookingKoala's lead module **requires** an email, a quote without an email may fail at that step – you still receive the Resend email, so the lead isn't lost, but add a fallback (e.g. skip the email field when empty);
- to see the new details in BookingKoala, map `summary` (or the new fields) into the lead's notes.

## Make.com scenario (to set up)

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
7. Keep `RESEND_API_KEY` set, so you still get the email if Make.com is down.

**Not done here:** no BookingKoala API is called directly from the website, and no credentials are stored. Lead creation happens entirely in Make.com, using its supported BookingKoala integration.

## Testing safely

- Locally: run any small HTTP receiver, start the site with `LEAD_WEBHOOK_URL=http://localhost:<port>`, and submit a form. This is how the payload above was produced and checked.
- The API ignores submissions made in under 2.5 seconds, and any with the hidden honeypot field filled. They appear to succeed but send nothing.
- It's rate-limited to 5 requests per 10 minutes per IP address.
- `npm run test:all` includes two webhook suites (`webhook-a`, `webhook-b`), each on its own fresh server.
