"use client";

import { useEffect, useRef, useState } from "react";
import { BOOKINGKOALA_EMBED_SCRIPT, bookingKoalaDirectUrl, bookingKoalaEmbedUrl, bookingKoalaForms, type BookingKoalaForm } from "@/lib/bookingKoala";
import { track } from "@/lib/analytics";
import { Icon } from "./Icon";

const SCRIPT_ID = "bookingkoala-embed-js";
/** Path the current copy of embed.js was loaded for – one copy per page, re-run after client-side navigation. */
let scriptLoadedFor: string | null = null;

/**
 * Load BookingKoala's official embed.js once for this page.
 * The official snippet relies on the script running after the iframe is in the DOM. On a direct
 * page load that's the first mount; after client-side navigation the old copy has already run, so
 * the tag is replaced (one copy on the page at a time) and runs again for the new iframe.
 * The script is cached by the browser, so re-running it costs no extra download.
 */
function loadEmbedScript(onError: () => void) {
  const here = window.location.pathname;
  const existing = document.getElementById(SCRIPT_ID);
  if (existing && scriptLoadedFor === here) return;
  existing?.remove();
  const s = document.createElement("script");
  s.id = SCRIPT_ID;
  s.src = BOOKINGKOALA_EMBED_SCRIPT;
  s.defer = true;
  s.onerror = onError;
  document.body.appendChild(s);
  scriptLoadedFor = here;
}

const viewEvent: Record<BookingKoalaForm, string> = {
  login: "customer_login_view",
};

/**
 * Swept's official BookingKoala embed – used for the customer login on /login only.
 *
 * - Reserves the form's height in the server HTML (no layout shift) and shows a loading state until the iframe loads.
 * - Uses the official iframe URL and embed.js; never touches the cross-origin iframe's content.
 * - If embed.js can't load, the iframe is reloaded with normal scrolling so no field is unreachable.
 * - Always offers a direct link to the same form on BookingKoala as a fallback.
 * - Fires a "form view" analytics event on load – a view, never a booking or a submission.
 */
export function BookingKoalaEmbed({ form, lazy = false, className = "" }: { form: BookingKoalaForm; lazy?: boolean; className?: string }) {
  const cfg = bookingKoalaForms[form];
  const [mounted, setMounted] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [scriptFailed, setScriptFailed] = useState(false);
  const viewed = useRef(false);

  useEffect(() => {
    // The iframe is added after hydration so its onLoad is always caught (a server-rendered iframe
    // can finish loading before React attaches the handler, leaving the loading state stuck).
    setMounted(true);
  }, []);
  useEffect(() => {
    if (mounted) loadEmbedScript(() => setScriptFailed(true));
  }, [mounted]);

  const onLoad = () => {
    setLoaded(true);
    if (!viewed.current) {
      viewed.current = true;
      track(viewEvent[form], { form }); // a view of the form – never a login or a submission
    }
  };

  return (
    <div className={className}>
      <div className="relative overflow-hidden rounded-[var(--radius-card)] border border-lilac bg-white shadow-soft" style={{ minHeight: cfg.height }}>
        {!loaded && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-white p-6 text-center" role="status" aria-live="polite">
            <span className="size-8 animate-spin rounded-full border-[3px] border-lilac border-t-violet motion-reduce:animate-none" aria-hidden="true" />
            <span className="font-display font-semibold text-navy">Loading secure form…</span>
          </div>
        )}
        {mounted && (
        <iframe
          // Re-created with normal scrolling if embed.js fails, so the form can never be clipped.
          key={scriptFailed ? "scroll" : "embed"}
          src={bookingKoalaEmbedUrl(form)}
          title={cfg.title}
          width="100%"
          scrolling={scriptFailed ? "auto" : "no"}
          loading={lazy ? "lazy" : "eager"}
          onLoad={onLoad}
          className="block w-full border-0"
          style={{ height: cfg.height }}
        />
        )}
      </div>
      <p className="mt-3 text-center text-sm">
        {scriptFailed ? "The form didn't load properly. " : "Form not loading? "}
        <a href={bookingKoalaDirectUrl(form)} target="_blank" rel="noopener" className="inline-flex items-center gap-1 font-semibold text-violet-ink underline underline-offset-2">
          {cfg.fallback} <Icon name="arrow" className="size-3.5" />
        </a>
      </p>
      <noscript>
        <p className="mt-2 text-center text-sm">
          JavaScript is off. <a href={bookingKoalaDirectUrl(form)} className="font-semibold underline">{cfg.fallback}</a>.
        </p>
      </noscript>
    </div>
  );
}
