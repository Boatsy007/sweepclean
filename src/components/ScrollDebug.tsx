"use client";

import { useEffect, useState } from "react";

/** Live scroll diagnostics, shown only with ?debug=scroll in the URL. */
export function ScrollDebug() {
  const [on, setOn] = useState(false);
  const [rows, setRows] = useState<[string, string][]>([]);
  useEffect(() => {
    if (new URLSearchParams(location.search).get("debug") !== "scroll") return;
    setOn(true);
    const vv = window.visualViewport;
    const read = () => {
      const se = document.scrollingElement as HTMLElement | null;
      const h = document.querySelector("header")?.getBoundingClientRect();
      const first = document.querySelector("main h1")?.getBoundingClientRect();
      const scrolled = [...document.querySelectorAll<HTMLElement>("body *")].filter((e) => e.scrollTop > 0).map((e) => `${e.tagName.toLowerCase()}:${e.scrollTop}`).slice(0, 3);
      setRows([
        ["scrollY", String(Math.round(window.scrollY))],
        ["scrollingEl.top", `${se?.tagName.toLowerCase()} ${Math.round(se?.scrollTop ?? 0)}`],
        ["body.scrollTop", String(Math.round(document.body.scrollTop))],
        ["vv.offsetTop/pageTop", vv ? `${Math.round(vv.offsetTop)} / ${Math.round(vv.pageTop)}` : "n/a"],
        ["vv.height/scale", vv ? `${Math.round(vv.height)} / ${vv.scale.toFixed(2)}` : "n/a"],
        ["innerHeight", String(window.innerHeight)],
        ["header top/bottom", h ? `${Math.round(h.top)} / ${Math.round(h.bottom)}` : "-"],
        ["h1 top", first ? String(Math.round(first.top)) : "-"],
        ["docH / clientH", `${document.documentElement.scrollHeight} / ${document.documentElement.clientHeight}`],
        ["other scrolled", scrolled.join(" ") || "none"],
        ["html class", document.documentElement.className.replace(/\S*variable\S*/g, "").trim() || "-"],
        ["pointer coarse", String(matchMedia("(pointer: coarse)").matches)],
      ]);
    };
    read();
    window.addEventListener("scroll", read, { passive: true });
    window.addEventListener("resize", read);
    vv?.addEventListener("resize", read);
    vv?.addEventListener("scroll", read);
    const t = setInterval(read, 500);
    return () => {
      window.removeEventListener("scroll", read);
      window.removeEventListener("resize", read);
      vv?.removeEventListener("resize", read);
      vv?.removeEventListener("scroll", read);
      clearInterval(t);
    };
  }, []);
  if (!on) return null;
  return (
    <div className="pointer-events-none fixed inset-x-2 bottom-24 z-[100] rounded-xl bg-black/85 p-3 font-mono text-[11px] leading-snug text-white">
      {rows.map(([k, v]) => (
        <div key={k} className="flex justify-between gap-3"><span className="text-white/60">{k}</span><span>{v}</span></div>
      ))}
    </div>
  );
}
