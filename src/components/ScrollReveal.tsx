"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

const SELECTOR = [".reveal", "main .card:not(form)", "main .band", "main section > div > h2", "main section > h2", ".reveal-stagger > *"].join(",");

/**
 * Scroll reveals for touch devices. Each element animates in once when it first
 * enters the viewport, then is left alone – nothing is tied to scroll position,
 * so it can't interfere with momentum scrolling or pull-to-refresh on iOS.
 * Desktop (pointer: fine) uses the CSS scroll-driven animations instead.
 */
export function ScrollReveal() {
  const path = usePathname();
  useEffect(() => {
    if (!window.matchMedia("(pointer: coarse)").matches) return;
    if (!("IntersectionObserver" in window)) return;
    const root = document.documentElement;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    root.classList.add("js-reveal");

    // In-page links (e.g. "Get my free quote" → #quote): smooth-scroll with JS on touch
    const onClick = (ev: MouseEvent) => {
      const a = (ev.target as HTMLElement).closest?.('a[href^="#"]') as HTMLAnchorElement | null;
      const id = a?.getAttribute("href")?.slice(1);
      const target = id ? document.getElementById(id) : null;
      if (!target) return;
      ev.preventDefault();
      target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    };
    document.addEventListener("click", onClick);
    root.classList.toggle("rv-fade-only", reduce);

    const els = [...document.querySelectorAll<HTMLElement>(SELECTOR)].filter(
      // skip things nested inside an element that already reveals
      (el, _, all) => !all.some((o) => o !== el && o.contains(el)),
    );
    const vh = window.innerHeight;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.classList.add("rv-in");
          io.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    for (const el of els) {
      const r = el.getBoundingClientRect();
      if (r.top < vh * 0.92 && r.bottom > 0) continue; // already on screen: leave visible, no flash
      const parent = el.parentElement;
      if (parent?.classList.contains("reveal-stagger")) {
        const i = [...parent.children].indexOf(el);
        el.style.setProperty("--rv-d", `${Math.min(i, 4) * 90}ms`);
      }
      el.classList.add("rv");
      io.observe(el);
    }
    return () => {
      document.removeEventListener("click", onClick);
      io.disconnect();
      for (const el of els) el.classList.remove("rv", "rv-in");
    };
  }, [path]);
  return null;
}
