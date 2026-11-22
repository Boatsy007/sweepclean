import { LeadQuoteForm } from "@/components/LeadQuoteForm";
import { QuoteSteps } from "@/components/QuoteSteps";
import { Icon } from "@/components/Icon";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Free House & Commercial Cleaning Quote | Swept Cleaning",
  description: "Request a free, no-obligation house or commercial cleaning quote from Swept. Tell us what you need in two minutes – Brisbane, Logan, Gold Coast and Tweed Heads.",
  path: "/quote",
});

export default function QuotePage() {
  return (
    <section className="bg-gradient-to-b from-white to-lavender/70">
      <div className="container-x pt-8 lg:pt-12">
        <div className="max-w-4xl">
          <h1 className="text-3xl font-extrabold sm:text-[2.6rem]">Get a Free Cleaning Quote</h1>
          <p className="mt-3 max-w-2xl text-lg">Tell us a little about your cleaning requirements and our team will be in touch to discuss your needs and provide a personalised quote.</p>
          <QuoteSteps className="mt-5 sm:mt-6" />
        </div>
      </div>
      <div className="container-x grid gap-10 pb-20 pt-6 sm:pt-8 lg:grid-cols-[1.6fr_1fr]">
        <div>
          <LeadQuoteForm />
        </div>
        <aside className="space-y-5">
          <div className="rounded-[var(--radius-card)] border border-lilac bg-white/60 p-6 text-[0.95rem]">
            <p className="flex items-center gap-2 font-display font-semibold text-navy"><Icon name="shield" className="size-5 text-violet" />Your details are safe</p>
            <p className="mt-2">We only use your details to respond to this request. We never sell or share them.</p>
          </div>
        </aside>
      </div>
    </section>
  );
}
