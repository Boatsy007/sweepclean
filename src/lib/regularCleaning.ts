/*
 * Regular (recurring) house cleaning – what's included, the optional extra detail customers can
 * ask for, and the frequency options shown on /services/regular-house-cleaning#prices.
 *
 * Swept no longer publishes package prices: every regular clean is quoted personally, based on
 * the home's size and condition, how often we visit and the customer's requirements. Nothing in
 * this file is a price – don't add any here (it ships to the browser).
 */

/** Included in every regular clean. Matches the regular cleaning checklist in services.ts. */
export const regularIncludes = [
  "Kitchen benchtops and accessible surfaces wiped",
  "Kitchen sink and taps cleaned",
  "Stovetop surface wiped",
  "Bathroom basins cleaned",
  "Toilets cleaned and sanitised",
  "Accessible bathroom surfaces wiped",
  "Routine shower cleaning",
  "Mirrors cleaned and polished",
  "Accessible furniture and surfaces dusted",
  "Floors vacuumed",
  "Hard floors mopped",
  "General household bins emptied",
] as const;

/** Extra detail a customer can ask us to add to their cleaning plan (agreed in the quote). */
export const regularExtraDetail = [
  "More detailed shower screen cleaning",
  "Bathroom tiles and fittings",
  "Microwave interior",
  "Rangehood exterior",
  "Accessible skirting boards",
  "Window sills",
  "Light switches and door handles",
  "Fingerprints and light marks on accessible surfaces",
  "Kitchen and bathroom cabinet fronts",
  "Accessible ceiling fans and air-conditioning vents",
  "Accessible interior window glass",
  "Accessible sliding-door tracks",
  "Accessible blinds",
] as const;

export type RegularFrequency = {
  value: "weekly" | "fortnightly" | "monthly";
  title: string;
  headline: string;
  description: string;
  /** Large display line on the card, e.g. "Every" + "week". */
  every: string;
  emphasis?: boolean;
};

export const regularFrequencies: RegularFrequency[] = [
  {
    value: "weekly",
    title: "Weekly house cleaning",
    headline: "A consistently clean home, every week.",
    description: "Ideal for busy households and families looking for ongoing help maintaining a clean and comfortable home.",
    every: "week",
  },
  {
    value: "fortnightly",
    title: "Fortnightly house cleaning",
    headline: "A fresh home without the weekly commitment.",
    description: "Reliable recurring cleaning every two weeks, tailored to your household's requirements.",
    every: "fortnight",
    emphasis: true,
  },
  {
    value: "monthly",
    title: "Monthly house cleaning",
    headline: "Regular support when you need a little extra help.",
    description: "Professional cleaning assistance once a month for households that generally maintain their own home but appreciate additional support.",
    every: "month",
  },
];

/**
 * Retired package ids (old /book-now?package=… links and stale browser tabs). Names only – used
 * to note which old package a legacy request came from. Never shown to customers.
 */
export const LEGACY_PACKAGE_NAMES: Record<string, string> = { regular: "Regular", spotless: "Spotless", platinum: "Ultimate Platinum" };
