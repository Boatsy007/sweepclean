"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { track } from "@/lib/analytics";
import type { CtaIntent } from "@/lib/bookingKoala";

/** Non-personal context sent with CTA clicks (never names, emails, phones or addresses). */
export type CtaContext = {
  page_type?: "home" | "service" | "service_area" | "region" | "suburb" | "guide" | "guides" | "package" | "general";
  service?: string;
  region?: string;
  suburb?: string;
  package?: string;
  frequency?: string;
};

/**
 * A booking or quote call to action.
 * Fires `booking_cta_click` or `quote_cta_click` – a click, never a booking or a lead – with the CTA
 * location, page context and destination. `data-cta-intent` lets tests check every CTA's destination.
 */
export function CtaLink({ intent, location, context = {}, ...props }: ComponentProps<typeof Link> & { intent: CtaIntent; location: string; context?: CtaContext }) {
  const href = String(props.href);
  return (
    <Link
      {...props}
      data-cta-intent={intent}
      onClick={(e) => {
        track(intent === "book" ? "booking_cta_click" : "quote_cta_click", { cta_location: location, destination: href.split("?")[0], ...context });
        props.onClick?.(e);
      }}
    />
  );
}
