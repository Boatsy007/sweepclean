import type { Metadata } from "next";
import type { StaticImageData } from "next/image";

const SITE = "Swept Cleaning";
const DEFAULT_IMAGE = { url: "/opengraph-image", width: 1200, height: 630, alt: "Swept Cleaning – house cleaning from Brisbane to Tweed Heads" };

/**
 * Complete metadata for a page: title, description, canonical, Open Graph and
 * Twitter. Child-page openGraph objects replace (not merge with) the root's, so
 * every page goes through this helper to keep share images and site data intact.
 */
export function pageMeta({ title, description, path, image, noindex }: { title: string; description: string; path: string; image?: { src: StaticImageData; alt: string }; noindex?: boolean }): Metadata {
  const images = image ? [{ url: image.src.src, width: image.src.width, height: image.src.height, alt: image.alt }] : [DEFAULT_IMAGE];
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: path },
    openGraph: { type: "website", siteName: SITE, locale: "en_AU", url: path, title, description, images },
    twitter: { card: "summary_large_image", title, description, images: images.map((i) => i.url) },
    ...(noindex ? { robots: { index: false, follow: false } } : {}),
  };
}
