import type { Faq } from "./services";
import { site } from "./site";

export const generalFaqs: Faq[] = [
  {
    q: "Which areas does Swept clean?",
    a: "We clean homes across Brisbane (northside, southside and inner city), Logan, the Gold Coast, and Tweed Heads in NSW. If you're not sure we cover your suburb, request a quote and we'll confirm.",
  },
  {
    q: "How much does a house clean cost?",
    a: "It depends on the size of your home, how often we visit, its current condition and any extras you'd like. Tell us about your home online and we'll send a written quote – the price you see is the price you pay for the agreed scope.",
  },
  {
    q: "How quickly will I get my quote?",
    a: `We reply to quote requests ${site.quoteResponse}, ${site.responseHours.split(",")[0].toLowerCase()}.`,
  },
  {
    q: "Can I choose what gets cleaned?",
    a: "Yes. Every clean starts from our room-by-room checklist, and you can tell us which areas matter most, which to skip, and extras such as the oven and stove, blinds, laundry or windows and tracks.",
  },
  {
    q: "Am I locked into a contract?",
    a: "No. Regular cleans run visit to visit. You can pause, change your frequency or stop at any time.",
  },
  ...(site.insured || site.policeChecked
    ? [{
        q: site.insured && site.policeChecked ? "Are your cleaners insured and police-checked?" : site.insured ? "Are you insured?" : "Are your cleaners police-checked?",
        a: [
          site.insured && "Yes – Swept holds current public liability insurance. Commercial clients can ask us for a copy of our certificate of currency.",
          site.policeChecked && "Every cleaner holds a current national police check.",
        ].filter(Boolean).join(" "),
      }]
    : []),
  {
    q: "Do I need to supply cleaning products or equipment?",
    a: "No – we bring everything. If you'd like us to use your own products on particular surfaces, just let us know.",
  },
  {
    q: "Do I need to be home?",
    a: "Not at all. Plenty of customers leave a key or lockbox code. Let us know how you'd like access to work.",
  },
  {
    q: "What's the difference between weekly, fortnightly and monthly cleaning?",
    a: "Weekly suits busy households with kids or pets. Fortnightly suits most couples and small families. Monthly is a regular reset for tidy homes. You can change frequency whenever you like.",
  },
];
