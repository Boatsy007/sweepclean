import Link from "next/link";
import { BookingKoalaEmbed } from "@/components/BookingKoalaEmbed";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Icon } from "@/components/Icon";
import { BOOK_PATH } from "@/lib/bookingKoala";
import { site, telHref, trustLabel } from "@/lib/site";
import { pageMeta } from "@/lib/seo";

/*
 * Online booking (BookingKoala). A transactional page: noindex, follow and not in the sitemap –
 * the service, area and suburb pages are the ones that rank; this is where people go to book.
 */
export const metadata = pageMeta({
  title: "Book a Clean Online | Swept Cleaning",
  description: "Book your Swept house clean online – choose your service, home details and a time that suits, then confirm securely.",
  path: BOOK_PATH,
  noindex: true,
});

const steps = [
  ["home", "Tell us about your home", "Choose your service, home size and any extras."],
  ["calendar", "Pick a day and time", "Choose the time that suits you."],
  ["checkCircle", "Review and confirm", "Check the details and confirm securely."],
] as const;

export default function BookNowPage() {
  const trust = trustLabel();
  return (
    <section className="bg-gradient-to-b from-white to-lavender/70">
      <div className="container-x max-w-5xl pb-20 pt-8 lg:pt-12">
        <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "Book a clean", path: BOOK_PATH }]} />
        <h1 className="text-3xl font-extrabold sm:text-[2.6rem]">Book a clean</h1>
        <p className="mt-3 max-w-2xl text-lg">Book your clean online in a few minutes. Prefer to talk it through first? <Link href="/quote" className="font-semibold text-violet-ink underline underline-offset-2">Get a free written quote</Link>{site.phone ? <> or call <a href={telHref(site.phone)} className="font-semibold text-violet-ink underline underline-offset-2">{site.phone}</a></> : null}.</p>

        {/* Compact on phones so the form starts near the top of the screen; cards from 640px. */}
        <ol className="mt-5 grid gap-2 sm:mt-6 sm:grid-cols-3 sm:gap-3">
          {steps.map(([icon, t, b], i) => (
            <li key={t} className="flex items-center gap-3 sm:items-start sm:rounded-2xl sm:border sm:border-lilac sm:bg-white/70 sm:p-4">
              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-lavender text-violet sm:size-9"><Icon name={icon} className="size-5" /></span>
              <span><strong className="block font-display text-navy"><span className="sr-only">Step {i + 1}: </span>{t}</strong><span className="hidden text-[0.95rem] sm:inline">{b}</span></span>
            </li>
          ))}
        </ol>

        <BookingKoalaEmbed form="booking" className="mt-6 sm:mt-8" />

        <ul className="mt-8 grid gap-3 text-[0.95rem] sm:grid-cols-3">
          {trust && <li className="flex gap-2.5"><Icon name="shield" className="mt-0.5 size-5 shrink-0 text-violet" /><span><strong className="text-navy">{trust}</strong> cleaners</span></li>}
          <li className="flex gap-2.5"><Icon name="shieldSparkle" className="mt-0.5 size-5 shrink-0 text-violet" /><span>Every clean is backed by <Link href={site.promise.path} className="font-semibold text-violet-ink underline underline-offset-2">{site.promise.name}</Link></span></li>
          <li className="flex gap-2.5"><Icon name="check" className="mt-0.5 size-5 shrink-0 text-violet" /><span>No lock-in contracts – pause or change your schedule any time</span></li>
        </ul>
        <p className="mt-6 text-[0.95rem]">
          <strong className="text-navy">Commercial or office cleaning?</strong> These are quoted individually – <Link href="/quote?service=commercial-cleaning" className="font-semibold text-violet-ink underline underline-offset-2">request a commercial quote</Link>. Already a customer? <Link href="/login" className="font-semibold text-violet-ink underline underline-offset-2">Log in to your account</Link>.
        </p>
        <p className="mt-3 text-sm">Bookings, customer accounts and payments are handled securely by BookingKoala, our booking system. See our <Link href="/privacy" className="underline underline-offset-2">privacy policy</Link>.</p>
      </div>
    </section>
  );
}
