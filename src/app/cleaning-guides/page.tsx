import type { Metadata } from "next";
import Link from "next/link";
import { allCategories, guidePath, guides } from "@/lib/guides";
import { breadcrumbSchema } from "@/lib/schema";
import { pageMeta } from "@/lib/seo";
import { siteUrl } from "@/lib/site";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CtaBand } from "@/components/CtaBand";
import { GuideCard } from "@/components/GuideCard";
import { GuideGrid, GuideTopicProvider, TopicChips } from "@/components/GuideFilter";
import { Icon } from "@/components/Icon";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  ...pageMeta({
    title: "Cleaning Guides & Advice | Swept Cleaning",
    description: "Helpful tips, practical advice and answers to your house cleaning questions from Swept Cleaning – Brisbane, Logan, the Gold Coast and Tweed Heads.",
    path: "/cleaning-guides",
  }),
  // Kept out of search results until the first guide is published (an empty listing is thin content).
  ...(guides.length === 0 ? { robots: { index: false, follow: true } } : {}),
};

export default function CleaningGuides() {
  const crumbs = [{ name: "Home", path: "/" }, { name: "Cleaning Guides", path: "/cleaning-guides" }];
  const categories = allCategories();
  const counts = Object.fromEntries(categories.map((c) => [c, guides.filter((g) => g.categories.includes(c)).length]));
  const collection = guides.length
    ? {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "Cleaning Guides & Advice",
        url: `${siteUrl()}/cleaning-guides`,
        publisher: { "@id": `${siteUrl()}/#business` },
        mainEntity: {
          "@type": "ItemList",
          itemListElement: guides.map((g, i) => ({ "@type": "ListItem", position: i + 1, url: `${siteUrl()}${guidePath(g.slug)}`, name: g.title })),
        },
      }
    : null;

  return (
    <>
      <JsonLd data={collection ? [collection, breadcrumbSchema(crumbs)] : breadcrumbSchema(crumbs)} />

      <GuideTopicProvider topics={categories}>
      <section className="bg-gradient-to-b from-white to-lavender/70">
        <div className="container-x pb-12 pt-8 lg:pb-16 lg:pt-12">
          <Breadcrumbs items={crumbs} />
          <p className="eyebrow">Cleaning guides</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-extrabold leading-[1.05] sm:text-5xl">Cleaning Guides &amp; Advice</h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed">Helpful tips, practical advice and answers to your house cleaning questions.</p>
          {categories.length > 0 && <TopicChips topics={categories} counts={counts} total={guides.length} />}
        </div>
      </section>

      <section className="container-x py-12 sm:py-16" aria-label="Guides">
        {guides.length > 0 ? (
          <GuideGrid items={guides.map((g, i) => ({ slug: g.slug, categories: g.categories, card: <GuideCard guide={g} priority={i === 0} /> }))} />
        ) : (
          <div className="card mx-auto max-w-3xl px-6 py-12 text-center sm:px-12">
            <span className="mx-auto grid size-16 place-items-center rounded-2xl bg-lavender text-violet"><Icon name="doc" className="size-8" /></span>
            <h2 className="mt-5 text-2xl font-extrabold sm:text-3xl">Our first guides are on their way</h2>
            <p className="mx-auto mt-3 max-w-xl text-lg leading-relaxed">
              We&apos;re putting together practical, easy-to-follow cleaning advice for homes across Brisbane, Logan, the Gold Coast and Tweed Heads. In the meantime, our FAQs answer the questions we&apos;re asked most.
            </p>
            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/faq" className="btn-primary">Read our FAQs <Icon name="arrow" className="size-4" /></Link>
              <Link href="/services" className="btn-outline">Explore our services</Link>
            </div>
          </div>
        )}
      </section>
      </GuideTopicProvider>

      <CtaBand title="Ready for a beautifully clean home?" body="Tell us about your home and we'll send a clear, written price." href="/quote" cta="Get My Free Quote" id="guides_index_band" />
    </>
  );
}
