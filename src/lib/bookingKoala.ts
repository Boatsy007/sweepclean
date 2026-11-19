/**
 * BookingKoala – Swept's booking, customer account and payment platform.
 *
 * The official embeds (Settings → Design Forms & Website → Embed Forms in BookingKoala) are an
 * iframe per form plus BookingKoala's embed.js. Everything here comes from those official codes:
 * no API, no credentials. BookingKoala handles booking, login and payment inside its own iframe.
 */

export const BOOKINGKOALA_ORIGIN = "https://sweptresidentialandcommercialcleaning.bookingkoala.com";
export const BOOKINGKOALA_EMBED_SCRIPT = `${BOOKINGKOALA_ORIGIN}/resources/embed.js`;

export type BookingKoalaForm = "booking" | "login" | "contact";

export const bookingKoalaForms: Record<BookingKoalaForm, { path: string; height: number; title: string; fallback: string }> = {
  // Heights are BookingKoala's official defaults. embed.js is expected to resize the iframe to its
  // content; the wrapper reserves this space so nothing shifts while the form loads.
  booking: { path: "/booknow", height: 1000, title: "Swept online booking form (secure, by BookingKoala)", fallback: "Open the booking form in a new tab" },
  login: { path: "/login", height: 650, title: "Swept customer login (secure, by BookingKoala)", fallback: "Open customer login in a new tab" },
  contact: { path: "/contact-us", height: 1000, title: "Swept contact form (by BookingKoala)", fallback: "Open the contact form in a new tab" },
};

/** The URL that goes in the iframe (official `?embed=true` form). */
export const bookingKoalaEmbedUrl = (form: BookingKoalaForm) => `${BOOKINGKOALA_ORIGIN}${bookingKoalaForms[form].path}?embed=true`;
/** The same form as a full page on BookingKoala – the fallback if the embed can't load. */
export const bookingKoalaDirectUrl = (form: BookingKoalaForm) => `${BOOKINGKOALA_ORIGIN}${bookingKoalaForms[form].path}`;

/** Our own pages that host the embeds. */
export const BOOK_PATH = "/book-now";
export const LOGIN_PATH = "/login";

/* ---------------------------------------------------------------------------------------------
 * Which pathway each service uses. Small and dependency-free so client components can import it.
 *
 * "book"  → /book-now (BookingKoala). Only for services set up in BookingKoala with standard pricing.
 * "quote" → /quote?service=… (custom form, Resend). Services whose scope varies (bond, commercial…).
 *
 * To make another residential service bookable once it's configured in BookingKoala, add its slug here.
 * ------------------------------------------------------------------------------------------- */
export const BOOKABLE_SERVICES: readonly string[] = ["regular-house-cleaning"];
export const COMMERCIAL_SERVICE = "commercial-cleaning";
export const QUOTE_PATH = "/quote";

export const isBookable = (service?: string | null) => !!service && BOOKABLE_SERVICES.includes(service);

/** Website packages (src/lib/packages.ts ids) and frequencies a booking link may carry, so /book-now can say which to pick. */
export const BOOK_HINT_PACKAGES = { regular: "Regular", spotless: "Spotless", platinum: "Ultimate Platinum" } as const;
export const BOOK_HINT_FREQUENCIES = { weekly: "Weekly", fortnightly: "Fortnightly", monthly: "Monthly" } as const;

export function bookHref(hint: { package?: keyof typeof BOOK_HINT_PACKAGES; frequency?: keyof typeof BOOK_HINT_FREQUENCIES } = {}) {
  const q = new URLSearchParams();
  if (hint.package) q.set("package", hint.package);
  if (hint.frequency) q.set("frequency", hint.frequency);
  const s = q.toString();
  return s ? `${BOOK_PATH}?${s}` : BOOK_PATH;
}

export function quoteHref(service?: string | null, extra: Record<string, string> = {}) {
  const q = new URLSearchParams({ ...(service ? { service } : {}), ...extra });
  const s = q.toString();
  return s ? `${QUOTE_PATH}?${s}` : QUOTE_PATH;
}

export type CtaIntent = "book" | "quote";

/** Primary pathway for a page about `service` (no service = general residential page → book). */
export function primaryCta(service?: string | null): { intent: CtaIntent; href: string } {
  if (!service || isBookable(service)) return { intent: "book", href: BOOK_PATH };
  return { intent: "quote", href: quoteHref(service) };
}
