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
  tagline: "House cleaning in Brisbane, Logan and the Gold Coast",
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
  insured: true,
  /** Set to true only if every cleaner holds a current police check. */
  policeChecked: true,

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

  /**
   * The Swept Promise – Swept's service guarantee, shown across the site.
   * This is a commitment to customers: only change it if the way you handle
   * re-cleans changes too. Keep the ACL note – the promise must never read as
   * limiting customers' statutory rights.
   */
  promise: {
    name: "The Swept Promise",
    tagline: "A clean you can count on.",
    body: "If something we've agreed to clean isn't done right, let us know by the end of the next business day. We'll come back and put it right at no extra charge.",
    path: "/swept-promise",
    steps: [
      {
        title: "Every clean follows an agreed checklist",
        body: "Before your first clean we agree exactly what's included, room by room or area by area. That checklist is what we clean – and what we hold ourselves to.",
      },
      {
        title: "Tell us by the end of the next business day",
        body: "If an agreed task was missed or not done properly, contact us by the end of the next business day. Let us know what needs attention – a quick photo helps.",
      },
      {
        title: "We come back and put it right",
        body: "We'll arrange a time to return and re-clean the affected area, at no extra charge.",
      },
      {
        title: "Management reviews anything unresolved",
        body: "If you're still not happy, a member of our management team personally reviews your concern and works through it with you.",
      },
    ],
    acl: "The Swept Promise is in addition to your rights under the Australian Consumer Law and does not limit those rights.",
  },

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

/** Short trust label built from the insured / police-check flags. null = show nothing. */
export function trustLabel(): string | null {
  if (site.insured && site.policeChecked) return "Insured & police-checked";
  if (site.insured) return "Fully insured";
  if (site.policeChecked) return "Police-checked cleaners";
  return null;
}

export function telHref(phone: string): string {
  const digits = phone.replace(/[^\d+]/g, "");
  return `tel:${digits.startsWith("0") ? "+61" + digits.slice(1) : digits}`;
}
