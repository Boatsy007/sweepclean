import Link from "next/link";
import { Suspense } from "react";
import { site, siteUrl, telHref, trustLabel } from "@/lib/site";
import { areas } from "@/lib/areas";
import { suburbsIn } from "@/lib/suburbs";
import type { Faq } from "@/lib/services";
import { breadcrumbSchema, faqSchema } from "@/lib/schema";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CtaBand } from "@/components/CtaBand";
import { Faqs } from "@/components/Faqs";
import { Icon } from "@/components/Icon";
import { JsonLd } from "@/components/JsonLd";
import { QuoteForm } from "@/components/QuoteForm";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Contact Us: Quotes, Calls & Email | Swept Cleaning",
  description: "Contact Swept Cleaning by phone, email or online for a free quote or a call back – homes and businesses in Brisbane, Logan, the Gold Coast and Tweed Heads.",
  path: "/contact",
});

const ways = [
  {
    icon: "doc",
    title: "Get a quote online",
    body: `The fastest way to a price. Tell us about your home in about two minutes and we'll reply with a written quote ${site.quoteResponse}.`,
    href: "/quote",
    cta: "Start your quote",
  },
  ...(site.phone
    ? [{ icon: "phone", title: "Call us", body: `Talk to us about your clean, ${site.responseHours.replace(/\s*\(AEST\)/, "")} (Queensland time).`, href: telHref(site.phone), cta: site.phone }]
    : []),
  ...(site.email
    ? [{ icon: "mail", title: "Email us", body: "Send photos, your condition report for a bond clean, or questions about a regular booking.", href: `mailto:${site.email}`, cta: site.email }]
    : []),
  {
    icon: "chat",
    title: "Request a call back",
    body: "Busy right now? Leave your number with the form on this page and choose a time that suits – we'll call you.",
    href: "#callback",
    cta: "Request a call back",
  },
];

const include = [
  "Your suburb and postcode",
  "The type of clean – regular, detailed, bond, NDIS, Airbnb, carpet or commercial",
  "Bedrooms, bathrooms and living areas (or the size of your premises)",
  "How often you'd like us to come, and your preferred day",
  "Pets, access details (key, lockbox or building access) and anything we should focus on",
  "For a bond clean: your vacate date and a copy of your entry condition report",
];

const faqs: Faq[] = [
  {
    q: "How quickly will you get back to me?",
    a: `We reply to quote requests and messages ${site.quoteResponse}. Our enquiry hours are ${site.responseHours}.`,
  },
  {
    q: "Can I send photos or my condition report?",
    a: site.email
      ? `Yes. Email them to ${site.email} with your name and suburb, or mention in your quote request that you'll send them. Photos help us give a more accurate price.`
      : "Yes. Mention it in your quote request and we'll tell you how to send them. Photos help us give a more accurate price.",
  },
  {
    q: "Do you have a shopfront I can visit?",
    a: "No – we're a mobile cleaning service and our team comes to you. The quickest way to reach us is by phone, email or the online quote form.",
  },
  {
    q: "Which time zone are bookings in?",
    a: "Queensland time for Brisbane, Logan and the Gold Coast. For Tweed Heads we confirm bookings in NSW time, which is an hour ahead of Queensland from October to April.",
  },
  {
    q: "What if my suburb isn't listed?",
    a: "Get in touch anyway. We clean across Brisbane, Logan, the Gold Coast and Tweed Heads, and we'll let you know straight away if we can reach you.",
  },
];

export default function Contact() {
  const crumbs = [{ name: "Home", path: "/" }, { name: "Contact", path: "/contact" }];
  const contactPage = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "@id": `${siteUrl()}/contact#page`,
    url: `${siteUrl()}/contact`,
    name: "Contact Swept Cleaning",
    about: { "@id": `${siteUrl()}/#business` },
    mainEntity: { "@id": `${siteUrl()}/#business` },
  };
  return (
    <>
      <JsonLd data={[contactPage, breadcrumbSchema(crumbs), faqSchema(faqs)]} />
      <section className="bg-gradient-to-b from-white to-lavender/60">
        <div className="container-x grid gap-10 pb-16 pt-10 lg:grid-cols-[1fr_1.3fr]">
          <div>
            <Breadcrumbs items={crumbs} />
            <h1 className="text-4xl font-extrabold sm:text-5xl">Contact Swept Cleaning</h1>
            <p className="mt-4 text-lg leading-relaxed">The fastest way to a price is our <Link href="/quote" className="font-semibold text-violet underline underline-offset-4">online quote</Link>. Prefer to chat first? Call, email, or leave your number and we&apos;ll call you back.</p>
            <ul className="mt-8 space-y-5">
              {site.phone && <li className="flex gap-4"><Icon name="phone" className="size-6 text-violet" /><a href={telHref(site.phone)} className="font-display text-xl font-semibold text-navy">{site.phone}</a></li>}
              {site.email && <li className="flex gap-4"><Icon name="mail" className="size-6 text-violet" /><a href={`mailto:${site.email}`} className="font-display text-xl font-semibold text-navy">{site.email}</a></li>}
              <li className="flex gap-4"><Icon name="clock" className="size-6 shrink-0 text-violet" /><span><strong className="block text-navy">Enquiry hours</strong>{site.responseHours}</span></li>
              <li className="flex gap-4"><Icon name="pin" className="size-6 shrink-0 text-violet" /><span><strong className="block text-navy">Service area</strong>Brisbane, Logan, Gold Coast and Tweed Heads</span></li>
              {trustLabel() && <li className="flex gap-4"><Icon name="shield" className="size-6 shrink-0 text-violet" /><span><strong className="block text-navy">{trustLabel()}</strong>Every clean is backed by <Link href={site.promise.path} className="font-semibold text-violet underline underline-offset-2">{site.promise.name}</Link>.</span></li>}
            </ul>
          </div>
          <div id="callback" className="scroll-mt-28">
            <Suspense fallback={<div className="card h-96" />}>
              <QuoteForm initialMode="callback" />
            </Suspense>
          </div>
        </div>
      </section>

      <section className="container-x py-16" aria-labelledby="ways-h">
        <h2 id="ways-h" className="text-3xl font-extrabold sm:text-[2.4rem]">Ways to reach us</h2>
        <ul className="reveal-stagger mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {ways.map((w) => (
            <li key={w.title} className="card flex flex-col p-6">
              <span className="grid size-12 place-items-center rounded-xl bg-violet text-white"><Icon name={w.icon} className="size-6" /></span>
              <h3 className="mt-4 text-lg font-bold">{w.title}</h3>
              <p className="mt-2 flex-1 leading-relaxed">{w.body}</p>
              <a href={w.href} className="mt-4 break-words font-display font-semibold text-violet underline underline-offset-4">{w.cta}</a>
            </li>
          ))}
        </ul>
      </section>

      <section className="bg-lavender py-16" aria-labelledby="include-h">
        <div className="container-x grid gap-10 lg:grid-cols-2">
          <div>
            <h2 id="include-h" className="text-3xl font-extrabold">What to include in your enquiry</h2>
            <p className="mt-3 text-lg leading-relaxed">The more we know, the more accurate your quote. You don&apos;t need everything – just what you have.</p>
            <ul className="mt-6 space-y-3">
              {include.map((t) => <li key={t} className="flex gap-3"><Icon name="checkCircle" className="mt-0.5 size-6 shrink-0 text-violet" />{t}</li>)}
            </ul>
          </div>
          <div>
            <h2 className="text-3xl font-extrabold">Where we clean</h2>
            <p className="mt-3 text-lg leading-relaxed">Homes and businesses across four regions of South East Queensland and northern NSW.</p>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {areas.map((a) => (
                <li key={a.slug}>
                  <Link href={`/areas/${a.slug}`} className="card flex items-center gap-3 p-4 hover:shadow-lift">
                    <Icon name="pin" className="size-5 shrink-0 text-violet" />
                    <span><span className="block font-display font-semibold text-navy">{a.name} {a.state}</span><span className="block text-sm">{suburbsIn(a.slug).length} suburbs</span></span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="container-x grid gap-8 py-16 lg:grid-cols-[0.8fr_2fr]" aria-labelledby="cfaq-h">
        <h2 id="cfaq-h" className="text-3xl font-extrabold">Contact FAQs</h2>
        <Faqs faqs={faqs} />
      </section>

      <CtaBand id="contact_band" />
    </>
  );
}
