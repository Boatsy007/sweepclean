"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Icon } from "./Icon";
import { track } from "@/lib/analytics";

/** Hero quick-start: capture the suburb first (low-effort commitment), then continue the quote. */
export function QuickStart({ id = "hero" }: { id?: string }) {
  const router = useRouter();
  const [v, setV] = useState("");
  return (
    <form
      className="mt-8 max-w-xl"
      onSubmit={(e) => {
        e.preventDefault();
        track("quote_quickstart", { location: id });
        router.push(v.trim() ? `/quote?suburb=${encodeURIComponent(v.trim())}` : "/quote");
      }}
    >
      <label htmlFor={`qs-${id}`} className="label">Where&apos;s the home?</label>
      <div className="flex flex-col gap-3 rounded-[1.6rem] bg-white p-2 shadow-lift sm:flex-row sm:rounded-full">
        <div className="flex flex-1 items-center gap-2 px-3">
          <Icon name="pin" className="size-5 shrink-0 text-violet" />
          <input id={`qs-${id}`} value={v} onChange={(e) => setV(e.target.value)} autoComplete="address-level2" placeholder="Suburb or postcode, e.g. Robina" className="min-h-12 w-full bg-transparent text-navy placeholder:text-slate/60 focus:outline-none" />
        </div>
        <button type="submit" className="btn-primary !min-h-12">Get a free quote <Icon name="arrow" className="size-4" /></button>
      </div>
      <p className="mt-3 text-sm">Free and no obligation · Takes about 2 minutes · <a href="#how-it-works" className="font-semibold text-violet underline underline-offset-4">How it works</a></p>
    </form>
  );
}
