import type { MetadataRoute } from "next";
import { indexable, siteUrl } from "@/lib/site";

/*
 * Production: crawl everything except the API. Pages that shouldn't be indexed (the quote
 * thank-you page, previews) use noindex instead of a Disallow, because Google can only see a
 * noindex on a page it's allowed to crawl.
 * Previews: crawling allowed, but every response carries X-Robots-Tag: noindex (next.config.ts)
 * and a robots noindex meta tag – and Vercel Deployment Protection should keep them private.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: indexable ? [{ userAgent: "*", allow: "/", disallow: ["/api/"] }] : [{ userAgent: "*", allow: "/" }],
    sitemap: `${siteUrl()}/sitemap.xml`,
  };
}
