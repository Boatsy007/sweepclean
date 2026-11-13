"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";

/*
 * Re-mounts on every client-side navigation, so each new page fades and rises in gently.
 * The class is added in the browser only (before paint), never in server HTML, so the very
 * first page load is not animated and its first paint isn't delayed.
 */
let hydrated = false;

export default function Template({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    if (hydrated) ref.current?.classList.add("page-enter");
    hydrated = true;
  }, []);
  return <div ref={ref}>{children}</div>;
}
