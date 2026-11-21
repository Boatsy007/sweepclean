"use client";

import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import { getAttribution, track } from "@/lib/analytics";
import { JOBBER_ATTRIBUTION_KEYS, JOBBER_CLIENTHUB_ID, JOBBER_CSS_HREF, JOBBER_FORM_URL, JOBBER_LOAD_TIMEOUT_MS, JOBBER_SCRIPT_SRC } from "@/lib/jobber";
import { ALL_FREQUENCIES } from "@/lib/quote";
import { services } from "@/lib/services";
import { site, telHref } from "@/lib/site";
import { Icon } from "./Icon";

// The site's own form – only downloaded if Jobber's form can't be shown (backup).
const QuoteForm = dynamic(() => import("./QuoteForm").then((m) => m.QuoteForm), { ssr: false, loading: () => <div className="card h-[32rem]" /> });

/**
 * Jobber's official embedded work request form (enquiries go straight into Jobber).
 *
 * Jobber's snippet runs once per <script> element and reads its settings from that element
 * (document.currentScript). next/script loads a given src only once per session, so after a
 * client-side visit away from /quote and back it would not run again and the form would stay empty.
 * So the script (and a fresh target element) is added each time this component mounts, and removed
 * when it unmounts.
 *
 * Ad attribution: the snippet forwards utm_* and gclid from the page URL. When the visitor arrived
 * on another page (e.g. an ad landing page) and then came to /quote, the stored attribution for the
 * visit is added to the form URL instead, so Jobber still records it.
 *
 * If Jobber reports an error or hasn't shown its form within JOBBER_LOAD_TIMEOUT_MS, the visitor is
 * offered the site's own form (→ email to the business inbox), so no enquiry is lost.
 */
export function JobberQuoteForm() {
  const hostRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<"loading" | "ready" | "failed">("loading");

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let settled = false;
    const settle = (next: "ready" | "failed", reason?: string) => {
      if (settled) return;
      settled = true;
      setState(next);
      if (next === "failed") track("quote_form_fallback", { reason: reason ?? "unknown" });
    };

    // Jobber's stylesheet, added without blocking the page's first paint (it only styles the embed).
    if (!document.querySelector(`link[href="${JOBBER_CSS_HREF}"]`)) {
      const css = document.createElement("link");
      css.rel = "stylesheet";
      css.href = JOBBER_CSS_HREF;
      css.media = "screen";
      document.head.appendChild(css);
    }

    const target = document.createElement("div");
    target.id = JOBBER_CLIENTHUB_ID;
    host.replaceChildren(target);

    const formUrl = new URL(JOBBER_FORM_URL);
    const page = new URLSearchParams(window.location.search);
    const stored = getAttribution() ?? {};
    for (const k of JOBBER_ATTRIBUTION_KEYS) {
      const v = stored[k];
      if (v && !page.get(k)) formUrl.searchParams.set(k, v);
    }

    const script = document.createElement("script");
    script.src = JOBBER_SCRIPT_SRC;
    script.async = true;
    script.setAttribute("clienthub_id", JOBBER_CLIENTHUB_ID);
    script.setAttribute("form_url", formUrl.toString());
    script.addEventListener("error", () => settle("failed", "script_error"));

    // Jobber inserts iframe.jobber-work-request when the form loads, or .jobber-flash--error if it can't.
    const observer = new MutationObserver(() => {
      if (target.querySelector(".jobber-flash--error")) settle("failed", "jobber_error");
      const frame = target.querySelector<HTMLIFrameElement>("iframe.jobber-work-request");
      if (frame && !frame.dataset.sweptWatched) {
        frame.dataset.sweptWatched = "1";
        frame.title = "Request a quote from Swept Cleaning (secure form by Jobber)";
        frame.addEventListener("load", () => settle("ready"));
      }
    });
    observer.observe(target, { childList: true, subtree: true });
    const timer = window.setTimeout(() => settle("failed", "timeout"), JOBBER_LOAD_TIMEOUT_MS);

    host.appendChild(script);
    return () => {
      observer.disconnect();
      window.clearTimeout(timer);
      host.replaceChildren();
    };
  }, []);

  return (
    <div>
      <Suspense fallback={null}>
        <ChosenService />
      </Suspense>
      {state === "failed" && (
        <div role="status" className="mb-5 rounded-xl border border-lilac bg-white px-4 py-3 text-[0.95rem] text-navy">
          <p className="font-semibold">Our online request form didn&apos;t load.</p>
          <p className="mt-1">Please use the form below instead{site.phone ? <> or call us on <a href={telHref(site.phone)} className="font-semibold text-violet-ink underline underline-offset-2">{site.phone}</a></> : null}.</p>
        </div>
      )}
      <div
        className={`card relative overflow-hidden p-2 sm:p-4 ${state === "failed" ? "hidden" : ""} ${state === "loading" ? "min-h-[40rem]" : ""}`}
        aria-busy={state === "loading"}
      >
        <div ref={hostRef} data-jobber-form />
        {state === "loading" && <p className="sr-only">Loading the quote request form…</p>}
      </div>
      {state === "failed" && (
        <Suspense fallback={<div className="card h-[32rem]" />}>
          <QuoteForm />
        </Suspense>
      )}
    </div>
  );
}

/** The service (and frequency) the visitor chose on the page they came from – a reminder, since
 *  Jobber's embed has no supported way to preselect answers. */
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
        {freq && freq.value !== "once" ? <> – <strong>{freq.label.toLowerCase()}</strong></> : null} – please include this in the form below.
      </span>
    </p>
  );
}
