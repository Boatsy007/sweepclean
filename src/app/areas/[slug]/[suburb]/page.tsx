import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { areaFor, getSuburb, nearby, stateName, suburbPath, suburbs, suburbsIn } from "@/lib/suburbs";
import { services } from "@/lib/services";
import { site, siteUrl, trustLabel } from "@/lib/site";
import { breadcrumbSchema, faqSchema } from "@/lib/schema";
import type { Faq } from "@/lib/services";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CtaBand } from "@/components/CtaBand";
import { Faqs } from "@/components/Faqs";
import { HeroQuoteForm } from "@/components/HeroQuoteForm";
import { Icon } from "@/components/Icon";
import { JsonLd } from "@/components/JsonLd";
import { pageMeta } from "@/lib/seo";
import { AreaGuides } from "@/components/AreaGuides";

type Props = { params: Promise<{ slug: string; suburb: string }> };

export function generateStaticParams() {
  return suburbs.map((s) => ({ slug: s.area, suburb: s.slug }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, suburb } = await params;
  const s = getSuburb(slug, suburb);
  if (!s) return {};
  const a = areaFor(s);
  return pageMeta({
    title: `House Cleaning ${s.name} ${s.postcode} | Swept Cleaning`,
    description: `House cleaning in ${s.name} ${a.state} ${s.postcode}: weekly, fortnightly or monthly cleans, deep cleans and bond cleaning. No lock-in contract. Free written quote.`,
    path: suburbPath(s),
  });
}

export default async function SuburbPage({ params }: Props) {
  const { slug, suburb } = await params;
  const s = getSuburb(slug, suburb);
  if (!s) notFound();
  const a = areaFor(s);
  const near = nearby(s);
  const nsw = a.state === "NSW";
  const path = suburbPath(s);
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Areas", path: "/areas" },
    { name: a.name, path: `/areas/${a.slug}` },
    { name: s.name, path },
  ];

  const faqs: Faq[] = [
    {
      q: `Do you clean homes in ${s.name}?`,
      a: `Yes. Swept cleans houses, townhouses and apartments in ${s.name} ${a.state} ${s.postcode}, along with nearby suburbs such as ${near.slice(0, 3).map((n) => n.name).join(", ")}. Request a quote online and we'll confirm your booking.`,
    },
    {
      q: `How much does house cleaning cost in ${s.name}?`,
      a: `Every home is different, so we quote each one. The price depends on the number of bedrooms and bathrooms, how often you'd like us to visit, the home's current condition and any extras such as inside the oven. You'll get a written price ${site.quoteResponse}, before anything is booked.`,
    },
    {
      q: `Do you offer bond cleaning in ${s.name}?`,
      a: nsw
        ? `Yes. ${s.name} is in NSW, so end-of-lease cleans are checked against the condition report you signed at the start of your lease under NSW tenancy rules. Send it with your quote request and we'll clean the property room by room against it.`
        : `Yes. In Queensland your entry condition report (Form 1a) is compared with the exit condition report (Form 14a) when you move out. We clean the ${s.name} property room by room against your entry report – send it with your quote request.`,
    },
    {
      q: `What kinds of homes do you clean in ${s.name}?`,
      a: `${s.note} Whatever the home, we work from a written room-by-room checklist and tailor it to your priorities, weekly, fortnightly or monthly.`,
    },
    {
      q: `Which council area is ${s.name} in?`,
      a: `${s.name} (postcode ${s.postcode}) is in the ${s.council} area${nsw ? ", New South Wales, just across the border from Coolangatta" : `, ${stateName(a.state)}`}. ${nsw ? "From October to April NSW runs on daylight saving time, so we confirm your booking in NSW time." : `We clean right across ${a.name}.`}`,
    },
  ];

  const placeSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${siteUrl()}${path}#service`,
    name: `House cleaning in ${s.name}`,
    serviceType: "House cleaning",
    description: `Regular, deep, NDIS, bond, Airbnb, carpet and commercial cleaning in ${s.name} ${a.state} ${s.postcode}.`,
    url: `${siteUrl()}${path}`,
    provider: { "@id": `${siteUrl()}/#business` },
    areaServed: {
      "@type": "Place",
      name: `${s.name}, ${stateName(a.state)}`,
      address: { "@type": "PostalAddress", addressLocality: s.name, postalCode: s.postcode, addressRegion: a.state, addressCountry: "AU" },
      containedInPlace: { "@type": "AdministrativeArea", name: s.council },
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: `Cleaning services in ${s.name}`,
      itemListElement: services.map((sv) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: `${sv.name} in ${s.name}`, url: `${siteUrl()}/services/${sv.slug}` } })),
    },
  };

  const facts: [string, React.ReactNode][] = [
    ["Suburb", `${s.name}, ${stateName(a.state)}`],
    ["Postcode", s.postcode],
    ["Council", s.council],
    ["Region", <Link key="r" href={`/areas/${a.slug}`} className="font-semibold text-violet underline underline-offset-2">{a.name}</Link>],
    ["Services", "Regular, deep, NDIS & home care, bond, Airbnb, carpet and commercial cleaning"],
    ["Visit frequency", "Weekly, fortnightly, monthly or one-off"],
    ["Quote turnaround", `Written quote ${site.quoteResponse}`],
    ["Bond cleaning standard", nsw ? "NSW condition report" : "QLD RTA Form 1a / Form 14a"],
  ];

  return (
    <>
      <JsonLd data={[placeSchema, faqSchema(faqs), breadcrumbSchema(crumbs)]} />

      <section className="bg-gradient-to-b from-white to-lavender/70">
        <div className="container-x grid gap-10 pb-14 pt-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start lg:pb-20 lg:pt-12">
          <div>
            <Breadcrumbs items={crumbs} />
            <p className="eyebrow">{s.name} {a.state} {s.postcode} · {s.council}</p>
            <h1 className="mt-3 text-4xl font-extrabold leading-[1.05] sm:text-5xl">House cleaning in {s.name}</h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed">
              Swept offers regular, deep, NDIS, bond, Airbnb and carpet cleaning for homes in {s.name} and the surrounding {s.group === s.name ? a.name : s.group} suburbs, plus commercial cleaning for local businesses. Choose weekly, fortnightly or monthly visits – no lock-in contract.
            </p>
            <div className="mt-6 rounded-2xl border border-lilac bg-white p-5 shadow-soft">
              <h2 className="flex items-center gap-2 text-lg font-bold"><Icon name="home" className="size-5 text-violet" />Homes in {s.name}</h2>
              <p className="mt-2 leading-relaxed">{s.note}</p>
            </div>
            <ul className="mt-6 grid gap-2.5 text-[0.98rem] font-medium text-navy sm:grid-cols-2">
              {["Free, no-obligation quote", "No lock-in contracts", "Same checklist every visit", trustLabel() ?? `Reply ${site.quoteResponse}`].map((t) => (
                <li key={t} className="flex items-center gap-2"><Icon name="checkCircle" className="size-5 shrink-0 text-violet" />{t}</li>
              ))}
            </ul>
          </div>
          <HeroQuoteForm defaultSuburb={`${s.name} ${s.postcode}`} title={`Get a quote in ${s.name}`} />
        </div>
      </section>

      <section className="container-x grid gap-10 py-16 lg:grid-cols-[1fr_1.1fr]" aria-labelledby="glance-h">
        <div>
          <h2 id="glance-h" className="text-3xl font-extrabold">{s.name} at a glance</h2>
          <dl className="reveal mt-6 divide-y divide-lilac overflow-hidden rounded-[var(--radius-card)] border border-lilac bg-white">
            {facts.map(([k, v]) => (
              <div key={k} className="grid grid-cols-[9.5rem_1fr] gap-4 px-5 py-3.5 sm:grid-cols-[12rem_1fr]">
                <dt className="font-display font-semibold text-navy">{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="lg:pt-16">
          <div className="card p-6">
            <h2 className="text-xl font-bold">Cleaning across {a.name}</h2>
            <p className="mt-2 leading-relaxed">{s.name} is one of {suburbsIn(a.slug).length} {a.name} suburbs we clean. For what we look out for in {a.name} homes – from {a.notes.map((n) => n.title.toLowerCase()).slice(0, 2).join(" to ")} – see our <Link href={`/areas/${a.slug}`} className="font-semibold text-violet underline underline-offset-2">{a.name} cleaning guide</Link>.</p>
          </div>
        </div>
      </section>

      <section className="bg-lavender py-16" aria-labelledby="svc-h">
        <div className="container-x">
          <h2 id="svc-h" className="text-3xl font-extrabold sm:text-[2.4rem]">Cleaning services in {s.name}</h2>
          <ul className="reveal-stagger mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((sv) => (
              <li key={sv.slug} className="card flex flex-col p-6">
                <Icon name={sv.icon} className="size-8 text-violet" />
                <h3 className="mt-3 text-lg font-bold">{sv.name} in {s.name}</h3>
                <span className="flex-1" />
                <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-sm font-semibold">
                  <Link href={`/quote?service=${sv.slug}&suburb=${encodeURIComponent(s.name)}`} className="text-violet underline underline-offset-2">Get a quote</Link>
                  <Link href={`/services/${sv.slug}`} className="text-navy underline underline-offset-2">What&apos;s included<span className="sr-only"> in {sv.name.toLowerCase()}</span></Link>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="container-x grid gap-8 py-16 lg:grid-cols-[0.8fr_2fr]" aria-labelledby="sfaq-h">
        <h2 id="sfaq-h" className="text-3xl font-extrabold">House cleaning in {s.name}: FAQs</h2>
        <Faqs faqs={faqs} />
      </section>

      <AreaGuides area={a.slug} place={s.name} />

      <section className="container-x" aria-labelledby="near-h">
        <h2 id="near-h" className="text-2xl font-extrabold">We also clean near {s.name}</h2>
        <ul className="mt-5 flex flex-wrap gap-3">
          {near.map((n) => (
            <li key={n.slug}>
              <Link href={suburbPath(n)} className="inline-flex items-center gap-2 rounded-full border-2 border-lilac bg-white px-4 py-2 font-medium text-navy hover:border-violet">
                <Icon name="pin" className="size-4 text-violet" />{n.name}
              </Link>
            </li>
          ))}
          <li>
            <Link href={`/areas/${a.slug}`} className="inline-flex items-center gap-2 rounded-full bg-violet px-4 py-2 font-medium text-white hover:bg-violet-deep">All {a.name} suburbs</Link>
          </li>
        </ul>
      </section>

      <CtaBand title={`A cleaner home in ${s.name}, on repeat.`} body="Tell us about your home and we'll send a clear, written price." href={`/quote?suburb=${encodeURIComponent(s.name)}`} id={`suburb_band_${s.slug}`} />
    </>
  );
}
