import type { Guide } from "@/lib/guides";
import { photos } from "@/lib/photos";

/*
 * Sources (checked November 2026):
 * - What's the Damage Gold Coast: bond cleans 1 bed $215–$370, 2 bed $245–$490, 3 bed $345–$685,
 *   4 bed $490–$835.
 * - Gold Coast apartment specialist (SparkleClean): all-inclusive carpeted 2-bed apartment ~$320–$480;
 *   many operators quote carpet steaming separately.
 * - Cleaning Search estimator: 2–3 bed unit base clean ~$230–$540, carpet steam ~$40 per bedroom extra.
 * - Provider price lists: studio from ~$210, 1 bed from ~$245; larger 3–4 bed apartments ~$480–$650.
 * - RTA Queensland bond process (Form 1a, 14a, 4, 16; 14-day dispute window; evidence within 14 days; QCAT).
 * - Good-quality company rate $65–$70/hr is the owner's position.
 * Review the ranges yearly and update `updated`.
 */

const g = (slug: string, name: string) => `[${name}](/areas/gold-coast/${slug})`;

export const guide: Guide = {
  slug: "bond-cleaning-cost-gold-coast",
  title: "Bond Cleaning Cost on the Gold Coast: What Should You Expect to Pay?",
  metaTitle: "Bond Cleaning Cost Gold Coast (2026 Prices) | Swept Cleaning",
  description:
    "Gold Coast bond cleaning prices for 2026, from beachside apartments to family homes, plus sand, salt and building access tips and the QLD RTA bond process.",
  published: "2026-11-04",
  categories: ["Bond cleaning", "Pricing"],
  image: photos.bathroom,
  services: ["bond-cleaning", "carpet-cleaning"],
  areas: ["gold-coast"],
  related: ["average-price-cleaning-services-gold-coast", "bond-cleaning-cost-tweed-heads", "bond-cleaning-cost-brisbane"],
  sources: [
    { title: "House cleaning cost Gold Coast 2026", url: "https://whatsthedamage.com.au/house-cleaning-cost-gold-coast/", publisher: "What's the Damage" },
    { title: "Bond cleaning Gold Coast apartments 2026", url: "https://sparkleclean.au/blog/bond-cleaning-gold-coast-for-apartments", publisher: "SparkleClean" },
    { title: "Bond cleaning calculator and price list Australia 2026", url: "https://cleaningsearch.com.au/tools/bond-cleaning-estimator", publisher: "Cleaning Search" },
    { title: "Bond cleaning Gold Coast prices (2026)", url: "https://clean4you.com.au/how-much-does-bond-cleaning-cost-in-gold-coast/", publisher: "Clean4You" },
    { title: "Bond refunds", url: "https://www.rta.qld.gov.au/renting/ending-a-tenancy/bond-refunds", publisher: "Residential Tenancies Authority (QLD)" },
    { title: "Rental bonds fact sheet", url: "https://www.rta.qld.gov.au/forms-resources/fact-sheets/general-tenancy-fact-sheets/rental-bonds-fact-sheet", publisher: "Residential Tenancies Authority (QLD)" },
    { title: "Carpet cleaning and pest control", url: "https://www.rta.qld.gov.au/renting/ending-a-tenancy/bond-refunds/carpet-cleaning-and-pest-control", publisher: "Residential Tenancies Authority (QLD)" },
  ],
  body: [
    {
      type: "p",
      text: "The Gold Coast rental market is unusual. One week you're moving out of a high-rise in Surfers Paradise, the next you're handing back a four-bedroom house in Pimpama. Bond cleaning prices on the Coast swing just as widely, and the coastal environment adds a few jobs inland cleaners rarely deal with. Here's what to expect in 2026.",
    },
    {
      type: "tip",
      title: "The short answer",
      text: "Gold Coast bond cleans typically cost **$215–$370 for one bedroom**, **$245–$490 for two**, **$345–$685 for three** and **$490–$835 for four bedrooms**. For a carpeted two-bedroom apartment, an all-inclusive price of about **$320–$480** is realistic. Always check whether carpet steam cleaning is included.",
    },

    { type: "h2", text: "Gold Coast bond cleaning prices by size" },
    {
      type: "p",
      text: "These ranges come from 2026 Gold Coast price guides and provider price lists. Most bond cleans are quoted as a fixed price.",
    },
    {
      type: "ul",
      items: [
        "**Studio:** from about $210.",
        "**One bedroom:** about $215–$370.",
        "**Two bedrooms:** about $245–$490. A carpeted two-bedroom apartment, all-inclusive, is commonly $320–$480.",
        "**Three bedrooms:** about $345–$685. Larger three- and four-bedroom apartments are often around $480–$650.",
        "**Four bedrooms:** about $490–$835, more for large canal or prestige homes.",
        "**Carpet steam cleaning:** often quoted separately. Price guides suggest roughly $40 a bedroom on top of a base clean, though some operators charge considerably more per room.",
      ],
    },

    { type: "h2", text: "Apartments vs houses on the Gold Coast" },
    { type: "h3", text: "High-rise and beachside apartments" },
    {
      type: "p",
      text: "Apartments in " + g("surfers-paradise", "Surfers Paradise") + ", " + g("broadbeach", "Broadbeach") + ", " + g("main-beach", "Main Beach") + " and " + g("southport", "Southport") + " are smaller to clean, but rarely quick. Lift bookings, visitor parking, key collection and building rules all take time. Floor-to-ceiling glass and long sliding doors need careful work, and many apartments have tiled floors rather than carpet – which can make carpet costs lower.",
    },
    { type: "h3", text: "Family homes and new estates" },
    {
      type: "p",
      text: "In the northern growth corridor – " + g("pimpama", "Pimpama") + ", " + g("coomera", "Coomera") + ", " + g("upper-coomera", "Upper Coomera") + " and " + g("ormeau", "Ormeau") + " – rentals are often newer four-bedroom homes with two bathrooms and carpeted bedrooms. Newer finishes are easier to clean, but the size of the home sets the price.",
    },
    { type: "h3", text: "Canal and prestige homes" },
    {
      type: "p",
      text: "Larger homes in " + g("hope-island", "Hope Island") + ", " + g("benowa", "Benowa") + ", " + g("runaway-bay", "Runaway Bay") + " and " + g("sanctuary-cove", "Sanctuary Cove") + " often have stone benchtops, lots of glass and multiple living areas. These need the right products and more time, so expect quotes at or above the top of the range.",
    },

    { type: "h2", text: "Coastal living: what adds time to a bond clean" },
    {
      type: "ul",
      items: [
        "**Sand in sliding-door tracks:** homes near the beach in " + g("burleigh-heads", "Burleigh Heads") + ", " + g("palm-beach", "Palm Beach") + ", " + g("mermaid-beach", "Mermaid Beach") + " and " + g("coolangatta", "Coolangatta") + " collect sand in every track, sill and corner.",
        "**Salt film on glass:** sea air leaves a hazy film on windows and glass doors that needs a proper clean, not a quick wipe.",
        "**Humidity and mould:** bathrooms, wardrobes and window frames are prone to mould and mildew, especially in apartments with limited airflow.",
        "**Furnished and holiday-style rentals:** if the property was furnished, the clean may include furniture surfaces and appliances you used, so check your lease.",
        "**Peak seasons:** end-of-month, school holidays and the summer moving season book out quickly.",
      ],
    },

    { type: "h2", text: "What a quality bond clean should include" },
    {
      type: "p",
      text: "Your property manager will compare the property with your entry condition report, so a quality clean covers the areas they inspect:",
    },
    {
      type: "ul",
      items: [
        "Kitchen cupboards and drawers inside and out, oven, grill trays, stovetop and rangehood filters.",
        "Bathrooms scrubbed – shower screens, tiles, grout, toilet, vanity, mirrors and exhaust fan covers.",
        "Wardrobes, skirting boards, doors, light switches, window sills, tracks and inside glass.",
        "Ceiling fans, light fittings, and all floors vacuumed and mopped.",
        "Clearly priced extras such as carpet steam cleaning and blinds.",
      ],
    },
    {
      type: "p",
      text: "A good-quality cleaning company typically charges the equivalent of **$65–$70 an hour**. A quote far below the market for your home size often means fewer hours, a missing area or no insurance – and a failed inspection can cost more than the saving.",
    },

    { type: "h2", text: "How the bond process works on the Gold Coast" },
    {
      type: "p",
      text: "The Gold Coast is in Queensland, so the Residential Tenancies Authority (RTA) rules apply.",
    },
    {
      type: "ol",
      items: [
        "**Entry condition report (Form 1a):** your benchmark. Share it with your cleaner.",
        "**Exit condition report (Form 14a):** complete it when you move out, with dated photos taken after the clean.",
        "**Refund of rental bond (Form 4):** lodged by you or your property manager.",
        "**Claims:** if part of your bond is claimed, you'll be notified and have 14 days to dispute it. The property manager or owner must give you supporting evidence within 14 days.",
        "**Disputes:** the RTA's free dispute resolution comes first. Unresolved disputes can go to QCAT.",
      ],
    },
    {
      type: "p",
      text: "Carpets generally need to be returned to the standard they were in at the start of the tenancy, and a pet approval can include a condition to have them professionally cleaned at the end. Fair wear and tear – normal ageing from everyday living – isn't your responsibility.",
    },
    {
      type: "tip",
      title: "Living near the border?",
      text: "If your rental is in Tweed Heads or anywhere south of the border, NSW rules apply instead. Read our [Tweed Heads bond cleaning cost guide](/cleaning-guides/bond-cleaning-cost-tweed-heads).",
    },

    { type: "h2", text: "Get a bond cleaning quote on the Gold Coast" },
    {
      type: "p",
      text: "Swept cleans rentals right across the Gold Coast, from " + g("robina", "Robina") + " and " + g("varsity-lakes", "Varsity Lakes") + " to " + g("helensvale", "Helensvale") + " and " + g("nerang", "Nerang") + ". Our [bond cleaning](/services/bond-cleaning) is built around your entry report, with [carpet steam cleaning](/services/carpet-cleaning) available. Tell us about your building access and move-out date and we'll send a fixed written price. [Get your free quote](/quote?service=bond-cleaning). For all Gold Coast cleaning prices, see our [Gold Coast cleaning price guide](/cleaning-guides/average-price-cleaning-services-gold-coast), or browse every [Gold Coast suburb we clean](/areas/gold-coast).",
    },
  ],
  faqs: [
    {
      q: "How much is a bond clean on the Gold Coast?",
      a: "In 2026, Gold Coast bond cleans typically cost $215–$370 for one bedroom, $245–$490 for two, $345–$685 for three and $490–$835 for four bedrooms. A carpeted two-bedroom apartment is commonly $320–$480 all-inclusive.",
    },
    {
      q: "Are apartment bond cleans cheaper than houses?",
      a: "Usually, because there's less floor area and often fewer carpeted rooms. But building access, lift bookings, parking and lots of glass can add time, so a high-rise apartment isn't always much cheaper.",
    },
    {
      q: "Does sand affect my bond clean?",
      a: "It can. Sand builds up in sliding-door tracks, window sills and corners, and property managers often check tracks closely. A thorough bond clean should include them.",
    },
    {
      q: "Is carpet cleaning included in a Gold Coast bond clean?",
      a: "Not always. Many operators quote carpet steam cleaning separately, so ask whether your price is all-inclusive. Your lease or pet approval may require professional carpet cleaning.",
    },
    {
      q: "Do Gold Coast rentals follow QLD or NSW bond rules?",
      a: "Gold Coast rentals follow Queensland's RTA rules. If the property is south of the border in Tweed Heads, NSW rules apply instead.",
    },
    {
      q: "How long do I have to dispute a bond claim?",
      a: "In Queensland, you have 14 days from the RTA's notice to dispute a claim on your bond. The RTA offers free dispute resolution, and unresolved disputes can go to QCAT.",
    },
  ],
};
