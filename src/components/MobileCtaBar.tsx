"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { site, telHref } from "@/lib/site";
import { track } from "@/lib/analytics";
import { BOOK_PATH, LOGIN_PATH, primaryCta, type CtaIntent } from "@/lib/bookingKoala";
import { Icon } from "./Icon";

/** Primary action for a path: service pages follow their service (bookable → book, bond/commercial → quote); everything else books. */
function ctaForPath(path: string): { intent: CtaIntent; href: string } {
  const service = path.match(/^\/services\/([^/]+)/)?.[1];
  return primaryCta(service);
}

/**
 * Thumb-zone CTA on phones, pinned to the bottom of the screen: Call + the page's primary action.
 * Residential pages: Book a clean (/book-now). Commercial, bond and other quote-first services: Get a free quote.
 * A page can override the default with a hidden `[data-page-cta]` marker (e.g. bond guides → quote).
 * Hidden where a form is the page: the quote funnel and the BookingKoala booking and login pages.
 * A spacer the same height keeps the footer clear of the bar.
 */
export function MobileCtaBar() {
  const path = usePathname();
  const [override, setOverride] = useState<{ intent: CtaIntent; href: string } | null>(null);
  const [hasInline, setHasInline] = useState(false);
  useEffect(() => {
    setHasInline(!!document.getElementById("quote"));
    const marker = document.querySelector<HTMLElement>("[data-page-cta]");
    const intent = marker?.dataset.pageCta;
    setOverride(marker && (intent === "book" || intent === "quote") ? { intent, href: marker.dataset.pageCtaHref || (intent === "book" ? BOOK_PATH : "/quote") } : null);
  }, [path]);
  if (path.startsWith("/quote") || path === BOOK_PATH || path === LOGIN_PATH) return null;

  const cta = override ?? ctaForPath(path);
  const book = cta.intent === "book";
  // On a page with the inline quote form, "Get a free quote" jumps to it instead of leaving the page.
  const href = !book && hasInline ? "#quote" : cta.href;
  return (
    <>
      <div aria-hidden="true" className="h-[calc(3.75rem+max(env(safe-area-inset-bottom),0.5rem))] lg:hidden" />
      <div data-mobile-cta-bar className="fixed inset-x-0 bottom-0 z-40 border-t border-lilac bg-white/95 shadow-[0_-10px_28px_-14px_rgb(6_27_73/0.22)] px-4 pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-2 backdrop-blur lg:hidden">
        <div className="flex gap-2.5 min-[360px]:gap-3">
          {site.phone && (
            <a href={telHref(site.phone)} onClick={() => track("click_to_call", { location: "mobile_bar" })} className="btn-outline !min-h-11 flex-1 whitespace-nowrap !px-4">
              <Icon name="phone" className="size-5" /> Call
            </a>
          )}
          <Link
            href={href}
            data-cta-intent={cta.intent}
            onClick={() => track(book ? "booking_cta_click" : "quote_cta_click", { cta_location: "mobile_bar", destination: href.split("?")[0] })}
            className="btn-primary !min-h-11 flex-[2] whitespace-nowrap !px-4"
          >
            {book ? "Book a clean" : "Get a free quote"} <Icon name="arrow" className="size-4" />
          </Link>
        </div>
      </div>
    </>
  );
}
