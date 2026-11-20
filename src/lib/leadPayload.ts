import { postcodeInArea } from "./areas";
import { FREQUENCY_OPTIONS, PREMISES_OPTIONS, PROPERTY_OPTIONS, SERVICE_OPTIONS, SIZE_OPTIONS, TIME_OPTIONS, cleaningTypeBy, frequencyLabel, labelFor, type QuoteRequest } from "./quote";

/**
 * The JSON posted to LEAD_WEBHOOK_URL for every enquiry – designed for a Make.com scenario
 * (Custom webhook → BookingKoala "Create Lead"), but plain JSON any automation tool can read.
 * Field reference: docs/LEAD-WEBHOOK.md.
 *
 * Compatibility rule (version 1): every field that existed before the quote-only change keeps its
 * name, type and the set of values it could already carry for a quote request. Answers that are
 * new (e.g. "Not sure", "Several times a week", "After hours / overnight", "Strata / common areas")
 * go only in the new fields (`customer_type`, `cleaning_type`, `customer.business_name`,
 * `details`) and in `summary`, so an existing mapping never receives a value it hasn't seen.
 */
export type LeadPayload = ReturnType<typeof buildLeadPayload>;

const stateFor = (postcode?: string) => (!postcode ? undefined : postcode.startsWith("2") ? "NSW" : postcode.startsWith("4") ? "QLD" : undefined);
const oneOf = (list: readonly string[], v?: string) => (v && list.includes(v) ? v : null);

export function buildLeadPayload(q: QuoteRequest, summary: Record<string, string | undefined>) {
  const [first, ...rest] = q.name.trim().split(/\s+/);
  const commercial = q.customerType === "commercial";
  const ct = cleaningTypeBy(q.cleaningType);
  const legacyFrequency = FREQUENCY_OPTIONS.find((f) => f.value === q.frequency);
  // Legacy property.type values: residential types, or the premises list (anything else → "Other").
  const propertyType = commercial ? (q.propertyType ? oneOf(PREMISES_OPTIONS, q.propertyType) ?? "Other" : null) : oneOf([...PROPERTY_OPTIONS, ...PREMISES_OPTIONS], q.propertyType);
  return {
    version: 1,
    type: q.kind === "callback" ? "callback_request" : "quote_request",
    submitted_at: new Date().toISOString(),
    /** "residential" | "commercial" (null when unknown, e.g. a call-back without a service). */
    customer_type: q.customerType ?? null,
    /** The customer-facing cleaning type chosen on /quote, e.g. { value: "spring", label: "Spring cleaning" }. */
    cleaning_type: ct ? { value: ct.value, label: ct.label } : null,
    customer: {
      name: q.name,
      first_name: first ?? "",
      last_name: rest.join(" "),
      email: q.email ?? null,
      phone: q.phone,
      contact_preference: q.contactPref ?? null,
      business_name: q.businessName ?? null,
    },
    property: {
      address: q.address ?? null,
      suburb: q.suburb,
      postcode: q.postcode ?? null,
      state: stateFor(q.postcode) ?? null,
      in_service_area: q.postcode ? postcodeInArea(q.postcode) : null,
      type: propertyType,
      bedrooms: q.bedrooms ?? null,
      bathrooms: q.bathrooms ?? null,
      premises_size: oneOf(SIZE_OPTIONS, q.size),
      pets: q.pets ?? null,
    },
    service: q.service ? { slug: q.service, name: labelFor(SERVICE_OPTIONS, q.service) } : null,
    /** Retired (no packages or prices any more) – always null, as it always was for quote requests. */
    package: null,
    frequency: legacyFrequency ? { value: legacyFrequency.value, label: legacyFrequency.label } : null,
    extra_hours: null,
    extras: {
      bed_making_beds: null,
      linen_change_beds: null,
      /** Add-ons ticked on older versions of the quote form. */
      quote_add_ons: q.extras?.length ? q.extras : [],
    },
    preferred_date: q.startDate ?? null,
    preferred_time: oneOf(TIME_OPTIONS, q.timePref),
    /** Retired – Swept prices every quote personally. Always null. */
    estimate: null,
    notes: q.notes ?? null,
    source: q.source ?? null,
    /** Google Ads click ID (gclid/gbraid/wbraid) and UTM tags of the visit – for offline conversion import. */
    attribution: q.attribution ?? null,
    /** The customer's exact answers, including ones the older fields above can't carry. */
    details: {
      frequency: q.frequency ? { value: q.frequency, label: frequencyLabel(q.frequency) } : null,
      premises_type: commercial ? q.propertyType ?? null : null,
      floor_area: commercial ? q.size ?? null : null,
      preferred_times: commercial ? q.timePref ?? null : null,
      legacy_booking: q.legacyBooking ? true : null,
    },
    /** The same human-readable rows as the notification email – handy for a lead's notes field. */
    summary,
  };
}
