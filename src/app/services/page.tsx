import Link from "next/link";
import { services } from "@/lib/services";
import { breadcrumbSchema } from "@/lib/schema";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CtaBand } from "@/components/CtaBand";
import { Icon } from "@/components/Icon";
import { JsonLd } from "@/components/JsonLd";
import { serviceScenes } from "@/components/Scenes";

export const metadata = {
  title: "Home Cleaning Services – Regular, Deep, NDIS & Bond",
  description: "Explore Swept's residential cleaning services from Brisbane to Tweed Heads: regular home cleaning, detailed deep cleans, NDIS and home care cleaning, and bond cleaning.",
  alternates: { canonical: "/services" },
};

export default function Services() {
  const crumbs = [{ name: "Home", path: "/" }, { name: "Services", path: "/services" }];
  return (
    <>
      <JsonLd data={breadcrumbSchema(crumbs)} />
      <section className="container-x pb-6 pt-10">
        <Breadcrumbs items={crumbs} />
        <h1 className="text-4xl font-extrabold sm:text-5xl">Residential cleaning services</h1>
        <p className="mt-4 max-w-2xl text-lg">Four ways we can help, from a regular weekly clean to a detailed bond clean when you move out. Every service is tailored to your home.</p>
      </section>
      <section className="container-x space-y-6 py-8">
        {services.map((s, i) => {
          const Scene = serviceScenes[s.icon];
          return (
            <article key={s.slug} className="card grid overflow-hidden md:grid-cols-[1fr_1.2fr]">
              <div className={i % 2 ? "md:order-2" : ""}><Scene className="block h-full min-h-56 w-full" /></div>
              <div className="p-7 sm:p-10">
                <Icon name={s.icon} className="size-8 text-violet" />
                <h2 className="mt-3 text-2xl font-extrabold sm:text-3xl"><Link href={`/services/${s.slug}`} className="hover:text-violet">{s.name}</Link></h2>
                <p className="mt-1 font-medium text-violet">{s.bestFor}</p>
                <p className="mt-4 leading-relaxed">{s.summary}</p>
                <ul className="mt-4 space-y-2">
                  {s.suits.slice(0, 3).map((t) => <li key={t} className="flex gap-2.5"><Icon name="check" className="mt-0.5 size-5 shrink-0 text-violet" />{t}</li>)}
                </ul>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link href={`/quote?service=${s.slug}`} className="btn-primary">Get a quote</Link>
                  <Link href={`/services/${s.slug}`} className="btn-outline">Learn more<span className="sr-only"> about {s.name}</span></Link>
                </div>
              </div>
            </article>
          );
        })}
      </section>
      <CtaBand />
    </>
  );
}
