import Image from "next/image";
import Link from "next/link";
import { guidePath, readingTime, type Guide } from "@/lib/guides";
import { Icon } from "./Icon";

export function GuideCard({ guide, priority = false }: { guide: Guide; priority?: boolean }) {
  const href = guidePath(guide.slug);
  return (
    <article className="card group flex h-full flex-col overflow-hidden transition-shadow hover:shadow-lift">
      <Link href={href} tabIndex={-1} aria-hidden="true" className="reveal-zoom relative block aspect-[16/10] overflow-hidden">
        {guide.image ? (
          typeof guide.image.src === "string" ? (
            <Image src={guide.image.src} alt="" fill sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw" className="object-cover" priority={priority} />
          ) : (
            <Image src={guide.image.src} alt="" fill sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw" className="object-cover" placeholder="blur" priority={priority} />
          )
        ) : (
          <span className="grid h-full place-items-center bg-gradient-to-br from-lavender to-lilac">
            <Icon name="doc" className="size-14 text-violet/70" strokeWidth={1.3} />
          </span>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-6">
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
          {guide.categories.slice(0, 2).map((c) => (
            <span key={c} className="rounded-full bg-lavender px-2.5 py-0.5 font-semibold text-violet-ink">{c}</span>
          ))}
          <span className="inline-flex items-center gap-1 text-slate"><Icon name="clock" className="size-4" />{readingTime(guide)} min read</span>
        </p>
        <h2 className="mt-3 text-xl font-bold leading-snug"><Link href={href} className="hover:text-violet">{guide.title}</Link></h2>
        <p className="mt-2 flex-1 leading-relaxed">{guide.description}</p>
        <Link href={href} className="mt-5 inline-flex items-center gap-1.5 font-display font-semibold text-violet">
          Read guide<span className="sr-only">: {guide.title}</span> <Icon name="arrow" className="size-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </article>
  );
}
