import type { StaticImageData } from "next/image";
import type { Faq } from "./services";
import { guideList } from "@/content/guides";

/*
 * Cleaning Guides – content model.
 *
 * Each guide is one file in src/content/guides/<slug>.ts exporting a `Guide`,
 * registered in src/content/guides/index.ts. Everything else – the listing,
 * article page, metadata, structured data, sitemap, related links and CTAs – is
 * generated from that data. See docs/CLEANING-GUIDES.md.
 */

/**
 * Inline text in any block supports:
 *   [link text](/internal-path)  or  [link text](https://external.site)
 *   **bold**
 */
export type GuideBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string; id?: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "image"; src: StaticImageData | string; alt: string; caption?: string; width?: number; height?: number }
  | { type: "tip"; title?: string; text: string };

export type GuideImage = { src: StaticImageData | string; alt: string; width?: number; height?: number };

export type Guide = {
  /** URL slug: lowercase-words-with-hyphens → /cleaning-guides/<slug> */
  slug: string;
  /** On-page H1 */
  title: string;
  /** Optional <title> override (≤ 60 chars incl. " | Swept Cleaning"); defaults to `${title} | Swept Cleaning` */
  metaTitle?: string;
  /** Intro shown under the title, on the card and as the meta description (aim for 110–160 chars) */
  description: string;
  /** ISO date, e.g. "2026-11-20" */
  published: string;
  /** ISO date of the last meaningful update */
  updated?: string;
  categories: string[];
  image?: GuideImage;
  body: GuideBlock[];
  faqs?: Faq[];
  /** Slugs of guides to show as related (otherwise chosen by shared category) */
  related?: string[];
  /** Service slugs this guide supports (e.g. "bond-cleaning") – linked at the end of the article */
  services?: string[];
  /** Area slugs (e.g. "brisbane") – the guide is featured on that area page and all its suburb pages */
  areas?: string[];
};

export const guidePath = (slug: string) => `/cleaning-guides/${slug}`;

/** Published guides, newest first. */
export const guides: Guide[] = [...guideList].sort((a, b) => b.published.localeCompare(a.published));

export function getGuide(slug: string) {
  return guides.find((g) => g.slug === slug);
}

const strip = (s: string) => s.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/\*\*/g, "");

export function guideText(g: Guide): string {
  const parts: string[] = [g.description];
  for (const b of g.body) {
    if (b.type === "p" || b.type === "h2" || b.type === "h3") parts.push(b.text);
    else if (b.type === "ul" || b.type === "ol") parts.push(...b.items);
    else if (b.type === "tip") parts.push(b.title ?? "", b.text);
    else if (b.type === "image") parts.push(b.caption ?? "");
  }
  for (const f of g.faqs ?? []) parts.push(f.q, f.a);
  return strip(parts.join(" "));
}

export const wordCount = (g: Guide) => guideText(g).split(/\s+/).filter(Boolean).length;

/** Minutes to read at ~200 words per minute (minimum 1). */
export const readingTime = (g: Guide) => Math.max(1, Math.round(wordCount(g) / 200));

export const headingId = (text: string) =>
  strip(text).toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

/** Up to `n` related guides: explicit `related` first, then shared categories, then newest. */
export function relatedGuides(g: Guide, n = 3): Guide[] {
  const others = guides.filter((o) => o.slug !== g.slug);
  const explicit = (g.related ?? []).map((s) => others.find((o) => o.slug === s)).filter(Boolean) as Guide[];
  const byCategory = others
    .filter((o) => !explicit.includes(o))
    .map((o) => ({ o, score: o.categories.filter((c) => g.categories.includes(c)).length }))
    .sort((a, b) => b.score - a.score || b.o.published.localeCompare(a.o.published))
    .map((x) => x.o);
  return [...explicit, ...byCategory].slice(0, n);
}

/** Guides tagged for an area (featured on the area page and its suburb pages). */
export const guidesForArea = (area: string) => guides.filter((g) => g.areas?.includes(area));

export const allCategories = () => [...new Set(guides.flatMap((g) => g.categories))].sort();

export const formatDate = (iso: string) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" });
