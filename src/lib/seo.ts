import type { Metadata } from "next";
import type { StaticImageData } from "next/image";

const SITE = "Swept Cleaning";
const DEFAULT_IMAGE = { url: "/opengraph-image", width: 1200, height: 630, alt: "Swept Cleaning – house cleaning in Brisbane, Logan and the Gold Coast" };

/**
 * Complete metadata for a page: title, description, canonical, Open Graph and
 * Twitter. Child-page openGraph objects replace (not merge with) the root's, so
 * every page goes through this helper to keep share images and site data intact.
 */
type MetaImage = { src: StaticImageData | string; alt: string; width?: number; height?: number };
type ArticleMeta = { publishedTime: string; modifiedTime?: string; tags?: string[] };

export function pageMeta({ title, description, path, image, noindex, article }: { title: string; description: string; path: string; image?: MetaImage; noindex?: boolean; article?: ArticleMeta }): Metadata {
  const images = image
    ? [typeof image.src === "string" ? { url: image.src, width: image.width, height: image.height, alt: image.alt } : { url: image.src.src, width: image.src.width, height: image.src.height, alt: image.alt }]
    : [DEFAULT_IMAGE];
  const base = { siteName: SITE, locale: "en_AU", url: path, title, description, images };
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: path },
    openGraph: article
      ? { ...base, type: "article", publishedTime: article.publishedTime, modifiedTime: article.modifiedTime ?? article.publishedTime, tags: article.tags, authors: [SITE] }
      : { ...base, type: "website" },
    twitter: { card: "summary_large_image", title, description, images: images.map((i) => i.url) },
    ...(noindex ? { robots: { index: false, follow: false } } : {}),
  };
}
