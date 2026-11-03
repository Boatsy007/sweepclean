import Link from "next/link";
import { Suspense } from "react";
import { site, telHref } from "@/lib/site";
import { breadcrumbSchema } from "@/lib/schema";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Icon } from "@/components/Icon";
import { JsonLd } from "@/components/JsonLd";
import { QuoteForm } from "@/components/QuoteForm";

export const metadata = {
  title: "Contact Swept – Cleaning Quotes & Call Backs",
  description: "Contact Swept Cleaning for a free house cleaning quote or a call back. Serving Brisbane, Logan, the Gold Coast and Tweed Heads.",
  alternates: { canonical: "/contact" },
};

export default function Contact() {
  const crumbs = [{ name: "Home", path: "/" }, { name: "Contact", path: "/contact" }];
  return (
    <>
      <JsonLd data={breadcrumbSchema(crumbs)} />
      <section className="bg-gradient-to-b from-white to-lavender/60">
        <div className="container-x grid gap-10 pb-16 pt-10 lg:grid-cols-[1fr_1.3fr]">
          <div>
            <Breadcrumbs items={crumbs} />
            <h1 className="text-4xl font-extrabold sm:text-5xl">Talk to Swept</h1>
            <p className="mt-4 text-lg leading-relaxed">The fastest way to a price is our <Link href="/quote" className="font-semibold text-violet underline underline-offset-4">online quote</Link>. Prefer to chat first? Leave your number and we&apos;ll call you back.</p>
            <ul className="mt-8 space-y-5">
              {site.phone && <li className="flex gap-4"><Icon name="phone" className="size-6 text-violet" /><a href={telHref(site.phone)} className="font-display text-xl font-semibold text-navy">{site.phone}</a></li>}
              {site.email && <li className="flex gap-4"><Icon name="mail" className="size-6 text-violet" /><a href={`mailto:${site.email}`} className="font-display text-xl font-semibold text-navy">{site.email}</a></li>}
              <li className="flex gap-4"><Icon name="clock" className="size-6 shrink-0 text-violet" /><span><strong className="block text-navy">Enquiry hours</strong>{site.responseHours}</span></li>
              <li className="flex gap-4"><Icon name="pin" className="size-6 shrink-0 text-violet" /><span><strong className="block text-navy">Service area</strong>Brisbane, Logan, Gold Coast and Tweed Heads. <Link href="/areas" className="text-violet underline underline-offset-4">See all areas</Link></span></li>
            </ul>
          </div>
          <Suspense fallback={<div className="card h-96" />}>
            <QuoteFormCallback />
          </Suspense>
        </div>
      </section>
    </>
  );
}

function QuoteFormCallback() {
  return <QuoteForm initialMode="callback" />;
}
