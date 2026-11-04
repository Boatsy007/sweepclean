/**
 * Swept – business facts.
 *
 * Every public claim the site makes about the business lives here so it can be
 * checked in one place. Anything set to `null` is simply not rendered – the site
 * never shows a placeholder phone number, ABN, rating or guarantee.
 *
 * Before launch, review docs/LAUNCH-CHECKLIST.md.
 */

export const site = {
  name: "Swept",
  legalName: null as string | null, // e.g. "Swept Cleaning Pty Ltd"
  tagline: "Home cleaning, Brisbane to Tweed Heads",
  description:
    "Regular, deep, bond, Airbnb, carpet and commercial cleaning across Brisbane, Logan, the Gold Coast and Tweed Heads. Get a written quote online in about two minutes.",

  /** Contact details. Leave null until real – the UI hides anything that is null. */
  phone: "0490 216 363" as string | null, // display format
  email: null as string | null, // e.g. "hello@swept.com.au"
  abn: null as string | null,

  /** Hours you answer enquiries (shown on contact surfaces + schema). */
  responseHours: "Monday to Saturday, 7am–6pm (AEST)",
  /** Same hours in machine-readable form for structured data. */
  openingHours: { days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], opens: "07:00", closes: "18:00" },
  /**
   * Official profiles, e.g. Google Business Profile, Facebook, Instagram, LinkedIn.
   * Add each one as it goes live – these feed `sameAs` in structured data, which
   * helps Google and AI assistants connect the profiles to this site.
   */
  profiles: [] as string[],
  /** Date the site content was last meaningfully updated (used for sitemap lastmod). */
  contentUpdated: "2026-11-04",
  /** How quickly you reply to a quote request. Only promise what you can keep. */
  quoteResponse: "within one business day",

  /** Set to true only once a current public liability policy is in place. */
  insured: false,
  /** Set to true only if every cleaner holds a current police check. */
  policeChecked: false,

  /**
   * Operating commitments shown on the site. These are promises, not marketing:
   * remove any you won't honour every single time.
   */
  commitments: [
    {
      title: "A written quote before anything is booked",
      body: "You'll know the price, what's included and how long we expect to take before you say yes.",
    },
    {
      title: "No lock-in contracts",
      body: "Regular cleans run visit to visit. Pause, change frequency or stop whenever you need to.",
    },
    {
      title: "The same checklist, every visit",
      body: "Every clean follows a written room-by-room checklist, so you know exactly what to expect.",
    },
    {
      title: "Tell us what matters most",
      body: "Note your priorities once – the oven, the pet hair, the shower screen – and we keep them on your file.",
    },
  ],

  /** Optional incentive for recurring bookings, e.g. "10% off every regular clean". null = hidden. */
  recurringOffer: null as string | null,
} as const;

export function siteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel}`;
  return "http://localhost:3000";
}

export function telHref(phone: string): string {
  const digits = phone.replace(/[^\d+]/g, "");
  return `tel:${digits.startsWith("0") ? "+61" + digits.slice(1) : digits}`;
}
