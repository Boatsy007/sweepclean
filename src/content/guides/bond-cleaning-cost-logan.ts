import type { Guide } from "@/lib/guides";
import { photos } from "@/lib/photos";

/*
 * Sources (checked November 2026):
 * - Airtasker Logan-area end-of-lease listings: posted 3-bed jobs mostly ~$210–$450 (e.g. $250 3-bed 1-bath,
 *   $400 3-bed 2-bath, $350 two-storey 3-bed in Kingston, $430 Logan Central Dec 2025) – asking prices.
 * - A Logan bond cleaning company quotes $300–$800 for a standard three-bedroom house.
 * - Brisbane-region company price guides (Logan is part of the same market): 3 bed ~$350–$600,
 *   4 bed ~$450–$950, carpet steam cleaning ~$80–$150 extra.
 * - RTA Queensland bond process (Form 1a, 14a, 4, 16; 14-day dispute window; evidence within 14 days; QCAT);
 *   pet approval conditions can include professional carpet cleaning.
 * - Good-quality company rate $65–$70/hr is the owner's position; hour examples are illustrative.
 * Review the ranges yearly and update `updated`.
 */

const l = (slug: string, name: string) => `[${name}](/areas/logan/${slug})`;

export const guide: Guide = {
  slug: "bond-cleaning-cost-logan",
  title: "Bond Cleaning Cost in Logan: What Should You Expect to Pay?",
  metaTitle: "Bond Cleaning Cost Logan (2026 Prices) | Swept Cleaning",
  description:
    "Logan bond cleaning prices for 2026 – from units to four-bedroom family homes – plus pets, carpets and how to protect your bond under Queensland's RTA rules.",
  published: "2026-11-04",
  categories: ["Bond cleaning", "Pricing"],
  image: photos.cleaner,
  services: ["bond-cleaning", "carpet-cleaning"],
  areas: ["logan"],
  related: ["bond-cleaning-cost-brisbane", "how-much-does-house-cleaning-cost-in-logan", "bond-cleaning-cost-gold-coast"],
  sources: [
    { title: "End of lease cleaning in Logan Central", url: "https://www.airtasker.com/cleaning/end-of-lease-cleaning/logan-central-qld", publisher: "Airtasker" },
    { title: "End of lease cleaning services cost", url: "https://bondcleaningloganarea-com-au.pages.dev/end-of-lease-cleaning-services-cost-what-does-it-really-cost", publisher: "Bond Cleaning Logan Area" },
    { title: "How much does a bond clean cost in Brisbane? (2026 guide)", url: "https://www.absolutedomestics.com.au/blog/how-much-does-a-bond-clean-cost-in-brisbane/", publisher: "Absolute Domestics" },
    { title: "Bond cleaning cost Brisbane 2026", url: "https://sparkleclean.au/blog/how-much-does-bond-cleaning-cost-in-brisbane", publisher: "SparkleClean" },
    { title: "Bond refunds", url: "https://www.rta.qld.gov.au/renting/ending-a-tenancy/bond-refunds", publisher: "Residential Tenancies Authority (QLD)" },
    { title: "Rental bonds fact sheet", url: "https://www.rta.qld.gov.au/forms-resources/fact-sheets/general-tenancy-fact-sheets/rental-bonds-fact-sheet", publisher: "Residential Tenancies Authority (QLD)" },
    { title: "Carpet cleaning and pest control", url: "https://www.rta.qld.gov.au/renting/ending-a-tenancy/bond-refunds/carpet-cleaning-and-pest-control", publisher: "Residential Tenancies Authority (QLD)" },
  ],
  body: [
    {
      type: "p",
      text: "Logan has a lot of rental homes, and many of them are big ones – four bedrooms, two bathrooms, a separate living room and often a dog. That makes Logan bond cleans a different job from a city apartment, and the price reflects it. This guide sets out what Logan renters are paying in 2026, what pushes the price up, and how to avoid paying twice.",
    },
    {
      type: "tip",
      title: "The short answer",
      text: "Posted bond cleaning jobs for **three-bedroom Logan homes** mostly ask **$210–$450**, while cleaning companies quote about **$300 to $800**. A **four-bedroom family home** commonly costs **$450–$950** from a company, and **carpet steam cleaning** often adds **$80–$150**. Pets, two storeys and extra bathrooms push the price towards the top.",
    },

    { type: "h2", text: "Logan bond cleaning prices at a glance" },
    {
      type: "p",
      text: "Logan sits within the wider Brisbane market, so company prices are similar. What's different is the mix of homes – more large houses and fewer small apartments.",
    },
    {
      type: "ul",
      items: [
        "**Unit or townhouse:** usually priced like Brisbane units – roughly $200–$450 depending on bedrooms and bathrooms.",
        "**Three-bedroom house, marketplace jobs:** posted Logan jobs mostly ask $210–$450. For example, around $250 for a three-bedroom, one-bathroom home and around $400 for three bedrooms with two bathrooms.",
        "**Three-bedroom house, cleaning companies:** about $300–$800, depending on size, condition and inclusions.",
        "**Four-bedroom family home:** commonly $450–$950 from a cleaning company.",
        "**Carpet steam cleaning:** often an extra $80–$150, unless it's included.",
      ],
    },
    {
      type: "p",
      text: "Marketplace figures are what people posted as asking prices. The final price – and what's actually included – can be quite different, so compare quotes on scope, not just the headline number.",
    },

    { type: "h2", text: "Why Logan bond cleans can cost more" },
    { type: "h3", text: "Bigger homes, more bathrooms" },
    {
      type: "p",
      text: "Estate homes in suburbs like " + l("marsden", "Marsden") + ", " + l("crestmead", "Crestmead") + ", " + l("waterford", "Waterford") + " and " + l("park-ridge", "Park Ridge") + " often have four bedrooms, an ensuite, a main bathroom, a separate toilet and a media room. Every extra bathroom adds scrubbing, grout, glass and fittings, and every extra room adds wardrobes, fans, sills and tracks.",
    },
    { type: "h3", text: "Pets" },
    {
      type: "p",
      text: "Plenty of Logan renters have dogs. Pet hair works its way into carpets, tracks, vents and skirting boards, and paw marks show on glass sliding doors. If your pet approval included a condition to have carpets professionally cleaned at the end of the tenancy, budget for it and keep the receipt.",
    },
    { type: "h3", text: "Two-storey homes" },
    {
      type: "p",
      text: "Stairs, balustrades, extra landings and high windows take time. A two-storey, three-bedroom home will often cost more than a single-storey four-bedroom one.",
    },
    { type: "h3", text: "Busy family kitchens" },
    {
      type: "p",
      text: "A family kitchen used every day builds up grease in the oven, rangehood filters and on cupboard doors. Heavy oven grease is one of the most common reasons a bond clean takes longer than expected.",
    },
    { type: "h3", text: "Distance" },
    {
      type: "p",
      text: "Logan covers a big area, from " + l("springwood", "Springwood") + " and " + l("rochedale-south", "Rochedale South") + " in the north to acreage around " + l("jimboomba", "Jimboomba") + " and new estates in " + l("yarrabilba", "Yarrabilba") + " and " + l("flagstone", "Flagstone") + ". Some cleaners add travel time for outer suburbs, so ask.",
    },

    { type: "h2", text: "What a quality bond clean includes" },
    {
      type: "p",
      text: "Whatever you pay, the clean should be measured against your entry condition report. A thorough Logan bond clean should cover:",
    },
    {
      type: "ul",
      items: [
        "Inside and outside every kitchen cupboard and drawer, the oven, grill trays, stovetop and rangehood filters.",
        "Showers, screens, tiles and grout in every bathroom and ensuite, plus toilets, vanities, mirrors and exhaust fan covers.",
        "Wardrobes, skirting boards, doors, light switches, window sills, tracks and inside glass throughout.",
        "Ceiling fans and light fittings, and every floor vacuumed and mopped.",
        "Optional extras such as carpet steam cleaning and blinds, clearly priced.",
      ],
    },

    { type: "h2", text: "What a good cleaning company costs – and why" },
    {
      type: "p",
      text: "A good-quality cleaning company typically charges the equivalent of **$65–$70 an hour**. A thorough bond clean of a four-bedroom, two-bathroom Logan home often takes a team most of a day, so a quality fixed price will usually land in the upper half of the company range above.",
    },
    {
      type: "p",
      text: "What that buys you is insured, police-checked cleaners, a written checklist built from your entry report, and a company that will come back if your property manager flags a cleaning item. If a quote seems very low for the size of your home, ask how many hours are included – a rushed clean that fails inspection usually costs more in the end.",
    },

    { type: "h2", text: "Protecting your bond in Queensland" },
    {
      type: "p",
      text: "Logan rentals follow Queensland's rules, administered by the Residential Tenancies Authority (RTA).",
    },
    {
      type: "ol",
      items: [
        "**Start with your entry report (Form 1a).** It's the benchmark. Give your cleaner a copy so they focus on what will be checked.",
        "**Complete your exit condition report (Form 14a)** when you move out, and take date-stamped photos of every room after the clean.",
        "**Lodge a Refund of rental bond (Form 4)** with the RTA, or agree it with your property manager.",
        "**If part of the bond is claimed,** you'll be notified and have 14 days to dispute it. The property manager or owner must give you supporting evidence within 14 days of the claim.",
        "**Use RTA dispute resolution** if you disagree. If it isn't resolved there, either party can apply to QCAT.",
      ],
    },
    {
      type: "p",
      text: "Remember fair wear and tear. You need to return the home clean and in the condition you received it, but you're not responsible for normal ageing – faded paint, worn carpet in walkways or minor marks from everyday living.",
    },

    { type: "h2", text: "Bond cleans across Logan's suburbs" },
    {
      type: "p",
      text: "Rental-heavy suburbs like " + l("woodridge", "Woodridge") + ", " + l("slacks-creek", "Slacks Creek") + ", " + l("kingston", "Kingston") + ", " + l("logan-central", "Logan Central") + " and " + l("beenleigh", "Beenleigh") + " see lots of bond cleans, from units to family homes. Newer estates in " + l("yarrabilba", "Yarrabilba") + ", " + l("park-ridge", "Park Ridge") + " and " + l("flagstone", "Flagstone") + " are often quicker to clean because finishes are newer, while established brick homes in " + l("shailer-park", "Shailer Park") + " and " + l("daisy-hill", "Daisy Hill") + " tend to be larger. See every [Logan suburb we clean](/areas/logan).",
    },
    {
      type: "p",
      text: "For regular cleaning prices, read [how much house cleaning costs in Logan](/cleaning-guides/how-much-does-house-cleaning-cost-in-logan). Moving closer to the city? See [bond cleaning costs in Brisbane](/cleaning-guides/bond-cleaning-cost-brisbane).",
    },

    { type: "h2", text: "Get a fixed bond cleaning price for your Logan home" },
    {
      type: "p",
      text: "Swept's [bond cleaning](/services/bond-cleaning) follows your entry condition report room by room, with [carpet steam cleaning](/services/carpet-cleaning) available if you need it. Tell us your vacate date, the size of the home and about any pets, and we'll send a clear written price. [Get your free quote](/quote?service=bond-cleaning).",
    },
  ],
  faqs: [
    {
      q: "How much does a bond clean cost in Logan?",
      a: "For a three-bedroom Logan home, posted marketplace jobs mostly ask $210–$450, and cleaning companies quote about $300–$800. Four-bedroom family homes commonly cost $450–$950 from a company, with carpet steam cleaning often an extra $80–$150.",
    },
    {
      q: "Does having a dog make a bond clean more expensive?",
      a: "Usually, yes. Pet hair in carpets, tracks and vents takes extra time, and your pet approval may require the carpets to be professionally cleaned at the end of the tenancy. Mention pets when you ask for a quote.",
    },
    {
      q: "Why is my four-bedroom bond clean so much more than a unit?",
      a: "Bond cleans are priced on time, and a four-bedroom home has more bathrooms, wardrobes, windows, tracks and floor area. A two-storey home adds stairs and high windows on top.",
    },
    {
      q: "Do Logan bond cleaners charge travel fees?",
      a: "Some do, particularly for outer and acreage areas such as Jimboomba. Ask whether travel is included before you book.",
    },
    {
      q: "What happens if my property manager says the clean isn't good enough?",
      a: "Check their concerns against your entry condition report and photos. A good bond cleaner will come back to fix any cleaning item they covered. If part of your bond is claimed, you have 14 days to dispute it with the RTA.",
    },
    {
      q: "Is a bond clean the same as a deep clean?",
      a: "They're similar, but a bond clean is done on an empty home and is measured against your entry condition report, so it includes inside cupboards, wardrobes, the oven and other areas a property manager inspects.",
    },
  ],
};
