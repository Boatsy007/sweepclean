import Link from "next/link";
import { BOOK_PATH, bookingRequestHref } from "@/lib/bookingKoala";
import { CtaLink } from "./CtaLink";
import { orgRef } from "@/lib/schema";
import { packageExtras, regularPackages } from "@/lib/packages";
import { siteUrl } from "@/lib/site";
import { Icon } from "./Icon";
import { JsonLd } from "./JsonLd";

/**
 * Recurring house cleaning packages and prices (regular cleaning pages only).
 * `place` tailors the short intro, e.g. "on the Gold Coast"; `pageUrl` is the page the section sits on.
 */
export function RegularPackages({ place, pageUrl = "/services/regular-house-cleaning" }: { place?: string; pageUrl?: string } = {}) {
  const x = packageExtras;
  // Starting prices are marked as minimum prices (not fixed prices for every home); extras are fixed unit prices.
  const offers = {
    "@context": "https://schema.org",
    "@type": "OfferCatalog",
    name: "Recurring house cleaning packages",
    url: `${siteUrl()}${pageUrl}#prices`,
    itemListElement: [
      ...regularPackages.map((p) => ({
        "@type": "Offer",
        name: `${p.name} recurring house clean`,
        description: `${p.description} Starting price for a ${p.basis} home; larger homes cost more. Final fixed price confirmed before the clean.`,
        priceSpecification: { "@type": "PriceSpecification", minPrice: p.from, priceCurrency: "AUD", valueAddedTaxIncluded: false },
        url: `${siteUrl()}${BOOK_PATH}`,
        itemOffered: { "@type": "Service", name: "Recurring house cleaning", provider: orgRef() },
      })),
      { "@type": "Offer", name: "Additional cleaning time", priceSpecification: { "@type": "UnitPriceSpecification", price: x.extraHour, priceCurrency: "AUD", valueAddedTaxIncluded: false, unitText: "hour" } },
      { "@type": "Offer", name: "Bed making", priceSpecification: { "@type": "UnitPriceSpecification", price: x.bedMaking, priceCurrency: "AUD", valueAddedTaxIncluded: false, unitText: "bed" } },
      { "@type": "Offer", name: "Fresh linen change", priceSpecification: { "@type": "UnitPriceSpecification", price: x.linenChange, priceCurrency: "AUD", valueAddedTaxIncluded: false, unitText: "bed" } },
    ],
  };

  return (
    <section id="prices" className="container-x scroll-mt-24 py-16 sm:py-20" aria-labelledby="prices-h">
      <JsonLd data={offers} />
      <div className="max-w-2xl">
        <p className="eyebrow">Regular clean prices</p>
        <h2 id="prices-h" className="mt-2 text-3xl font-extrabold sm:text-[2.5rem]">Choose your regular clean</h2>
        <p className="mt-3 text-lg">
          Professional recurring home cleaning {place ?? "across Brisbane, Logan, the Gold Coast and Tweed Heads"}, weekly, fortnightly or monthly. Choose from three levels of cleaning – any package suits any home, and your price depends on your home&apos;s size and the package you choose.
        </p>
      </div>

      <ul className="mt-12 grid items-stretch gap-6 lg:grid-cols-3">
        {regularPackages.map((p) => (
          <li key={p.id} className={`relative flex flex-col rounded-[var(--radius-card)] border bg-white p-7 shadow-soft ${p.recommended ? "border-violet ring-1 ring-violet" : "border-lilac"}`}>
            {p.recommended && (
              <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-violet px-4 py-1 font-display text-xs font-bold uppercase tracking-[0.14em] text-white">Recommended</span>
            )}
            <h3 className="text-2xl font-extrabold">{p.name}</h3>
            <p className="mt-1 font-display font-semibold text-navy">{p.headline}</p>
            <p className="mt-1 text-[0.95rem] lg:min-h-[4.5rem]">{p.description}</p>
            <p className="mt-5 flex items-end gap-1.5">
              <span className="pb-1 font-medium">From</span>
              <span className="font-display text-5xl font-extrabold leading-none text-navy">${p.from}</span>
              <span className="pb-1 font-medium">+GST per clean</span>
            </p>
            <p className="mt-2 text-sm font-semibold text-navy">Starting price for {p.basis}</p>

            <div className="mt-6 border-t border-lilac pt-5">
              {p.builds && <p className="mb-3 font-display font-semibold text-navy">Everything in {p.builds}, plus:</p>}
              <ul className="space-y-2.5 text-[0.97rem]">
                {p.includes.map((t) => (
                  <li key={t} className="flex gap-2.5"><Icon name="check" className="mt-0.5 size-5 shrink-0 text-violet" />{t}</li>
                ))}
              </ul>
            </div>

            <span className="flex-1" />
            <CtaLink intent="book" location="package_card" context={{ page_type: "package", service: "regular-house-cleaning", package: p.id }} href={bookingRequestHref(p.id)} className={`${p.recommended ? "btn-primary" : "btn-outline"} mt-8 w-full !min-h-13`}>
              Request booking <Icon name="arrow" className="size-4" />
            </CtaLink>
          </li>
        ))}
      </ul>
      {/* BookingKoala can't preselect a package from our site, so say which one to choose. */}
      <p className="mt-5 text-center text-[0.95rem]">Booking online? Choose the same package and your home&apos;s size in the booking form.</p>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <h3 className="text-xl font-bold">Need a little extra?</h3>
          <p className="mt-2 leading-relaxed">
            Add extra cleaning time to any package for <strong className="text-navy">${x.extraHour} + GST per hour</strong>. Whether your home needs more attention or you&apos;d like us to focus on additional areas, we&apos;ll confirm everything with you before your clean.
          </p>
          <ul className="mt-4 space-y-2 text-[0.97rem]">
            <li className="flex gap-2.5"><Icon name="check" className="mt-0.5 size-5 shrink-0 text-violet" /><span><strong className="text-navy">Bed making – ${x.bedMaking} + GST per bed.</strong> Straightening and making an existing bed with the linen already on it.</span></li>
            <li className="flex gap-2.5"><Icon name="check" className="mt-0.5 size-5 shrink-0 text-violet" /><span><strong className="text-navy">Fresh linen change – ${x.linenChange} + GST per bed.</strong> Replacing the bed linen with fresh linen you supply.</span></li>
          </ul>
          <p className="mt-3 text-sm">Bed making isn&apos;t part of any package. Linen supply, laundry and ironing aren&apos;t included.</p>
        </div>
        <div className="card p-6">
          <h3 className="text-xl font-bold">Simple, transparent cleaning prices.</h3>
          <p className="mt-2 leading-relaxed">
            Our cleaning packages are tailored to your home&apos;s size and the level of cleaning you choose. Select your preferred package and we&apos;ll confirm your fixed price before your clean. No unexpected hourly charges.
          </p>
          <ul className="mt-4 space-y-2 text-[0.97rem]">
            <li className="flex gap-2.5"><Icon name="check" className="mt-0.5 size-5 shrink-0 text-violet" />Starting prices apply to the property size shown on each package, in a reasonably maintained home.</li>
            <li className="flex gap-2.5"><Icon name="check" className="mt-0.5 size-5 shrink-0 text-violet" />Larger homes cost more – choose any package for any size of home.</li>
            <li className="flex gap-2.5"><Icon name="check" className="mt-0.5 size-5 shrink-0 text-violet" />Extras and additional time are only added if you agree to them first.</li>
          </ul>
          <p className="mt-3 text-sm">
            Not sure which clean you need? A <Link href="/services/deep-cleaning" className="font-semibold text-violet-ink underline underline-offset-2">deep clean</Link> is the best first step for a home that&apos;s fallen behind, and moving out needs a <Link href="/services/bond-cleaning" className="font-semibold text-violet-ink underline underline-offset-2">bond clean</Link>.
          </p>
        </div>
      </div>
    </section>
  );
}
