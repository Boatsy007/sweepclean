import Image from "next/image";
import Link from "next/link";
import { Fragment, type ReactNode } from "react";
import { headingId, type GuideBlock } from "@/lib/guides";
import { Icon } from "./Icon";

/** Renders [text](href) links and **bold** inside a string. Internal links use next/link. */
export function Inline({ text }: { text: string }) {
  const out: ReactNode[] = [];
  const re = /\[([^\]]+)\]\(([^)\s]+)\)|\*\*([^*]+)\*\*/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let k = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    if (m[1] !== undefined) {
      const href = m[2];
      out.push(
        href.startsWith("/") || href.startsWith("#") ? (
          <Link key={k++} href={href}>{m[1]}</Link>
        ) : (
          <a key={k++} href={href} target="_blank" rel="noopener noreferrer">{m[1]}</a>
        ),
      );
    } else {
      out.push(<strong key={k++}>{m[3]}</strong>);
    }
    last = re.lastIndex;
  }
  if (last < text.length) out.push(text.slice(last));
  return <>{out.map((n, i) => <Fragment key={i}>{n}</Fragment>)}</>;
}

/** Article body. Styling comes from `.prose-guide` in globals.css. */
export function GuideContent({ blocks }: { blocks: GuideBlock[] }) {
  return (
    <div className="prose-guide">
      {blocks.map((b, i) => {
        switch (b.type) {
          case "p":
            return <p key={i}><Inline text={b.text} /></p>;
          case "h2":
            return <h2 key={i} id={b.id ?? headingId(b.text)}><Inline text={b.text} /></h2>;
          case "h3":
            return <h3 key={i}><Inline text={b.text} /></h3>;
          case "ul":
            return <ul key={i}>{b.items.map((t, j) => <li key={j}><Inline text={t} /></li>)}</ul>;
          case "ol":
            return <ol key={i}>{b.items.map((t, j) => <li key={j}><Inline text={t} /></li>)}</ol>;
          case "tip":
            return (
              <aside key={i} className="guide-tip">
                <Icon name="sparkle" className="size-6 shrink-0 text-violet" />
                <div>
                  {b.title && <p className="font-display font-bold text-navy">{b.title}</p>}
                  <p><Inline text={b.text} /></p>
                </div>
              </aside>
            );
          case "image":
            return (
              <figure key={i}>
                {typeof b.src === "string" ? (
                  <Image src={b.src} alt={b.alt} width={b.width ?? 1200} height={b.height ?? 800} sizes="(min-width: 768px) 720px, 100vw" className="h-auto w-full" />
                ) : (
                  <Image src={b.src} alt={b.alt} sizes="(min-width: 768px) 720px, 100vw" placeholder="blur" className="h-auto w-full" />
                )}
                {b.caption && <figcaption>{b.caption}</figcaption>}
              </figure>
            );
        }
      })}
    </div>
  );
}
