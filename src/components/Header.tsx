"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Logo } from "./SweptMark";
import { Icon } from "./Icon";
import { services } from "@/lib/services";
import { track } from "@/lib/analytics";
import { site, telHref } from "@/lib/site";

const nav = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services", children: true },
  { href: "/why-swept", label: "Why Swept" },
  { href: "/areas", label: "Areas" },
  { href: "/cleaning-guides", label: "Cleaning Guides" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const [svcOpen, setSvcOpen] = useState(false);
  const svcRef = useRef<HTMLLIElement>(null);

  useEffect(() => { setOpen(false); setSvcOpen(false); }, [path]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && (setOpen(false), setSvcOpen(false));
    const onClick = (e: MouseEvent) => { if (svcRef.current && !svcRef.current.contains(e.target as Node)) setSvcOpen(false); };
    document.addEventListener("keydown", onKey);
    document.addEventListener("click", onClick);
    return () => { document.removeEventListener("keydown", onKey); document.removeEventListener("click", onClick); };
  }, []);
  useEffect(() => { document.body.style.overflow = open ? "hidden" : ""; }, [open]);

  const active = (href: string) => (href === "/" ? path === "/" : path.startsWith(href));

  return (
    <header className="header-elevate sticky top-0 z-50 border-b border-lilac bg-white text-violet">
      <div aria-hidden="true" className="scroll-progress pointer-events-none absolute inset-x-0 bottom-0 h-[3px] bg-violet" />
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-violet">Skip to content</a>
      <div className="container-x flex h-[76px] items-center justify-between gap-3 lg:h-[96px] lg:gap-4 xl:gap-6">
        <Link href="/" className="shrink-0"><Logo size="header" priority /></Link>

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {nav.map((n) =>
              n.children ? (
                <li key={n.href} ref={svcRef} className="relative">
                  <button
                    type="button"
                    aria-expanded={svcOpen}
                    aria-controls="svc-menu"
                    onClick={() => setSvcOpen((v) => !v)}
                    className={`flex items-center gap-1 whitespace-nowrap rounded-full px-4 py-2 font-display font-medium hover:bg-lavender lg:px-2.5 lg:text-[1rem] xl:px-3 xl:text-[1.05rem] 2xl:px-4 ${active("/services") ? "underline decoration-2 underline-offset-[10px]" : ""}`}
                  >
                    Services <Icon name="chevron" className={`size-4 transition-transform ${svcOpen ? "rotate-180" : ""}`} />
                  </button>
                  <div id="svc-menu" hidden={!svcOpen} className="absolute left-1/2 top-full mt-3 w-[22rem] -translate-x-1/2 rounded-2xl border border-lilac bg-white p-2 text-navy shadow-lift">
                    {services.map((s) => (
                      <Link key={s.slug} href={`/services/${s.slug}`} className="flex items-start gap-3 rounded-xl p-3 hover:bg-lavender">
                        <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-lg bg-lavender text-violet"><Icon name={s.icon} className="size-5" /></span>
                        <span>
                          <span className="block font-display font-semibold">{s.name}</span>
                          <span className="block text-sm text-slate">{s.bestFor}</span>
                        </span>
                      </Link>
                    ))}
                    <Link href="/services" className="mt-1 block rounded-xl px-3 py-2.5 text-sm font-semibold text-violet hover:bg-lavender">All services →</Link>
                  </div>
                </li>
              ) : (
                <li key={n.href}>
                  <Link href={n.href} aria-current={active(n.href) ? "page" : undefined} className={`block whitespace-nowrap rounded-full px-4 py-2 font-display font-medium hover:bg-lavender lg:px-2.5 lg:text-[1rem] xl:px-3 xl:text-[1.05rem] 2xl:px-4 ${active(n.href) ? "underline decoration-2 underline-offset-[10px]" : ""}`}>
                    {n.label}
                  </Link>
                </li>
              ),
            )}
          </ul>
        </nav>

        {/* Desktop actions */}
        <div className="hidden items-center gap-2 lg:flex">
          {site.phone && (
            <>
              <a href={telHref(site.phone)} onClick={() => track("click_to_call", { location: "header" })} className="hidden items-center gap-2 whitespace-nowrap rounded-full px-3 py-2 font-display text-[1.05rem] font-semibold hover:bg-lavender xl:inline-flex">
                <Icon name="phone" className="size-5" />{site.phone}
              </a>
              <a href={telHref(site.phone)} onClick={() => track("click_to_call", { location: "header" })} aria-label={`Call Swept on ${site.phone}`} className="grid size-11 place-items-center rounded-full hover:bg-lavender xl:hidden">
                <Icon name="phone" className="size-6" />
              </a>
            </>
          )}
          <Link href="/quote" onClick={() => track("cta_click", { cta: "header_book" })} className="btn-primary !min-h-12 whitespace-nowrap !px-5 text-[1rem] xl:!px-6 xl:text-[1.05rem]">
            Book a clean <Icon name="arrow" className="size-4" />
          </Link>
        </div>

        {/* Mobile / tablet actions: labelled tiles */}
        <div className="-mr-2 flex h-full items-stretch whitespace-nowrap font-display text-[0.72rem] font-semibold leading-[1.15] lg:hidden">
          <Link href="/quote" onClick={() => track("cta_click", { cta: "header_quote_mobile" })} className="flex flex-col items-center justify-center gap-1 px-1.5 text-center hover:bg-lavender min-[360px]:px-2.5 min-[400px]:px-3">
            <Icon name="calendar" className="size-6" />
            <span>Request a<br />Free Quote</span>
          </Link>
          {site.phone && (
            <a href={telHref(site.phone)} onClick={() => track("click_to_call", { location: "header_mobile" })} aria-label={`Call Swept on ${site.phone}`} className="flex flex-col items-center justify-center gap-1 border-l border-lilac px-1.5 hover:bg-lavender min-[360px]:px-2.5 min-[400px]:px-3">
              <Icon name="phone" className="size-6" />
              <span aria-hidden="true">Call Us</span>
            </a>
          )}
          <button type="button" className="flex flex-col items-center justify-center gap-1 border-l border-lilac px-1.5 hover:bg-lavender min-[360px]:px-2.5 min-[400px]:px-3" aria-expanded={open} aria-controls="mobile-nav" aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen((v) => !v)}>
            <Icon name={open ? "close" : "menu"} className="size-6" />
            <span aria-hidden="true">{open ? "Close" : "Menu"}</span>
          </button>
        </div>
      </div>

      {/* Close as soon as any link is tapped – don't wait for the next page to load
          (and still close when tapping the page you're already on). */}
      <div id="mobile-nav" data-lenis-prevent data-open={open} aria-hidden={!open} inert={!open} onClick={(e) => { if ((e.target as HTMLElement).closest("a")) setOpen(false); }} className="mobile-nav fixed inset-x-0 bottom-0 top-[76px] overflow-y-auto border-t border-lilac bg-white px-4 pb-10 pt-2 text-navy lg:hidden">
        <nav aria-label="Mobile">
          <ul className="divide-y divide-lilac font-display text-xl font-semibold">
            {nav.filter((n) => !n.children).slice(0, 1).map((n) => (
              <li key={n.href}><Link href={n.href} className="block py-4">{n.label}</Link></li>
            ))}
            <li className="py-4">
              <span className="text-sm uppercase tracking-[0.2em] text-violet">Services</span>
              <ul className="mt-2 space-y-1 text-lg font-medium">
                {services.map((s) => (
                  <li key={s.slug}><Link href={`/services/${s.slug}`} className="flex items-center gap-3 py-2"><Icon name={s.icon} className="size-5 text-violet" />{s.name}</Link></li>
                ))}
              </ul>
            </li>
            {nav.filter((n) => !n.children).slice(1).map((n) => (
              <li key={n.href}><Link href={n.href} className="block py-4">{n.label}</Link></li>
            ))}
          </ul>
        </nav>
        <Link href="/quote" onClick={() => track("cta_click", { cta: "mobile_menu_quote" })} className="btn-primary mt-6 w-full">Get a free quote <Icon name="arrow" className="size-4" /></Link>
      </div>
    </header>
  );
}
