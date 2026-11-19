import { postcodeInArea } from "./areas";
import type { CleanPackage, PackageEstimate } from "./packages";
import { FREQUENCY_OPTIONS, SERVICE_OPTIONS, labelFor, type QuoteRequest } from "./quote";

/**
 * The JSON posted to LEAD_WEBHOOK_URL for every enquiry – designed for a Make.com scenario
 * (Custom webhook → BookingKoala "Create Lead"), but plain JSON any automation tool can read.
 * Field reference: docs/LEAD-WEBHOOK.md. Bump `version` if the shape changes.
 */
export type LeadPayload = ReturnType<typeof buildLeadPayload>;

const num = (v?: string) => (v ? parseInt(v, 10) || 0 : 0);
const stateFor = (postcode?: string) => (!postcode ? undefined : postcode.startsWith("2") ? "NSW" : postcode.startsWith("4") ? "QLD" : undefined);

export function buildLeadPayload(q: QuoteRequest, pkg: CleanPackage | undefined, est: PackageEstimate | undefined, summary: Record<string, string | undefined>) {
  const [first, ...rest] = q.name.trim().split(/\s+/);
  const gst = est ? Math.round(est.total * 0.1 * 100) / 100 : undefined;
  return {
    version: 1,
    type: q.kind === "booking" ? "booking_request" : q.kind === "callback" ? "callback_request" : "quote_request",
    submitted_at: new Date().toISOString(),
    customer: {
      name: q.name,
      first_name: first ?? "",
      last_name: rest.join(" "),
      email: q.email ?? null,
      phone: q.phone,
      contact_preference: q.contactPref ?? null,
    },
    property: {
      address: q.address ?? null,
      suburb: q.suburb,
      postcode: q.postcode ?? null,
      state: stateFor(q.postcode) ?? null,
      in_service_area: q.postcode ? postcodeInArea(q.postcode) : null,
      type: q.propertyType ?? null,
      bedrooms: q.bedrooms ?? null,
      bathrooms: q.bathrooms ?? null,
      premises_size: q.size ?? null,
      pets: q.pets ?? null,
    },
    service: q.service ? { slug: q.service, name: labelFor(SERVICE_OPTIONS, q.service) } : null,
    package: pkg ? { id: pkg.id, name: pkg.name, from_price_ex_gst: pkg.from, starting_size: pkg.basis } : null,
    frequency: q.frequency ? { value: q.frequency, label: labelFor(FREQUENCY_OPTIONS, q.frequency) } : null,
    extra_hours: q.kind === "booking" ? num(q.extraHours) : null,
    extras: {
      bed_making_beds: q.kind === "booking" ? num(q.bedMaking) : null,
      linen_change_beds: q.kind === "booking" ? num(q.linenChange) : null,
      /** Add-ons ticked on the quote form (quote requests). */
      quote_add_ons: q.extras?.length ? q.extras : [],
    },
    preferred_date: q.startDate ?? null,
    preferred_time: q.timePref ?? null,
    /** Booking requests only: published prices + chosen extras. The final price is confirmed by Swept. */
    estimate: est
      ? {
          currency: "AUD",
          per_clean_ex_gst: est.total,
          gst,
          per_clean_inc_gst: Math.round((est.total + (gst ?? 0)) * 100) / 100,
          breakdown_ex_gst: { package_from: est.from, extra_time: est.extraHours, bed_making: est.bedMaking, linen_change: est.linenChange },
          note: "Estimate from published starting prices. Larger homes may need extra time; final price to be confirmed.",
        }
      : null,
    notes: q.notes ?? null,
    source: q.source ?? null,
    /** Google Ads click ID (gclid/gbraid/wbraid) and UTM tags of the visit – for offline conversion import. */
    attribution: q.attribution ?? null,
    /** The same human-readable rows as the notification email – handy for a lead's notes field. */
    summary,
  };
}
