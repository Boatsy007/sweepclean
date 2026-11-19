import Link from "next/link";
import { Suspense } from "react";
import { BookingRequestForm } from "@/components/BookingRequestForm";
import { CtaLink } from "@/components/CtaLink";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Icon } from "@/components/Icon";
import { BOOK_PATH } from "@/lib/bookingKoala";
import { site, telHref, trustLabel } from "@/lib/site";
import { pageMeta } from "@/lib/seo";

/*
 * Booking request for a regular cleaning package (native form; Swept confirms in BookingKoala).
 * A transactional page: noindex, follow and not in the sitemap – the regular cleaning page, where
 * the packages are compared, is the one that ranks.
 */
export const metadata = pageMeta({
  title: "Request a Booking | Swept Cleaning",
  description: "Request your regular house clean with Swept – your package, home details and preferred date. We'll confirm your appointment; no payment needed now.",
  path: BOOK_PATH,
  noindex: true,
});

const steps = [
  ["home", "Tell us about your home", "Your package, home size, how often and any extras."],
  ["calendar", "Choose a preferred date", "Pick the day you'd like your first clean."],
  ["checkCircle", "We confirm it", `We confirm your appointment and price ${site.quoteResponse}.`],
] as const;

export default function BookNowPage() {
  const trust = trustLabel();
  return (
    <section className="bg-gradient-to-b from-white to-lavender/70">
      <div className="container-x max-w-4xl pb-20 pt-8 lg:pt-12">
        <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "Book a clean", path: BOOK_PATH }]} />
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
          <h1 className="text-3xl font-extrabold sm:text-[2.6rem]">Book a clean</h1>
          <p className="text-[0.95rem]">Already a customer? <Link href="/login" className="font-semibold text-violet-ink underline underline-offset-2">Log in</Link></p>
        </div>
        <p className="mt-3 max-w-2xl text-lg">Request your regular clean in a couple of minutes. It&apos;s a request, not a payment – we&apos;ll confirm your appointment and final price.</p>

        {/* Compact on phones so the form starts near the top of the screen; cards from 640px. */}
        <ol className="mt-5 grid gap-2 sm:mt-6 sm:grid-cols-3 sm:gap-3">
          {steps.map(([icon, t, b], i) => (
            <li key={t} className="flex items-center gap-3 sm:items-start sm:rounded-2xl sm:border sm:border-lilac sm:bg-white/70 sm:p-4">
              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-lavender text-violet sm:size-9"><Icon name={icon} className="size-5" /></span>
              <span><strong className="block font-display text-navy"><span className="sr-only">Step {i + 1}: </span>{t}</strong><span className="hidden text-[0.95rem] sm:inline">{b}</span></span>
            </li>
          ))}
        </ol>

        <div className="mt-6 sm:mt-8">
          {/* Placeholder sized to the form (measured 320–1440px) so nothing shifts when it loads. */}
          <Suspense fallback={<div className="card h-[178rem] min-[360px]:h-[165rem] sm:h-[122rem] md:h-[111rem] lg:h-[110rem]" />}>
            <BookingRequestForm />
          </Suspense>
        </div>

        <ul className="mt-8 grid gap-3 text-[0.95rem] sm:grid-cols-3">
          {trust && <li className="flex gap-2.5"><Icon name="shield" className="mt-0.5 size-5 shrink-0 text-violet" /><span><strong className="text-navy">{trust}</strong> cleaners</span></li>}
          <li className="flex gap-2.5"><Icon name="shieldSparkle" className="mt-0.5 size-5 shrink-0 text-violet" /><span>Every clean is backed by <Link href={site.promise.path} className="font-semibold text-violet-ink underline underline-offset-2">{site.promise.name}</Link></span></li>
          <li className="flex gap-2.5"><Icon name="check" className="mt-0.5 size-5 shrink-0 text-violet" /><span>No lock-in contracts – pause or change your schedule any time</span></li>
        </ul>
        <p className="mt-6 text-[0.95rem]">
          <strong className="text-navy">Need something other than a regular clean?</strong> Deep, bond, NDIS, Airbnb and carpet cleaning are quoted individually – <CtaLink intent="quote" location="book_page" href="/quote" className="font-semibold text-violet-ink underline underline-offset-2">get a free quote</CtaLink>{site.phone ? <> or call <a href={telHref(site.phone)} className="font-semibold text-violet-ink underline underline-offset-2">{site.phone}</a></> : null}.
        </p>
        <p className="mt-3 text-[0.95rem]">
          <strong className="text-navy">Commercial or office cleaning?</strong> <CtaLink intent="quote" location="book_page_commercial" href="/quote?service=commercial-cleaning" className="font-semibold text-violet-ink underline underline-offset-2">Request a commercial quote</CtaLink>.
        </p>
      </div>
    </section>
  );
}
