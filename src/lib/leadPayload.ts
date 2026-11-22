import { postcodeInArea } from "./areas";
import { FREQUENCY_OPTIONS, PREMISES_OPTIONS, PROPERTY_OPTIONS, SERVICE_OPTIONS, SIZE_OPTIONS, TIME_OPTIONS, cleaningTypeOf, frequencyLabel, labelFor, type QuoteRequest } from "./quote";

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
  const [splitFirst, ...rest] = q.name.trim().split(/\s+/);
  // The six-field form sends first and last name separately – used exactly as entered.
  const first = q.firstName ?? splitFirst;
  const last = q.lastName ?? rest.join(" ");
  const commercial = q.customerType === "commercial";
  const ct = cleaningTypeOf(q);
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
      last_name: last,
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
    /** Random ID of this enquiry (six-field form; null otherwise). A repeat of the same ID is the same enquiry – use it to de-duplicate. */
    enquiry_id: q.enquiryId ?? null,
    /** homepage_hero | quote_page | suburb_hero (the quote form); null for the call-back form and older forms. */
    form_location: q.formLocation ?? null,
    /** The page the enquiry was sent from (path and query), when the form sends it. */
    page_url: q.pageUrl ?? null,
    /** Ready-made text for the BookingKoala lead's notes: cleaning type, suburb and where it came from. */
    lead_notes: leadNotes(q, ct?.label),
  };
}

/** Plain-text notes for the CRM lead, so the cleaning type and suburb are never lost in mapping. */
function leadNotes(q: QuoteRequest, cleaningType?: string) {
  const lines = [
    `Cleaning type: ${cleaningType ?? (q.service ? labelFor(SERVICE_OPTIONS, q.service) : "Not given")}`,
    `Suburb: ${[q.suburb, q.postcode].filter(Boolean).join(" ")}`,
    q.frequency ? `Frequency (chosen on the website): ${frequencyLabel(q.frequency)}` : undefined,
    q.notes ? `Notes: ${q.notes}` : undefined,
    `Website enquiry${q.formLocation === "homepage_hero" ? " – homepage form" : q.formLocation === "quote_page" ? " – quote page" : q.formLocation === "suburb_hero" ? ` – suburb page${q.pageUrl ? ` ${q.pageUrl.split("?")[0]}` : ""}` : ""}${q.enquiryId ? ` (ID ${q.enquiryId})` : ""}`,
  ];
  return lines.filter(Boolean).join("\n");
}
