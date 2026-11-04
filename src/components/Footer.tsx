import Link from "next/link";
import { Logo } from "./SweptMark";
import { services } from "@/lib/services";
import { areas } from "@/lib/areas";
import { site, telHref } from "@/lib/site";

export function Footer() {
  return (
    <footer className="bg-navy pb-28 pt-16 text-white/80 lg:pb-12">
      <div className="container-x grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Logo tone="white" size="lg" />
          <p className="mt-5 max-w-xs leading-relaxed">House cleaning across Brisbane, Logan, the Gold Coast and Tweed Heads. Weekly, fortnightly and monthly cleans, tailored to your home.</p>
          <Link href="/quote" className="btn-white mt-6">Get a free quote</Link>
        </div>
        <FooterCol title="Services" links={services.map((s) => ({ href: `/services/${s.slug}`, label: s.name }))} />
        <FooterCol title="Areas" links={[...areas.map((a) => ({ href: `/areas/${a.slug}`, label: a.name })), { href: "/areas", label: "All areas" }]} />
        <div>
          <h2 className="font-display text-sm font-bold uppercase tracking-[0.18em] text-white">Contact</h2>
          <ul className="mt-4 space-y-2.5">
            {site.phone && <li><a href={telHref(site.phone)} className="hover:text-white">{site.phone}</a></li>}
            {site.email && <li><a href={`mailto:${site.email}`} className="hover:text-white">{site.email}</a></li>}
            <li><Link href="/contact" className="hover:text-white">Contact us</Link></li>
            <li><Link href={site.promise.path} className="hover:text-white">{site.promise.name}</Link></li>
            <li><Link href="/faq" className="hover:text-white">FAQs</Link></li>
            <li><Link href="/cleaning-guides" className="hover:text-white">Cleaning guides</Link></li>
            <li className="text-sm text-white/60">{site.responseHours}</li>
          </ul>
        </div>
      </div>
      <div className="container-x mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-sm text-white/55 sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} {site.legalName ?? "Swept Cleaning"}{site.abn ? ` · ABN ${site.abn}` : ""}</p>
        <p className="flex gap-5"><Link href="/privacy" className="hover:text-white">Privacy</Link><Link href="/sitemap.xml" className="hover:text-white">Sitemap</Link></p>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <div>
      <h2 className="font-display text-sm font-bold uppercase tracking-[0.18em] text-white">{title}</h2>
      <ul className="mt-4 space-y-2.5">
        {links.map((l) => <li key={l.href}><Link href={l.href} className="hover:text-white">{l.label}</Link></li>)}
      </ul>
    </div>
  );
}
