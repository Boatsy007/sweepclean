import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getService, services } from "@/lib/services";
import { areas, getArea } from "@/lib/areas";
import { site, siteUrl, trustLabel } from "@/lib/site";
import { suburbPath, suburbsIn } from "@/lib/suburbs";
import { guides, guidePath, readingTime } from "@/lib/guides";
import { anchorLabel, getServiceArea, serviceAreaPath, serviceAreas, titleLabel, topSuburbs } from "@/lib/serviceAreas";
import { breadcrumbSchema, faqSchema } from "@/lib/schema";
import { pageMeta } from "@/lib/seo";
import { servicePhotos } from "@/lib/photos";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CtaBand } from "@/components/CtaBand";
import { Faqs } from "@/components/Faqs";
import { Icon } from "@/components/Icon";
import { JsonLd } from "@/components/JsonLd";
import { ServiceVisual } from "@/components/ServiceVisual";
import { TrackedLink } from "@/components/TrackedLink";

/*
 * Service × area landing page, e.g. /services/bond-cleaning/brisbane.
 * Answers the "hire" search for one service in one area. Content comes from src/lib/serviceAreas.ts;
 * the checklist and process are the service's own. Prices stay in the guides (linked, not repeated).
 */

type Props = { params: Promise<{ slug: string; area: string }> };

export function generateStaticParams() {
  return Object.entries(serviceAreas).flatMap(([slug, m]) => Object.keys(m).map((area) => ({ slug, area })));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, area } = await params;
  const s = getService(slug);
  const a = getArea(area);
  const c = getServiceArea(slug, area);
  if (!s || !a || !c) return {};
  return pageMeta({
    title: `${titleLabel[slug]} ${a.name} | Swept Cleaning`,
    description: c.description,
    path: serviceAreaPath(slug, area),
    image: servicePhotos[slug],
  });
}

export default async function ServiceAreaPage({ params }: Props) {
  const { slug, area } = await params;
  const s = getService(slug);
  const a = getArea(area);
  const c = getServiceArea(slug, area);
  if (!s || !a || !c) notFound();

  const path = serviceAreaPath(slug, area);
  // Natural phrasing: "on the Gold Coast", "in Brisbane"; "for the Gold Coast", "for Logan".
  const at = a.slug === "gold-coast" ? "on the Gold Coast" : `in ${a.name}`;
  const of = a.slug === "gold-coast" ? "the Gold Coast" : a.name;
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: s.name, path: `/services/${s.slug}` },
    { name: a.name, path },
  ];
  const best = topSuburbs(slug, area, 8);
  const all = suburbsIn(area);
  const quoteHref = `/quote?service=${s.slug}`;
  // Guides for this service: ones written for this area first, then general ones (never another area's).
  const related = guides
    .filter((g) => g.services?.includes(slug) && (!g.areas || g.areas.includes(area)))
    .sort((x, y) => Number(!!y.areas?.includes(area)) - Number(!!x.areas?.includes(area)))
    .slice(0, 4);
  const otherAreas = areas.filter((x) => x.slug !== area && serviceAreas[slug]?.[x.slug]);
  const otherServices = services.filter((x) => x.slug !== slug && serviceAreas[x.slug]?.[area]);
  const faqs = [...c.faqs, ...s.faqs.slice(0, 2)];

  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${siteUrl()}${path}#service`,
    name: `${s.name} ${at}`,
    serviceType: s.name,
    description: c.description,
    url: `${siteUrl()}${path}`,
    provider: { "@id": `${siteUrl()}/#business` },
    areaServed: [
      { "@type": a.state === "NSW" ? "Place" : "City", name: `${a.name}, ${a.state === "NSW" ? "New South Wales" : "Queensland"}` },
      ...all.map((x) => ({ "@type": "Place", name: `${x.name} ${a.state} ${x.postcode}` })),
    ],
    isRelatedTo: { "@type": "Service", name: s.name, url: `${siteUrl()}/services/${s.slug}` },
  };

  return (
    <>
      <JsonLd data={[schema, faqSchema(faqs), breadcrumbSchema(crumbs)]} />

      <section className="bg-gradient-to-b from-white to-lavender/60">
        <div className="container-x grid gap-10 pb-14 pt-8 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:pb-20 lg:pt-12">
          <div>
            <Breadcrumbs items={crumbs} />
            <p className="eyebrow">{s.name} · {a.name} {a.state}</p>
            <h1 className="mt-3 text-4xl font-extrabold leading-[1.05] sm:text-5xl">{titleLabel[slug]} {at}</h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed">{c.intro}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <TrackedLink cta={`service_area_hero_${slug}_${area}`} href={quoteHref} className="btn-primary !min-h-14 !px-8 text-lg">Get a free quote <Icon name="arrow" className="size-5" /></TrackedLink>
              <a href="#checklist" className="btn-outline !min-h-14">What&apos;s included</a>
            </div>
            <p className="mt-4 text-sm">Written quote {site.quoteResponse}{trustLabel() ? ` · ${trustLabel()}` : ""} · {all.length} {a.name} suburbs</p>
          </div>
          <div className="reveal-zoom overflow-hidden rounded-[2rem] border border-lilac shadow-lift">
            <ServiceVisual service={s} priority sizes="(min-width: 1200px) 520px, (min-width: 1024px) 45vw, 100vw" className="aspect-[5/3.4] w-full" />
          </div>
        </div>
      </section>

      <section className="container-x py-16" aria-labelledby="local-h">
        <h2 id="local-h" className="text-3xl font-extrabold sm:text-[2.5rem]">{s.name} {at}: what we plan for</h2>
        <ul className="reveal-stagger mt-8 grid gap-5 md:grid-cols-3">
          {c.notes.map((n) => (
            <li key={n.title} className="card p-6">
              <h3 className="text-lg font-bold">{n.title}</h3>
              <p className="mt-2 leading-relaxed">{n.body}</p>
            </li>
          ))}
        </ul>
      </section>

      <section id="checklist" className="scroll-mt-24 bg-lavender py-16 sm:py-20" aria-labelledby="check-h">
        <div className="container-x">
          <h2 id="check-h" className="text-3xl font-extrabold sm:text-[2.5rem]">What&apos;s included</h2>
          <p className="mt-3 max-w-2xl text-lg">The same room-by-room checklist we use across {of}. Tell us your priorities and anything to skip.</p>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {s.checklist.map((g) => (
              <div key={g.room} className="card p-6">
                <h3 className="text-lg font-bold">{g.room}</h3>
                <ul className="mt-4 space-y-2.5 text-[0.95rem]">
                  {g.items.map((i) => <li key={i} className="flex gap-2.5"><Icon name="check" className="mt-0.5 size-5 shrink-0 text-violet" />{i}</li>)}
                </ul>
              </div>
            ))}
          </div>
          <p className="mt-6"><Link href={`/services/${s.slug}`} className="font-semibold text-violet-ink underline underline-offset-2">More about {s.name.toLowerCase()}</Link> – who it suits, how pricing works and how it runs.</p>
        </div>
      </section>

      <section className="container-x py-16" aria-labelledby="where-h">
        <h2 id="where-h" className="text-3xl font-extrabold">Where we offer {s.name.toLowerCase()} {at}</h2>
        <p className="mt-3 max-w-2xl text-lg">All {all.length} {a.name} suburbs we clean. Suburbs where it&apos;s a particularly good fit:</p>
        <ul className="mt-6 grid gap-x-6 gap-y-2.5 sm:grid-cols-2 lg:grid-cols-4">
          {best.map((x) => (
            <li key={x.slug}><Link href={suburbPath(x)} className="inline-flex items-center gap-2 font-medium text-navy underline decoration-lilac underline-offset-4 hover:text-violet hover:decoration-violet"><Icon name="pin" className="size-4 shrink-0 text-violet" />{anchorLabel[slug]} in {x.name}</Link></li>
          ))}
        </ul>
        <p className="mt-5"><Link href={`/areas/${a.slug}`} className="font-semibold text-violet underline underline-offset-2">See all {a.name} suburbs</Link></p>
      </section>

      {related.length > 0 && (
        <section className="container-x pb-16" aria-labelledby="sa-guides-h">
          <h2 id="sa-guides-h" className="text-2xl font-extrabold">Prices and advice for {of}</h2>
          <ul className="mt-5 grid gap-4 md:grid-cols-2">
            {related.map((g) => (
              <li key={g.slug}>
                <Link href={guidePath(g.slug)} className="card group flex h-full flex-col p-5 hover:shadow-lift">
                  <span className="font-display font-bold leading-snug text-navy group-hover:text-violet">{g.title}</span>
                  <span className="mt-1.5 text-[0.95rem]">{g.description}</span>
                  <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-violet">Read guide · {readingTime(g)} min <Icon name="arrow" className="size-4" /></span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="container-x grid gap-8 pb-16 lg:grid-cols-[0.8fr_2fr]" aria-labelledby="sa-faq-h">
        <h2 id="sa-faq-h" className="text-3xl font-extrabold">{titleLabel[slug]} {a.name}: FAQs</h2>
        <Faqs faqs={faqs} />
      </section>

      <section className="container-x pb-4" aria-labelledby="sa-more-h">
        <h2 id="sa-more-h" className="text-2xl font-extrabold">More from Swept</h2>
        <div className="mt-5 grid gap-8 lg:grid-cols-2">
          <div>
            <h3 className="font-display font-semibold text-navy">{s.name} in other areas</h3>
            <ul className="mt-3 flex flex-wrap gap-2.5">
              {otherAreas.map((x) => (
                <li key={x.slug}><Link href={serviceAreaPath(slug, x.slug)} className="inline-flex items-center gap-2 rounded-full border border-lilac bg-white px-4 py-2 font-medium text-navy hover:border-violet"><Icon name="pin" className="size-4 text-violet" />{titleLabel[slug]} {x.name}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-display font-semibold text-navy">Other services {at}</h3>
            <ul className="mt-3 flex flex-wrap gap-2.5">
              {otherServices.map((x) => (
                <li key={x.slug}><Link href={serviceAreaPath(x.slug, area)} className="inline-flex items-center gap-2 rounded-full border border-lilac bg-white px-4 py-2 font-medium text-navy hover:border-violet"><Icon name={x.icon} className="size-4 text-violet" />{titleLabel[x.slug]} {a.name}</Link></li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <CtaBand title={`${titleLabel[slug]} ${at}, done properly.`} body="Tell us about your home or workplace and we'll send a clear, written price." href={quoteHref} id={`sa_band_${slug}_${area}`} />
    </>
  );
}
