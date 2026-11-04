"use client";

import { useEffect } from "react";

/**
 * Diagnostic switches for the iOS scroll issue – only active with ?off=… in the URL.
 *   ?off=anim  → no load or scroll animations
 *   ?off=bar   → no bottom Call / Get a free quote bar
 *   ?off=anim,bar → both
 * Adds classes to <html>; does nothing for normal visitors.
 */
export function TestSwitches() {
  useEffect(() => {
    const off = (new URLSearchParams(location.search).get("off") ?? "").split(",");
    const root = document.documentElement;
    if (off.includes("anim")) root.classList.add("t-noanim");
    if (off.includes("bar")) root.classList.add("t-nobar");
  }, []);
  return null;
}
