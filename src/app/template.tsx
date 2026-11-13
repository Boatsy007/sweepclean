"use client";

import { ViewTransition, useLayoutEffect, useRef, type ReactNode } from "react";
import { usePathname } from "next/navigation";

/*
 * Page transitions. Keyed on the full pathname, so every page change animates – including
 * between pages in the same section (e.g. /services → /services/bond-cleaning, or one suburb
 * to the next), which a template alone would treat as the same page.
 * Browsers with the View Transitions API (Chrome, Edge, Safari 18+) get a true crossfade:
 * the old page fades out while the new one fades and rises in – no blank frame
 * (timings in globals.css, "Page transitions"). Older browsers fall back to a fade-in.
 * Nothing is animated on the very first page load.
 */
let hydrated = false;

export default function Template({ children }: { children: ReactNode }) {
  const path = usePathname();
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    if (hydrated && !("startViewTransition" in document)) ref.current?.classList.add("page-enter");
    hydrated = true;
  }, [path]);
  return (
    <ViewTransition key={path} enter="page-in" exit="page-out" default="none">
      <div ref={ref}>{children}</div>
    </ViewTransition>
  );
}
