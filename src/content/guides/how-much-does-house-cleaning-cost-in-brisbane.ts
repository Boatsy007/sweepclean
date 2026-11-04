import type { Guide } from "@/lib/guides";
import { photos } from "@/lib/photos";

/*
 * Sources (checked November 2026):
 * - Brisbane market rates: published 2026 Brisbane cleaning price guides (Maid2Match, Absolute Domestics,
 *   What's the Damage, Clean4You, Family Clean) – insured services ~$50–$75/hr, averages mid-$50s,
 *   marketplace cleaners ~$30–$45/hr, bond cleans ~$250 (1 bed) to $650+ (4 bed).
 * - Cleaning Services Award 2020 [MA000022] Level 1 from 1 July 2026: $27.08/hr full-time, $33.85/hr casual
 *   (incl. 25% loading), after the FWC's 4.75% 2026 Annual Wage Review increase.
 * - Super guarantee 12% from 1 July 2025 (ATO).
 * - Sham contracting / workers' compensation enforcement in cleaning: Fair Work Ombudsman, WorkSafe QLD.
 * Review the award rates each July and update `updated`.
 */

export const guide: Guide = {
  slug: "how-much-does-house-cleaning-cost-in-brisbane",
  title: "How Much Does House Cleaning Cost in Brisbane?",
  metaTitle: "House Cleaning Cost in Brisbane (2026 Guide) | Swept",
  description:
    "What house cleaning really costs in Brisbane in 2026, why a quality cleaner charges $65–$70 an hour, and what a cheap quote can end up costing you.",
  published: "2026-11-04",
  categories: ["Pricing", "Regular cleaning"],
  image: photos.cleaner,
  services: ["regular-house-cleaning", "deep-cleaning", "bond-cleaning"],
  body: [
    {
      type: "p",
      text: "If you've started asking around for a cleaner in Brisbane, you've probably noticed the prices are all over the place. One person quotes $35 an hour, another quotes $70, and a third gives you a flat price without saying how long they'll be there. This guide explains what house cleaning actually costs in Brisbane in 2026, what goes into a professional cleaner's hourly rate, and why the cheapest quote is rarely the best value.",
    },
    {
      type: "tip",
      title: "The short answer",
      text: "Brisbane house cleaning ranges from roughly **$35 to $80 an hour**. Established, insured cleaning services mostly charge **$50 to $75 an hour**. For a high-quality cleaner who is properly paid, insured and reliable, expect to pay **$65 to $70 an hour** – around **$195 to $210** for a typical three-hour clean of a three-bedroom home.",
    },

    { type: "h2", text: "Brisbane house cleaning prices at a glance" },
    {
      type: "p",
      text: "Published 2026 price guides from Brisbane cleaning companies broadly agree on these ranges. Prices vary by suburb, home size, condition and how often you book, so treat them as a guide rather than a quote.",
    },
    {
      type: "ul",
      items: [
        "**Marketplace and cash-in-hand cleaners:** around $30–$45 an hour. Often cheaper because insurance, super and proper wages aren't part of the price.",
        "**Established, insured cleaning services:** around $50–$75 an hour, with Brisbane averages sitting in the mid-$50s.",
        "**High-quality, fully compliant service:** $65–$70 an hour – experienced cleaners paid correctly, insured, with a consistent checklist and someone accountable if anything goes wrong.",
        "**Bond (end-of-lease) cleans:** usually a fixed price rather than hourly – from about $250 for a one-bedroom unit to $650 or more for a four-bedroom house, depending on condition and extras such as carpets.",
      ],
    },
    {
      type: "p",
      text: "For a regular fortnightly clean of a three-bedroom home, most Brisbane households pay somewhere between $150 and $250 a visit. Where you land in that range depends on how big the home is, how it's kept between cleans, and who you hire. You can see what's included in a [regular home clean](/services/regular-house-cleaning) here.",
    },

    { type: "h2", text: "Why a good cleaner costs $65–$70 an hour" },
    {
      type: "p",
      text: "When you pay a cleaning business $65 an hour, the cleaner doesn't take home $65. That hour has to cover everything it takes to run a legitimate business that turns up on time, does the job properly and stands behind its work.",
    },
    { type: "h3", text: "Award wages and super" },
    {
      type: "p",
      text: "Cleaners employed by a business are covered by the [Cleaning Services Award 2020](https://awards.fairwork.gov.au/MA000022.html). From 1 July 2026, the minimum rate for an entry-level (Level 1) cleaner is **$27.08 an hour**, or **$33.85 an hour** for a casual cleaner once the 25% casual loading is included. Employers must also pay [superannuation at 12%](https://www.ato.gov.au/tax-rates-and-codes/key-superannuation-rates-and-thresholds/super-guarantee) on top.",
    },
    {
      type: "p",
      text: "That means a casual cleaner on the minimum rate costs a business about **$37.90 an hour in wages and super alone** – before a single other cost. Weekend and public holiday penalty rates are higher again, and good, experienced cleaners are often paid above the minimum.",
    },
    { type: "h3", text: "Travel between homes" },
    {
      type: "p",
      text: "Cleaners are paid while they drive from one home to the next, but that travel time isn't charged to you as cleaning time. Across Brisbane's traffic, it's a real cost that has to be built into the hourly rate.",
    },
    { type: "h3", text: "Insurance and workers' compensation" },
    {
      type: "p",
      text: "A professional cleaning business carries public liability insurance in case something is damaged in your home, and in Queensland employers must hold workers' compensation cover for their staff. Regulators do enforce this – WorkSafe Queensland has fined cleaning businesses for operating without a valid policy.",
    },
    { type: "h3", text: "Products, equipment and a vehicle" },
    {
      type: "p",
      text: "Quality vacuums, microfibre cloths, safe products for stone benchtops and timber floors, replacement equipment, and a reliable car to get between suburbs all add up.",
    },
    { type: "h3", text: "Running a real business" },
    {
      type: "p",
      text: "Bookings, rescheduling, quality checks, training, accounting and GST (10% for registered businesses) all sit behind every clean. A $68 rate that includes GST is about $61.80 before tax.",
    },
    {
      type: "p",
      text: "Here's a simplified example of where an hour at the top of the market goes. Every business is different, so these figures are illustrative only:",
    },
    {
      type: "ul",
      items: [
        "Cleaner's wages and super (casual, minimum rate): about $38",
        "Paid travel time and non-billable time between homes: about $6–$8",
        "Insurance, workers' compensation, products, equipment and vehicle: about $6–$8",
        "Admin, bookings, training and quality checks: about $4–$5",
        "GST: about $6",
        "What's left to cover sick days, re-cleans, growth and a fair profit: the remainder",
      ],
    },
    {
      type: "p",
      text: "Add that up and you can see why **$65–$70 an hour is what quality, above-board cleaning costs**. When a quote is far below the $50s, something in that list is usually missing.",
    },

    { type: "h2", text: "What a cheaper cleaner can really cost you" },
    {
      type: "p",
      text: "Not every low price means a bad cleaner. But the maths above doesn't change, so a very cheap rate usually means one of these things is being left out:",
    },
    {
      type: "ul",
      items: [
        "**The cleaner isn't paid properly.** Some operators pay cash or treat employees as contractors to avoid wages, super and insurance. That's illegal – the Fair Work Ombudsman has taken action against cleaning companies over sham contracting, with one case ending in more than $660,000 in penalties and compensation. Underpaid cleaners also tend not to stay, so you keep getting someone new.",
        "**No insurance.** If something is broken or someone is injured in your home and there's no cover, sorting it out can fall back on you. Always ask what insurance a cleaner holds.",
        "**Rushed cleans.** A low hourly rate often comes with fewer hours, or a cleaner racing to fit in more homes. The kitchen gets a wipe, but the shower screen, skirting boards and stovetop don't.",
        "**Unreliable bookings.** No-shows and last-minute cancellations are among the most common complaints about cheap cleaners – and they cost you your day.",
        "**Surprise extras.** A cheap headline rate can grow once ovens, windows, pets or 'extra mess' are added at the end.",
      ],
    },
    {
      type: "p",
      text: "Saving $15 an hour on a three-hour clean is $45 a visit. If it means a missed booking, a re-clean or a broken item with no insurance behind it, the cheaper option quickly becomes the expensive one.",
    },

    { type: "h2", text: "What affects the price of your clean" },
    {
      type: "ul",
      items: [
        "**Size of the home** – bedrooms, bathrooms, living areas and stairs.",
        "**Condition** – a first clean or a home that hasn't been cleaned in a while takes longer. A [deep clean](/services/deep-cleaning) first makes every regular visit after it faster.",
        "**How often you book** – weekly and fortnightly cleans take less time per visit than monthly ones, because there's less build-up.",
        "**Extras** – inside the oven, interior windows and tracks, blinds, laundry, dishes or changing bed linen.",
        "**Pets and kids** – more hair, more floors, more fingerprints.",
        "**Type of clean** – a [bond clean](/services/bond-cleaning) is far more detailed than a regular clean, and [carpet steam cleaning](/services/carpet-cleaning) is priced separately.",
        "**Access** – apartment parking, lift bookings and key collection all take time.",
      ],
    },

    { type: "h2", text: "Hourly rate or fixed price: how to compare quotes" },
    {
      type: "p",
      text: "An hourly rate on its own doesn't tell you what you'll pay. A cleaner at $45 an hour who takes four hours costs more than one at $68 who does the same job properly in three. When you compare quotes, ask each business:",
    },
    {
      type: "ol",
      items: [
        "What's the **total price per clean**, and how many hours is that based on?",
        "**What's included?** Ask for the checklist in writing.",
        "Do you hold **public liability insurance**, and are your cleaners covered by **workers' compensation**?",
        "Are your cleaners **employees paid under the award**, or contractors?",
        "Is **GST** included in the price?",
        "Will I have the **same cleaner** each visit?",
        "What happens if I'm **not happy** with part of the clean?",
        "Is there a **lock-in contract** or cancellation fee?",
      ],
    },
    {
      type: "p",
      text: "A business that answers all of those clearly, in writing, is usually worth the extra few dollars an hour.",
    },

    { type: "h2", text: "What $65–$70 an hour looks like in practice" },
    {
      type: "p",
      text: "These are examples only – the time a home takes depends on its layout, condition and what's included:",
    },
    {
      type: "ul",
      items: [
        "**Two-bedroom unit, regular clean** (about 2–2.5 hours): roughly $130–$175",
        "**Three-bedroom, two-bathroom home, fortnightly** (about 3 hours): roughly $195–$210",
        "**Four-bedroom family home, fortnightly** (about 4 hours): roughly $260–$280",
        "**First visit or deep clean:** usually longer, as it brings the home up to a standard that regular visits then maintain",
      ],
    },

    { type: "h2", text: "Is regular cleaning worth it?" },
    {
      type: "p",
      text: "For most busy Brisbane households, yes. A fortnightly clean keeps the whole home under control, each visit is shorter because there's less build-up, and you stop losing weekends to the bathroom and floors. You also get the same standard every time – which is hard to guarantee when you're switching between the cheapest cleaner available each month.",
    },

    { type: "h2", text: "Get an accurate price for your home" },
    {
      type: "p",
      text: "The only way to know what your home will cost is a proper quote. Swept cleans homes across [Brisbane](/areas/brisbane), Logan, the Gold Coast and Tweed Heads. Tell us about your home and we'll send a clear written quote before anything is booked – with the checklist included and no lock-in contract. [Get your free quote](/quote) or read our [house cleaning FAQs](/faq).",
    },
  ],
  faqs: [
    {
      q: "How much is a house cleaner per hour in Brisbane?",
      a: "Most Brisbane house cleaners charge between $35 and $80 an hour. Established, insured services mostly sit between $50 and $75 an hour, and a high-quality, fully compliant cleaner typically costs $65 to $70 an hour.",
    },
    {
      q: "Why are some cleaners so much cheaper?",
      a: "A properly employed casual cleaner costs a business about $37.90 an hour in award wages and super alone, before travel, insurance, equipment and GST. Very low prices usually mean something is missing – award wages, insurance, enough time to do the job properly, or reliable cover when a cleaner is sick.",
    },
    {
      q: "How much does a fortnightly clean of a three-bedroom house cost in Brisbane?",
      a: "Most households pay between about $150 and $250 a visit, depending on the size and condition of the home. At $65 to $70 an hour, a typical three-hour clean costs around $195 to $210.",
    },
    {
      q: "Is it better to pay a cleaner by the hour or a fixed price?",
      a: "Either can work. What matters is knowing the total price per clean, how long it's based on and exactly what's included. A higher hourly rate can cost less overall if the cleaner is experienced and efficient.",
    },
    {
      q: "How much is a bond clean in Brisbane?",
      a: "Bond cleans are usually quoted as a fixed price – from about $250 for a one-bedroom unit to $650 or more for a four-bedroom house, depending on the condition of the property and extras such as carpet steam cleaning.",
    },
    {
      q: "Do cleaning prices include GST?",
      a: "It depends on the business. Cleaning businesses registered for GST must add 10%, so always ask whether a quote includes GST so you can compare like with like.",
    },
  ],
};
