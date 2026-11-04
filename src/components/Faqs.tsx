import type { Faq } from "@/lib/services";
import { Icon } from "./Icon";

export function Faqs({ faqs }: { faqs: Faq[] }) {
  return (
    <div className="reveal divide-y divide-lilac overflow-hidden rounded-[var(--radius-card)] border border-lilac bg-white">
      {faqs.map((f) => (
        <details key={f.q} className="group">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-display text-[1.05rem] font-semibold text-navy hover:bg-lavender/60 sm:px-6 [&::-webkit-details-marker]:hidden">
            <h3 className="text-[1.05rem]">{f.q}</h3>
            <Icon name="chevron" className="size-5 shrink-0 text-violet transition-transform group-open:rotate-180" />
          </summary>
          <p className="px-5 pb-5 leading-relaxed sm:px-6">{f.a}</p>
        </details>
      ))}
    </div>
  );
}
