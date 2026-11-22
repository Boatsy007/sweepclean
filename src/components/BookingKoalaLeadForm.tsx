"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef } from "react";
import { BOOKINGKOALA_LEAD_FORM_URL, BOOKINGKOALA_RESIZER_SCRIPT } from "@/lib/bookingKoala";
import { ALL_FREQUENCIES } from "@/lib/quote";
import { services } from "@/lib/services";
import { Icon } from "./Icon";

const SCRIPT_ID = "bookingkoala-iframe-resizer";
const IFRAME_ID = "iFrameResizer0"; // as supplied in BookingKoala's embed code (one form per page)

type Resizable = HTMLIFrameElement & { iFrameResizer?: { removeListeners?: () => void }; iframeResizer?: { disconnect?: () => void } };
type ResizeFn = (options: Record<string, unknown>, target: HTMLIFrameElement) => unknown;

/**
 * BookingKoala's lead enquiry form (embed code supplied by Swept), used on /quote.
 *
 * - The iframe and URL are exactly as supplied (id, src, border, 1000px starting height, scrolling).
 * - BookingKoala's iframeResizer.min.js is loaded once per visit. If it sizes the iframe by itself
 *   when it loads, nothing more is done; if it only provides the resize function (or after a
 *   client-side visit back to /quote, when the script has already run), that function is applied to
 *   the new iframe. Without the script the form still works at its starting height, with scrolling.
 * - The site never reads or changes anything inside the form, and sends no analytics for it.
 */
export function BookingKoalaLeadForm() {
  const frameRef = useRef<Resizable>(null);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;
    const initIfNeeded = () => {
      if (!frame.isConnected || frame.iFrameResizer || frame.iframeResizer) return;
      const w = window as unknown as { iFrameResize?: ResizeFn; iframeResize?: ResizeFn };
      const resize = w.iFrameResize ?? w.iframeResize;
      if (resize) resize({}, frame);
    };
    let script = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement("script");
      script.id = SCRIPT_ID;
      script.src = BOOKINGKOALA_RESIZER_SCRIPT;
      script.defer = true;
      script.addEventListener("load", () => { script!.dataset.loaded = "1"; });
      document.body.appendChild(script);
    }
    if (script.dataset.loaded) initIfNeeded();
    else script.addEventListener("load", initIfNeeded, { once: true });
    return () => {
      script?.removeEventListener("load", initIfNeeded);
      frame.iFrameResizer?.removeListeners?.();
      frame.iframeResizer?.disconnect?.();
    };
  }, []);

  return (
    <div>
      <Suspense fallback={null}>
        <ChosenService />
      </Suspense>
      {/* The card's look without the .card class, so the site's scroll-in animation doesn't move or clip the form. */}
      <div className="overflow-hidden rounded-[var(--radius-card)] border border-lilac bg-white p-1 shadow-soft sm:p-2">
        <iframe
          ref={frameRef}
          id={IFRAME_ID}
          title="Request a free cleaning quote from Swept (secure form by BookingKoala)"
          src={BOOKINGKOALA_LEAD_FORM_URL}
          style={{ border: 0 }}
          height="1000px"
          width="100%"
          scrolling="yes"
        />
      </div>
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
