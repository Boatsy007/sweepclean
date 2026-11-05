import Link from "next/link";
import { site, telHref } from "@/lib/site";
import { services, type Faq } from "@/lib/services";
import { breadcrumbSchema, faqSchema } from "@/lib/schema";
import { pageMeta } from "@/lib/seo";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CtaBand } from "@/components/CtaBand";
import { Faqs } from "@/components/Faqs";
import { Icon } from "@/components/Icon";
import { JsonLd } from "@/components/JsonLd";
import { SweptMark } from "@/components/SweptMark";
import { PromiseSeal } from "@/components/SweptPromise";

const p = site.promise;

export const metadata = pageMeta({
  title: "The Swept Promise: Our Cleaning Guarantee | Swept Cleaning",
  description: "If an agreed cleaning task isn't done right, tell us by the end of the next business day and we'll come back and fix it at no extra charge.",
  path: p.path,
});

const stepIcons = ["doc", "chat", "sparkle", "shield"];

const covered = [
  "Every task on the checklist agreed for your clean",
  "Regular, detailed, NDIS, bond, Airbnb and carpet cleans",
  "Commercial and office cleans",
  "First-time and one-off cleans, not just regular bookings",
];

const goodToKnow = [
  "It covers what's on your agreed checklist. Anything extra is quoted separately.",
  "Marks, stains or wear that can't be removed by cleaning aren't covered – we'll tell you honestly if something won't come up.",
  "Let us know before the area is used or disturbed again, so we can see what needs attention.",
  "We'll arrange the return visit at a time that suits you and gives us access to the area.",
];

const faqs: Faq[] = [
  {
    q: "How long do I have to let you know?",
    a: "Until the end of the next business day after your clean. Business days are Monday to Friday, excluding public holidays – so for a clean on a Friday or Saturday, you have until the end of the following Monday.",
  },
  {
    q: "Is there a charge for the return visit?",
    a: "No. If an agreed task was missed or not done properly, we come back and put that area right at no extra charge.",
  },
  {
    q: "Does The Swept Promise apply to commercial cleaning?",
    a: "Yes. It applies to residential and commercial cleans alike, based on the checklist agreed for your home or workplace.",
  },
  {
    q: "Does it cover bond cleaning?",
    a: "Yes, for the tasks on your agreed bond clean checklist – let us know by the end of the next business day after the clean. If your property manager later raises a cleaning issue with something we cleaned, tell us and we'll work with you to fix it.",
  },
  {
    q: "What isn't covered?",
    a: "Tasks that weren't part of the agreed checklist, marks or damage that cleaning can't remove, and areas that have been used or disturbed since the clean. If you're not sure, ask us – we'd rather check than leave you unhappy.",
  },
  {
    q: "What happens if the issue still isn't resolved?",
    a: "A member of our management team personally reviews your concern and works through it with you.",
  },
  {
    q: "Does The Swept Promise affect my consumer rights?",
    a: `No. ${p.acl} Under the Australian Consumer Law, services come with automatic consumer guarantees, including that they're provided with due care and skill.`,
  },
];

export default function SweptPromisePage() {
  const crumbs = [{ name: "Home", path: "/" }, { name: p.name, path: p.path }];
  return (
    <>
      <JsonLd data={[faqSchema(faqs), breadcrumbSchema(crumbs)]} />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white to-lavender/70">
        <div className="container-x pt-8 lg:pt-12"><Breadcrumbs items={crumbs} /></div>
        <div className="container-x grid items-center gap-6 pb-14 lg:grid-cols-[1.25fr_0.75fr] lg:gap-14 lg:pb-20">
          <div>
            <p className="eyebrow">Our customer promise</p>
            <h1 className="mt-3 text-[2.6rem] font-extrabold leading-[1.04] sm:text-6xl">{p.name}.</h1>
            <p className="mt-3 font-display text-2xl font-semibold text-violet sm:text-[1.9rem]">{p.tagline}</p>
            <p className="mt-5 max-w-xl text-lg leading-relaxed">{p.body}</p>
            <p className="mt-4 max-w-xl leading-relaxed">It&apos;s how we work on every clean – homes and businesses, first visit or fiftieth – so you can book Swept with confidence, even the first time.</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/quote" className="btn-primary !min-h-14 !px-7 text-lg">Get a free quote <Icon name="arrow" className="size-5" /></Link>
              {site.phone && <a href={telHref(site.phone)} className="btn-outline !min-h-14 !px-6"><Icon name="phone" className="size-5" />{site.phone}</a>}
            </div>
          </div>
          <div className="order-first flex justify-center lg:order-none">
            <PromiseSeal label className="size-44 sm:size-56 lg:size-80" />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="container-x py-16 sm:py-20" aria-labelledby="how-h">
        <p className="eyebrow">Four simple steps</p>
        <h2 id="how-h" className="mt-2 text-3xl font-extrabold sm:text-[2.5rem]">How {p.name} works</h2>
        <ol className="reveal-stagger mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {p.steps.map((s, i) => (
            <li key={s.title} data-step={String(i + 1).padStart(2, "0")} className="card relative flex flex-col overflow-hidden p-6 before:absolute before:-right-1 before:-top-4 before:font-display before:text-[5.5rem] before:font-extrabold before:leading-none before:text-lavender before:content-[attr(data-step)]">
              <span className="relative grid size-12 place-items-center rounded-xl bg-violet text-white"><Icon name={stepIcons[i]} className="size-6" /></span>
              <h3 className="relative mt-5 text-lg font-bold"><span className="sr-only">Step {i + 1}: </span>{s.title}</h3>
              <p className="relative mt-2 leading-relaxed">{s.body}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Homes and businesses */}
      <section className="container-x" aria-labelledby="scope-h">
        <div className="band grid gap-8 px-6 py-10 sm:px-10 lg:grid-cols-[1fr_1.3fr] lg:items-center lg:py-12">
          <div className="relative">
            <h2 id="scope-h" className="text-3xl font-extrabold sm:text-[2.3rem]">One standard, home or business</h2>
            <p className="mt-4 text-lg leading-relaxed">{p.name} applies to every service we offer. Whatever we&apos;ve agreed to clean, we stand behind it.</p>
          </div>
          <ul className="relative flex flex-wrap gap-2.5">
            {services.map((s) => (
              <li key={s.slug}>
                <Link href={`/services/${s.slug}`} className="inline-flex items-center gap-2 rounded-full border border-lilac bg-white px-4 py-2 font-display font-medium text-navy hover:border-violet hover:text-violet">
                  <Icon name={s.icon} className="size-4 text-violet" />{s.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Covered / good to know */}
      <section className="container-x grid gap-5 py-16 sm:py-20 lg:grid-cols-2" aria-labelledby="cover-h">
        <h2 id="cover-h" className="sr-only">What&apos;s covered</h2>
        <div className="card p-7">
          <h3 className="flex items-center gap-2.5 text-xl font-bold"><Icon name="checkCircle" className="size-6 text-violet" />What&apos;s covered</h3>
          <ul className="mt-4 space-y-3">
            {covered.map((t) => <li key={t} className="flex gap-2.5"><Icon name="check" className="mt-0.5 size-5 shrink-0 text-violet" />{t}</li>)}
          </ul>
        </div>
        <div className="card p-7">
          <h3 className="flex items-center gap-2.5 text-xl font-bold"><Icon name="doc" className="size-6 text-violet" />Good to know</h3>
          <ul className="mt-4 space-y-3">
            {goodToKnow.map((t) => <li key={t} className="flex gap-2.5"><span aria-hidden="true" className="mt-2.5 size-1.5 shrink-0 rounded-full bg-violet" />{t}</li>)}
          </ul>
        </div>
        <aside className="flex gap-4 rounded-[var(--radius-card)] border border-lilac bg-lavender p-6 lg:col-span-2" aria-label="Australian Consumer Law">
          <Icon name="shield" className="mt-0.5 size-7 shrink-0 text-violet" />
          <div>
            <h3 className="font-display text-lg font-bold">Your rights under the Australian Consumer Law</h3>
            <p className="mt-1.5 leading-relaxed">{p.acl} Under the Australian Consumer Law, services come with automatic consumer guarantees, including that they&apos;re provided with due care and skill.</p>
          </div>
        </aside>
      </section>

      <section className="container-x grid gap-8 pb-4 lg:grid-cols-[0.8fr_2fr]" aria-labelledby="pfaq-h">
        <h2 id="pfaq-h" className="text-3xl font-extrabold">{p.name}: FAQs</h2>
        <Faqs faqs={faqs} />
      </section>

      <CtaBand title="Book your first clean with confidence." body={`A written quote, an agreed checklist and ${p.name} on every visit.`} id="promise_band" />
    </>
  );
}
