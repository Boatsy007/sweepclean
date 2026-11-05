import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatDate, getGuide, guideAuthor, guidePath, guides, headingId, isOfficialSource, readingTime, relatedGuides, wordCount } from "@/lib/guides";
import { services } from "@/lib/services";
import { siteUrl } from "@/lib/site";
import { breadcrumbSchema, faqSchema } from "@/lib/schema";
import { pageMeta } from "@/lib/seo";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CtaBand } from "@/components/CtaBand";
import { Faqs } from "@/components/Faqs";
import { GuideCard } from "@/components/GuideCard";
import { GuideContent } from "@/components/GuideContent";
import { Icon } from "@/components/Icon";
import { JsonLd } from "@/components/JsonLd";
import { TrackedLink } from "@/components/TrackedLink";

type Props = { params: Promise<{ slug: string }> };

/** Only real, published guides get a page – unknown slugs 404. */
export function generateStaticParams() {
  return guides.map((g) => ({ slug: g.slug }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const g = getGuide((await params).slug);
  if (!g) return {};
  return pageMeta({
    title: g.metaTitle ?? `${g.title} | Swept Cleaning`,
    description: g.description,
    path: guidePath(g.slug),
    image: g.image,
    article: { publishedTime: g.published, modifiedTime: g.updated, tags: g.categories },
  });
}

export default async function GuidePage({ params }: Props) {
  const g = getGuide((await params).slug);
  if (!g) notFound();
  const path = guidePath(g.slug);
  const url = `${siteUrl()}${path}`;
  const mins = readingTime(g);
  const toc = g.body.filter((b): b is Extract<typeof b, { type: "h2" }> => b.type === "h2");
  const related = relatedGuides(g);
  const linkedServices = (g.services ?? []).map((s) => services.find((x) => x.slug === s)).filter(Boolean) as typeof services;
  const crumbs = [{ name: "Home", path: "/" }, { name: "Cleaning Guides", path: "/cleaning-guides" }, { name: g.title, path }];
  const imageUrl = g.image ? (typeof g.image.src === "string" ? g.image.src : `${siteUrl()}${g.image.src.src}`) : `${siteUrl()}/opengraph-image`;

  const article = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    headline: g.title,
    description: g.description,
    image: imageUrl,
    datePublished: g.published,
    dateModified: g.updated ?? g.published,
    author: { "@type": "Organization", name: guideAuthor.name, url: `${siteUrl()}/why-swept`, parentOrganization: { "@id": `${siteUrl()}/#business` } },
    publisher: { "@id": `${siteUrl()}/#business` },
    mainEntityOfPage: url,
    articleSection: g.categories,
    keywords: g.categories.join(", "),
    wordCount: wordCount(g),
    inLanguage: "en-AU",
    ...(g.sources?.length ? { citation: g.sources.map((s) => ({ "@type": "CreativeWork", name: s.title, url: s.url, ...(s.publisher ? { publisher: { "@type": "Organization", name: s.publisher } } : {}) })) } : {}),
  };

  return (
    <>
      <JsonLd data={[article, breadcrumbSchema(crumbs), ...(g.faqs?.length ? [faqSchema(g.faqs)] : [])]} />

      <section className="bg-gradient-to-b from-white to-lavender/70">
        <div className="container-x max-w-4xl pb-10 pt-8 lg:pb-14 lg:pt-12">
          <Breadcrumbs items={crumbs} />
          <ul className="flex flex-wrap gap-2">
            {g.categories.map((c) => <li key={c} className="rounded-full bg-lavender px-3 py-1 text-sm font-semibold text-violet-ink">{c}</li>)}
          </ul>
          <h1 className="mt-4 text-4xl font-extrabold leading-[1.08] sm:text-5xl">{g.title}</h1>
          <p className="mt-5 text-lg leading-relaxed sm:text-xl">{g.description}</p>
          <p className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
            <span className="inline-flex items-center gap-1.5"><Icon name="sparkle" className="size-4 text-violet" />By <Link href="/why-swept" className="font-semibold text-navy underline decoration-lilac underline-offset-2 hover:decoration-violet">{guideAuthor.name}</Link></span>
            <span className="inline-flex items-center gap-1.5"><Icon name="calendar" className="size-4 text-violet" />Published <time dateTime={g.published}>{formatDate(g.published)}</time></span>
            {g.updated && g.updated !== g.published && (
              <span className="inline-flex items-center gap-1.5">Updated <time dateTime={g.updated}>{formatDate(g.updated)}</time></span>
            )}
            <span className="inline-flex items-center gap-1.5"><Icon name="clock" className="size-4 text-violet" />{mins} min read</span>
          </p>
        </div>
      </section>

      {g.image && (
        <div className="container-x -mt-2 max-w-5xl">
          <div className="reveal-zoom relative aspect-[16/9] overflow-hidden rounded-[1.75rem] border border-lilac shadow-lift">
            {typeof g.image.src === "string" ? (
              <Image src={g.image.src} alt={g.image.alt} fill priority sizes="(min-width: 1024px) 1000px, 100vw" className="object-cover" />
            ) : (
              <Image src={g.image.src} alt={g.image.alt} fill priority placeholder="blur" sizes="(min-width: 1024px) 1000px, 100vw" className="object-cover" />
            )}
          </div>
        </div>
      )}

      <div className="container-x grid gap-10 py-12 sm:py-16 lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-14">
        <article className="min-w-0 max-w-3xl">
          {toc.length >= 3 && (
            <details className="mb-8 rounded-2xl border border-lilac bg-white p-5 lg:hidden">
              <summary className="cursor-pointer font-display font-semibold text-navy">In this guide</summary>
              <ol className="mt-3 space-y-2 text-[0.95rem]">
                {toc.map((h) => <li key={h.text}><a href={`#${h.id ?? headingId(h.text)}`} className="text-violet hover:underline">{h.text.replace(/\*\*/g, "")}</a></li>)}
              </ol>
            </details>
          )}

          <GuideContent blocks={g.body} />

          {g.sources && g.sources.length > 0 && (
            <section className="mt-12 rounded-2xl border border-lilac bg-white p-6" aria-labelledby="guide-src-h">
              <h2 id="guide-src-h" className="text-xl font-extrabold">Sources</h2>
              <p className="mt-1 text-sm">Prices and rules checked <time dateTime={g.updated ?? g.published}>{formatDate(g.updated ?? g.published)}</time>. Prices are a guide only and change over time.</p>
              <ol className="mt-4 list-decimal space-y-2 pl-5 text-[0.95rem]">
                {g.sources.map((s) => (
                  <li key={s.url}>
                    <a href={s.url} target="_blank" rel={isOfficialSource(s.url) ? "noopener" : "nofollow noopener noreferrer"} className="font-medium text-violet underline decoration-lilac underline-offset-2 hover:decoration-violet">{s.title}</a>
                    {s.publisher && <span className="text-slate"> – {s.publisher}</span>}
                  </li>
                ))}
              </ol>
              <p className="mt-4 text-sm">{guideAuthor.role}. Tenancy information is general, not legal advice – check the official sources above for your situation.</p>
            </section>
          )}

          {g.faqs && g.faqs.length > 0 && (
            <section className="mt-14" aria-labelledby="guide-faq-h">
              <h2 id="guide-faq-h" className="mb-5 text-2xl font-extrabold sm:text-3xl">Frequently asked questions</h2>
              <Faqs faqs={g.faqs} />
            </section>
          )}

          {linkedServices.length > 0 && (
            <section className="mt-14" aria-labelledby="guide-svc-h">
              <h2 id="guide-svc-h" className="text-2xl font-extrabold">Services that can help</h2>
              <ul className="mt-5 grid gap-4 sm:grid-cols-2">
                {linkedServices.map((s) => (
                  <li key={s.slug}>
                    <Link href={`/services/${s.slug}`} className="card flex items-center gap-4 p-5 hover:shadow-lift">
                      <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-lavender text-violet"><Icon name={s.icon} className="size-6" /></span>
                      <span><span className="block font-display font-semibold text-navy">{s.name}</span><span className="block text-sm">{s.bestFor}</span></span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </article>

        <aside className="hidden lg:block">
          <div className="sticky top-32 space-y-5">
            {toc.length >= 3 && (
              <nav aria-label="In this guide" className="rounded-2xl border border-lilac bg-white p-5">
                <p className="font-display font-semibold text-navy">In this guide</p>
                <ol className="mt-3 space-y-2 text-[0.95rem]">
                  {toc.map((h) => <li key={h.text}><a href={`#${h.id ?? headingId(h.text)}`} className="text-slate hover:text-violet">{h.text.replace(/\*\*/g, "")}</a></li>)}
                </ol>
              </nav>
            )}
            <div className="band p-6">
              <p className="font-display text-lg font-bold">Ready for a beautifully clean home?</p>
              <p className="mt-2 text-sm text-white/85">Get a clear, written price for your home.</p>
              <TrackedLink cta={`guide_sidebar_${g.slug}`} href="/quote" className="btn-white mt-4 w-full">Get My Free Quote</TrackedLink>
            </div>
          </div>
        </aside>
      </div>

      {related.length > 0 && (
        <section className="bg-lavender py-14 sm:py-16" aria-labelledby="related-h">
          <div className="container-x">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 id="related-h" className="text-3xl font-extrabold">More cleaning guides</h2>
              <Link href="/cleaning-guides" className="font-display font-semibold text-violet underline underline-offset-4">All guides</Link>
            </div>
            <ul className="reveal-stagger mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => <li key={r.slug}><GuideCard guide={r} /></li>)}
            </ul>
          </div>
        </section>
      )}

      <CtaBand title="Ready for a beautifully clean home?" body="Tell us about your home and we'll send a clear, written price." href="/quote" cta="Get My Free Quote" id={`guide_band_${g.slug}`} />
    </>
  );
}
