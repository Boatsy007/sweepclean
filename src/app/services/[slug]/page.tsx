import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getService, services } from "@/lib/services";
import { areas } from "@/lib/areas";
import { site, trustLabel } from "@/lib/site";
import { breadcrumbSchema, faqSchema, serviceSchema } from "@/lib/schema";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Faqs } from "@/components/Faqs";
import { CtaBand } from "@/components/CtaBand";
import { Icon } from "@/components/Icon";
import { JsonLd } from "@/components/JsonLd";
import { ServiceVisual } from "@/components/ServiceVisual";
import { TrackedLink } from "@/components/TrackedLink";
import { pageMeta } from "@/lib/seo";
import { servicePhotos } from "@/lib/photos";
import { suburbPath, suburbsIn, type Suburb } from "@/lib/suburbs";
import { profilesFor, type ProfileKey } from "@/lib/localProfiles";
import { guides, guidePath, readingTime } from "@/lib/guides";

/** Which local home types make a suburb most relevant to each service (from each suburb's housing note). */
const serviceFit: Record<string, ProfileKey[]> = {
  "regular-house-cleaning": ["family", "acreage", "leafy", "hillside"],
  "deep-cleaning": ["newbuild", "character", "prestige", "waterside"],
  "ndis-cleaning": ["seniors", "family"],
  "bond-cleaning": ["rentals", "apartment"],
  "airbnb-cleaning": ["coastal", "apartment", "waterside"],
  "carpet-cleaning": ["rentals", "family", "acreage"],
  "commercial-cleaning": ["apartment", "rentals"],
};
const anchorLabel: Record<string, string> = {
  "regular-house-cleaning": "House cleaning", "deep-cleaning": "Deep cleaning", "ndis-cleaning": "NDIS cleaning",
  "bond-cleaning": "Bond cleaning", "airbnb-cleaning": "Airbnb cleaning", "carpet-cleaning": "Carpet cleaning", "commercial-cleaning": "Office cleaning",
};
function topSuburbs(service: string, area: string, n = 5): Suburb[] {
  const fit = serviceFit[service] ?? [];
  return suburbsIn(area)
    .map((x, i) => ({ x, i, score: profilesFor(x).filter((k) => fit.includes(k)).length }))
    .sort((p, q) => q.score - p.score || p.i - q.i)
    .slice(0, n)
    .map((p) => p.x);
}

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const s = getService((await params).slug);
  if (!s) return {};
  return pageMeta({ title: s.metaTitle, description: s.metaDescription, path: `/services/${s.slug}`, image: servicePhotos[s.slug] });
}

export default async function ServicePage({ params }: Props) {
  const s = getService((await params).slug);
  if (!s) notFound();
  const crumbs = [{ name: "Home", path: "/" }, { name: "Services", path: "/services" }, { name: s.name, path: `/services/${s.slug}` }];
  const others = services.filter((o) => o.slug !== s.slug);
  const quoteHref = `/quote?service=${s.slug}`;

  return (
    <>
      <JsonLd data={[serviceSchema(s), faqSchema(s.faqs), breadcrumbSchema(crumbs)]} />

      <section className="bg-gradient-to-b from-white to-lavender/60">
        <div className="container-x grid gap-10 pb-14 pt-8 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:pb-20 lg:pt-12">
          <div>
            <Breadcrumbs items={crumbs} />
            <p className="eyebrow">{s.bestFor}</p>
            <h1 className="mt-3 text-4xl font-extrabold leading-[1.05] sm:text-5xl">{s.h1}</h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed">{s.intro}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <TrackedLink cta={`service_hero_${s.slug}`} href={quoteHref} className="btn-primary !min-h-14 !px-8 text-lg">Get a free quote <Icon name="arrow" className="size-5" /></TrackedLink>
              <a href="#checklist" className="btn-outline !min-h-14">What&apos;s included</a>
            </div>
            <p className="mt-4 text-sm">Written quote {site.quoteResponse}{trustLabel() ? ` · ${trustLabel()}` : ""} · Brisbane, Logan, Gold Coast &amp; Tweed Heads</p>
          </div>
          <div className="reveal-zoom overflow-hidden rounded-[2rem] border border-lilac shadow-lift">
            <ServiceVisual service={s} priority sizes="(min-width: 1200px) 520px, (min-width: 1024px) 45vw, 100vw" className="aspect-[5/3.4] w-full" />
          </div>
        </div>
      </section>

      {s.availability && (
        <div className="container-x -mt-6 relative">
          <p className="flex gap-3 rounded-2xl border border-lilac bg-white px-5 py-4 text-[0.95rem] shadow-soft"><Icon name="shield" className="size-6 shrink-0 text-violet" />{s.availability}</p>
        </div>
      )}

      <section className="container-x grid gap-10 py-16 lg:grid-cols-2 lg:gap-16" aria-labelledby="suits-h">
        <div>
          <h2 id="suits-h" className="text-3xl font-extrabold">Who it&apos;s for</h2>
          <ul className="mt-6 space-y-3.5">
            {s.suits.map((t) => <li key={t} className="flex gap-3 text-lg"><Icon name="checkCircle" className="mt-0.5 size-6 shrink-0 text-violet" />{t}</li>)}
          </ul>
        </div>
        <div>
          <h2 className="text-3xl font-extrabold">How pricing works</h2>
          <p className="mt-4 text-lg">Every home is different, so every quote is too. Your price is based on:</p>
          <ul className="mt-4 space-y-3">
            {s.pricing.map((t) => <li key={t} className="flex gap-3"><span className="mt-2.5 size-2 shrink-0 rounded-full bg-violet" />{t}</li>)}
          </ul>
          <p className="mt-5">You&apos;ll get a written price for the agreed scope before anything is booked.</p>
        </div>
      </section>

      <section id="checklist" className="scroll-mt-24 bg-lavender py-16 sm:py-20" aria-labelledby="check-h">
        <div className="container-x">
          <h2 id="check-h" className="text-3xl font-extrabold sm:text-[2.5rem]">What&apos;s included in {s.name.toLowerCase()}</h2>
          <p className="mt-3 max-w-2xl text-lg">Our room-by-room checklist. Tell us your priorities and anything to skip – we&apos;ll tailor it to your home.</p>
          <div className="reveal-stagger mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {s.checklist.map((g) => (
              <div key={g.room} className="card p-6">
                <h3 className="text-lg font-bold">{g.room}</h3>
                <ul className="mt-4 space-y-2.5 text-[0.95rem]">
                  {g.items.map((i) => <li key={i} className="flex gap-2.5"><Icon name="check" className="mt-0.5 size-5 shrink-0 text-violet" />{i}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-x py-16 sm:py-20" aria-labelledby="steps-h">
        <h2 id="steps-h" className="text-3xl font-extrabold sm:text-[2.5rem]">How it works</h2>
        <ol className="reveal-stagger mt-8 grid gap-5 sm:grid-cols-3">
          {s.steps.map((st, i) => (
            <li key={st.title} className="card p-6">
              <span className="grid size-10 place-items-center rounded-full bg-violet font-display text-lg font-bold text-white">{i + 1}</span>
              <h3 className="mt-4 text-lg font-bold">{st.title}</h3>
              <p className="mt-1.5 leading-relaxed">{st.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="container-x grid gap-8 lg:grid-cols-[0.8fr_2fr]" aria-labelledby="sfaq-h">
        <div>
          <h2 id="sfaq-h" className="text-3xl font-extrabold">{s.name}: common questions</h2>
          <TrackedLink cta={`service_faq_${s.slug}`} href={quoteHref} className="btn-primary mt-6">Get a free quote <Icon name="arrow" className="size-4" /></TrackedLink>
        </div>
        <Faqs faqs={s.faqs} />
      </section>

      {(() => {
        const related = guides.filter((g) => g.services?.includes(s.slug)).slice(0, 6);
        if (!related.length) return null;
        return (
          <section className="container-x pt-16" aria-labelledby="sguides-h">
            <h2 id="sguides-h" className="text-2xl font-extrabold">Helpful guides about {s.name.toLowerCase()}</h2>
            <ul className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {related.map((g) => (
                <li key={g.slug}>
                  <Link href={guidePath(g.slug)} className="card group flex h-full flex-col p-5 hover:shadow-lift">
                    <span className="font-display font-bold leading-snug text-navy group-hover:text-violet">{g.title}</span>
                    <span className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-violet">Read guide · {readingTime(g)} min <Icon name="arrow" className="size-4" /></span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        );
      })()}

      <section className="container-x py-16" aria-labelledby="where-h">
        <h2 id="where-h" className="text-2xl font-extrabold">{s.name} near you</h2>
        <p className="mt-2 max-w-2xl">Available across Brisbane, Logan, the Gold Coast and Tweed Heads. Suburbs where {s.name.toLowerCase()} is a particularly good fit:</p>
        <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {areas.map((a) => (
            <li key={a.slug} className="card p-5">
              <Link href={`/areas/${a.slug}`} className="inline-flex items-center gap-2 font-display text-lg font-bold text-navy hover:text-violet"><Icon name="pin" className="size-5 text-violet" />{a.name}</Link>
              <ul className="mt-3 space-y-1.5 text-[0.95rem]">
                {topSuburbs(s.slug, a.slug).map((x) => (
                  <li key={x.slug}><Link href={suburbPath(x)} className="text-slate underline decoration-lilac underline-offset-2 hover:text-violet hover:decoration-violet">{anchorLabel[s.slug] ?? s.name} in {x.name}</Link></li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
        <h2 className="mt-12 text-2xl font-extrabold">Other services</h2>
        <ul className="reveal-stagger mt-5 grid gap-4 sm:grid-cols-3">
          {others.map((o) => (
            <li key={o.slug}>
              <Link href={`/services/${o.slug}`} className="card flex items-center gap-4 p-5 hover:shadow-lift">
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-lavender text-violet"><Icon name={o.icon} className="size-6" /></span>
                <span><span className="block font-display font-semibold text-navy">{o.name}</span><span className="block text-sm">{o.bestFor}</span></span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <CtaBand title={`Ready for your ${s.name.toLowerCase()} quote?`} body="Tell us about your home in about two minutes and we'll send a clear, written price." href={quoteHref} cta="Get my free quote" id={`service_band_${s.slug}`} />
    </>
  );
}
