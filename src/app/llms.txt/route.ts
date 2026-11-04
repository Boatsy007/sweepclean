import { site, siteUrl } from "@/lib/site";
import { services } from "@/lib/services";
import { areas } from "@/lib/areas";
import { generalFaqs } from "@/lib/faqs";
import { suburbPath, suburbsIn } from "@/lib/suburbs";
import { tasks } from "@/lib/tasks";
import { guidePath, guides } from "@/lib/guides";

export const dynamic = "force-static";

/** llms.txt – a plain-text summary of the business for AI assistants and answer engines. */
export function GET() {
  const u = siteUrl();
  const lines = [
    `# ${site.name} Cleaning`,
    "",
    `> ${site.description}`,
    "",
    "Swept Cleaning is a cleaning service covering South East Queensland and the Tweed in northern NSW: Brisbane, Logan, the Gold Coast and Tweed Heads. It offers regular home cleaning, deep cleaning, NDIS and home care cleaning, bond cleaning, Airbnb and holiday rental turnovers, carpet steam cleaning and commercial cleaning. Homes can book weekly, fortnightly, monthly or one-off cleans. There are no lock-in contracts, every clean follows a written room-by-room checklist, and customers receive a written quote before booking.",
    "",
    "## Key facts",
    `- Service area: Brisbane, Logan, Gold Coast (QLD) and Tweed Heads (NSW)`,
    `- Quote: free, written, sent ${site.quoteResponse}`,
    `- Enquiry hours: ${site.responseHours}`,
    ...(site.phone ? [`- Phone: ${site.phone}`] : []),
    ...(site.email ? [`- Email: ${site.email}`] : []),
    `- Request a quote: ${u}/quote`,
    "",
    "## Services",
    ...services.map((s) => `- [${s.name}](${u}/services/${s.slug}): ${s.summary} Best for: ${s.bestFor}.`),
    "",
    "## What we clean",
    ...tasks.map((t) => `- ${t.name}: ${t.detail}`),
    "",
    "## Areas and suburbs",
    ...areas.flatMap((a) => [
      `### [${a.name}](${u}/areas/${a.slug})`,
      ...suburbsIn(a.slug).map((s) => `- [${s.name} ${a.state} ${s.postcode}](${u}${suburbPath(s)}) – ${s.council}`),
      "",
    ]),
    ...(guides.length
      ? ["## Cleaning guides", ...guides.map((g) => `- [${g.title}](${u}${guidePath(g.slug)}): ${g.description}`), ""]
      : []),
    "## Frequently asked questions",
    ...generalFaqs.flatMap((f) => [`- Q: ${f.q}`, `  A: ${f.a}`]),
    "",
    "## More",
    `- [Why Swept](${u}/why-swept)`,
    `- [All FAQs](${u}/faq)`,
    `- [Contact](${u}/contact)`,
    `- [Sitemap](${u}/sitemap.xml)`,
    "",
  ];
  return new Response(lines.join("\n"), { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" } });
}
