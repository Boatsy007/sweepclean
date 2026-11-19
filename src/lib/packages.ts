/*
 * Recurring residential cleaning packages (owner-set prices, Nov 2026). Do not change prices
 * without the owner's approval.
 *
 * The package sets the LEVEL of cleaning; the home's size and any extras set the final fixed
 * price, confirmed before the clean. Starting prices apply to the stated property size in a
 * reasonably maintained home. Packages are not hourly services – extra time is an optional,
 * pre-agreed add-on. Inclusions must stay realistic at the starting price (contractors are paid
 * an hourly rate and supply their own equipment and products).
 */
export type CleanPackage = {
  id: "regular" | "spotless" | "platinum";
  name: string;
  headline: string;
  description: string;
  /** Starting price, AUD excluding GST. */
  from: number;
  /** Property size the starting price is based on. */
  basis: string;
  /** The same size as numbers – a larger home may need extra time (never priced automatically). */
  beds: number;
  baths: number;
  /** Shown as "Everything in <previous>, plus:" for tiers above the first. */
  builds?: string;
  includes: string[];
  recommended?: boolean;
};

export const regularPackages: CleanPackage[] = [
  {
    id: "regular",
    name: "Regular",
    headline: "The essentials, beautifully done.",
    description: "Reliable, professional home cleaning that keeps your home fresh, tidy and comfortable.",
    from: 97,
    basis: "1 bedroom, 1 bathroom",
    beds: 1,
    baths: 1,
    includes: [
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
    ],
  },
  {
    id: "spotless",
    name: "Spotless",
    headline: "A little more attention to detail.",
    description: "Everything in Regular, with extra attention to the details that make your home feel beautifully maintained.",
    from: 147,
    basis: "2 bedrooms, 2 bathrooms",
    beds: 2,
    baths: 2,
    builds: "Regular",
    recommended: true,
    includes: [
      "More detailed shower screen cleaning",
      "Additional attention to bathroom tiles and fittings",
      "Microwave interior cleaned",
      "Rangehood exterior wiped",
      "Accessible skirting boards wiped",
      "Window sills cleaned",
      "Light switches wiped",
      "Door handles wiped",
      "Visible fingerprints and light marks removed from accessible surfaces",
      "Additional detail cleaning of frequently used areas",
    ],
  },
  {
    id: "platinum",
    name: "Ultimate Platinum",
    headline: "The ultimate home refresh.",
    description: "Our most comprehensive recurring cleaning experience, with detailed attention throughout your home.",
    from: 207,
    basis: "3 bedrooms, 2 bathrooms",
    beds: 3,
    baths: 2,
    builds: "Spotless",
    includes: [
      "Kitchen and bathroom cabinet fronts wiped",
      "Accessible ceiling fans dusted",
      "Accessible air-conditioning vents dusted",
      "Accessible interior window glass cleaned",
      "Accessible sliding-door tracks cleaned",
      "Accessible blinds dusted",
      "Additional detail cleaning of fixtures and fittings",
      "Extra attention to high-touch surfaces",
      "Detailed cleaning of accessible areas commonly missed during routine maintenance cleans",
    ],
  },
];

/** Optional extras available with any package (AUD excluding GST). Agreed before the clean – never charged automatically. */
export const packageExtras = {
  extraHour: 67,
  bedMaking: 5,
  linenChange: 10,
} as const;

export const packageById = (id: string | null | undefined) => regularPackages.find((p) => p.id === id);

/** One-line summary added to the booking request. */
export const packageNote = (p: CleanPackage) => `Package: ${p.name} – from $${p.from} + GST per clean (starting price for ${p.basis})`;

export type PackageEstimate = { from: number; extraHours: number; bedMaking: number; linenChange: number; total: number };

/**
 * Estimated price per clean (AUD excluding GST) from the published prices only: the package's
 * starting price plus any extra time and extras the customer chose. Larger homes are NOT priced
 * here – the final price is confirmed by Swept before the first clean.
 */
export function estimatePackage(p: CleanPackage, opts: { extraHours?: number; bedMaking?: number; linenChange?: number }): PackageEstimate {
  const extraHours = Math.max(0, Math.min(4, Math.floor(opts.extraHours ?? 0))) * packageExtras.extraHour;
  const bedMaking = Math.max(0, Math.min(8, Math.floor(opts.bedMaking ?? 0))) * packageExtras.bedMaking;
  const linenChange = Math.max(0, Math.min(8, Math.floor(opts.linenChange ?? 0))) * packageExtras.linenChange;
  return { from: p.from, extraHours, bedMaking, linenChange, total: p.from + extraHours + bedMaking + linenChange };
}

/** True when the home is bigger than the package's starting size (so extra time may be needed). */
export const exceedsBasis = (p: CleanPackage, beds?: number, baths?: number) => (beds ?? 0) > p.beds || (baths ?? 0) > p.baths;
