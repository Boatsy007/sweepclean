/** Shared quote-request model + validation (used by the form and the API). */

import { services } from "./services";

export const SERVICE_OPTIONS = services.map((s) => ({ value: s.slug, label: s.label }));

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

export type QuoteRequest = {
  /** quote = free quote; callback = call-back request; booking = regular-package booking request (/book-now). */
  kind: "quote" | "callback" | "booking";
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
  phone: string;
  email?: string;
  contactPref?: string;
  notes?: string;
  consent: boolean;
  source?: string;
  /* Booking requests only */
  package?: string;
  extraHours?: string;
  bedMaking?: string;
  linenChange?: string;
  address?: string;
};

const AU_PHONE = /^(\+?61|0)[2-478](\s?\d){8}$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function normalisePhone(v: string) {
  return v.replace(/[\s()-]/g, "");
}

export type Errors = Partial<Record<keyof QuoteRequest, string>>;

export function validateContact(d: Partial<QuoteRequest>, kind: QuoteRequest["kind"]): Errors {
  const e: Errors = {};
  if (!d.name || d.name.trim().length < 2) e.name = "Please tell us your name.";
  if (!d.phone || !AU_PHONE.test(normalisePhone(d.phone))) e.phone = "Please enter an Australian phone number, e.g. 0412 345 678.";
  if (kind === "quote" && (!d.email || !EMAIL.test(d.email.trim()))) e.email = "Please enter a valid email so we can send your written quote.";
  if (kind === "booking" && (!d.email || !EMAIL.test(d.email.trim()))) e.email = "Please enter a valid email so we can confirm your booking.";
  if (kind === "callback" && d.email && !EMAIL.test(d.email.trim())) e.email = "That email doesn't look right.";
  if (!d.suburb || d.suburb.trim().length < 2) e.suburb = "Please enter your suburb.";
  if (d.postcode && !/^\d{4}$/.test(d.postcode)) e.postcode = "Postcodes have four digits.";
  if (kind === "booking" && !d.postcode) e.postcode = "Please enter your postcode.";
  if (!d.consent) e.consent = "Please confirm we can contact you about this request.";
  return e;
}

const MAX = 2000;
const str = (v: unknown, max = 200) => (typeof v === "string" ? v.trim().slice(0, max) : undefined);

/** Coerce untrusted JSON into a QuoteRequest shape (server side). */
export function sanitise(raw: Record<string, unknown>): QuoteRequest {
  return {
    kind: raw.kind === "callback" ? "callback" : raw.kind === "booking" ? "booking" : "quote",
    service: str(raw.service),
    propertyType: str(raw.propertyType),
    bedrooms: str(raw.bedrooms, 4),
    bathrooms: str(raw.bathrooms, 4),
    size: str(raw.size, 40),
    extras: Array.isArray(raw.extras) ? raw.extras.slice(0, 10).map((x) => String(x).slice(0, 60)) : [],
    pets: str(raw.pets, 10),
    frequency: str(raw.frequency, 20),
    startDate: str(raw.startDate, 10),
    timePref: str(raw.timePref, 20),
    suburb: str(raw.suburb, 80) ?? "",
    postcode: str(raw.postcode, 4),
    name: str(raw.name, 100) ?? "",
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
  };
}

export const BOOKING_BEDROOMS = ["1", "2", "3", "4", "5+"] as const;
export const BOOKING_BATHROOMS = ["1", "2", "3", "4+"] as const;
export const BOOKING_EXTRA_HOURS = ["0", "1", "2", "3"] as const;
export const BOOKING_BEDS = ["0", "1", "2", "3", "4", "5", "6"] as const;

/** Today's date in Queensland (YYYY-MM-DD) – the earliest preferred date we accept. */
export function todayInBrisbane(now = new Date()) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Australia/Brisbane" }).format(now);
}

/** Booking-request checks on top of validateContact (same rules in the browser and on the server). */
export function validateBooking(d: Partial<QuoteRequest>, packageIds: readonly string[]): Errors {
  const e: Errors = {};
  if (!d.package || !packageIds.includes(d.package)) e.package = "Please choose a package.";
  if (!d.bedrooms || !(BOOKING_BEDROOMS as readonly string[]).includes(d.bedrooms)) e.bedrooms = "How many bedrooms?";
  if (!d.bathrooms || !(BOOKING_BATHROOMS as readonly string[]).includes(d.bathrooms)) e.bathrooms = "How many bathrooms?";
  if (!d.frequency || !FREQUENCY_OPTIONS.some((f) => f.value === d.frequency)) e.frequency = "How often would you like us to clean?";
  if (d.extraHours && !(BOOKING_EXTRA_HOURS as readonly string[]).includes(d.extraHours)) e.extraHours = "Choose 0–3 extra hours.";
  if (d.bedMaking && !(BOOKING_BEDS as readonly string[]).includes(d.bedMaking)) e.bedMaking = "Choose 0–6 beds.";
  if (d.linenChange && !(BOOKING_BEDS as readonly string[]).includes(d.linenChange)) e.linenChange = "Choose 0–6 beds.";
  if (!d.startDate || !/^\d{4}-\d{2}-\d{2}$/.test(d.startDate)) e.startDate = "Please choose a preferred date.";
  else if (d.startDate < todayInBrisbane()) e.startDate = "Please choose a date from today onwards.";
  if (!d.address || d.address.trim().length < 4) e.address = "Please enter the street address.";
  return e;
}

export function labelFor(list: readonly { value: string; label: string }[], v?: string) {
  return list.find((o) => o.value === v)?.label ?? v ?? "–";
}
