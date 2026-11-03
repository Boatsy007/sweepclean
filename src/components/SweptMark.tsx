import { useId } from "react";

/*
 * Vector rendition of the Swept swirl. Replace with the master logo file once
 * supplied (public/brand/) – the geometry here is an approximation.
 */
const PETAL = "M56 47 C 44 40, 33 29, 36 16.5 C 38.5 7, 51 5.5, 54 13 C 56.5 19.5, 50 27, 56 47 Z";
const STAR = "M0 -1 C .14 -.14 .14 -.14 1 0 C .14 .14 .14 .14 0 1 C -.14 .14 -.14 .14 -1 0 C -.14 -.14 -.14 -.14 0 -1 Z";
const STARS: [number, number, number][] = [
  [16, 15, 6],
  [90, 40, 5],
  [12, 77, 5],
];

export function SweptMark({ size = 40, tone = "color", className }: { size?: number; tone?: "color" | "white"; className?: string }) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const shapes = (
    <>
      <g transform="translate(50 50) scale(.98) translate(-50 -50)">
        {[0, 60, 120, 180, 240, 300].map((r) => (
          <path key={r} d={PETAL} transform={`rotate(${r} 50 50)`} />
        ))}
      </g>
      {STARS.map(([x, y, s]) => (
        <path key={`${x}-${y}`} d={STAR} transform={`translate(${x} ${y}) scale(${s})`} />
      ))}
    </>
  );
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true" focusable="false" className={className}>
      {tone === "white" ? (
        <g fill="#fff">{shapes}</g>
      ) : (
        <>
          <defs>
            <linearGradient id={`g${uid}`} x1="12" y1="8" x2="80" y2="92" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#D47EF7" />
              <stop offset=".5" stopColor="#7A48F0" />
              <stop offset="1" stopColor="#1D4DFF" />
            </linearGradient>
            <mask id={`m${uid}`} maskUnits="userSpaceOnUse" x="0" y="0" width="100" height="100">
              <g fill="#fff">{shapes}</g>
            </mask>
          </defs>
          <rect width="100" height="100" fill={`url(#g${uid})`} mask={`url(#m${uid})`} />
        </>
      )}
    </svg>
  );
}

/** Full lock-up: mark + "swept" wordmark + "— CLEANING —". */
export function Logo({ tone = "color", size = "md" }: { tone?: "color" | "white"; size?: "md" | "lg" }) {
  const big = size === "lg";
  const ink = tone === "white" ? "text-white" : "text-navy";
  const sub = tone === "white" ? "text-white/90" : "text-violet";
  return (
    <span className="inline-flex items-center gap-2">
      <SweptMark size={big ? 56 : 40} tone={tone} />
      <span className="flex flex-col items-center leading-none">
        <span className={`font-logo font-black tracking-[-0.03em] ${ink} ${big ? "text-[2.6rem]" : "text-[1.85rem]"}`}>swept</span>
        <span className={`mt-0.5 flex items-center gap-1.5 font-logo font-bold tracking-[0.32em] ${sub} ${big ? "text-[0.7rem]" : "text-[0.52rem]"}`}>
          <span className="h-px w-3 bg-current" aria-hidden="true" />
          CLEANING
          <span className="h-px w-3 bg-current" aria-hidden="true" />
        </span>
      </span>
    </span>
  );
}
