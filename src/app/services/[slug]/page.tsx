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

      <section className="container-x py-16" aria-labelledby="where-h">
        <h2 id="where-h" className="text-2xl font-extrabold">{s.name} near you</h2>
        <ul className="mt-5 flex flex-wrap gap-3">
          {areas.map((a) => (
            <li key={a.slug}><Link href={`/areas/${a.slug}`} className="inline-flex items-center gap-2 rounded-full border-2 border-lilac bg-white px-5 py-2.5 font-medium text-navy hover:border-violet"><Icon name="pin" className="size-4 text-violet" />{a.name}</Link></li>
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
