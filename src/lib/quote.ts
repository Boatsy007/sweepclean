/** Shared quote-request model + validation (used by the forms and the API). */

import { services } from "./services";

export const SERVICE_OPTIONS = services.map((s) => ({ value: s.slug, label: s.label }));

/** Frequencies the hero form offers – and the only values the webhook's `frequency` field carries. */
export const FREQUENCY_OPTIONS = [
  { value: "weekly", label: "Weekly" },
  { value: "fortnightly", label: "Fortnightly" },
  { value: "monthly", label: "Monthly" },
  { value: "once", label: "Just once for now" },
] as const;

export const PROPERTY_OPTIONS = ["House", "Townhouse", "Apartment / unit"] as const;
export const PREMISES_OPTIONS = ["Office", "Shop / retail", "Medical / consulting", "Other"] as const;
export const SIZE_OPTIONS = ["Small (under 150m²)", "Medium (150–400m²)", "Large (400m²+)"] as const;
import { EXTRA_TASKS } from "./tasks";

export const EXTRA_OPTIONS = EXTRA_TASKS;
export const TIME_OPTIONS = ["Morning", "Afternoon", "Flexible"] as const;

/* ---------------------------------------------------------------------------------------------
 * The central quote form (/quote): Residential and Commercial tabs.
 * Each customer-facing cleaning type maps to one of the existing services (no new services or
 * pages). "Other" residential has no service. Window cleaning and commercial carpet/window
 * cleaning are not offered until the owner confirms them.
 * ------------------------------------------------------------------------------------------- */
export type CustomerType = "residential" | "commercial";
export const CUSTOMER_TYPES: readonly CustomerType[] = ["residential", "commercial"];

export type CleaningType = {
  value: string;
  label: string;
  customer: CustomerType;
  /** Underlying service (services.ts slug). */
  service?: string;
  /** Ask how often (recurring cleans). Otherwise the frequency is fixed to `fixedFrequency`. */
  recurring: boolean;
  fixedFrequency?: "once";
  /** Ask bedrooms and bathrooms (not for carpet cleaning). */
  rooms?: boolean;
};

export const CLEANING_TYPES: readonly CleaningType[] = [
  { value: "regular", label: "Regular house cleaning", customer: "residential", service: "regular-house-cleaning", recurring: true, rooms: true },
  { value: "deep", label: "Deep cleaning", customer: "residential", service: "deep-cleaning", recurring: false, fixedFrequency: "once", rooms: true },
  { value: "spring", label: "Spring cleaning", customer: "residential", service: "deep-cleaning", recurring: false, fixedFrequency: "once", rooms: true },
  { value: "bond", label: "Bond / end-of-lease cleaning", customer: "residential", service: "bond-cleaning", recurring: false, fixedFrequency: "once", rooms: true },
  { value: "one_off", label: "One-off cleaning", customer: "residential", service: "deep-cleaning", recurring: false, fixedFrequency: "once", rooms: true },
  { value: "ndis", label: "NDIS cleaning", customer: "residential", service: "ndis-cleaning", recurring: true, rooms: true },
  { value: "home_care", label: "Home care cleaning", customer: "residential", service: "ndis-cleaning", recurring: true, rooms: true },
  { value: "airbnb", label: "Airbnb / holiday rental cleaning", customer: "residential", service: "airbnb-cleaning", recurring: false, rooms: true },
  { value: "carpet", label: "Carpet cleaning", customer: "residential", service: "carpet-cleaning", recurring: false, fixedFrequency: "once", rooms: false },
  { value: "other", label: "Other residential cleaning", customer: "residential", recurring: true, rooms: true },
  { value: "office", label: "Office cleaning", customer: "commercial", service: "commercial-cleaning", recurring: true },
  { value: "retail", label: "Retail / shop cleaning", customer: "commercial", service: "commercial-cleaning", recurring: true },
  { value: "commercial", label: "Commercial cleaning", customer: "commercial", service: "commercial-cleaning", recurring: true },
  { value: "strata", label: "Strata / common area cleaning", customer: "commercial", service: "commercial-cleaning", recurring: true },
  { value: "other_commercial", label: "Other commercial cleaning", customer: "commercial", service: "commercial-cleaning", recurring: true },
];

export const cleaningTypeBy = (v?: string | null) => CLEANING_TYPES.find((t) => t.value === v);

/* ---------------------------------------------------------------------------------------------
 * The six-field quote form (homepage hero and /quote): first name, last name, cleaning type,
 * suburb, phone, email. It captures a lead – Swept phones the customer and books in BookingKoala.
 * Each option maps to an existing service (no new services or pages). Carpet cleaning, spring
 * cleaning and the commercial sub-types aren't listed here – "Other / Not Sure" covers them.
 * ------------------------------------------------------------------------------------------- */
export type LeadCleaningType = { value: string; label: string; service?: string; customer?: CustomerType };
export const LEAD_CLEANING_TYPES: readonly LeadCleaningType[] = [
  { value: "regular", label: "Regular House Cleaning", service: "regular-house-cleaning", customer: "residential" },
  { value: "one_off", label: "One-Off House Cleaning", service: "deep-cleaning", customer: "residential" },
  { value: "deep", label: "Deep Cleaning", service: "deep-cleaning", customer: "residential" },
  { value: "bond", label: "Bond / End of Lease Cleaning", service: "bond-cleaning", customer: "residential" },
  { value: "airbnb", label: "Airbnb / Holiday Rental Cleaning", service: "airbnb-cleaning", customer: "residential" },
  { value: "commercial", label: "Commercial / Office Cleaning", service: "commercial-cleaning", customer: "commercial" },
  { value: "ndis_home_care", label: "NDIS / Home Care Cleaning", service: "ndis-cleaning", customer: "residential" },
  { value: "not_sure", label: "Other / Not Sure" },
];
export const leadCleaningTypeBy = (v?: string | null) => LEAD_CLEANING_TYPES.find((t) => t.value === v);

/** The option a page's quote link preselects (/quote?service=…, ?type=commercial). */
export const DEFAULT_LEAD_CLEANING_TYPE: Record<string, string> = {
  "regular-house-cleaning": "regular",
  "deep-cleaning": "deep",
  "bond-cleaning": "bond",
  "airbnb-cleaning": "airbnb",
  "commercial-cleaning": "commercial",
  "ndis-cleaning": "ndis_home_care",
  "carpet-cleaning": "not_sure",
};

/** Where the quote form sits (sent as `form_location`; also marks a request as coming from it). */
export const LEAD_FORM_LOCATIONS = ["homepage_hero", "quote_page", "suburb_hero"] as const;
export type LeadFormLocation = (typeof LEAD_FORM_LOCATIONS)[number];
export const isLeadForm = (q: Pick<QuoteRequest, "formLocation">) => LEAD_FORM_LOCATIONS.some((l) => l === q.formLocation);

/** The cleaning type of any request: the six-field form's list or the earlier /quote form's list. */
export function cleaningTypeOf(q: Pick<QuoteRequest, "formLocation" | "cleaningType">): { value: string; label: string } | undefined {
  return isLeadForm(q) ? leadCleaningTypeBy(q.cleaningType) : cleaningTypeBy(q.cleaningType);
}
export const cleaningTypesFor = (c: CustomerType) => CLEANING_TYPES.filter((t) => t.customer === c);

/** The cleaning type a service page's quote link preselects (?service=…). */
export const DEFAULT_CLEANING_TYPE: Record<string, string> = {
  "regular-house-cleaning": "regular",
  "deep-cleaning": "deep",
  "ndis-cleaning": "ndis",
  "bond-cleaning": "bond",
  "airbnb-cleaning": "airbnb",
  "carpet-cleaning": "carpet",
  "commercial-cleaning": "commercial",
};

export const RESIDENTIAL_FREQUENCIES = [
  { value: "weekly", label: "Weekly" },
  { value: "fortnightly", label: "Fortnightly" },
  { value: "monthly", label: "Monthly" },
  { value: "once", label: "One-off" },
  { value: "not_sure", label: "Not sure yet" },
] as const;

export const COMMERCIAL_FREQUENCIES = [
  { value: "several_weekly", label: "Several times a week" },
  { value: "weekly", label: "Weekly" },
  { value: "fortnightly", label: "Fortnightly" },
  { value: "monthly", label: "Monthly" },
  { value: "once", label: "One-off" },
  { value: "not_sure", label: "Not sure yet" },
] as const;

/** Every frequency value any form can send (for labels). */
export const ALL_FREQUENCIES: readonly { value: string; label: string }[] = [...FREQUENCY_OPTIONS, ...COMMERCIAL_FREQUENCIES.filter((f) => !FREQUENCY_OPTIONS.some((o) => o.value === f.value))];
/** The customer's own wording for a frequency (summary rows). */
export const frequencyLabel = (v?: string) => (v === "once" ? "One-off" : labelFor(ALL_FREQUENCIES, v));

export const COMMERCIAL_PROPERTY_OPTIONS = ["Office", "Shop / retail", "Medical / consulting", "Strata / common areas", "Other"] as const;
export const FLOOR_AREA_OPTIONS = [...SIZE_OPTIONS, "Not sure"] as const;
export const COMMERCIAL_TIME_OPTIONS = ["Business hours", "After hours / overnight", "Flexible"] as const;
export const BEDROOM_OPTIONS = ["1", "2", "3", "4", "5+"] as const;
export const BATHROOM_OPTIONS = ["1", "2", "3", "4+"] as const;

/** Split "Robina 4226" / "4226" / "Robina" into suburb text and a postcode. */
export function splitSuburbPostcode(v?: string): { suburb: string; postcode?: string } {
  const text = (v ?? "").trim();
  const m = text.match(/\b(\d{4})\b/);
  if (!m) return { suburb: text };
  const rest = text.replace(m[0], "").replace(/[\s,]+$/, "").replace(/^[\s,]+/, "").trim();
  return { suburb: rest || text, postcode: m[1] };
}

export type QuoteRequest = {
  /** quote = free quote (all quote forms); callback = call-back request. */
  kind: "quote" | "callback";
  /** Residential or commercial (the /quote tabs). Worked out from the service when a form doesn't send it. */
  customerType?: CustomerType;
  /** Customer-facing cleaning type from the /quote form (CLEANING_TYPES value). */
  cleaningType?: string;
  /** Commercial quotes: the business name (optional). */
  businessName?: string;
  service?: string;
  propertyType?: string;
  bedrooms?: string;
  bathrooms?: string;
  size?: string;
  extras?: string[];
  pets?: string;
  frequency?: string;
  startDate?: string;
  timePref?: string;
  suburb: string;
  postcode?: string;
  name: string;
  /** Six-field form: first and last name as entered (`name` is both joined). */
  firstName?: string;
  lastName?: string;
  phone: string;
  email?: string;
  contactPref?: string;
  notes?: string;
  consent: boolean;
  source?: string;
  /* Legacy booking requests only (stale /book-now tabs). Accepted as quotes – never priced. */
  legacyBooking?: boolean;
  package?: string;
  extraHours?: string;
  bedMaking?: string;
  linenChange?: string;
  address?: string;
  /** Six-field form: a random ID per enquiry (repeat sends of the same enquiry are delivered once). */
  enquiryId?: string;
  /** Six-field form: homepage_hero | quote_page. */
  formLocation?: string;
  /** The page the form was sent from (path and query). */
  pageUrl?: string;
  /** Ad click ID / UTM tags of the visit (no personal data) – lets a confirmed booking be matched to its ad. */
  attribution?: Record<string, string>;
};

const AU_PHONE = /^(\+?61|0)[2-478](\s?\d){8}$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function normalisePhone(v: string) {
  return v.replace(/[\s()-]/g, "");
}

export type Errors = Partial<Record<keyof QuoteRequest, string>>;

/**
 * Contact checks shared by the browser and the server. Name and phone are always required (Swept
 * phones every enquiry). Email is required on every quote form (residential, commercial and the
 * quick quote form); the call-back form is phone-based, so its email is optional.
 */
export function validateContact(d: Partial<QuoteRequest>, kind: QuoteRequest["kind"], requireEmail = kind === "quote"): Errors {
  const e: Errors = {};
  if (!d.name || d.name.trim().length < 2) e.name = "Please tell us your name.";
  if (!d.phone || !AU_PHONE.test(normalisePhone(d.phone))) e.phone = "Please enter an Australian phone number, e.g. 0412 345 678.";
  if (requireEmail && (!d.email || !EMAIL.test(d.email.trim()))) e.email = "Please enter a valid email so we can send your written quote.";
  else if (d.email && !EMAIL.test(d.email.trim())) e.email = "That email doesn't look right.";
  if (!d.suburb || d.suburb.trim().length < 2) e.suburb = "Please enter your suburb.";
  if (d.postcode && !/^\d{4}$/.test(d.postcode)) e.postcode = "Postcodes have four digits.";
  if (!d.consent) e.consent = "Please confirm we can contact you about this request.";
  return e;
}

/**
 * The six-field form's checks, shared by the browser and the server: first name, last name,
 * cleaning type, suburb, Australian phone and email are all required (plus the contact consent).
 */
export function validateLead(d: Partial<QuoteRequest>): Errors {
  const e: Errors = {};
  if (!d.firstName?.trim()) e.firstName = "Please enter your first name.";
  if (!d.lastName?.trim()) e.lastName = "Please enter your last name.";
  if (!leadCleaningTypeBy(d.cleaningType)) e.cleaningType = "Please choose the type of cleaning you need.";
  if (!d.suburb || d.suburb.trim().length < 2) e.suburb = "Please enter the property's suburb.";
  if (!d.phone || !AU_PHONE.test(normalisePhone(d.phone))) e.phone = "Please enter an Australian mobile or landline, e.g. 0412 345 678.";
  if (!d.email || !EMAIL.test(d.email.trim())) e.email = "Please enter a valid email address.";
  if (!d.consent) e.consent = "Please confirm we can contact you about this request.";
  return e;
}

const MAX = 2000;
const str = (v: unknown, max = 200) => (typeof v === "string" ? v.trim().slice(0, max) : undefined);

/** Coerce untrusted JSON into a QuoteRequest shape (server side). */
export function sanitise(raw: Record<string, unknown>): QuoteRequest {
  return {
    kind: raw.kind === "callback" ? "callback" : "quote",
    legacyBooking: raw.kind === "booking" || undefined,
    customerType: CUSTOMER_TYPES.find((c) => c === raw.customerType),
    cleaningType: str(raw.cleaningType, 30),
    businessName: str(raw.businessName, 120),
    service: str(raw.service),
    propertyType: str(raw.propertyType),
    bedrooms: str(raw.bedrooms, 4),
    bathrooms: str(raw.bathrooms, 4),
    size: str(raw.size, 40),
    extras: Array.isArray(raw.extras) ? raw.extras.slice(0, 10).map((x) => String(x).slice(0, 60)) : [],
    pets: str(raw.pets, 10),
    frequency: str(raw.frequency, 20),
    startDate: str(raw.startDate, 10),
    timePref: str(raw.timePref, 40),
    suburb: str(raw.suburb, 80) ?? "",
    postcode: str(raw.postcode, 4),
    name: str(raw.name, 100) ?? "",
    firstName: str(raw.firstName, 60),
    lastName: str(raw.lastName, 60),
    phone: str(raw.phone, 20) ?? "",
    email: str(raw.email, 200),
    contactPref: str(raw.contactPref, 20),
    notes: str(raw.notes, MAX),
    consent: raw.consent === true,
    source: str(raw.source, 200),
    package: str(raw.package, 20),
    extraHours: str(raw.extraHours, 2),
    bedMaking: str(raw.bedMaking, 2),
    linenChange: str(raw.linenChange, 2),
    address: str(raw.address, 160),
    enquiryId: typeof raw.enquiryId === "string" && /^[A-Za-z0-9-]{8,64}$/.test(raw.enquiryId) ? raw.enquiryId : undefined,
    formLocation: LEAD_FORM_LOCATIONS.find((l) => l === raw.formLocation),
    pageUrl: str(raw.pageUrl, 300),
    attribution: attributionFrom(raw.attribution),
  };
}

const ATTRIBUTION_KEYS = ["gclid", "gbraid", "wbraid", "utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "landing_page"];
function attributionFrom(v: unknown): Record<string, string> | undefined {
  if (!v || typeof v !== "object") return undefined;
  const out: Record<string, string> = {};
  for (const k of ATTRIBUTION_KEYS) {
    const x = (v as Record<string, unknown>)[k];
    if (typeof x === "string" && x.trim()) out[k] = x.trim().slice(0, 200);
  }
  return Object.keys(out).length ? out : undefined;
}

export function labelFor(list: readonly { value: string; label: string }[], v?: string) {
  return list.find((o) => o.value === v)?.label ?? v ?? "–";
}
