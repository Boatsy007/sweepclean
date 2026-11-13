"use client";

import { ViewTransition, useLayoutEffect, useRef, type ReactNode } from "react";

/*
 * Page transitions. Re-mounts on every client-side navigation.
 * Browsers with the View Transitions API (Chrome, Edge, Safari 18+) get a true crossfade:
 * the old page fades out while the new one fades and rises in – no blank frame
 * (timings in globals.css, "Page transitions"). Older browsers fall back to a fade-in.
 * Nothing is animated on the very first page load.
 */
let hydrated = false;

export default function Template({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    if (hydrated && !("startViewTransition" in document)) ref.current?.classList.add("page-enter");
    hydrated = true;
  }, []);
  return (
    <ViewTransition enter="page-in" exit="page-out" default="none">
      <div ref={ref}>{children}</div>
    </ViewTransition>
  );
}
