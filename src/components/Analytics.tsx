import Script from "next/script";
import { GTM_ID } from "@/lib/analytics";
import { PRODUCTION_ORIGIN } from "@/lib/siteConfig";
import { AnalyticsListeners } from "./AnalyticsListeners";

/**
 * Google tag (Tag Manager container GTM-MFN3G8TW, which carries GA4 G-WX83B5MFH0), on every page via
 * the root layout.
 *
 * - Google's code, unchanged: define dataLayer + gtag(), gtag('js', new Date()), load gtm.js?id=… async.
 *   (Don't add the classic GTM "gtm.start / event: gtm.js" push – this container fires its page view
 *   on the gtag 'js' command, so that would double-count page views.)
 * - Production domain only: the check runs in the browser because the same build also serves the
 *   *.vercel.app alias and previews. NEXT_PUBLIC_ANALYTICS_TEST_HOST (e.g. "localhost") adds one host
 *   for local verification builds only – never set it in Vercel.
 * - Speed: dataLayer/gtag are ready as soon as the page is interactive, so early events queue in
 *   Google's standard way and none are lost; the large gtm.js download waits until the page has
 *   loaded and the browser is idle, keeping it out of LCP and the start-up main thread.
 * - Page views, including client-side navigation, come from the container's GA4 enhanced measurement
 *   (history events) – no manual page_view events here, so none are double-counted.
 */
const hosts = [new URL(PRODUCTION_ORIGIN).hostname, process.env.NEXT_PUBLIC_ANALYTICS_TEST_HOST].filter(Boolean);

export function Analytics() {
  const code = `(function(){
if (${JSON.stringify(hosts)}.indexOf(location.hostname) === -1) return;
window.dataLayer = window.dataLayer || [];
window.gtag = function gtag(){dataLayer.push(arguments);};
gtag('js', new Date());
function load(){ var s = document.createElement('script'); s.async = true; s.src = 'https://www.googletagmanager.com/gtm.js?id=${GTM_ID}'; document.head.appendChild(s); }
function idle(){ if (window.requestIdleCallback) requestIdleCallback(load, { timeout: 3000 }); else setTimeout(load, 1); }
if (document.readyState === 'complete') idle(); else window.addEventListener('load', idle, { once: true });
})();`;
  return (
    <>
      <Script id="google-tag" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: code }} />
      <AnalyticsListeners />
    </>
  );
}
