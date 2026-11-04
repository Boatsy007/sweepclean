"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { site, telHref } from "@/lib/site";
import { track } from "@/lib/analytics";
import { Icon } from "./Icon";

/** Thumb-zone CTA on phones. Hidden on the quote funnel itself. */
export function MobileCtaBar() {
  const path = usePathname();
  const [shown, setShown] = useState(false);
  const [hasInline, setHasInline] = useState(false);
  useEffect(() => {
    const form = document.getElementById("quote");
    setHasInline(!!form);
    let formVisible = false;
    const update = () => setShown(window.scrollY > 520 && !formVisible);
    const io = form ? new IntersectionObserver(([e]) => { formVisible = e.isIntersecting; update(); }, { threshold: 0.15 }) : null;
    if (form && io) io.observe(form);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => { window.removeEventListener("scroll", update); io?.disconnect(); };
  }, [path]);
  if (path.startsWith("/quote")) return null;
  return (
    <div aria-hidden={!shown} inert={!shown} className={`fixed inset-x-0 bottom-0 z-40 transition-transform duration-300 ${shown ? "translate-y-0" : "translate-y-full"} border-t border-lilac bg-white px-4 pb-[max(env(safe-area-inset-bottom),0.75rem)] pt-3 lg:hidden`}>
      <div className="flex gap-3">
        {site.phone && (
          <a href={telHref(site.phone)} onClick={() => track("click_to_call", { location: "mobile_bar" })} className="btn-outline !min-h-12 flex-1 !px-4">
            <Icon name="phone" className="size-5" /> Call
          </a>
        )}
        <Link href={hasInline ? "#quote" : "/quote"} onClick={() => track("cta_click", { cta: "mobile_bar_quote" })} className="btn-primary !min-h-12 flex-[2]">
          Get a free quote <Icon name="arrow" className="size-4" />
        </Link>
      </div>
    </div>
  );
}
