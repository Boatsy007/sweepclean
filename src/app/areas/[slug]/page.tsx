import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { areas, getArea } from "@/lib/areas";
import { services } from "@/lib/services";
import { siteUrl } from "@/lib/site";
import { breadcrumbSchema, faqSchema } from "@/lib/schema";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CtaBand } from "@/components/CtaBand";
import { Faqs } from "@/components/Faqs";
import { Icon } from "@/components/Icon";
import { JsonLd } from "@/components/JsonLd";
import { QuickStart } from "@/components/QuickStart";
import { suburbPath, suburbsIn } from "@/lib/suburbs";

type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() {
  return areas.map((a) => ({ slug: a.slug }));
}
export const dynamicParams = false;

const anchor = (s: string) => s.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const a = getArea((await params).slug);
  if (!a) return {};
  return { title: { absolute: a.metaTitle }, description: a.metaDescription, alternates: { canonical: `/areas/${a.slug}` }, openGraph: { title: a.metaTitle, description: a.metaDescription, url: `/areas/${a.slug}` } };
}

export default async function AreaPage({ params }: Props) {
  const a = getArea((await params).slug);
  if (!a) notFound();
  const crumbs = [{ name: "Home", path: "/" }, { name: "Areas", path: "/areas" }, { name: a.name, path: `/areas/${a.slug}` }];
  const list = suburbsIn(a.slug);
  const groups = [...new Set(list.map((sb) => sb.group))].map((g) => ({ name: g, suburbs: list.filter((sb) => sb.group === g) }));
  const placeSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `House cleaning in ${a.name}`,
    serviceType: "House cleaning",
    provider: { "@id": `${siteUrl()}/#business` },
    areaServed: suburbsIn(a.slug).map((sb) => ({ "@type": "Place", name: `${sb.name} ${a.state} ${sb.postcode}`, url: `${siteUrl()}${suburbPath(sb)}` })),
    url: `${siteUrl()}/areas/${a.slug}`,
  };
  return (
    <>
      <JsonLd data={[placeSchema, faqSchema(a.faqs), breadcrumbSchema(crumbs)]} />
      <section className="bg-gradient-to-b from-white to-lavender/60">
        <div className="container-x pb-14 pt-8 lg:pb-20 lg:pt-12">
          <Breadcrumbs items={crumbs} />
          <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-end">
            <div>
              <p className="eyebrow">{a.state === "NSW" ? "Across the border · NSW" : "South East Queensland"}</p>
              <h1 className="mt-3 text-4xl font-extrabold leading-[1.05] sm:text-5xl">{a.h1}</h1>
              <p className="mt-5 max-w-xl text-lg leading-relaxed">{a.intro}</p>
              <QuickStart id={`area_${a.slug}`} />
            </div>
            <nav aria-label={`Services in ${a.name}`} className="card p-6">
              <h2 className="text-lg font-bold">Services in {a.name}</h2>
              <ul className="mt-3 divide-y divide-lilac">
                {services.map((s) => (
                  <li key={s.slug}><Link href={`/services/${s.slug}`} className="flex items-center gap-3 py-3 font-medium text-navy hover:text-violet"><Icon name={s.icon} className="size-5 text-violet" />{s.name}<Icon name="arrow" className="ml-auto size-4" /></Link></li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </section>

      <section className="container-x py-16" aria-labelledby="local-h">
        <h2 id="local-h" className="text-3xl font-extrabold sm:text-[2.5rem]">Cleaning homes in {a.name}: what we look out for</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {a.notes.map((n) => (
            <div key={n.title} className="card p-6">
              <h3 className="text-lg font-bold">{n.title}</h3>
              <p className="mt-2 leading-relaxed">{n.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-lavender py-16" aria-labelledby="suburbs-h">
        <div className="container-x">
          <h2 id="suburbs-h" className="text-3xl font-extrabold">Suburbs we clean in {a.name}</h2>
          <p className="mt-3 max-w-2xl">Choose your suburb for local cleaning details and a quote form ready to go. Don&apos;t see yours? Request a quote and we&apos;ll confirm.</p>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {groups.map((g) => (
              <div key={g.name} id={anchor(g.name)} className="card scroll-mt-24 p-6">
                <h3 className="flex items-center gap-2 text-lg font-bold"><Icon name="pin" className="size-5 text-violet" />{g.name}</h3>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {g.suburbs.map((sb) => (
                    <li key={sb.slug}>
                      <Link href={suburbPath(sb)} className="inline-flex rounded-full bg-lavender px-3 py-1 text-sm font-medium text-violet-ink underline-offset-2 transition-colors hover:bg-violet hover:text-white focus-visible:bg-violet focus-visible:text-white">
                        {sb.name}<span className="sr-only"> house cleaning</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-x grid gap-8 py-16 lg:grid-cols-[0.8fr_2fr]" aria-labelledby="afaq-h">
        <div>
          <h2 id="afaq-h" className="text-3xl font-extrabold">{a.name} cleaning FAQs</h2>
          <p className="mt-3"><Link href="/faq" className="font-semibold text-violet underline underline-offset-4">More questions</Link></p>
        </div>
        <Faqs faqs={a.faqs} />
      </section>

      <section className="container-x" aria-label="Other areas">
        <p className="font-display font-semibold text-navy">Other areas we clean:</p>
        <ul className="mt-3 flex flex-wrap gap-3">
          {areas.filter((o) => o.slug !== a.slug).map((o) => (
            <li key={o.slug}><Link href={`/areas/${o.slug}`} className="inline-flex rounded-full border-2 border-lilac bg-white px-5 py-2 font-medium text-navy hover:border-violet">House cleaning {o.name}</Link></li>
          ))}
        </ul>
      </section>

      <CtaBand title={`Get a cleaning quote in ${a.name}`} body="Tell us about your home and we'll send a clear, written price." id={`area_band_${a.slug}`} />
    </>
  );
}
