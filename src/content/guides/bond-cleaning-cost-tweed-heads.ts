import type { Guide } from "@/lib/guides";
import { photos } from "@/lib/photos";

/*
 * Sources (checked November 2026):
 * - Airtasker Tweed Heads end-of-lease: $212–$430, median ~$300; posted jobs e.g. $400 for a 3-bed 1-bath
 *   duplex in Tweed Heads West.
 * - TheQuoteGuys Tweed Heads: standard residential bond clean typically $280–$700, plus $100–$200 for
 *   professional carpet steam cleaning where required.
 * - TaskLegend Tweed Heads: $200–$800 depending on property size and specifics.
 * - NSW: condition report at the start of the tenancy; Rental Bonds Online (NSW Fair Trading); landlord bond
 *   claim → tenant has 14 days to apply to NCAT if disputing (NSW Government, Tenants' Union NSW);
 *   leases generally can't require professional carpet cleaning at the end, main exception relates to pets
 *   (Residential Tenancies Act 2010 – confirm current wording with NSW Fair Trading).
 * - Good-quality company rate $65–$70/hr is the owner's position.
 * Review the ranges yearly and update `updated`.
 */

const t = (slug: string, name: string) => `[${name}](/areas/tweed-heads/${slug})`;

export const guide: Guide = {
  slug: "bond-cleaning-cost-tweed-heads",
  title: "Bond Cleaning Cost in Tweed Heads: What Should You Expect to Pay?",
  metaTitle: "Bond Cleaning Cost Tweed Heads (2026 Prices) | Swept",
  description:
    "Tweed Heads bond cleaning prices for 2026 and how NSW rules differ from Queensland – condition reports, carpet cleaning, Rental Bonds Online and NCAT.",
  published: "2026-11-04",
  categories: ["Bond cleaning", "Pricing"],
  image: photos.apartment,
  services: ["bond-cleaning", "carpet-cleaning"],
  areas: ["tweed-heads"],
  related: ["average-price-cleaning-services-tweed-heads", "bond-cleaning-cost-gold-coast"],
  body: [
    {
      type: "p",
      text: "Tweed Heads is only a few minutes from Coolangatta, but when you move out of a rental there, you're dealing with a different state's rules. Bond cleaning prices are similar to the southern Gold Coast, but the paperwork, the carpet rules and the dispute process all follow NSW law. This guide covers both: what you'll pay, and what you need to know to get your bond back.",
    },
    {
      type: "tip",
      title: "The short answer",
      text: "Most Tweed Heads bond cleans cost **$280–$700**, with a typical marketplace price of around **$300**. Small units sit at the lower end, while three- and four-bedroom homes sit towards the top. Carpet steam cleaning, where needed, often adds **$100–$200**. Tweed is in NSW, so your bond is held by **NSW Fair Trading**, not Queensland's RTA.",
    },

    { type: "h2", text: "Tweed Heads bond cleaning prices" },
    {
      type: "p",
      text: "There are fewer published price guides for Tweed than for Brisbane or the Gold Coast, but local quote sites and marketplace data point to similar ranges.",
    },
    {
      type: "ul",
      items: [
        "**Typical range:** about $280–$700 for a standard residential bond clean, depending on size and condition.",
        "**Marketplace jobs:** Airtasker's Tweed Heads end-of-lease jobs range from about $212 to $430, with a median of around $300. One three-bedroom, one-bathroom duplex in Tweed Heads West was posted at $400.",
        "**Wider range:** some local providers quote from about $200 for small units up to $800 for large homes.",
        "**Carpet steam cleaning:** about $100–$200 extra, where it's needed.",
      ],
    },
    {
      type: "p",
      text: "As a rough guide, a one- or two-bedroom unit near the river or beach usually sits towards the lower end. A three- or four-bedroom family home in " + t("banora-point", "Banora Point") + ", " + t("terranora", "Terranora") + " or " + t("tweed-heads-south", "Tweed Heads South") + " usually sits towards the upper end, especially with carpet.",
    },

    { type: "h2", text: "How NSW bond rules differ from Queensland" },
    {
      type: "p",
      text: "If you've rented on the Gold Coast before, some of this will feel different. The cleaning standard is much the same, but the process isn't.",
    },
    {
      type: "ul",
      items: [
        "**Who holds your bond:** NSW Fair Trading, through Rental Bonds Online – not the Queensland RTA.",
        "**Condition report:** the benchmark is the condition report completed at the start of your tenancy. There are no Queensland Form 1a or Form 14a reports.",
        "**Claims:** your landlord or agent lodges a claim through Rental Bonds Online. If you disagree, you have 14 days from the notice to apply to the NSW Civil and Administrative Tribunal (NCAT) and tell Fair Trading.",
        "**Disputes:** go to NCAT. NSW Fair Trading can't decide bond disputes itself.",
        "**Agreed claims:** if you agree with the claim, or don't dispute it in time, the bond is paid out as claimed.",
      ],
    },
    { type: "h3", text: "Do you have to get the carpets professionally cleaned in NSW?" },
    {
      type: "p",
      text: "Generally, no. In NSW, a lease generally can't require you to have the carpets professionally cleaned at the end of the tenancy. The main exception relates to keeping a pet. What you do need to do is leave the carpets reasonably clean and in the same condition as at the start, allowing for fair wear and tear. If you're unsure, check your agreement and NSW Fair Trading's guidance before you pay for carpet cleaning.",
    },
    {
      type: "p",
      text: "This is one of the biggest practical differences from Queensland, where carpets need to be returned to the standard they were in at the start – which can mean a professional clean if they were professionally cleaned before you moved in.",
    },

    { type: "h2", text: "What adds time to a Tweed bond clean" },
    {
      type: "ul",
      items: [
        "**Sand and salt:** coastal homes in " + t("tweed-heads", "Tweed Heads") + " and " + t("fingal-head", "Fingal Head") + " collect sand in tracks and corners, and salt film on glass.",
        "**Humidity:** riverside and canal homes in " + t("tweed-heads-west", "Tweed Heads West") + " and " + t("chinderah", "Chinderah") + " are prone to mould in bathrooms, wardrobes and window frames.",
        "**Hillside homes:** larger homes in " + t("terranora", "Terranora") + " and " + t("bilambil-heights", "Bilambil Heights") + " often have big windows, multiple living areas and more bathrooms.",
        "**Furnished holiday-style rentals:** check whether the lease expects furniture and appliances to be cleaned too.",
        "**Condition:** heavy oven grease, mould and pet hair all add time and cost.",
      ],
    },

    { type: "h2", text: "What a quality bond clean includes" },
    {
      type: "ul",
      items: [
        "Inside and outside every kitchen cupboard and drawer, the oven, grill trays, stovetop and rangehood filters.",
        "Bathrooms scrubbed, including shower screens, tiles, grout, toilet, vanity, mirrors and exhaust fan covers.",
        "Wardrobes, skirting boards, doors, light switches, window sills, tracks and inside glass.",
        "Ceiling fans and light fittings dusted, and every floor vacuumed and mopped.",
        "Extras such as carpet steam cleaning and blinds, priced clearly.",
      ],
    },
    {
      type: "p",
      text: "A good-quality cleaning company typically charges the equivalent of **$65–$70 an hour**. For a bond clean, that means insured, police-checked cleaners, a checklist built around your condition report, and a cleaner who'll come back if your agent raises a cleaning item.",
    },

    { type: "h2", text: "Cross-border tips for Tweed renters" },
    {
      type: "ol",
      items: [
        "**Check which state your rental is in.** It's the property's location that matters, not where you work or where you're moving to.",
        "**Mind daylight saving.** From October to April, NSW is an hour ahead of Queensland. Confirm cleaning and inspection times in NSW time.",
        "**Keep your condition report handy.** Give a copy to your cleaner and use it to check the result before you hand back the keys.",
        "**Photograph everything** after the clean, room by room, with dates.",
        "**Don't pay for carpet cleaning you don't need.** Check your agreement first – but if you kept a pet, budget for it.",
      ],
    },

    { type: "h2", text: "Get a bond cleaning quote in Tweed Heads" },
    {
      type: "p",
      text: "Swept cleans rentals across " + t("tweed-heads", "Tweed Heads") + ", " + t("banora-point", "Banora Point") + ", " + t("tweed-heads-south", "Tweed Heads South") + " and the surrounding area. Our [bond cleaning](/services/bond-cleaning) is cleaned room by room against the condition report you signed, and we confirm bookings in NSW time. Send us your move-out date and condition report and we'll send a written, fixed price. [Get your free quote](/quote?service=bond-cleaning).",
    },
    {
      type: "p",
      text: "Also see our [Tweed Heads cleaning price guide](/cleaning-guides/average-price-cleaning-services-tweed-heads), [bond cleaning costs on the Gold Coast](/cleaning-guides/bond-cleaning-cost-gold-coast), and every [Tweed suburb we clean](/areas/tweed-heads).",
    },
  ],
  faqs: [
    {
      q: "How much does a bond clean cost in Tweed Heads?",
      a: "Most Tweed Heads bond cleans cost about $280–$700 in 2026, with a typical marketplace price of around $300. Carpet steam cleaning, where needed, often adds $100–$200.",
    },
    {
      q: "Does Tweed Heads follow NSW or Queensland bond rules?",
      a: "NSW rules. Tweed Heads is in New South Wales, so your bond is held by NSW Fair Trading through Rental Bonds Online, and disputes go to NCAT rather than Queensland's RTA and QCAT.",
    },
    {
      q: "Do I have to get the carpets professionally cleaned when I leave a NSW rental?",
      a: "Generally no – a NSW lease generally can't require professional carpet cleaning at the end of the tenancy, with the main exception relating to pets. You do need to leave the carpets reasonably clean and in the same condition as at the start, allowing for fair wear and tear.",
    },
    {
      q: "How long do I have to dispute a bond claim in NSW?",
      a: "If your landlord or agent claims part of your bond, you have 14 days from the notice to apply to NCAT and tell NSW Fair Trading in writing. If you don't, the bond is paid out as claimed.",
    },
    {
      q: "Is bond cleaning cheaper in Tweed than on the Gold Coast?",
      a: "Prices are broadly similar. Tweed Heads bond cleans mostly cost $280–$700, which overlaps closely with southern Gold Coast prices for similar homes.",
    },
    {
      q: "What time zone should I book my Tweed bond clean in?",
      a: "Book in NSW time. From October to April, NSW is on daylight saving and is an hour ahead of Queensland, so confirm cleaning and inspection times carefully.",
    },
  ],
};
