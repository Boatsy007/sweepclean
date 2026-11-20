import { Icon } from "./Icon";

/** How a quote works – the three-card explainer first used on the booking page (same markup and styling). */
export const quoteSteps = [
  ["doc", "Tell us what you need", "Choose your cleaning service and tell us a little about your property."],
  ["phone", "Get your personalised quote", "Our team will call you to discuss your requirements and provide clear, upfront pricing."],
  ["sparkle", "Leave the cleaning to us", "Happy with your quote? We'll arrange a clean at a time that suits you."],
] as const;

export function QuoteSteps({ className = "" }: { className?: string }) {
  return (
    // Compact on phones so the form starts near the top of the screen; cards from 640px.
    <ol className={`grid gap-2 sm:grid-cols-3 sm:gap-3 ${className}`}>
      {quoteSteps.map(([icon, t, b], i) => (
        <li key={t} className="flex items-center gap-3 sm:items-start sm:rounded-2xl sm:border sm:border-lilac sm:bg-white/70 sm:p-4">
          <span className="grid size-8 shrink-0 place-items-center rounded-full bg-lavender text-violet sm:size-9"><Icon name={icon} className="size-5" /></span>
          <span><strong className="block font-display text-navy"><span className="sr-only">Step {i + 1}: </span>{t}</strong><span className="hidden text-[0.95rem] sm:inline">{b}</span></span>
        </li>
      ))}
    </ol>
  );
}
