"use client";

import { useSearchParams } from "next/navigation";
import { BOOK_HINT_FREQUENCIES, BOOK_HINT_PACKAGES } from "@/lib/bookingKoala";
import { Icon } from "./Icon";

/**
 * "You chose Spotless – select Spotless in the booking form below."
 * BookingKoala can't preselect a package or frequency from our site, so the choice made on our
 * page is repeated here. Only known values are shown (anything else in the URL is ignored).
 */
export function BookHint() {
  const params = useSearchParams();
  const pkg = BOOK_HINT_PACKAGES[params.get("package") as keyof typeof BOOK_HINT_PACKAGES];
  const freq = BOOK_HINT_FREQUENCIES[params.get("frequency") as keyof typeof BOOK_HINT_FREQUENCIES];
  if (!pkg && !freq) return null;
  const what = [pkg && `the ${pkg} package`, freq && `${freq.toLowerCase()} cleaning`].filter(Boolean).join(" and ");
  const pick = [pkg, freq].filter(Boolean).join(" and ");
  return (
    <p className="mt-5 flex items-start gap-2.5 rounded-2xl border border-lilac bg-white px-4 py-3 text-[0.98rem] text-navy">
      <Icon name="checkCircle" className="mt-0.5 size-5 shrink-0 text-violet" />
      <span>You chose {what}. Select <strong>{pick}</strong> in the booking form below.</span>
    </p>
  );
}
