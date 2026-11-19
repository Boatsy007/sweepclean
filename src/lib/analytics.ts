/**
 * Analytics – Google tag (Tag Manager container GTM-MFN3G8TW → GA4 G-WX83B5MFH0).
 *
 * - The tag is loaded by src/components/Analytics.tsx on the production domain only.
 * - Events are sent with gtag('event', …) – the one method, so nothing is counted twice. Before the
 *   tag loads, gtag() queues into dataLayer; on previews/localhost there is no gtag and nothing is sent.
 * - Never put personal information (names, emails, phones, addresses, notes) in event parameters.
 * Event reference: docs/ANALYTICS.md.
 */
type Params = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    /** Set by Analytics.tsx on the production domain: events wait here until gtm.js has loaded. */
    __sweptTag?: { ready: boolean; queue: [string, Params][] };
  }
}

export const GTM_ID = "GTM-MFN3G8TW";

export function track(event: string, params: Params = {}) {
  // gtag exists only on the production domain (src/components/Analytics.tsx) – the one path to Google.
  // Elsewhere nothing is sent or stored. (Automated tests install their own recording gtag.)
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  const clean: Params = {};
  for (const [k, v] of Object.entries(params)) if (v !== undefined && v !== "") clean[k] = v;
  const tag = window.__sweptTag;
  if (tag && !tag.ready) {
    // Container not loaded yet: hold the event (sent once on load, see Analytics.tsx). origin_path records
    // the page it happened on. (Overriding page_location here makes this container drop events – tested.)
    tag.queue.push([event, { ...clean, origin_path: window.location.pathname }]);
    return;
  }
  window.gtag("event", event, clean);
}

/* ---- Ad click attribution (for importing confirmed bookings into Google Ads later) ----------- */

const ATTR_KEY = "swept:attribution";
const ATTR_PARAMS = ["gclid", "gbraid", "wbraid", "utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"] as const;
export type Attribution = Partial<Record<(typeof ATTR_PARAMS)[number] | "landing_page", string>>;

/**
 * Remember the ad click ID / UTM tags of the visit's landing page for this browser tab
 * (sessionStorage only). These identify the ad click, not the person.
 */
export function captureAttribution() {
  try {
    const q = new URLSearchParams(window.location.search);
    const found: Attribution = {};
    for (const k of ATTR_PARAMS) {
      const v = q.get(k);
      if (v) found[k] = v.slice(0, 200);
    }
    if (Object.keys(found).length) {
      found.landing_page = window.location.pathname.slice(0, 200);
      sessionStorage.setItem(ATTR_KEY, JSON.stringify(found));
    }
  } catch {}
}

/** The stored attribution, sent with enquiry forms so a confirmed booking can be matched to its ad click. */
export function getAttribution(): Attribution | undefined {
  try {
    const v = sessionStorage.getItem(ATTR_KEY);
    return v ? (JSON.parse(v) as Attribution) : undefined;
  } catch {
    return undefined;
  }
}
