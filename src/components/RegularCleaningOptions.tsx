import Link from "next/link";
import { quoteHref } from "@/lib/bookingKoala";
import { CtaLink } from "./CtaLink";
import { regularExtraDetail, regularFrequencies, regularIncludes } from "@/lib/regularCleaning";
import { Icon } from "./Icon";

/**
 * Weekly, fortnightly and monthly cleaning options (regular house cleaning page, #prices).
 * Keeps the id="prices" anchor of the old package section so existing links still land here.
 * No prices: every regular clean is quoted personally. Each card's button opens the Residential
 * quote form with regular house cleaning and that frequency preselected.
 */
export function RegularCleaningOptions() {
  return (
    <section id="prices" className="container-x scroll-mt-24 py-16 sm:py-20" aria-labelledby="prices-h">
      <div className="max-w-2xl">
        <p className="eyebrow">Regular cleaning options</p>
        <h2 id="prices-h" className="mt-2 text-3xl font-extrabold sm:text-[2.5rem]">Choose your regular clean</h2>
        <p className="mt-3 text-lg">
          Professional recurring home cleaning across Brisbane, Logan, the Gold Coast and Tweed Heads, weekly, fortnightly or monthly. Every clean follows a personalised cleaning plan, and your quote is tailored to your property&apos;s size and condition, how often you&apos;d like us to visit and your individual cleaning requirements.
        </p>
      </div>

      <ul className="mt-12 grid items-stretch gap-6 lg:grid-cols-3">
        {regularFrequencies.map((f) => (
          <li key={f.value} className={`relative flex flex-col rounded-[var(--radius-card)] border bg-white p-7 shadow-soft ${f.emphasis ? "border-violet ring-1 ring-violet" : "border-lilac"}`}>
            <h3 className="text-2xl font-extrabold">{f.title}</h3>
            <p className="mt-1 font-display font-semibold text-navy lg:min-h-[3rem]">{f.headline}</p>
            <p className="mt-1 text-[0.95rem] lg:min-h-[6rem]">{f.description}</p>
            <p className="mt-5 flex flex-wrap items-end gap-x-1.5">
              <span className="pb-1 font-medium">Every</span>
              <span className="font-display text-[2.6rem] font-extrabold leading-none text-navy min-[375px]:text-5xl">{f.every}</span>
            </p>
            <p className="mt-2 text-sm font-semibold text-navy">Personalised quote for your home</p>

            <div className="mt-6 border-t border-lilac pt-5">
              <ul className="space-y-2.5 text-[0.97rem]">
                {["The same room-by-room checklist every visit", "Optional extras added to your plan on request", "No lock-in – change or pause any time"].map((t) => (
                  <li key={t} className="flex gap-2.5"><Icon name="check" className="mt-0.5 size-5 shrink-0 text-violet" />{t}</li>
                ))}
              </ul>
            </div>

            <span className="flex-1" />
            <CtaLink intent="quote" location="frequency_card" context={{ page_type: "service", service: "regular-house-cleaning", frequency: f.value }} href={quoteHref("regular-house-cleaning", { frequency: f.value })} className={`${f.emphasis ? "btn-primary" : "btn-outline"} mt-8 w-full !min-h-13`}>
              Get a Free Quote <Icon name="arrow" className="size-4" />
            </CtaLink>
          </li>
        ))}
      </ul>
      <p className="mt-5 text-center text-[0.95rem]">Not sure how often? Choose “Not sure yet” in the quote form and we&apos;ll help you decide.</p>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <h3 className="text-xl font-bold">Included in every regular clean</h3>
          <ul className="mt-4 grid gap-x-6 gap-y-2 text-[0.97rem] sm:grid-cols-2">
            {regularIncludes.map((t) => (
              <li key={t} className="flex gap-2.5"><Icon name="check" className="mt-0.5 size-5 shrink-0 text-violet" />{t}</li>
            ))}
          </ul>
          <p className="mt-4 text-sm">
            Not sure which clean you need? A <Link href="/services/deep-cleaning" className="font-semibold text-violet-ink underline underline-offset-2">deep clean</Link> is the best first step for a home that&apos;s fallen behind, and moving out needs a <Link href="/services/bond-cleaning" className="font-semibold text-violet-ink underline underline-offset-2">bond clean</Link>.
          </p>
        </div>
        <div className="card p-6">
          <h3 className="text-xl font-bold">Need a little extra?</h3>
          <p className="mt-2 leading-relaxed">
            Ask us to add extra detail to your cleaning plan. Whether your home needs more attention or you&apos;d like us to focus on additional areas, we&apos;ll include it in your personalised quote and confirm everything with you before your clean.
          </p>
          <ul className="mt-4 grid gap-x-6 gap-y-2 text-[0.97rem] sm:grid-cols-2">
            {regularExtraDetail.map((t) => (
              <li key={t} className="flex gap-2.5"><Icon name="check" className="mt-0.5 size-5 shrink-0 text-violet" />{t}</li>
            ))}
          </ul>
          <ul className="mt-4 space-y-2 text-[0.97rem]">
            <li className="flex gap-2.5"><Icon name="check" className="mt-0.5 size-5 shrink-0 text-violet" /><span><strong className="text-navy">Extra cleaning time.</strong> More time on site for homes that need extra attention.</span></li>
            <li className="flex gap-2.5"><Icon name="check" className="mt-0.5 size-5 shrink-0 text-violet" /><span><strong className="text-navy">Bed making.</strong> Straightening and making an existing bed with the linen already on it.</span></li>
            <li className="flex gap-2.5"><Icon name="check" className="mt-0.5 size-5 shrink-0 text-violet" /><span><strong className="text-navy">Fresh linen change.</strong> Replacing the bed linen with fresh linen you supply.</span></li>
          </ul>
          <p className="mt-3 text-sm">Bed making isn&apos;t included as standard. Linen supply, laundry and ironing aren&apos;t included.</p>
        </div>
      </div>
    </section>
  );
}
