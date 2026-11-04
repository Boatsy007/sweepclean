import Link from "next/link";
import { areas } from "@/lib/areas";
import { breadcrumbSchema } from "@/lib/schema";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CtaBand } from "@/components/CtaBand";
import { Icon } from "@/components/Icon";
import { JsonLd } from "@/components/JsonLd";
import { suburbPath, suburbsIn } from "@/lib/suburbs";

export const metadata = {
  title: "Areas We Clean – Brisbane, Logan, Gold Coast & Tweed Heads",
  description: "Swept cleans homes from Brisbane to Tweed Heads: Brisbane's northside, southside and inner city, Logan, the Gold Coast and Tweed Heads.",
  alternates: { canonical: "/areas" },
};

const icons: Record<string, string> = { brisbane: "city", logan: "home", "gold-coast": "palm", "tweed-heads": "wave" };

export default function Areas() {
  const crumbs = [{ name: "Home", path: "/" }, { name: "Areas", path: "/areas" }];
  return (
    <>
      <JsonLd data={breadcrumbSchema(crumbs)} />
      <section className="container-x pb-6 pt-10">
        <Breadcrumbs items={crumbs} />
        <h1 className="text-4xl font-extrabold sm:text-5xl">Areas we clean, from Brisbane to Tweed Heads</h1>
        <p className="mt-4 max-w-2xl text-lg">One standard of cleaning along the whole South East Queensland corridor – and across the border into Tweed Heads.</p>
      </section>
      <section className="container-x py-8">
        <ol className="relative grid gap-5 md:grid-cols-2">
          {areas.map((a, i) => (
            <li key={a.slug}>
              <Link href={`/areas/${a.slug}`} className="card group flex h-full gap-5 p-6 hover:shadow-lift sm:p-8">
                <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-violet text-white"><Icon name={icons[a.slug]} className="size-8" /></span>
                <span>
                  <span className="text-sm font-semibold uppercase tracking-wider text-violet">{String(i + 1).padStart(2, "0")} · {a.state}</span>
                  <span className="mt-1 block font-display text-2xl font-bold text-navy group-hover:text-violet">{a.name}</span>
                  <span className="mt-2 block">{suburbsIn(a.slug).slice(0, 6).map((sb) => sb.name).join(", ")} and {suburbsIn(a.slug).length - 6} more</span>
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </section>
      <section className="container-x py-12" aria-labelledby="dir-h">
        <h2 id="dir-h" className="text-3xl font-extrabold">Every suburb we clean</h2>
        <div className="mt-8 grid gap-8 md:grid-cols-2">
          {areas.map((a) => (
            <div key={a.slug}>
              <h3 className="text-xl font-bold"><Link href={`/areas/${a.slug}`} className="hover:text-violet">House cleaning {a.name}</Link></h3>
              <ul className="mt-3 flex flex-wrap gap-2">
                {suburbsIn(a.slug).map((sb) => (
                  <li key={sb.slug}><Link href={suburbPath(sb)} className="inline-flex rounded-full bg-lavender px-3 py-1 text-sm font-medium text-violet-ink hover:bg-violet hover:text-white">{sb.name} {sb.postcode}</Link></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
      <CtaBand />
    </>
  );
}
