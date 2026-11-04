import { generalFaqs } from "@/lib/faqs";
import { services } from "@/lib/services";
import { breadcrumbSchema, faqSchema } from "@/lib/schema";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CtaBand } from "@/components/CtaBand";
import { Faqs } from "@/components/Faqs";
import { JsonLd } from "@/components/JsonLd";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "House Cleaning FAQs: Pricing, Bond & NDIS | Swept",
  description: "Answers to common questions about Swept house cleaning: pricing, scheduling, contracts, access, products, bond cleaning and NDIS cleaning.",
  path: "/faq",
});

export default function FaqPage() {
  const crumbs = [{ name: "Home", path: "/" }, { name: "FAQs", path: "/faq" }];
  return (
    <>
      {/* Service FAQs carry their own FAQPage markup on each service page; mark up only the general ones here. */}
      <JsonLd data={[faqSchema(generalFaqs), breadcrumbSchema(crumbs)]} />
      <section className="container-x pb-6 pt-10">
        <Breadcrumbs items={crumbs} />
        <h1 className="text-4xl font-extrabold sm:text-5xl">Frequently asked questions</h1>
        <p className="mt-4 max-w-2xl text-lg">Everything you might want to know before booking a clean.</p>
      </section>
      <section className="container-x space-y-12 py-8">
        <div>
          <h2 className="mb-5 text-2xl font-extrabold">General</h2>
          <Faqs faqs={generalFaqs} />
        </div>
        {services.map((s) => (
          <div key={s.slug} id={s.slug} className="scroll-mt-24">
            <h2 className="mb-5 text-2xl font-extrabold">{s.name}</h2>
            <Faqs faqs={s.faqs} />
          </div>
        ))}
      </section>
      <CtaBand />
    </>
  );
}
