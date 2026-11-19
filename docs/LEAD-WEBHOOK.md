# Website leads → BookingKoala (via Make.com)

**Status:** the website sends leads. Make.com and BookingKoala are **not yet configured or tested**. Nothing reaches BookingKoala until you set `LEAD_WEBHOOK_URL` and build the scenario below.

## What sends a lead

Every enquiry form posts to `/api/quote`, which:
1. validates the request on the server (prices are recalculated from `src/lib/packages.ts` – never trusted from the browser);
2. emails it to `LEAD_TO_EMAIL` (default hey@sweptcleans.com.au) via **Resend** – kept as the backup channel;
3. if `LEAD_WEBHOOK_URL` is set, POSTs the JSON below to it (e.g. a Make.com custom webhook);
4. emails the customer a copy (booking requests are told the clean isn't booked until you confirm it and no payment is needed).

The request succeeds if **either** channel delivers. If neither is configured in production, the visitor sees "didn't send" and the lead is written to the Vercel function log.

| Form | Where | `type` |
|---|---|---|
| Booking request (regular cleaning packages) | `/book-now?package=regular|spotless|platinum` | `booking_request` |
| Quote (all services) | `/quote`, homepage hero, suburb hero forms | `quote_request` |
| Call-back | `/contact`, `/quote` (call-back mode) | `callback_request` |

## Payload (version 1)

```json
{
  "version": 1,
  "type": "booking_request",
  "submitted_at": "2026-11-19T04:54:26.681Z",
  "customer": { "name": "Jane Citizen", "first_name": "Jane", "last_name": "Citizen", "email": "jane@example.com", "phone": "0412345678", "contact_preference": null },
  "property": { "address": "5 Example Ave", "suburb": "Banora Point", "postcode": "2486", "state": "NSW", "in_service_area": true, "type": null, "bedrooms": "3", "bathrooms": "2", "premises_size": null, "pets": null },
  "service": { "slug": "regular-house-cleaning", "name": "Regular home cleaning" },
  "package": { "id": "platinum", "name": "Ultimate Platinum", "from_price_ex_gst": 207, "starting_size": "3 bedrooms, 2 bathrooms" },
  "frequency": { "value": "weekly", "label": "Weekly" },
  "extra_hours": 0,
  "extras": { "bed_making_beds": 1, "linen_change_beds": 2, "quote_add_ons": [] },
  "preferred_date": "2026-11-24",
  "preferred_time": null,
  "estimate": {
    "currency": "AUD", "per_clean_ex_gst": 232, "gst": 23.2, "per_clean_inc_gst": 255.2,
    "breakdown_ex_gst": { "package_from": 207, "extra_time": 0, "bed_making": 5, "linen_change": 20 },
    "note": "Estimate from published starting prices. Larger homes may need extra time; final price to be confirmed."
  },
  "notes": null,
  "source": "/book-now?package=platinum",
  "summary": { "Type": "Booking request (to confirm)", "Package": "Ultimate Platinum – from $207 + GST per clean (starting price for 3 bedrooms, 2 bathrooms)", "…": "…" }
}
```

- Quote and call-back leads have the same shape with `package`, `estimate`, `extra_hours` and the booking `extras` set to `null`. `service` is the service they chose, and `extras.quote_add_ons` lists the add-ons they ticked.
- `summary` is the same readable list as the notification email. Map it into the lead's notes, so nothing is lost if a field has no BookingKoala equivalent.
- `state` is derived from the postcode (2xxx → NSW, 4xxx → QLD).
- The estimate excludes GST, matching the website. `gst` and `per_clean_inc_gst` are provided for convenience.

## Make.com scenario (to set up)

1. **Webhooks → Custom webhook.** Create it, copy its URL, and click "Redetermine data structure".
2. In **Vercel → Project → Settings → Environment Variables**, set `LEAD_WEBHOOK_URL` to that URL. Use Preview first, then Production. Redeploy.
3. On the preview, send one test booking request with your own details, so Make learns the structure.
4. Add the **BookingKoala → Create a Lead** module (Make.com's official BookingKoala app). Map the fields:
   - first name, last name, email, phone;
   - address, suburb, postcode, state;
   - service, package and frequency;
   - `summary` and `notes` into the lead's notes or comments field.
   - Map only fields the module actually offers; don't invent custom fields.
5. **Optional:** add a router on `type` (`booking_request` / `quote_request` / `callback_request`) to tag leads differently.
6. Turn the scenario on. Check `https://<site>/api/lead-status` shows `"webhook": true`. Submit one test from each form and confirm the leads appear in BookingKoala.
7. Keep `RESEND_API_KEY` set, so you still get the email if Make.com is down.

**Not done here:** no BookingKoala API is called directly from the website, and no credentials are stored. Lead creation happens entirely in Make.com, using its supported BookingKoala integration.

## Testing safely

- Locally: run any small HTTP receiver, start the site with `LEAD_WEBHOOK_URL=http://localhost:<port>`, and submit a form. This is how the payload above was produced and checked.
- The API ignores submissions made in under 2.5 seconds, and any with the hidden honeypot field filled. They appear to succeed but send nothing.
- It's rate-limited to 5 requests per 10 minutes per IP address.
