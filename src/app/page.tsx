import Link from "next/link";
import { services } from "@/lib/services";
import { generalFaqs } from "@/lib/faqs";
import { site } from "@/lib/site";
import { faqSchema } from "@/lib/schema";
import { Icon } from "@/components/Icon";
import { SweptMark } from "@/components/SweptMark";
import { LivingScene, serviceScenes } from "@/components/Scenes";
import { Faqs } from "@/components/Faqs";
import { CtaBand } from "@/components/CtaBand";
import { JsonLd } from "@/components/JsonLd";
import { QuickStart } from "@/components/QuickStart";
import { TrackedLink } from "@/components/TrackedLink";

export const metadata = {
  title: { absolute: "House Cleaning Brisbane to Tweed Heads | Swept Cleaning" },
  alternates: { canonical: "/" },
};

const tasks = ["Dusting", "Kitchens", "Bathrooms", "Floors", "Blinds and fans", "Windows and tracks", "Beds", "Laundry and general tidy"];

const schedules = [
  { value: "weekly", label: "Weekly", body: "For busy households, young kids and pets – the house never gets a chance to slip." },
  { value: "fortnightly", label: "Fortnightly", body: "A popular balance for couples and families who keep on top of the day-to-day." },
  { value: "monthly", label: "Monthly", body: "A regular top-to-bottom reset for tidy homes that want a hand with the big jobs." },
];

const regions = [
  { href: "/areas/brisbane#northside", label: "Brisbane Northside", icon: "city" },
  { href: "/areas/brisbane#southside", label: "Brisbane Southside", icon: "home" },
  { href: "/areas/brisbane#inner-city", label: "Inner City", icon: "bridge" },
  { href: "/areas/logan", label: "Logan", icon: "home" },
  { href: "/areas/gold-coast", label: "Gold Coast", icon: "palm" },
  { href: "/areas/tweed-heads", label: "Tweed Heads", icon: "wave" },
];

export default function Home() {
  const homeFaqs = generalFaqs.slice(0, 6);
  return (
    <>
      <JsonLd data={faqSchema(homeFaqs)} />

      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white to-lavender/60">
        <div className="container-x grid items-center gap-10 pb-14 pt-10 lg:grid-cols-[1.05fr_1fr] lg:gap-14 lg:pb-20 lg:pt-16">
          <div>
            <h1 className="text-[2.6rem] font-extrabold leading-[1.02] sm:text-6xl lg:text-[4.1rem]">
              <span className="eyebrow mb-4 block !leading-normal">House cleaning · Brisbane to Tweed Heads</span>
              A beautifully clean home. <span className="text-violet">More time for you.</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed sm:text-xl">
              Flexible weekly, fortnightly and monthly home cleaning, tailored to your home – across Brisbane, Logan, the Gold Coast and Tweed Heads.
            </p>
            <QuickStart />
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-[0.95rem] font-medium text-navy">
              <li className="flex items-center gap-2"><Icon name="calendar" className="size-5 text-violet" />Flexible scheduling</li>
              <li className="flex items-center gap-2"><Icon name="sparkle" className="size-5 text-violet" />Customised cleans</li>
              <li className="flex items-center gap-2"><Icon name="pin" className="size-5 text-violet" />Brisbane to Tweed Heads</li>
            </ul>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-[2rem] border border-lilac shadow-lift">
              <LivingScene className="block aspect-[5/3.3] w-full sm:aspect-[5/3.6]" />
            </div>
            <div className="card relative mx-4 -mt-12 p-4 sm:absolute sm:-left-6 sm:bottom-8 sm:mx-0 sm:mt-0 sm:w-[17rem]">
              <p className="flex items-center gap-2 font-display text-sm font-bold text-navy"><Icon name="calendar" className="size-5 text-violet" />Your cleaning plan</p>
              <p className="mt-1 text-sm">Fortnightly · Thursday mornings</p>
              <ul className="mt-3 space-y-1.5 text-sm text-navy">
                {["Kitchen & bathrooms", "Floors throughout", "Your priority: the oven"].map((t) => (
                  <li key={t} className="flex items-center gap-2"><Icon name="checkCircle" className="size-4 text-violet" />{t}</li>
                ))}
              </ul>
              <p className="mt-3 text-[0.7rem] uppercase tracking-wider text-slate">Example plan</p>
            </div>
            <div className="absolute -right-2 -top-4 hidden rounded-full bg-violet px-4 py-2 font-display text-sm font-semibold text-white shadow-lift sm:block">
              No lock-in contracts
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="container-x py-16 sm:py-20" aria-labelledby="services-h">
        <div className="mx-auto max-w-2xl text-center">
          <h2 id="services-h" className="text-3xl font-extrabold sm:text-[2.6rem]">Our residential cleaning services</h2>
          <p className="mt-3 text-lg">A complete range of home cleaning services to keep your home fresh, clean and comfortable.</p>
        </div>
        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s) => {
            const Scene = serviceScenes[s.icon];
            return (
              <li key={s.slug}>
                <Link href={`/services/${s.slug}`} className="card group flex h-full flex-col overflow-hidden transition-shadow hover:shadow-lift">
                  <div className="relative flex-1 p-6">
                    <Icon name="arrow" className="absolute right-6 top-6 size-5 text-violet sm:hidden" />
                    <Icon name={s.icon} className="size-8 text-violet" />
                    <h3 className="mt-3 text-xl font-bold leading-tight">{s.name}</h3>
                    <p className="mt-2 leading-relaxed">{s.summary}</p>
                    {s.availability && <p className="mt-2 text-sm text-slate">Availability confirmed on enquiry.</p>}
                  </div>
                  <div className="relative hidden sm:block">
                    <Scene className="block aspect-[5/3] w-full" />
                    <span className="absolute bottom-3 right-3 grid size-10 place-items-center rounded-full bg-white text-violet shadow-soft transition-transform group-hover:translate-x-0.5">
                      <Icon name="arrow" className="size-5" />
                      <span className="sr-only">Learn about {s.name}</span>
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      {/* YOUR CLEAN, YOUR WAY */}
      <section className="container-x" aria-labelledby="way-h">
        <div className="band grid gap-8 px-6 py-10 sm:px-10 lg:grid-cols-[1fr_1.3fr] lg:items-center lg:py-12">
          <SweptMark tone="white" size={260} className="pointer-events-none absolute -bottom-16 -right-12 opacity-15" />
          <div className="relative lg:border-r lg:border-white/25 lg:pr-10">
            <h2 id="way-h" className="text-3xl font-extrabold !text-white sm:text-[2.5rem]">Your clean, your way</h2>
            <p className="mt-3 text-lg text-white/90">A flexible, customised clean that covers the areas that matter most to you.</p>
          </div>
          <div className="relative">
            <ul className="grid grid-cols-1 gap-x-8 gap-y-3 min-[420px]:grid-cols-2">
              {tasks.map((t) => (
                <li key={t} className="flex items-center gap-3 text-lg font-medium"><Icon name="checkCircle" className="size-6 shrink-0" />{t}</li>
              ))}
            </ul>
            <p className="mt-5 italic text-white/85">Customise the tasks to your home and schedule.</p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="container-x scroll-mt-24 py-16 sm:py-20" aria-labelledby="how-h">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_2fr] lg:items-center">
          <div>
            <h2 id="how-h" className="text-3xl font-extrabold sm:text-[2.5rem]">Simple as 1 – 2 – 3</h2>
            <p className="mt-3 text-lg">Getting a cleaner home is easy with Swept.</p>
          </div>
          <ol className="grid gap-5 sm:grid-cols-3">
            {[
              { icon: "chat", title: "Tell us about your home", body: "A two-minute online form: rooms, frequency, suburb and what matters most." },
              { icon: "doc", title: "Receive a tailored quote", body: `A clear written price and checklist, ${site.quoteResponse}.` },
              { icon: "home", title: "Enjoy your clean home", body: "We arrive on your chosen day and work through your checklist, visit after visit." },
            ].map((s, i) => (
              <li key={s.title} className="card relative p-6">
                <span className="grid size-10 place-items-center rounded-full bg-violet font-display text-lg font-bold text-white">{i + 1}</span>
                <Icon name={s.icon} className="mt-4 size-8 text-violet" />
                <h3 className="mt-3 text-lg font-bold">{s.title}</h3>
                <p className="mt-1.5 leading-relaxed">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* SCHEDULE */}
      <section className="bg-lavender py-16 sm:py-20" aria-labelledby="sched-h">
        <div className="container-x grid gap-10 lg:grid-cols-[0.8fr_2fr] lg:items-center">
          <div>
            <h2 id="sched-h" className="text-3xl font-extrabold sm:text-[2.5rem]">Choose a cleaning schedule that works for you</h2>
            <p className="mt-3 text-lg">No lock-in. Change frequency or pause whenever life changes.{site.recurringOffer ? ` ${site.recurringOffer}.` : ""}</p>
          </div>
          <ul className="grid gap-4 sm:grid-cols-3">
            {schedules.map((s) => (
              <li key={s.value}>
                <TrackedLink cta={`schedule_${s.value}`} href={`/quote?service=regular-house-cleaning&frequency=${s.value}`} className="group flex h-full flex-col rounded-[var(--radius-card)] border-2 border-violet/40 bg-white p-6 transition hover:border-violet hover:shadow-lift">
                  <span className="flex items-center gap-3 font-display text-xl font-bold text-navy"><Icon name="calendar" className="size-6 text-violet" />{s.label}</span>
                  <span className="mt-3 flex-1 leading-relaxed">{s.body}</span>
                  <span className="mt-4 inline-flex items-center gap-1.5 font-display font-semibold text-violet">Quote {s.label.toLowerCase()} <Icon name="arrow" className="size-4 transition-transform group-hover:translate-x-1" /></span>
                </TrackedLink>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* WHY SWEPT */}
      <section className="container-x pt-16 sm:pt-20" aria-labelledby="why-h">
        <div className="band grid gap-8 px-6 py-10 sm:px-10 lg:grid-cols-[1fr_1.6fr] lg:items-center lg:py-12">
          <SweptMark tone="white" size={260} className="pointer-events-none absolute -right-14 -top-16 opacity-15" />
          <div className="relative lg:border-r lg:border-white/25 lg:pr-10">
            <h2 id="why-h" className="text-3xl font-extrabold !text-white sm:text-[2.5rem]">Why choose Swept?</h2>
            <Link href="/why-swept" className="mt-4 inline-flex items-center gap-1.5 font-display font-semibold text-white underline decoration-white/40 underline-offset-4 hover:decoration-white">How we work <Icon name="arrow" className="size-4" /></Link>
          </div>
          <ul className="relative space-y-4">
            {site.commitments.map((c) => (
              <li key={c.title} className="flex gap-3">
                <Icon name="checkCircle" className="mt-0.5 size-6 shrink-0" />
                <span><strong className="font-display text-lg font-semibold text-white">{c.title}.</strong> <span className="text-white/85">{c.body}</span></span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* AREAS */}
      <section className="container-x py-16 sm:py-20" aria-labelledby="areas-h">
        <div className="card grid gap-8 p-6 sm:p-10 lg:grid-cols-[0.9fr_2fr] lg:items-center">
          <div className="flex items-start gap-4">
            <Icon name="pin" className="size-10 shrink-0 text-violet" />
            <div>
              <h2 id="areas-h" className="text-2xl font-extrabold sm:text-3xl">Serving Brisbane to Tweed Heads</h2>
              <p className="mt-2">Across South East Queensland and over the border into NSW.</p>
            </div>
          </div>
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {regions.map((r) => (
              <li key={r.href}>
                <Link href={r.href} className="flex h-full flex-col items-center gap-2 rounded-2xl p-3 text-center font-medium text-navy hover:bg-lavender">
                  <Icon name={r.icon} className="size-9 text-navy" strokeWidth={1.4} />
                  <span className="text-sm">{r.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* FAQ */}
      <section className="container-x pb-4" aria-labelledby="faq-h">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_2fr]">
          <div>
            <h2 id="faq-h" className="text-3xl font-extrabold sm:text-[2.5rem]">Questions, answered</h2>
            <p className="mt-3 text-lg">Can&apos;t see yours? <Link href="/faq" className="font-semibold text-violet underline underline-offset-4">Read all FAQs</Link> or <Link href="/contact" className="font-semibold text-violet underline underline-offset-4">ask us</Link>.</p>
          </div>
          <Faqs faqs={homeFaqs} />
        </div>
      </section>

      <CtaBand />
    </>
  );
}
