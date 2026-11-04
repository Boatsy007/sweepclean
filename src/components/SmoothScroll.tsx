"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Momentum ("buttery") wheel scrolling on desktop. Touch devices keep native
 * scrolling, and it is skipped entirely for prefers-reduced-motion. Lenis scrolls
 * the real document, so CSS scroll-driven animations keep working with it.
 */
export function SmoothScroll() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarse = window.matchMedia("(pointer: coarse)");
    if (reduce.matches || coarse.matches) return;
    const lenis = new Lenis({
      lerp: 0.085,
      wheelMultiplier: 1,
      smoothWheel: true,
      anchors: { offset: -104 },
      autoRaf: true,
    });
    return () => lenis.destroy();
  }, []);
  return null;
}
