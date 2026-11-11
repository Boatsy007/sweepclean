import Link from "next/link";
import { getImageProps } from "next/image";
import { preload } from "react-dom";
import { services } from "@/lib/services";
import { generalFaqs } from "@/lib/faqs";
import { site, telHref } from "@/lib/site";
import { Icon } from "@/components/Icon";
import { ServiceVisual } from "@/components/ServiceVisual";
import { photos } from "@/lib/photos";
import { Faqs } from "@/components/Faqs";
import { CtaBand } from "@/components/CtaBand";
import { HeroQuoteForm } from "@/components/HeroQuoteForm";
import { PromisePanel } from "@/components/SweptPromise";
import { TrackedLink } from "@/components/TrackedLink";
import { tasks } from "@/lib/tasks";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "House Cleaning Brisbane, Logan & Gold Coast | Swept Cleaning",
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

/**
 * Mobile-only hero photo: a <picture> whose only source applies below 1024px, so desktop never downloads it.
 * One fixed 750px file (it sits under a white veil, so more detail isn't visible), preloaded for phones only,
 * so the preload and the image are always the same download.
 */
function MobileHeroPhoto() {
  const w = 750;
  const h = Math.round((photos.bathroom.src.height / photos.bathroom.src.width) * w);
  const { props } = getImageProps({ src: photos.bathroom.src, alt: "", width: w, height: h, quality: 70 });
  const url = (props.srcSet ?? props.src).split(",")[0].trim().split(" ")[0]; // the 1x (≈750px) file
  preload(url, { as: "image", fetchPriority: "high", media: "(max-width: 1023px)" });
  return (
    <picture>
      <source media="(max-width: 1023px)" srcSet={url} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" alt="" loading="eager" decoding="async" fetchPriority="high" className="absolute inset-0 size-full object-cover object-[72%_40%]" />
    </picture>
  );
}

export default function Home() {
  const homeFaqs = generalFaqs.slice(0, 6);
  return (
    <>

      {/* HERO – headline + quote form above the fold */}
      <section className="relative isolate overflow-hidden bg-white">
        {/* Very soft lavender light, top right – the only decoration; the logo carries the personality */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 hidden lg:block bg-[radial-gradient(60rem_32rem_at_100%_0%,rgb(246_240_255)_0%,rgb(246_240_255/0.6)_45%,transparent_75%)]" />
        <div className="container-x grid items-center gap-6 pb-10 pt-5 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14 lg:pb-20 lg:pt-12">
          <div className="hero-drift relative min-w-0">
            {/* Phones/tablets: a bright, airy photo behind the headline under a soft white veil, fading into white */}
            <div aria-hidden="true" className="pointer-events-none absolute -left-4 -right-4 -top-5 bottom-[-1.5rem] -z-10 overflow-hidden sm:-left-6 sm:-right-6 lg:hidden">
              <MobileHeroPhoto />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(255_255_255/0.74)_0%,rgb(255_255_255/0.6)_40%,rgb(255_255_255/0.72)_72%,#fff_100%)]" />
            </div>
            <h1 className="intro-solid text-[2.5rem] font-extrabold leading-[1.04] !text-navy sm:text-6xl lg:text-[3.9rem]">
              <span className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-lilac bg-white/90 px-2.5 py-1 font-display shadow-[0_2px_10px_-6px_rgb(6_27_73/0.25)] lg:bg-lavender/70 lg:shadow-none text-[0.62rem] font-semibold uppercase leading-normal tracking-[0.05em] text-violet-ink min-[380px]:whitespace-nowrap min-[400px]:tracking-[0.09em] lg:mb-6 lg:gap-2 lg:px-4 lg:py-2 lg:text-[0.8rem] lg:tracking-[0.14em]">
                <Icon name="sparkle" className="size-3.5 text-violet lg:size-4" /> House cleaning · Brisbane, Logan & Gold Coast
              </span>{" "}
              <span className="sr-only">– </span>
              <span className="block">A beautifully clean home.</span>{" "}
              <span className="relative inline-block text-violet">
                More time for you.
                <svg aria-hidden="true" viewBox="0 0 300 18" preserveAspectRatio="none" className="absolute -bottom-3 left-0 h-3 w-[72%] text-violet/70"><path d="M3 14C70 4 190 0 297 9" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" /></svg>
              </span>
            </h1>
            <p className="intro mt-6 max-w-xl text-[1.05rem] leading-relaxed text-navy [--d:160ms] sm:text-xl lg:mt-8">
              Flexible weekly, fortnightly and monthly home cleaning, tailored to your home – across Brisbane, Logan, the Gold Coast and Tweed Heads.
            </p>
            <ul className="intro mt-5 grid gap-2.5 text-[1rem] font-medium text-navy [--d:280ms] sm:text-[1.05rem] lg:mt-7 lg:grid-cols-2 lg:gap-x-6 lg:gap-y-3">
              {[
                { icon: "check", text: "No lock-in contracts" },
                { icon: "doc", text: "Personalised cleaning checklists" },
                { icon: "sparkle", text: "Free, no-obligation quotes" },
              ].map((b) => (
                <li key={b.text} className="flex items-center gap-3">
                  <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-white text-violet shadow-[0_2px_10px_-6px_rgb(6_27_73/0.3)] ring-1 ring-lilac lg:bg-lavender lg:shadow-none lg:ring-0"><Icon name={b.icon} className="size-5" strokeWidth={2} /></span>
                  {b.text}
                </li>
              ))}
              <li className="flex items-center gap-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-white text-violet shadow-[0_2px_10px_-6px_rgb(6_27_73/0.3)] ring-1 ring-lilac lg:bg-lavender lg:shadow-none lg:ring-0"><Icon name="shieldSparkle" className="size-5" strokeWidth={2} /></span>
                <Link href={site.promise.path} className="font-display font-semibold text-violet underline decoration-violet/30 underline-offset-4 hover:decoration-violet">Backed by {site.promise.name}</Link>
              </li>
            </ul>
            {/* One clear primary action, phone as secondary, services as a text link */}
            <div className="intro mt-7 [--d:400ms] lg:mt-9 lg:flex lg:flex-wrap lg:items-center lg:gap-4">
              <a href="#quote" className="btn-primary !min-h-14 w-full whitespace-nowrap text-[1.08rem] lg:w-auto lg:!px-9">Get my free quote <Icon name="arrow" className="size-[1.1rem]" /></a>
              <div className="mt-3 flex items-center justify-between gap-3 lg:mt-0 lg:justify-start lg:gap-6">
                {site.phone && (
                  <a href={telHref(site.phone)} className="btn-outline !min-h-12 whitespace-nowrap !px-5 text-[0.98rem]">
                    <Icon name="phone" className="size-[1.1rem]" />{site.phone}
                  </a>
                )}
                <Link href="/services" className="inline-flex items-center gap-1 whitespace-nowrap font-display text-[0.98rem] font-semibold text-violet underline decoration-violet/40 underline-offset-4 hover:decoration-violet">
                  Explore services <Icon name="arrow" className="size-4" />
                </Link>
              </div>
            </div>
          </div>

          <div className="intro-right [--d:220ms]">
            <HeroQuoteForm promiseNote />
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="container-x py-16 sm:py-20" aria-labelledby="services-h">
        <div className="mx-auto max-w-2xl text-center">
          <h2 id="services-h" className="text-3xl font-extrabold sm:text-[2.6rem]">Our cleaning services</h2>
          <p className="mt-3 text-lg">A complete range of home cleaning services to keep your home fresh, clean and comfortable.</p>
        </div>
        <ul className="reveal-stagger mt-8 grid gap-4 sm:mt-10 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
          {services.slice(0, 4).map((s) => {
            return (
              <li key={s.slug}>
                <Link href={`/services/${s.slug}`} className="card group flex h-full flex-row-reverse overflow-hidden transition-shadow hover:shadow-lift sm:flex-col">
                  <div className="relative flex-1 p-4 pr-9 sm:p-6">
                    <Icon name="arrow" className="absolute right-3.5 top-4 size-5 text-violet sm:hidden" />
                    <Icon name={s.icon} className="hidden size-8 text-violet sm:block" />
                    <h3 className="text-lg font-bold leading-tight sm:mt-3 sm:text-xl">{s.name}</h3>
                    <p className="mt-1.5 text-[0.95rem] leading-relaxed sm:mt-2 sm:text-base">{s.summary}</p>
                    {s.availability && <p className="mt-2 hidden text-sm text-slate sm:block">Availability confirmed on enquiry.</p>}
                  </div>
                  <div className="reveal-zoom relative w-[7.25rem] shrink-0 overflow-hidden sm:w-auto">
                    <ServiceVisual service={s} sizes="(min-width: 1024px) 280px, (min-width: 640px) 50vw, 120px" className="h-full w-full sm:aspect-[5/3] sm:h-auto" />
                    <span className="absolute bottom-3 right-3 hidden size-10 place-items-center rounded-full bg-white text-violet shadow-soft transition-transform group-hover:translate-x-0.5 sm:grid">
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
          <div className="relative lg:border-r lg:border-lilac lg:pr-10">
            <h2 id="way-h" className="text-3xl font-extrabold !text-navy sm:text-[2.5rem]">Your clean, your way</h2>
            <p className="mt-3 text-lg">A flexible, customised clean that covers the areas that matter most to you.</p>
          </div>
          <div className="relative">
            <ul className="grid grid-cols-2 gap-x-5 gap-y-3 sm:gap-x-8 lg:grid-cols-3">
              {tasks.map((t) => (
                <li key={t.name} className="flex items-center gap-2.5 text-[0.98rem] font-medium text-navy sm:text-[1.05rem]"><Icon name="checkCircle" className="size-5 shrink-0 text-violet sm:size-6" />{t.name}</li>
              ))}
            </ul>
            <p className="mt-5 italic">Customise the tasks to your home and schedule.</p>
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
          <div className="relative lg:border-r lg:border-lilac lg:pr-10">
            <h2 id="why-h" className="text-3xl font-extrabold !text-navy sm:text-[2.5rem]">Why choose Swept?</h2>
            <Link href="/why-swept" className="mt-4 inline-flex items-center gap-1.5 font-display font-semibold text-violet underline decoration-violet/40 underline-offset-4 hover:decoration-violet">How we work <Icon name="arrow" className="size-4" /></Link>
          </div>
          <ul className="relative space-y-4">
            {site.commitments.map((c) => (
              <li key={c.title} className="flex gap-3">
                <Icon name="checkCircle" className="mt-0.5 size-6 shrink-0 text-violet" />
                <span><strong className="font-display text-lg font-semibold text-navy">{c.title}.</strong> <span>{c.body}</span></span>
              </li>
            ))}
            {(site.insured || site.policeChecked) && (
              <li className="flex gap-3">
                <Icon name="shield" className="mt-0.5 size-6 shrink-0 text-violet" />
                <span><strong className="font-display text-lg font-semibold text-navy">{site.insured && site.policeChecked ? "Insured and police-checked." : site.insured ? "Fully insured." : "Police-checked cleaners."}</strong> <span>{[site.insured && "We hold current public liability insurance", site.policeChecked && "every cleaner holds a current national police check"].filter(Boolean).join(", and ")}.</span></span>
              </li>
            )}
          </ul>
          <PromisePanel className="lg:col-span-2" />
        </div>
      </section>

      {/* AREAS */}
      <section className="container-x py-16 sm:py-20" aria-labelledby="areas-h">
        <div className="card grid gap-8 p-6 sm:p-10 lg:grid-cols-[0.9fr_2fr] lg:items-center">
          <div className="flex items-start gap-4">
            <Icon name="pin" className="size-10 shrink-0 text-violet" />
            <div>
              <h2 id="areas-h" className="text-2xl font-extrabold sm:text-3xl">Serving Brisbane, Logan, the Gold Coast &amp; Tweed Heads</h2>
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
