import { site, siteUrl, telHref } from "./site";
import { areas } from "./areas";
import { services, type Faq, type Service } from "./services";

const id = (frag: string) => `${siteUrl()}/#${frag}`;

/** Stable identifiers for the site-wide entities. Reference these – never redeclare the business. */
export const orgId = () => id("organization");
export const websiteId = () => id("website");
/** `{ "@id": … }` reference to the one Swept business entity (declared in the root layout on every page). */
export const orgRef = () => ({ "@id": orgId() });

/**
 * The one Swept business entity.
 *
 * Organization rather than a LocalBusiness subtype: Swept is a service-area business with no
 * public premises, and Google requires a street address for LocalBusiness markup. We don't
 * publish (or invent) an address – service coverage is expressed with areaServed instead.
 * Enquiry hours live on the contactPoint (openingHours is a LocalBusiness-only property).
 */
export function businessSchema() {
  const b: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": orgId(),
    name: `${site.name} Cleaning`,
    alternateName: site.name,
    url: `${siteUrl()}/`,
    logo: `${siteUrl()}/brand/swept-logo.png`,
    image: `${siteUrl()}/opengraph-image`,
    description: site.description,
    areaServed: areas.map((a) => ({
      "@type": "City",
      name: a.name,
      containedInPlace: { "@type": "State", name: a.state === "QLD" ? "Queensland" : "New South Wales" },
    })),
    knowsLanguage: "en-AU",
    slogan: "A beautifully clean home. More time for you.",
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Cleaning services",
      itemListElement: services.map((s) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: s.name, url: `${siteUrl()}/services/${s.slug}` },
      })),
    },
    potentialAction: {
      "@type": "QuoteAction",
      target: `${siteUrl()}/quote`,
      name: "Request a free cleaning quote",
    },
  };
  const contact: Record<string, unknown> = {
    "@type": "ContactPoint",
    contactType: "customer service",
    areaServed: "AU",
    availableLanguage: "en-AU",
    hoursAvailable: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: site.openingHours.days.map((d) => `https://schema.org/${d}`),
      opens: site.openingHours.opens,
      closes: site.openingHours.closes,
    },
  };
  if (site.phone) b.telephone = contact.telephone = telHref(site.phone).replace("tel:", "");
  if (site.email) b.email = contact.email = site.email;
  if (site.phone || site.email) b.contactPoint = contact;
  if (site.profiles.length) b.sameAs = site.profiles;
  if (site.legalName) b.legalName = site.legalName;
  if (site.abn) b.taxID = site.abn.replace(/\s/g, "");
  return b;
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": websiteId(),
    url: `${siteUrl()}/`,
    name: `${site.name} Cleaning`,
    alternateName: site.name,
    inLanguage: "en-AU",
    publisher: orgRef(),
  };
}

export function serviceSchema(s: Service) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${siteUrl()}/services/${s.slug}#service`,
    name: s.name,
    serviceType: s.name,
    description: s.metaDescription,
    url: `${siteUrl()}/services/${s.slug}`,
    provider: orgRef(),
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
