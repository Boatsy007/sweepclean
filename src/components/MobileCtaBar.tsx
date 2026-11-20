"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { site, telHref } from "@/lib/site";
import { track } from "@/lib/analytics";
import { BOOK_PATH, LOGIN_PATH, primaryCta, type CtaIntent } from "@/lib/bookingKoala";
import { Icon } from "./Icon";

/** Primary action for a path: a free quote, with the service preselected on service pages. */
function ctaForPath(path: string): { intent: CtaIntent; href: string } {
  const service = path.match(/^\/services\/([^/]+)/)?.[1];
  return primaryCta(service);
}

/**
 * Thumb-zone CTA on phones, pinned to the bottom of the screen: Call + the page's primary action.
 * Every page: Get a free quote (service pages preselect their service).
 * A page can override the destination with a hidden `[data-page-cta]` marker (e.g. bond guides → bond quote).
 * Hidden where a form is the page: the quote funnel and the login page.
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
    setOverride(marker && (intent === "book" || intent === "quote") ? { intent: "quote", href: marker.dataset.pageCtaHref || "/quote" } : null);
  }, [path]);
  if (path.startsWith("/quote") || path === BOOK_PATH || path === LOGIN_PATH) return null;

  const cta = override ?? ctaForPath(path);
  // On a page with the inline quote form, "Get a free quote" jumps to it instead of leaving the page.
  const href = hasInline ? "#quote" : cta.href;
  return (
    <>
      <div aria-hidden="true" className="h-[calc(3.75rem+max(env(safe-area-inset-bottom),0.5rem))] lg:hidden" />
      <div data-mobile-cta-bar className="fixed inset-x-0 bottom-0 z-40 border-t border-lilac bg-white/95 shadow-[0_-10px_28px_-14px_rgb(6_27_73/0.22)] px-4 pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-2 backdrop-blur lg:hidden">
        <div className="flex gap-2.5 min-[360px]:gap-3">
          {site.phone && (
            <a href={telHref(site.phone)} className="btn-outline !min-h-11 flex-1 whitespace-nowrap !px-4">
              <Icon name="phone" className="size-5" /> Call
            </a>
          )}
          <Link
            href={href}
            data-cta-intent="quote"
            onClick={() => track("quote_cta_click", { cta_location: "mobile_bar", destination: href.split("?")[0] })}
            className="btn-primary !min-h-11 flex-[2] whitespace-nowrap !px-4"
          >
            Get a free quote <Icon name="arrow" className="size-4" />
          </Link>
        </div>
      </div>
    </>
  );
}
