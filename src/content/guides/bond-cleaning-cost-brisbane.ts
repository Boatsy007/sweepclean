import type { Guide } from "@/lib/guides";
import { photos } from "@/lib/photos";

/*
 * Sources (checked November 2026):
 * - Brisbane 2026 bond cleaning price guides (Absolute Domestics, SparkleClean, ProShine, The Bond Cleaning
 *   Brisbane, Deep Bond Clean, BNE Cleaners, Clean4You, Cleaning Search estimator):
 *   1 bed ~$200–$380; 2 bed ~$260–$450 (2 bed 2 bath ~$400–$550); 3 bed ~$350–$600 (some $500–$700);
 *   4 bed ~$450–$950; carpet steam cleaning commonly an $80–$150 add-on.
 * - RTA Queensland: Form 1a (entry), Form 14a (exit), Form 4 (refund), Form 16 (dispute); other party has
 *   14 days to dispute a claim; unresolved disputes can go to QCAT within 7 days of the notice; lessor/agent
 *   must give supporting evidence within 14 days of a claim; carpets to the standard at the start of the
 *   tenancy; pet approval conditions can include professional carpet cleaning.
 * - Good-quality company rate $65–$70/hr is the owner's position; hour examples are illustrative.
 * Review the ranges yearly and update `updated`.
 */

const b = (slug: string, name: string) => `[${name}](/areas/brisbane/${slug})`;

export const guide: Guide = {
  slug: "bond-cleaning-cost-brisbane",
  title: "Bond Cleaning Cost in Brisbane: What Should You Expect to Pay?",
  metaTitle: "Bond Cleaning Cost Brisbane (2026 Prices) | Swept Cleaning",
  description:
    "Brisbane bond cleaning prices for 2026 by home size, what a quality end-of-lease clean includes, and how Queensland's RTA bond process works when you move out.",
  published: "2026-11-04",
  categories: ["Bond cleaning", "Pricing"],
  image: photos.apartment,
  services: ["bond-cleaning", "carpet-cleaning"],
  areas: ["brisbane"],
  related: ["bond-cleaning-cost-logan", "bond-cleaning-cost-gold-coast", "how-much-does-house-cleaning-cost-in-brisbane"],
  sources: [
    { title: "How much does a bond clean cost in Brisbane? (2026 guide)", url: "https://www.absolutedomestics.com.au/blog/how-much-does-a-bond-clean-cost-in-brisbane/", publisher: "Absolute Domestics" },
    { title: "Bond cleaning cost Brisbane 2026", url: "https://sparkleclean.au/blog/how-much-does-bond-cleaning-cost-in-brisbane", publisher: "SparkleClean" },
    { title: "How much does bond cleaning cost in Brisbane? (2026 price guide)", url: "https://proshinebondcleaning.com.au/blogs/bond-cleaning-cost-brisbane-2026-price-guide/", publisher: "ProShine Bond Cleaning" },
    { title: "Bond cleaning Brisbane cost guide 2026", url: "https://www.thebondcleaningbrisbane.com.au/bond-cleaning-brisbane-cost-guide-2026-exact-prices-by-property-size-no-hidden-charges/", publisher: "The Bond Cleaning Brisbane" },
    { title: "Bond cleaning Brisbane cost guide 2026", url: "https://deepbondclean.com.au/bond-cleaning-brisbane-cost-guide-2026/", publisher: "Deep Bond Clean" },
    { title: "Bond cleaning cost Brisbane 2026", url: "https://bnecleaners.com/guides/bond-cleaning-cost-brisbane", publisher: "BNE Cleaners" },
    { title: "Bond cleaning calculator and price list Australia 2026", url: "https://cleaningsearch.com.au/tools/bond-cleaning-estimator", publisher: "Cleaning Search" },
    { title: "Bond refunds", url: "https://www.rta.qld.gov.au/renting/ending-a-tenancy/bond-refunds", publisher: "Residential Tenancies Authority (QLD)" },
    { title: "Rental bonds fact sheet", url: "https://www.rta.qld.gov.au/forms-resources/fact-sheets/general-tenancy-fact-sheets/rental-bonds-fact-sheet", publisher: "Residential Tenancies Authority (QLD)" },
    { title: "Carpet cleaning and pest control", url: "https://www.rta.qld.gov.au/renting/ending-a-tenancy/bond-refunds/carpet-cleaning-and-pest-control", publisher: "Residential Tenancies Authority (QLD)" },
    { title: "New Queensland rental laws in effect from 1 May 2025", url: "https://www.rta.qld.gov.au/news/2025/04/30/new-queensland-rental-laws-in-effect-from-1-may-2025-and-updated-rta-forms", publisher: "Residential Tenancies Authority (QLD)" },
  ],
  body: [
    {
      type: "p",
      text: "Moving out of a Brisbane rental is expensive enough without losing part of your bond over a greasy oven or a mouldy shower. A bond clean, also called an end-of-lease clean, is usually the single biggest thing standing between you and a full refund. Here's what Brisbane renters can expect to pay in 2026, why prices vary so much, and how to make sure the clean you pay for is the one your property manager is looking for.",
    },
    {
      type: "tip",
      title: "The short answer",
      text: "Most Brisbane bond cleans cost about **$200–$380 for a one-bedroom unit**, **$260–$450 for two bedrooms**, **$350–$600 for a three-bedroom house** and **$450–$950 for four bedrooms**. Carpet steam cleaning is often an extra **$80–$150**. A thorough clean from a quality company sits in the middle to upper part of each range.",
    },

    { type: "h2", text: "Brisbane bond cleaning prices by home size" },
    {
      type: "p",
      text: "These ranges come from 2026 Brisbane bond cleaning price guides published by local cleaning companies. Bond cleans are almost always quoted as a fixed price rather than by the hour.",
    },
    {
      type: "ul",
      items: [
        "**Studio or one-bedroom unit:** about $200–$380.",
        "**Two-bedroom unit or small house:** about $260–$450, or roughly $400–$550 with two bathrooms.",
        "**Three-bedroom house:** about $350–$600. Larger or two-storey homes can reach $700.",
        "**Four-bedroom house:** about $450–$950, depending on bathrooms, living areas and condition.",
        "**Carpet steam cleaning:** commonly quoted separately at around $80–$150, unless it's bundled into the price.",
      ],
    },
    {
      type: "p",
      text: "Why the wide spread? The top of each range usually reflects a home in poorer condition, extra bathrooms, two storeys, or a quote that includes carpets, blinds and other extras. The bottom usually reflects a small, well-kept home – or a quote that leaves things out.",
    },

    { type: "h2", text: "What a quality bond clean should include" },
    {
      type: "p",
      text: "A bond clean goes well beyond a regular clean. Your property manager will compare the home with your entry condition report, so the clean needs to reach the places a weekly clean never touches. A quality quote should include, at minimum:",
    },
    {
      type: "ul",
      items: [
        "**Kitchen:** inside and outside every cupboard and drawer, the oven, grill trays, stovetop and rangehood filters, plus benchtops, splashback and sink.",
        "**Bathrooms and laundry:** shower screens, tiles and grout scrubbed, toilet, vanity and cabinets inside and out, mirrors, exhaust fan covers and the laundry tub.",
        "**Every room:** wardrobes and built-ins, skirting boards, doors and frames, light switches, window sills, tracks and inside glass, and ceiling fans and light fittings.",
        "**Floors:** vacuumed and mopped throughout, including edges.",
      ],
    },
    {
      type: "p",
      text: "Check what's left out, too. Carpet steam cleaning, blinds, outside windows and wall marks are often excluded or charged separately. A cheap quote can look great until you find you need three more trades.",
    },

    { type: "h2", text: "What makes a Brisbane bond clean cost more" },
    {
      type: "p",
      text: "Brisbane's housing and climate add a few cost factors you won't see everywhere.",
    },
    {
      type: "ul",
      items: [
        "**Humidity and mould:** Brisbane's humid summers mean bathroom mould, mildew on grout and silicone, and condensation marks are common. Heavy mould takes much longer to remove.",
        "**Queenslanders and timber floors:** older timber homes have VJ-lined rooms, high ceilings, ornate fittings and timber floors that need the right products – and usually more time.",
        "**Inner-city apartments:** in suburbs like " + b("south-brisbane", "South Brisbane") + ", " + b("fortitude-valley", "Fortitude Valley") + " and " + b("newstead", "Newstead") + ", parking, lift bookings and building access can add time even when the unit is small.",
        "**Student rentals:** share houses near the universities in " + b("st-lucia", "St Lucia") + " and " + b("toowong", "Toowong") + " often have more people, more cooking and more wear, so they take longer.",
        "**Ceiling fans and louvres:** most Brisbane homes have several fans, and louvre windows have lots of glass and tracks to clean.",
        "**Timing:** end-of-month, end-of-semester and the January–February moving season are the busiest times. Book early for those dates.",
      ],
    },

    { type: "h2", text: "Is a cheaper bond clean worth the risk?" },
    {
      type: "p",
      text: "A $250 quote for a three-bedroom house can be tempting. But a full bond clean of that home, done properly, usually takes a team most of a day. Divide a fixed price by the hours it really takes and some quotes work out at well under $40 an hour. That usually means rushing, skipping areas, or no insurance.",
    },
    {
      type: "p",
      text: "A good-quality cleaning company typically charges the equivalent of **$65–$70 an hour**. For a bond clean, that buys trained, insured and police-checked cleaners working from a written checklist, and – importantly – someone who'll come back if your property manager flags a cleaning item. If a cheap clean fails the final inspection, a re-clean or a bond deduction can easily cost more than you saved.",
    },

    { type: "h2", text: "How the Queensland bond process works" },
    {
      type: "p",
      text: "Brisbane rentals follow Queensland's rules, administered by the Residential Tenancies Authority (RTA). Knowing the process helps you protect your bond.",
    },
    {
      type: "ol",
      items: [
        "**Entry condition report (Form 1a):** completed when you moved in. This is the benchmark your clean is measured against, so give your cleaner a copy.",
        "**Exit condition report (Form 14a):** you complete this when you move out, noting the condition of each room. Take date-stamped photos after the clean.",
        "**Refund of rental bond (Form 4):** either you or the property manager can lodge it with the RTA. If you both agree, the bond is paid out as requested.",
        "**If there's a claim:** the other party is notified and has 14 days to dispute it. The property manager or owner must give you supporting evidence for a claim within 14 days.",
        "**If it's not resolved:** the RTA offers free dispute resolution. If that doesn't settle it, either party can apply to QCAT for a decision.",
      ],
    },
    {
      type: "p",
      text: "The standard is the same condition as when you moved in, apart from fair wear and tear. Cleaning is your responsibility – but normal wear from everyday living, such as faded paint or worn carpet, isn't.",
    },
    { type: "h3", text: "Do I have to get the carpets professionally cleaned?" },
    {
      type: "p",
      text: "Not automatically. In Queensland, the carpets generally need to be returned to the standard they were in at the start of the tenancy. If they were professionally cleaned before you moved in, you'll usually need to match that. If you kept a pet, your pet approval may include a condition to have carpets professionally cleaned at the end. Check your lease and your entry report, and keep the receipt as evidence.",
    },

    { type: "h2", text: "How to get an accurate bond cleaning quote" },
    {
      type: "ol",
      items: [
        "**Send your entry condition report** so the quote reflects what your property manager will check.",
        "**Give the real size:** bedrooms, bathrooms, living areas, storeys, and whether there's carpet.",
        "**Be honest about condition:** heavy oven grease, mould or pet hair all add time.",
        "**Ask what's excluded:** carpets, blinds, outside windows and wall marks in particular.",
        "**Ask about re-cleans:** if the property manager flags a cleaning item, will they come back at no charge?",
        "**Check insurance and police checks:** you're giving the cleaner access to a property you're still responsible for.",
        "**Book for an empty home:** schedule the clean after the removalists and before your final inspection.",
      ],
    },

    { type: "h2", text: "Where Brisbane bond cleans are most common" },
    {
      type: "p",
      text: "Bond cleans come up all over Brisbane, but especially in rental-heavy apartment and student areas. Inner-city units in " + b("brisbane-city", "Brisbane City") + ", " + b("west-end", "West End") + ", " + b("kangaroo-point", "Kangaroo Point") + ", " + b("spring-hill", "Spring Hill") + " and " + b("new-farm", "New Farm") + " tend to be quicker to clean, but take more time to access. Family homes in suburbs like " + b("chermside", "Chermside") + ", " + b("carindale", "Carindale") + ", " + b("sunnybank", "Sunnybank") + " and " + b("indooroopilly", "Indooroopilly") + " are bigger jobs with more bathrooms and living areas. See every [Brisbane suburb we clean](/areas/brisbane).",
    },
    {
      type: "p",
      text: "Moving within South East Queensland? Compare bond cleaning prices in [Logan](/cleaning-guides/bond-cleaning-cost-logan) and on the [Gold Coast](/cleaning-guides/bond-cleaning-cost-gold-coast), or read our [Brisbane house cleaning cost guide](/cleaning-guides/how-much-does-house-cleaning-cost-in-brisbane) for regular cleaning prices.",
    },

    { type: "h2", text: "Get a bond cleaning quote for your Brisbane rental" },
    {
      type: "p",
      text: "Swept's [bond cleaning](/services/bond-cleaning) is built around your entry condition report, with [carpet steam cleaning](/services/carpet-cleaning) available as an add-on. Send us your move-out date and your entry report, and we'll send a written, fixed price with the checklist included. [Get your free quote](/quote?service=bond-cleaning).",
    },
  ],
  faqs: [
    {
      q: "How much does a bond clean cost in Brisbane?",
      a: "In 2026, most Brisbane bond cleans cost about $200–$380 for a one-bedroom unit, $260–$450 for two bedrooms, $350–$600 for a three-bedroom house and $450–$950 for four bedrooms. Carpet steam cleaning is often an extra $80–$150.",
    },
    {
      q: "Is carpet cleaning included in a bond clean?",
      a: "Often not. Many Brisbane cleaners quote carpet steam cleaning separately, at around $80–$150. Always check whether a quote includes carpets, and whether your lease or pet approval requires them to be professionally cleaned.",
    },
    {
      q: "Do I have to use a professional bond cleaner in Queensland?",
      a: "No. You can clean the property yourself. What matters is that it's returned in the same condition as at the start of the tenancy, apart from fair wear and tear, as recorded on your entry condition report (Form 1a).",
    },
    {
      q: "How long do I have to dispute a bond claim in Queensland?",
      a: "If the property manager or owner claims part of your bond, the RTA sends you a notice and you have 14 days to dispute it. Unresolved disputes go through RTA dispute resolution and can then be taken to QCAT.",
    },
    {
      q: "When should I book my bond clean?",
      a: "Book the clean for after the removalists have left and before your final inspection. End-of-month dates and the January–February moving season book out quickly, so arrange it as soon as you know your vacate date.",
    },
    {
      q: "Can a bond cleaner guarantee I get my bond back?",
      a: "No honest cleaner can guarantee your whole bond, because bond claims can also cover damage, rent or other items outside cleaning. Look for a cleaner who works from your entry report and will come back to fix any cleaning item your property manager raises.",
    },
  ],
};
