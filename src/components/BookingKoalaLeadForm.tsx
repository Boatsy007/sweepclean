"use client";

import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState, type ReactNode } from "react";
import { BOOKINGKOALA_LEAD_FORM_URL, BOOKINGKOALA_ORIGIN, BOOKINGKOALA_RESIZER_SCRIPT } from "@/lib/bookingKoala";
import { ALL_FREQUENCIES } from "@/lib/quote";
import { services } from "@/lib/services";
import { photos } from "@/lib/photos";
import { site, trustLabel } from "@/lib/site";
import { PRODUCTION_ORIGIN } from "@/lib/siteConfig";
import { Icon } from "./Icon";

const SCRIPT_ID = "bookingkoala-iframe-resizer";
const IFRAME_ID = "iFrameResizer"; // + instance number: iFrameResizer0 as in BookingKoala's embed code (one form per page)

type Resizable = HTMLIFrameElement & { iFrameResizer?: { removeListeners?: () => void }; iframeResizer?: { disconnect?: () => void } };
type ResizeFn = (options: Record<string, unknown>, target: HTMLIFrameElement) => unknown;
type Diag = { resizeFn: string; initialisedBy: string; dynamicScript: boolean; sizerMessages: number; lastHeight: string; otherMessages: string[]; frameHeight: number; frameWidth: number };

/**
 * BookingKoala's lead enquiry form (embed code supplied by Swept), used on /quote.
 *
 * The iframe and the resizer <script defer> are rendered exactly as in BookingKoala's snippet, so on
 * a direct visit BookingKoala's iframeResizer.min.js runs just as it would on any website. After a
 * client-side visit to /quote, React doesn't run that script tag, so: if the script has already run
 * this visit and provides iFrameResize(), it's applied to the new iframe; otherwise a copy of the
 * script is added once. Every iframe is set up at most once; listeners are removed on leaving.
 * Without the resizer the form still works at its 1000px starting height, with scrolling.
 *
 * Preview diagnostics: on a non-production host, /quote?bkdebug=1 shows whether the resizer started
 * and which messages BookingKoala's form sends (message types only – never form content), and
 * &bkwidth=860 (280–1400) tries a narrower form card on /quote. Nothing is tracked or sent anywhere,
 * and none of this works on the production domain.
 */
export function BookingKoalaLeadForm({ variant = "page", instance = 0 }: { variant?: "page" | "hero"; instance?: number } = {}) {
  const frameRef = useRef<Resizable>(null);
  const [debug, setDebug] = useState(false);
  const [diag, setDiag] = useState<Diag | null>(null);
  const [trialWidth, setTrialWidth] = useState<number | null>(null); // preview-only width trial (?bkwidth=…)

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;
    const dbg = window.location.origin !== PRODUCTION_ORIGIN && new URLSearchParams(window.location.search).get("bkdebug") === "1";
    setDebug(dbg);
    const bw = Number(new URLSearchParams(window.location.search).get("bkwidth"));
    if (dbg && bw >= 280 && bw <= 1400) setTrialWidth(bw);
    const w = window as unknown as { iFrameResize?: ResizeFn; iframeResize?: ResizeFn };
    const d: Diag = { resizeFn: "not found", initialisedBy: "not yet", dynamicScript: false, sizerMessages: 0, lastHeight: "", otherMessages: [], frameHeight: 0, frameWidth: 0 };
    const initialised = () => !!(frame.iFrameResizer || frame.iframeResizer);
    const tryInit = () => {
      if (!frame.isConnected) return true;
      if (initialised()) { if (d.initialisedBy === "not yet") d.initialisedBy = "BookingKoala's script"; return true; }
      const resize = w.iFrameResize ?? w.iframeResize;
      if (!resize) return false;
      resize(dbg ? { log: true } : {}, frame);
      d.initialisedBy = "this page (iFrameResize)";
      return true;
    };
    const onMessage = (e: MessageEvent) => {
      if (!dbg || e.origin !== BOOKINGKOALA_ORIGIN) return;
      const data = typeof e.data === "string" ? e.data : JSON.stringify(e.data ?? "");
      if (data.startsWith("[iFrameSizer]")) { d.sizerMessages++; d.lastHeight = data.split(":")[1] ?? ""; }
      else if (d.otherMessages.length < 20) d.otherMessages.push(data.slice(0, 80));
    };
    window.addEventListener("message", onMessage);

    // Give the page's own copy of the script (direct visits) a moment; then, if needed, add one copy.
    let tries = 0;
    const timer = window.setInterval(() => {
      tries++;
      if (tryInit()) { if (!dbg) window.clearInterval(timer); }
      else if (tries === 4 && !document.querySelector(`script[data-bk-dynamic]`)) {
        const s = document.createElement("script");
        s.src = BOOKINGKOALA_RESIZER_SCRIPT;
        s.dataset.bkDynamic = "1";
        document.body.appendChild(s);
        d.dynamicScript = true;
      }
      if (tries > 40 && !dbg) window.clearInterval(timer);
      if (dbg) {
        d.resizeFn = w.iFrameResize ? "window.iFrameResize" : w.iframeResize ? "window.iframeResize" : "not found";
        d.frameHeight = Math.round(frame.getBoundingClientRect().height);
        d.frameWidth = Math.round(frame.getBoundingClientRect().width);
        setDiag({ ...d, otherMessages: [...d.otherMessages] });
      }
    }, 250);

    return () => {
      window.clearInterval(timer);
      window.removeEventListener("message", onMessage);
      frame.iFrameResizer?.removeListeners?.();
      frame.iframeResizer?.disconnect?.();
    };
  }, []);

  const iframe = (
    <iframe
      ref={frameRef}
      id={`${IFRAME_ID}${instance}`}
      title="Request a free cleaning quote from Swept (secure form by BookingKoala)"
      src={BOOKINGKOALA_LEAD_FORM_URL}
      style={{ border: 0, display: "block" }}
      height="1000px"
      width="100%"
      scrolling="yes"
      loading="lazy"
    />
  );
  // BookingKoala's resizer, exactly as in their embed code (runs on direct visits; one tag per page).
  const resizerScript = <script id={SCRIPT_ID} src={BOOKINGKOALA_RESIZER_SCRIPT} defer />;
  const diagnostics = debug && diag && (
    <pre data-bk-debug className="mt-4 overflow-x-auto rounded-xl border border-lilac bg-white p-4 text-left text-xs text-navy">
{`BookingKoala form diagnostics (preview only)
resize function:   ${diag.resizeFn}
set up by:         ${diag.initialisedBy}
extra script copy: ${diag.dynamicScript ? "added" : "not needed"}
size messages:     ${diag.sizerMessages}${diag.lastHeight ? ` (last height ${diag.lastHeight}px)` : ""}
iframe size now:   ${diag.frameWidth} × ${diag.frameHeight}px (width × height)${trialWidth ? `\nwidth trial:       card limited to ${trialWidth}px (?bkwidth)` : ""}
other messages:    ${diag.otherMessages.length ? "\n  " + diag.otherMessages.join("\n  ") : "none"}`}
    </pre>
  );

  if (variant === "hero") {
    // The homepage hero card – same card, photo (phones), title, trust line and promise note as the
    // quick quote form it replaces; BookingKoala's form takes the place of the fields, edge to edge.
    return (
      <HeroCard>
        <div className="-mx-5 mt-4 sm:-mx-8">{iframe}</div>
        {resizerScript}
        {diagnostics}
      </HeroCard>
    );
  }

  return (
    <div>
      <Suspense fallback={null}>
        <ChosenService />
      </Suspense>
      {/* The card's look without the .card class (so the site's scroll-in animation doesn't move or clip the form), and no inner padding. */}
      <div className="overflow-hidden rounded-[var(--radius-card)] border border-lilac bg-white shadow-soft" style={trialWidth ? { maxWidth: trialWidth } : undefined}>{iframe}</div>
      {resizerScript}
      {diagnostics}
    </div>
  );
}

function HeroCard({ children }: { children: ReactNode }) {
  return (
    <div id="quote" className="relative scroll-mt-24 overflow-hidden rounded-[1.75rem] bg-white p-5 text-slate shadow-[0_30px_60px_-20px_rgb(6_27_73/0.39)] sm:p-8" aria-labelledby="hq-title">
      {/* Mobile: a real person front and centre, right where people enquire */}
      <div className="relative -mx-5 -mt-5 mb-4 aspect-[16/10] overflow-hidden lg:hidden">
        <Image src={photos.quoteCleaner.src} alt={photos.quoteCleaner.alt} fill sizes="(min-width: 640px) 600px, 100vw" quality={70} placeholder="blur" className="object-cover object-[50%_20%]" />
      </div>
      <h2 id="hq-title" className="text-center text-[1.3rem] font-extrabold uppercase tracking-wide sm:text-[1.65rem]">Request your free quote</h2>
      <p className="mt-1 flex flex-wrap items-center justify-center gap-x-2 gap-y-0.5 text-center text-sm">
        <span>Free, no obligation</span>
        <span className="inline-flex items-center gap-1 whitespace-nowrap font-medium text-navy"><Icon name="clock" className="size-4 shrink-0 text-violet" />We reply within 1 hour (business hours)</span>
        {trustLabel() && <span className="inline-flex items-center gap-1 whitespace-nowrap font-medium text-navy"><Icon name="shield" className="size-4 shrink-0 text-violet" />{trustLabel()}</span>}
      </p>
      {children}
      <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-sm font-medium text-navy">
        <Icon name="shieldSparkle" className="size-4 shrink-0 text-violet" />
        Something missed? <a href={site.promise.path} className="font-semibold text-violet underline underline-offset-2">We&apos;ll come back and fix it.</a>
      </p>
    </div>
  );
}

/** The service (and frequency) chosen on the page the visitor came from – a reminder, because
 *  prefilling BookingKoala's form from the link hasn't been verified. */
function ChosenService() {
  const params = useSearchParams();
  const svc = services.find((s) => s.slug === params.get("service"));
  const freq = ALL_FREQUENCIES.find((f) => f.value === params.get("frequency"));
  if (!svc) return null;
  return (
    <p data-chosen-service className="mb-4 flex items-start gap-2.5 rounded-xl border border-lilac bg-white px-4 py-3 text-[0.95rem] text-navy">
      <Icon name="checkCircle" className="mt-0.5 size-5 shrink-0 text-violet" />
      <span>
        You&apos;re asking about <strong>{svc.name.toLowerCase()}</strong>
        {freq && freq.value !== "once" ? <> – <strong>{freq.label.toLowerCase()}</strong></> : null} – please select this in the form below.
      </span>
    </p>
  );
}
