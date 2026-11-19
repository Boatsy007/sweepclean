"use client";

import { useEffect } from "react";
import { captureAttribution, track } from "@/lib/analytics";

/** Where on the page a link sits (for reports) – never the number or address itself. */
function linkLocation(el: Element) {
  if (el.closest("[data-mobile-cta-bar]")) return "mobile_bar";
  if (el.closest("#mobile-nav")) return "mobile_menu";
  if (el.closest("header")) return "header";
  if (el.closest("footer")) return "footer";
  return "page";
}

/**
 * Site-wide listeners: one place tracks every phone and email link (present and future), so no link
 * needs its own handler and nothing is counted twice. Also remembers the visit's ad click ID / UTMs.
 */
export function AnalyticsListeners() {
  useEffect(() => {
    captureAttribution();
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.('a[href^="tel:"], a[href^="mailto:"]');
      if (!a) return;
      const tel = a.getAttribute("href")!.startsWith("tel:");
      track(tel ? "click_to_call" : "click_email", { link_location: linkLocation(a) });
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);
  return null;
}
