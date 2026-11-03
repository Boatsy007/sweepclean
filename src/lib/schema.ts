import { site, siteUrl } from "./site";
import { areas } from "./areas";
import type { Faq, Service } from "./services";

const id = (frag: string) => `${siteUrl()}/#${frag}`;

export function businessSchema() {
  const b: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    additionalType: "https://en.wikipedia.org/wiki/Housekeeping",
    "@id": id("business"),
    name: `${site.name} Cleaning`,
    alternateName: site.name,
    url: siteUrl(),
    logo: `${siteUrl()}/brand/swept-logo.png`,
    image: `${siteUrl()}/opengraph-image`,
    description: site.description,
    areaServed: areas.map((a) => ({
      "@type": "City",
      name: a.name,
      containedInPlace: { "@type": "State", name: a.state === "QLD" ? "Queensland" : "New South Wales" },
    })),
    knowsLanguage: "en-AU",
  };
  if (site.phone) b.telephone = site.phone;
  if (site.email) b.email = site.email;
  if (site.legalName) b.legalName = site.legalName;
  if (site.abn) b.taxID = site.abn;
  return b;
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": id("website"),
    url: siteUrl(),
    name: `${site.name} Cleaning`,
    inLanguage: "en-AU",
    publisher: { "@id": id("business") },
  };
}

export function serviceSchema(s: Service) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: s.name,
    serviceType: s.name,
    description: s.metaDescription,
    url: `${siteUrl()}/services/${s.slug}`,
    provider: { "@id": id("business") },
    areaServed: areas.map((a) => ({ "@type": "City", name: a.name })),
  };
}

export function faqSchema(faqs: Faq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: `${siteUrl()}${it.path}`,
    })),
  };
}
