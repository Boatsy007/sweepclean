/*
 * Regular-clean packages shown on /services/regular-house-cleaning (owner-set prices, Nov 2026).
 * Inclusions are built from the regular-clean checklist and its "add to any visit" extras in
 * services.ts, so a package never promises something Swept doesn't offer. Prices are per visit
 * for a typical home on a regular schedule; the written quote confirms before anything is booked.
 */
export type CleanPackage = {
  id: "regular" | "spotless" | "platinum";
  name: string;
  price: number;
  time: string;
  bestFor: string;
  /** Shown as "Everything in <previous>, plus:" for tiers above the first. */
  builds?: string;
  includes: string[];
  recommended?: boolean;
};

export const regularPackages: CleanPackage[] = [
  {
    id: "regular",
    name: "Regular",
    price: 97,
    time: "Typically 1–1.5 hours",
    bestFor: "Smaller or well-kept homes on a weekly or fortnightly clean",
    includes: [
      "Kitchen benchtops, splashback, sink and tapware",
      "Stovetop and appliance exteriors wiped",
      "Shower, basin, vanity and toilet cleaned",
      "Mirrors and chrome polished",
      "Dusting of reachable surfaces",
      "Floors vacuumed and mopped throughout",
      "Bins emptied",
    ],
  },
  {
    id: "spotless",
    name: "Spotless",
    price: 147,
    time: "Typically about 2 hours",
    bestFor: "Most family homes on a fortnightly clean",
    builds: "Regular",
    recommended: true,
    includes: [
      "Shower screens and tiles scrubbed",
      "Microwave cleaned inside and out",
      "Rangehood exterior degreased",
      "Skirting boards and window sills wiped",
      "Light switches and door handles wiped",
      "Beds made (fresh linen if left out)",
      "Laundry tub and benches wiped",
    ],
  },
  {
    id: "platinum",
    name: "Ultimate Platinum",
    price: 247,
    time: "Typically about 3 hours",
    bestFor: "Larger homes, busy households with pets, or a full monthly reset",
    builds: "Spotless",
    includes: [
      "Inside the oven and stove cleaned",
      "Kitchen cabinets wiped",
      "Blinds dusted",
      "Ceiling fans and vents dusted",
      "Inside windows and sliding-door tracks cleaned",
    ],
  },
];

export const packageById = (id: string | null | undefined) => regularPackages.find((p) => p.id === id);

/** One-line summary added to the booking request, e.g. "Package: Spotless – $147 per clean (typically about 2 hours)". */
export const packageNote = (p: CleanPackage) => `Package: ${p.name} – $${p.price} per clean (${p.time.toLowerCase()})`;
