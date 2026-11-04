import type { MetadataRoute } from "next";
import { services } from "@/lib/services";
import { areas } from "@/lib/areas";
import { site, siteUrl } from "@/lib/site";
import { suburbPath, suburbs } from "@/lib/suburbs";
import { guidePath, guides } from "@/lib/guides";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  const now = new Date(site.contentUpdated);
  const page = (path: string, priority: number) => ({ url: `${base}${path}`, lastModified: now, priority });
  return [
    page("/", 1),
    page("/quote", 0.9),
    page("/services", 0.8),
    ...services.map((s) => page(`/services/${s.slug}`, 0.9)),
    page("/areas", 0.7),
    ...areas.map((a) => page(`/areas/${a.slug}`, 0.8)),
    ...suburbs.map((s) => page(suburbPath(s), 0.7)),
    // Guides: the listing joins the sitemap once the first guide is published
    ...(guides.length ? [page("/cleaning-guides", 0.6)] : []),
    ...guides.map((g) => ({ url: `${base}${guidePath(g.slug)}`, lastModified: new Date(g.updated ?? g.published), priority: 0.6 })),
    page("/why-swept", 0.6),
    page("/faq", 0.6),
    page("/contact", 0.6),
    page("/privacy", 0.2),
  ];
}
