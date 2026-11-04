import Link from "next/link";
import { services } from "@/lib/services";
import { generalFaqs } from "@/lib/faqs";
import { site, telHref } from "@/lib/site";
import { Icon } from "@/components/Icon";
import { SweptMark } from "@/components/SweptMark";
import { ServiceVisual } from "@/components/ServiceVisual";
import { photos } from "@/lib/photos";
import { Faqs } from "@/components/Faqs";
import { CtaBand } from "@/components/CtaBand";
import { HeroQuoteForm } from "@/components/HeroQuoteForm";
import { HeroBackground } from "@/components/HeroBackground";
import { TrackedLink } from "@/components/TrackedLink";
import { tasks } from "@/lib/tasks";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "House Cleaning Brisbane to Tweed Heads | Swept Cleaning",
  description: "Weekly, fortnightly and monthly house cleaning across Brisbane, Logan, the Gold Coast and Tweed Heads. No lock-in contracts. Get a free written quote online.",
  path: "/",
});


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

      {/* HERO – headline + quote form above the fold */}
      <section className="relative isolate overflow-hidden bg-violet text-white">
        <HeroBackground src={photos.bathroom.src} className="hero-parallax -z-20 object-cover object-[70%_50%]" />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,#3a0174_0%,#2b0857_100%)] lg:bg-[linear-gradient(90deg,rgb(30_8_56/0.88)_0%,rgb(36_8_70/0.78)_38%,rgb(36_8_70/0.5)_54%,rgb(20_8_40/0.12)_72%,rgb(20_8_40/0)_100%)]" />
        <SweptMark tone="white" size={360} className="spin-on-scroll pointer-events-none absolute -left-24 -top-20 -z-10 hidden opacity-[0.07] lg:block" />
        <div className="container-x grid items-center gap-10 pb-14 pt-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14 lg:pb-20 lg:pt-12">
          <div className="hero-drift">
            <h1 className="intro-solid text-[2.5rem] font-extrabold leading-[1.04] !text-white sm:text-6xl lg:text-[3.9rem]">
              <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/35 bg-white/10 px-4 py-2 font-display text-[0.8rem] font-semibold uppercase leading-normal tracking-[0.14em]">
                <Icon name="sparkle" className="size-4" /> House cleaning · Brisbane to Tweed Heads
              </span>{" "}
              <span className="sr-only">– </span>
              <span className="block">A beautifully clean home.</span>{" "}
              <span className="relative inline-block text-[#e9d8ff]">
                More time for you.
                <svg aria-hidden="true" viewBox="0 0 300 18" preserveAspectRatio="none" className="absolute -bottom-3 left-0 h-3.5 w-full text-[#c9a8ff]"><path d="M3 14C70 4 190 0 297 9" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" /></svg>
              </span>
            </h1>
            <p className="intro mt-7 max-w-xl text-lg leading-relaxed text-white/90 [--d:160ms] sm:text-xl">
              Flexible weekly, fortnightly and monthly home cleaning, tailored to your home – across Brisbane, Logan, the Gold Coast and Tweed Heads.
            </p>
            <ul className="intro mt-7 grid gap-3 text-[1rem] font-medium [--d:280ms] sm:grid-cols-2">
              {["Free, no-obligation quotes", "No lock-in contracts", "The same checklist every visit", `We reply ${site.quoteResponse}`].map((t) => (
                <li key={t} className="flex items-center gap-2.5"><Icon name="checkCircle" className="size-5 shrink-0 text-[#d9bfff]" />{t}</li>
              ))}
            </ul>
            <div className="intro mt-8 flex flex-wrap gap-3 [--d:400ms]">
              <a href="#quote" className="btn-white lg:hidden">Get my free quote <Icon name="arrow" className="size-4 rotate-90" /></a>
              {site.phone && (
                <a href={telHref(site.phone)} className="btn-white"><Icon name="phone" className="size-5" />{site.phone}</a>
              )}
              <Link href="/services" className="btn border-2 border-white/60 text-white hover:bg-white hover:text-violet">Explore our services</Link>
            </div>
          </div>

          <div className="intro-right [--d:220ms]">
            <HeroQuoteForm />
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="container-x py-16 sm:py-20" aria-labelledby="services-h">
        <div className="mx-auto max-w-2xl text-center">
          <h2 id="services-h" className="text-3xl font-extrabold sm:text-[2.6rem]">Our cleaning services</h2>
          <p className="mt-3 text-lg">A complete range of home cleaning services to keep your home fresh, clean and comfortable.</p>
        </div>
        <ul className="reveal-stagger mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {services.slice(0, 4).map((s) => {
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
                  <div className="reveal-zoom relative hidden overflow-hidden sm:block">
                    <ServiceVisual service={s} sizes="(min-width: 1024px) 280px, 50vw" className="aspect-[5/3] w-full" />
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
        <div className="reveal mt-6 flex flex-col gap-4 rounded-[var(--radius-card)] border border-lilac bg-white p-5 sm:flex-row sm:items-center sm:gap-6 sm:p-6">
          <p className="shrink-0 font-display text-lg font-bold text-navy">Also available</p>
          <ul className="flex flex-wrap gap-3">
            {services.slice(4).map((s) => (
              <li key={s.slug}>
                <Link href={`/services/${s.slug}`} className="inline-flex items-center gap-2 rounded-full border-2 border-lilac px-4 py-2 font-medium text-navy transition-colors hover:border-violet hover:text-violet">
                  <Icon name={s.icon} className="size-5 text-violet" />{s.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* YOUR CLEAN, YOUR WAY */}
      <section className="container-x" aria-labelledby="way-h">
        <div className="band grid gap-8 px-6 py-10 sm:px-10 lg:grid-cols-[0.75fr_1.65fr] lg:items-center lg:py-12">
          <SweptMark tone="white" size={260} className="spin-on-scroll pointer-events-none absolute -bottom-16 -right-12 opacity-15" />
          <div className="relative lg:border-r lg:border-white/25 lg:pr-10">
            <h2 id="way-h" className="text-3xl font-extrabold !text-white sm:text-[2.5rem]">Your clean, your way</h2>
            <p className="mt-3 text-lg text-white/90">A flexible, customised clean that covers the areas that matter most to you.</p>
          </div>
          <div className="relative">
            <ul className="grid grid-cols-2 gap-x-5 gap-y-3 sm:gap-x-8 lg:grid-cols-3">
              {tasks.map((t) => (
                <li key={t.name} className="flex items-center gap-2.5 text-[0.98rem] font-medium sm:text-[1.05rem]"><Icon name="checkCircle" className="size-5 shrink-0 sm:size-6" />{t.name}</li>
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
          <ol className="reveal-stagger grid gap-5 sm:grid-cols-3">
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
          <ul className="reveal-stagger grid gap-4 sm:grid-cols-3">
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
          <SweptMark tone="white" size={260} className="spin-on-scroll pointer-events-none absolute -right-14 -top-16 opacity-15" />
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
          <ul className="reveal-stagger grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
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
