import { site } from "@/lib/site";
import { breadcrumbSchema } from "@/lib/schema";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CtaBand } from "@/components/CtaBand";
import { Icon } from "@/components/Icon";
import { JsonLd } from "@/components/JsonLd";
import { SweptMark } from "@/components/SweptMark";

export const metadata = {
  title: "Why Swept – How We Clean & What We Commit To",
  description: "Swept is a new residential cleaning service from Brisbane to Tweed Heads. Here's how we work, what we commit to on every clean, and what to expect.",
  alternates: { canonical: "/why-swept" },
};

const approach = [
  { icon: "doc", title: "A written plan for your home", body: "Your quote spells out what we'll clean, how long we expect to take and the price. That plan becomes the checklist for every visit." },
  { icon: "chat", title: "Easy, friendly communication", body: "Enquire online in a couple of minutes, then hear back from a real person. Changes, skips and questions are a quick message away." },
  { icon: "calendar", title: "Scheduling built around you", body: "Weekly, fortnightly or monthly on a day that suits – and the freedom to pause or change when life does." },
  { icon: "sparkle", title: "Attention to the details", body: "Skirting boards, shower screens, tapware, the top of the fridge – the things that make a home feel properly clean, not just tidied." },
];

export default function WhySwept() {
  const crumbs = [{ name: "Home", path: "/" }, { name: "Why Swept", path: "/why-swept" }];
  return (
    <>
      <JsonLd data={breadcrumbSchema(crumbs)} />
      <section className="container-x pb-10 pt-10">
        <Breadcrumbs items={crumbs} />
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-center">
          <div>
            <h1 className="text-4xl font-extrabold leading-[1.05] sm:text-5xl">Why choose Swept?</h1>
            <p className="mt-5 text-lg leading-relaxed">Swept is a new residential cleaning service for homes from Brisbane to Tweed Heads. We&apos;re building our reputation one home at a time – so rather than big claims, here&apos;s exactly how we work and what you can hold us to.</p>
          </div>
          <SweptMark size={220} className="mx-auto hidden lg:block" />
        </div>
      </section>

      <section className="container-x" aria-labelledby="commit-h">
        <div className="band px-6 py-10 sm:px-10 lg:py-12">
          <SweptMark tone="white" size={280} className="pointer-events-none absolute -bottom-20 -right-16 opacity-15" />
          <h2 id="commit-h" className="relative text-3xl font-extrabold !text-white">Our commitments on every clean</h2>
          <ul className="relative mt-8 grid gap-6 md:grid-cols-2">
            {site.commitments.map((c) => (
              <li key={c.title} className="flex gap-3">
                <Icon name="checkCircle" className="mt-0.5 size-7 shrink-0" />
                <span><strong className="block font-display text-xl font-semibold text-white">{c.title}</strong><span className="mt-1 block text-white/85">{c.body}</span></span>
              </li>
            ))}
            {site.insured && <li className="flex gap-3"><Icon name="shield" className="mt-0.5 size-7 shrink-0" /><span><strong className="block font-display text-xl font-semibold text-white">Fully insured</strong><span className="mt-1 block text-white/85">We hold current public liability insurance.</span></span></li>}
            {site.policeChecked && <li className="flex gap-3"><Icon name="shield" className="mt-0.5 size-7 shrink-0" /><span><strong className="block font-display text-xl font-semibold text-white">Police-checked cleaners</strong><span className="mt-1 block text-white/85">Every cleaner holds a current national police check.</span></span></li>}
          </ul>
        </div>
      </section>

      <section className="container-x py-16 sm:py-20" aria-labelledby="approach-h">
        <h2 id="approach-h" className="text-3xl font-extrabold sm:text-[2.5rem]">How we work</h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {approach.map((a) => (
            <div key={a.title} className="card p-7">
              <Icon name={a.icon} className="size-9 text-violet" />
              <h3 className="mt-4 text-xl font-bold">{a.title}</h3>
              <p className="mt-2 leading-relaxed">{a.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-lavender py-16" aria-labelledby="trust-h">
        <div className="container-x grid gap-8 lg:grid-cols-[1fr_1.5fr]">
          <h2 id="trust-h" className="text-3xl font-extrabold">Letting someone into your home is a big deal</h2>
          <div className="space-y-4 text-lg leading-relaxed">
            <p>We know the hardest part of hiring a cleaner isn&apos;t the price – it&apos;s trust. So we keep things simple: you&apos;ll know who&apos;s coming, when they&apos;re arriving, what they&apos;ll do and what it costs, before the first visit.</p>
            <p>If something isn&apos;t right after a clean, tell us. We&apos;d rather hear about it and fix it than have you quietly unhappy.</p>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
