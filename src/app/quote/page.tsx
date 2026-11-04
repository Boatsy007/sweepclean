import { Suspense } from "react";
import { QuoteForm } from "@/components/QuoteForm";
import { Icon } from "@/components/Icon";
import { site } from "@/lib/site";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Free House Cleaning Quote | Swept Cleaning",
  description: "Request a free, no-obligation house cleaning quote from Swept. Tell us about your home in about two minutes – Brisbane, Logan, Gold Coast and Tweed Heads.",
  path: "/quote",
});

export default function QuotePage() {
  return (
    <section className="bg-gradient-to-b from-white to-lavender/70">
      <div className="container-x grid gap-10 pb-20 pt-8 lg:grid-cols-[1.6fr_1fr] lg:pt-12">
        <div>
          <h1 className="text-3xl font-extrabold sm:text-[2.6rem]">Book a clean – get your free quote</h1>
          <p className="mb-7 mt-3 text-lg">A few quick questions, then we&apos;ll send a written price {site.quoteResponse}. No obligation.</p>
          <Suspense fallback={<div className="card h-[32rem]" />}>
            <QuoteForm />
          </Suspense>
        </div>
        <aside className="space-y-5 lg:pt-28">
          <div className="card p-6">
            <h2 className="text-lg font-bold">What happens next</h2>
            <ol className="mt-4 space-y-4">
              {[
                ["doc", "We review your details", "and prepare a tailored written quote."],
                ["chat", `We get in touch ${site.quoteResponse}`, "to confirm the price, checklist and a time."],
                ["calendar", "You decide", "Book only if it suits – no obligation, no lock-in."],
              ].map(([icon, t, b]) => (
                <li key={t} className="flex gap-3"><Icon name={icon} className="size-6 shrink-0 text-violet" /><span><strong className="text-navy">{t}</strong> {b}</span></li>
              ))}
            </ol>
          </div>
          <div className="rounded-[var(--radius-card)] border border-lilac bg-white/60 p-6 text-[0.95rem]">
            <p className="flex items-center gap-2 font-display font-semibold text-navy"><Icon name="shield" className="size-5 text-violet" />Your details are safe</p>
            <p className="mt-2">We only use your details to respond to this request. We never sell or share them.</p>
          </div>
        </aside>
      </div>
    </section>
  );
}
