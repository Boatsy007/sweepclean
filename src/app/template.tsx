"use client";

import type { ReactNode } from "react";

/*
 * Re-mounts on every client-side navigation, so each new page fades and rises in gently.
 * The very first page load is not animated (it would only delay the first paint).
 */
let firstRender = true;

export default function Template({ children }: { children: ReactNode }) {
  const animate = !firstRender;
  firstRender = false;
  return <div className={animate ? "page-enter" : undefined}>{children}</div>;
}
