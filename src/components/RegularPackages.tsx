import { regularPackages } from "@/lib/packages";
import { siteUrl } from "@/lib/site";
import { Icon } from "./Icon";
import { JsonLd } from "./JsonLd";
import { TrackedLink } from "./TrackedLink";

/** Regular-clean price packages with a "Request booking" button each (regular cleaning page only). */
export function RegularPackages() {
  const offers = {
    "@context": "https://schema.org",
    "@type": "OfferCatalog",
    name: "Regular home cleaning packages",
    url: `${siteUrl()}/services/regular-house-cleaning#prices`,
    itemListElement: regularPackages.map((p) => ({
      "@type": "Offer",
      name: `${p.name} regular clean`,
      description: `${p.time}. ${p.bestFor}.`,
      price: p.price,
      priceCurrency: "AUD",
      priceSpecification: { "@type": "UnitPriceSpecification", price: p.price, priceCurrency: "AUD", valueAddedTaxIncluded: false, unitText: "per clean" },
      url: `${siteUrl()}/quote?service=regular-house-cleaning&package=${p.id}`,
      itemOffered: { "@type": "Service", name: "Regular home cleaning", provider: { "@id": `${siteUrl()}/#business` } },
    })),
  };

  return (
    <section id="prices" className="container-x scroll-mt-24 py-16 sm:py-20" aria-labelledby="prices-h">
      <JsonLd data={offers} />
      <div className="max-w-2xl">
        <p className="eyebrow">Regular clean prices</p>
        <h2 id="prices-h" className="mt-2 text-3xl font-extrabold sm:text-[2.5rem]">Choose your regular clean</h2>
        <p className="mt-3 text-lg">Three simple packages at a fixed price per clean (+GST) – you pay the package price, not by the hour. Pick the one that suits your home and request a booking.</p>
      </div>

      <ul className="mt-12 grid items-stretch gap-6 lg:grid-cols-3">
        {regularPackages.map((p) => (
          <li key={p.id} className={`relative flex flex-col rounded-[var(--radius-card)] border bg-white p-7 shadow-soft ${p.recommended ? "border-violet ring-1 ring-violet" : "border-lilac"}`}>
            {p.recommended && (
              <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-violet px-4 py-1 font-display text-xs font-bold uppercase tracking-[0.14em] text-white">Recommended</span>
            )}
            <h3 className="text-2xl font-extrabold">{p.name}</h3>
            <p className="mt-1 text-[0.95rem] lg:min-h-[3rem]">{p.bestFor}</p>
            <p className="mt-5 flex items-end gap-1.5">
              <span className="font-display text-5xl font-extrabold leading-none text-navy">${p.price}</span>
              <span className="pb-1 font-medium">+GST per clean</span>
            </p>
            <p className="mt-1.5 text-sm font-semibold text-navy">Fixed price – not an hourly rate</p>
            <p className="mt-3 inline-flex items-center gap-2 font-display font-semibold text-violet-ink"><Icon name="clock" className="size-5 text-violet" />{p.time}</p>

            <div className="mt-6 border-t border-lilac pt-5">
              {p.builds && <p className="mb-3 font-display font-semibold text-navy">Everything in {p.builds}, plus:</p>}
              <ul className="space-y-2.5 text-[0.97rem]">
                {p.includes.map((t) => (
                  <li key={t} className="flex gap-2.5"><Icon name="check" className="mt-0.5 size-5 shrink-0 text-violet" />{t}</li>
                ))}
              </ul>
            </div>

            <span className="flex-1" />
            <TrackedLink cta={`package_${p.id}`} href={`/quote?service=regular-house-cleaning&package=${p.id}`} className={`${p.recommended ? "btn-primary" : "btn-outline"} mt-8 w-full !min-h-13`}>
              Request booking <Icon name="arrow" className="size-4" />
            </TrackedLink>
          </li>
        ))}
      </ul>

      <p className="mt-8 max-w-3xl text-[0.95rem]">
        Prices are fixed per visit, plus GST, for a typical home. Times are a guide for one cleaner on a weekly or fortnightly schedule. Larger homes, a first clean or heavy build-up can take longer – we&apos;ll confirm your price and time in writing before anything is booked. No lock-in contracts.
      </p>
    </section>
  );
}
