"use client";
import { useEffect, useState } from "react";

type Row = [label: string, value: string, ok: boolean, fix?: string];

export function MotionReport({ commit, builtAt }: { commit: string; builtAt: string }) {
  const [rows, setRows] = useState<Row[] | null>(null);
  useEffect(() => {
    // Wait a moment so smooth scrolling has had time to start.
    const t = setTimeout(run, 600);
    return () => clearTimeout(t);
  }, []);
  function run() {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timeline = typeof CSS !== "undefined" && CSS.supports("animation-timeline: view()");
    const touch = window.matchMedia("(pointer: coarse)").matches;
    const chrome = navigator.userAgent.match(/Chrome\/(\d+)/)?.[1];
    const lenis = document.documentElement.classList.contains("lenis");
    setRows([
      ["Reduce motion (from your device settings)", reduce ? "ON – site shows gentle fades only" : "Off – full animation", !reduce,
        reduce ? "Windows: Settings → Accessibility → Visual effects → turn Animation effects ON (also check battery saver). Mac: System Settings → Accessibility → Display → turn Reduce motion OFF. Then reload." : undefined],
      ["Scroll-driven animations supported", timeline ? "Yes" : "No", timeline, timeline ? undefined : "Update Chrome (Menu → Help → About Google Chrome)."],
      ["Browser", chrome ? `Chrome ${chrome}` : navigator.userAgent.slice(0, 60), !chrome || Number(chrome) >= 115],
      ["Smooth wheel scrolling active", lenis ? "Yes" : touch ? "No – touch screen (uses native scrolling)" : "No", lenis || touch],
      ["Site version", `${commit} · built ${builtAt}`, true],
    ]);
  }
  if (!rows) return <p>Checking…</p>;
  return (
    <ul className="mt-8 divide-y divide-lilac overflow-hidden rounded-[var(--radius-card)] border border-lilac bg-white">
      {rows.map(([label, value, ok, fix]) => (
        <li key={label} className="px-5 py-4">
          <p className="flex items-start justify-between gap-4">
            <span className="font-display font-semibold text-navy">{label}</span>
            <span className={`shrink-0 font-semibold ${ok ? "text-[#067647]" : "text-[#b42318]"}`}>{ok ? "✓" : "✗"} {value}</span>
          </p>
          {fix && <p className="mt-2 text-sm">{fix}</p>}
        </li>
      ))}
    </ul>
  );
}
