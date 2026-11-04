import Link from "next/link";
import { useId } from "react";
import { site } from "@/lib/site";
import { Icon } from "./Icon";

const SHIELD = "M12 2.75 4.25 5.9v5.6c0 4.75 3.3 8.5 7.75 9.75 4.45-1.25 7.75-5 7.75-9.75V5.9L12 2.75Z";
const SPARKLE = "M11.4 7.4c.3 2.15 1.15 3 3.3 3.3-2.15.3-3 1.15-3.3 3.3-.3-2.15-1.15-3-3.3-3.3 2.15-.3 3-1.15 3.3-3.3Z";
const SPARKLE_SM = "M15.6 13.6c.12.85.45 1.2 1.3 1.3-.85.12-1.18.45-1.3 1.3-.12-.85-.45-1.18-1.3-1.3.85-.1 1.18-.45 1.3-1.3Z";

const tones = {
  violet: { disc: "#4c0296", inner: "#3a0174", ring: "#ffffff", shield: "#ffffff", spark: "#4c0296" },
  white: { disc: "#ffffff", inner: "#f5effc", ring: "#4c0296", shield: "#4c0296", spark: "#ffffff" },
} as const;

/**
 * The Swept Promise seal: a round emblem with the name and tagline set around a
 * shield-and-sparkle mark. The lettered ring turns gently as it scrolls past.
 */
export function PromiseSeal({ tone = "violet", className = "size-40", label = false }: { tone?: keyof typeof tones; className?: string; label?: boolean }) {
  const id = useId().replace(/:/g, "");
  const t = tones[tone];
  const a11y = label ? { role: "img", "aria-label": `${site.promise.name} – ${site.promise.tagline}` } : { "aria-hidden": true };
  return (
    <span className={`relative inline-block shrink-0 ${className}`} {...a11y}>
      <svg viewBox="0 0 240 240" className="absolute inset-0 size-full drop-shadow-[0_14px_30px_rgb(46_10_99/0.22)]">
        <circle cx="120" cy="120" r="119" fill={t.disc} />
        <circle cx="120" cy="120" r="111" fill="none" stroke={t.ring} strokeOpacity="0.3" strokeWidth="1.2" />
        <circle cx="120" cy="120" r="72" fill={t.inner} />
        <circle cx="120" cy="120" r="72" fill="none" stroke={t.ring} strokeOpacity="0.35" strokeWidth="1.2" />
        <g transform="translate(120 121) scale(3.7) translate(-12 -12)">
          <path d={SHIELD} fill={t.shield} />
          <path d={SPARKLE} fill={t.spark} />
          <path d={SPARKLE_SM} fill={t.spark} />
        </g>
      </svg>
      <svg viewBox="0 0 240 240" className="promise-ring absolute inset-0 size-full">
        <defs>
          <path id={`ring-${id}`} d="M120,120 m-91,0 a91,91 0 1,1 182,0 a91,91 0 1,1 -182,0" />
        </defs>
        <text fill={t.ring} fontSize="15" fontWeight="700" className="font-display" letterSpacing="2.4">
          <textPath href={`#ring-${id}`} textLength="560" lengthAdjust="spacing">
            THE SWEPT PROMISE • A CLEAN YOU CAN COUNT ON •
          </textPath>
        </text>
      </svg>
    </span>
  );
}

/** Small inline line for the hero: "Backed by The Swept Promise". */
export function PromiseBacked({ className = "" }: { className?: string }) {
  return (
    <Link href={site.promise.path} className={`group inline-flex items-center gap-2 font-display font-semibold ${className}`}>
      <Icon name="shieldSparkle" className="size-5 shrink-0" />
      <span className="underline decoration-current/30 underline-offset-4 group-hover:decoration-current">Backed by {site.promise.name}</span>
    </Link>
  );
}

/**
 * Feature panel for the violet "Why choose Swept?" band and the Why Swept page:
 * seal, name, tagline, the promise itself and a link to how it works.
 */
export function PromisePanel({ className = "" }: { className?: string }) {
  const p = site.promise;
  return (
    <div className={`relative grid items-center gap-6 rounded-[1.4rem] border border-white/20 bg-white/[0.07] p-6 sm:grid-cols-[auto_1fr] sm:gap-8 sm:p-8 lg:grid-cols-[auto_1fr_auto] ${className}`}>
      <PromiseSeal tone="white" className="size-28 sm:size-32" />
      <div>
        <p className="font-display text-[0.75rem] font-bold uppercase tracking-[0.2em] text-white/70">Our promise on every clean</p>
        <h3 className="mt-1.5 text-2xl font-extrabold !text-white sm:text-[1.9rem]">{p.name}.</h3>
        <p className="mt-1 font-display text-lg font-semibold text-[#e9d8ff]">{p.tagline}</p>
        <p className="mt-3 max-w-2xl leading-relaxed text-white/85">{p.body}</p>
      </div>
      <Link href={p.path} className="btn-white w-full whitespace-nowrap sm:col-span-2 sm:w-auto sm:justify-self-start lg:col-span-1">
        How the promise works <Icon name="arrow" className="size-4" />
      </Link>
    </div>
  );
}
