"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { site, telHref } from "@/lib/site";
import { track } from "@/lib/analytics";
import { Icon } from "./Icon";

/**
 * Thumb-zone CTA on phones, always pinned to the bottom of the screen.
 * Hidden on the quote funnel itself, where it would cover the form.
 * A spacer the same height keeps the footer clear of the bar.
 */
export function MobileCtaBar() {
  const path = usePathname();
  const [hasInline, setHasInline] = useState(false);
  useEffect(() => { setHasInline(!!document.getElementById("quote")); }, [path]);
  if (path.startsWith("/quote")) return null;
  return (
    <>
      <div aria-hidden="true" className="h-[calc(4.5rem+max(env(safe-area-inset-bottom),0.75rem))] lg:hidden" />
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-lilac bg-white/95 px-4 pb-[max(env(safe-area-inset-bottom),0.75rem)] pt-3 backdrop-blur lg:hidden">
        <div className="flex gap-2.5 min-[360px]:gap-3">
          {site.phone && (
            <a href={telHref(site.phone)} onClick={() => track("click_to_call", { location: "mobile_bar" })} className="btn-outline !min-h-12 flex-1 whitespace-nowrap !px-4">
              <Icon name="phone" className="size-5" /> Call
            </a>
          )}
          <Link href={hasInline ? "#quote" : "/quote"} onClick={() => track("cta_click", { cta: "mobile_bar_quote" })} className="btn-primary !min-h-12 flex-[2] whitespace-nowrap !px-4">
            Get a free quote <Icon name="arrow" className="size-4" />
          </Link>
        </div>
      </div>
    </>
  );
}
