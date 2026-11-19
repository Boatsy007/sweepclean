import type { MetadataRoute } from "next";
import { services } from "@/lib/services";
import { areas } from "@/lib/areas";
import { absoluteUrl, site } from "@/lib/site";
import { suburbPath, suburbs } from "@/lib/suburbs";
import { guidePath, guides } from "@/lib/guides";
import { serviceAreaPath, serviceAreas } from "@/lib/serviceAreas";

/*
 * XML sitemap, generated from the same data that generates the pages – a new service, area,
 * suburb, service × area combination or guide is included automatically.
 *
 * - Only canonical, indexable, 200 pages. Excluded: /quote/thanks (noindex), /api/*, /llms.txt,
 *   the Open Graph image, redirects (next.config.ts) and anything that 404s.
 * - lastmod only where we have a genuine content date: each guide's published/updated date, and the
 *   guides listing (date of the newest guide). Other pages omit lastmod rather than claim a fake date.
 * - No priority/changefreq: Google ignores them.
 * - One file covers up to 50,000 URLs. Past that, switch to generateSitemaps() (Next.js) to split it.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const page = (path: string, lastModified?: string): MetadataRoute.Sitemap[number] => ({ url: absoluteUrl(path), ...(lastModified ? { lastModified } : {}) });
  const guideDate = (g: (typeof guides)[number]) => g.updated ?? g.published;
  const newestGuide = guides.map(guideDate).sort().at(-1);
  return [
    page("/"),
    page("/quote"),
    page("/services"),
    ...services.map((s) => page(`/services/${s.slug}`)),
    ...Object.entries(serviceAreas).flatMap(([sv, m]) => Object.keys(m).map((ar) => page(serviceAreaPath(sv, ar)))),
    page("/areas"),
    ...areas.map((a) => page(`/areas/${a.slug}`)),
    ...suburbs.map((s) => page(suburbPath(s))),
    // The guides listing joins the sitemap once the first guide is published (it's noindex while empty).
    ...(guides.length ? [page("/cleaning-guides", newestGuide)] : []),
    ...guides.map((g) => page(guidePath(g.slug), guideDate(g))),
    page(site.promise.path),
    page("/why-swept"),
    page("/faq"),
    page("/contact"),
    page("/privacy"),
  ];
}
