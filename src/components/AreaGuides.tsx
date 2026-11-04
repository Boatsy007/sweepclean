import Link from "next/link";
import { guidePath, guidesForArea, readingTime } from "@/lib/guides";
import { Icon } from "./Icon";

/** Guides tagged for an area – shown on the area page and its suburb pages. Renders nothing if none. */
export function AreaGuides({ area, place }: { area: string; place: string }) {
  const list = guidesForArea(area);
  if (!list.length) return null;
  return (
    <section className="container-x pb-12" aria-labelledby={`guides-${area}-h`}>
      <h2 id={`guides-${area}-h`} className="text-2xl font-extrabold">Helpful guides for {place} homes</h2>
      <ul className="mt-5 grid gap-4 md:grid-cols-2">
        {list.map((g) => (
          <li key={g.slug}>
            <Link href={guidePath(g.slug)} className="card group flex h-full items-start gap-4 p-5 hover:shadow-lift sm:p-6">
              <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-lavender text-violet"><Icon name="doc" className="size-6" /></span>
              <span className="min-w-0">
                <span className="block font-display text-lg font-bold leading-snug text-navy group-hover:text-violet">{g.title}</span>
                <span className="mt-1 block leading-relaxed">{g.description}</span>
                <span className="mt-3 inline-flex items-center gap-1.5 font-display font-semibold text-violet">
                  Read guide · {readingTime(g)} min <Icon name="arrow" className="size-4 transition-transform group-hover:translate-x-1" />
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
