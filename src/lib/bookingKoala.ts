/**
 * BookingKoala – Swept's customer management, scheduling, recurring bookings, payments and
 * customer accounts.
 *
 * On the website, BookingKoala is embedded in two places: the customer login on /login (official
 * iframe + embed.js) and the lead enquiry form on /quote (official iframe + iframeResizer.min.js –
 * see docs/BOOKINGKOALA-LEAD-FORM.md). No API, no credentials. The site's own forms (quick quote,
 * call-back, and the native /quote form) reach BookingKoala as leads via LEAD_WEBHOOK_URL
 * (e.g. Make.com) – see docs/LEAD-WEBHOOK.md.
 */

export const BOOKINGKOALA_ORIGIN = "https://sweptresidentialandcommercialcleaning.bookingkoala.com";
export const BOOKINGKOALA_EMBED_SCRIPT = `${BOOKINGKOALA_ORIGIN}/resources/embed.js`;
/** Lead enquiry form (embed code supplied by Swept) and BookingKoala's iframe resizer, used on /quote. */
export const BOOKINGKOALA_LEAD_FORM_URL = `${BOOKINGKOALA_ORIGIN}/leads/form/8a30eb91-5b26-4ddf-ac12-29ff53bba421?embed=true`;
export const BOOKINGKOALA_RESIZER_SCRIPT = `${BOOKINGKOALA_ORIGIN}/resources/iframeResizer.min.js`;
/** Which form /quote shows (build-time): "bookingkoala" (default) or "native" (the site's own form). */
export const quoteFormMode = (): "bookingkoala" | "native" => (process.env.NEXT_PUBLIC_QUOTE_FORM === "native" ? "native" : "bookingkoala");

export type BookingKoalaForm = "login";

export const bookingKoalaForms: Record<BookingKoalaForm, { path: string; height: number; title: string; fallback: string }> = {
  // BookingKoala's official default height; embed.js is expected to resize the iframe to its content.
  login: { path: "/login", height: 650, title: "Swept customer login (secure, by BookingKoala)", fallback: "Open customer login in a new tab" },
};

/** The URL that goes in the iframe (official `?embed=true` form). */
export const bookingKoalaEmbedUrl = (form: BookingKoalaForm) => `${BOOKINGKOALA_ORIGIN}${bookingKoalaForms[form].path}?embed=true`;
/** The same form as a full page on BookingKoala – the fallback if the embed can't load. */
export const bookingKoalaDirectUrl = (form: BookingKoalaForm) => `${BOOKINGKOALA_ORIGIN}${bookingKoalaForms[form].path}`;

/** Retired booking request page – now a redirect to /quote (next.config.ts). */
export const BOOK_PATH = "/book-now";
export const LOGIN_PATH = "/login";

/* ---------------------------------------------------------------------------------------------
 * Which pathway each service uses. Small and dependency-free so client components can import it.
 *
 * Every service is quoted personally: "Get a free quote" → /quote?service=… (the central quote
 * form, with the service preselected). Nothing is booked or priced online, so no service is
 * bookable. The "book" intent is kept only for type compatibility.
 * ------------------------------------------------------------------------------------------- */
export const BOOKABLE_SERVICES: readonly string[] = [];
export const COMMERCIAL_SERVICE = "commercial-cleaning";
export const QUOTE_PATH = "/quote";

export const isBookable = (service?: string | null) => !!service && BOOKABLE_SERVICES.includes(service);

export function quoteHref(service?: string | null, extra: Record<string, string> = {}) {
  const q = new URLSearchParams({ ...(service ? { service } : {}), ...extra });
  const s = q.toString();
  return s ? `${QUOTE_PATH}?${s}` : QUOTE_PATH;
}

export type CtaIntent = "book" | "quote";

/** Primary pathway for a page about `service` (no service = the general quote form). */
export function primaryCta(service?: string | null): { intent: CtaIntent; href: string } {
  return { intent: "quote", href: quoteHref(service) };
}
