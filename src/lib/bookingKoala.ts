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
