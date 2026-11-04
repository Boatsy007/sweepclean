import type { Guide } from "@/lib/guides";
import { photos } from "@/lib/photos";

/*
 * Sources (checked November 2026):
 * - Tweed Heads house cleaning ~$33–$66/hr; flat-rate regular cleans ~$70–$220; bond cleans ~$150–$800 (Maid2Match).
 * - Airtasker Tweed Heads listings: house cleaning jobs typically $150–$375, median ~$210; bond cleans median ~$300,
 *   most $212–$430.
 * - The Quote Guys: Tweed bond cleans ~$280–$700 for a standard home; ~$280–$380 for a two-bedroom apartment.
 * - Gold Coast comparison (Airbnb turnovers ~$80–$240; carpets ~$29–$59/room; companies ~$55–$80/hr) – see the
 *   Gold Coast guide's sources. Tweed-specific figures for these weren't available, so they're presented as nearby benchmarks.
 * - NSW: tenants must leave the premises reasonably clean, compared with the ingoing condition report allowing for fair
 *   wear and tear; bonds held by NSW Fair Trading (Rental Bonds Online); disputes go to NCAT (Tenants' Union NSW,
 *   Service NSW). NSW observes daylight saving (October–April), Queensland doesn't.
 * Review the ranges yearly and update `updated`.
 */

export const guide: Guide = {
  slug: "average-price-cleaning-services-tweed-heads",
  title: "What's the Average Price for Cleaning Services in Tweed Heads?",
  metaTitle: "Average Cleaning Prices Tweed Heads (2026) | Swept",
  description:
    "Average cleaning prices in Tweed Heads in 2026 – house, bond, Airbnb and carpet cleaning – plus NSW bond tips and what a good cleaning company charges.",
  published: "2026-11-04",
  categories: ["Pricing", "Bond cleaning", "Airbnb hosting"],
  image: photos.apartment,
  services: ["regular-house-cleaning", "deep-cleaning", "bond-cleaning", "airbnb-cleaning", "carpet-cleaning"],
  areas: ["tweed-heads"],
  related: ["average-price-cleaning-services-gold-coast", "how-much-does-house-cleaning-cost-in-brisbane"],
  body: [
    {
      type: "p",
      text: "Tweed Heads sits right on the Queensland border, so cleaning here is a bit different from the rest of South East Queensland. Homes range from apartments a short walk from Coolangatta to canal homes in Tweed Heads West and hillside properties in Terranora – and because Tweed is in NSW, bond cleans follow NSW tenancy rules. This guide covers the average prices for house cleaning, bond cleaning, Airbnb turnovers and carpet cleaning in Tweed Heads and surrounds in 2026, and what a good-quality cleaning company charges.",
    },
    {
      type: "tip",
      title: "The short answer",
      text: "Published price guides put house cleaning in Tweed Heads at roughly **$33 to $66 an hour**, with most regular cleans costing **$70 to $220** a visit depending on the size of the home. A good-quality cleaning company typically charges **$65 to $70 an hour** – in line with the Gold Coast and Brisbane. Most bond cleans cost around **$280 to $700**.",
    },

    { type: "h2", text: "Tweed Heads cleaning prices at a glance" },
    {
      type: "p",
      text: "There's less published pricing data for Tweed than for Brisbane or the Gold Coast, so these figures combine local price guides and marketplace listings, with Gold Coast benchmarks where Tweed-specific figures aren't available. Treat them as a guide, not a quote.",
    },
    {
      type: "ul",
      items: [
        "**Regular house cleaning:** roughly $33–$66 an hour. Good-quality companies: $65–$70 an hour.",
        "**Regular clean per visit:** roughly $70–$220, depending on the home. Marketplace jobs for a full house clean commonly land around $150–$375, with a median near $210.",
        "**Bond (end-of-lease) clean:** most cost around $280–$700 for a standard home, and about $280–$380 for a two-bedroom apartment.",
        "**Airbnb and holiday rental turnover:** typically similar to the neighbouring Gold Coast, where most turnovers cost $80–$240 per clean.",
        "**Carpet steam cleaning:** typically similar to the Gold Coast, at about $29–$59 per room plus a minimum call-out charge.",
      ],
    },

    { type: "h2", text: "House cleaning prices in Tweed Heads" },
    {
      type: "p",
      text: "Tweed's published hourly range is a little lower than Brisbane's, and the lowest prices usually come from solo operators and marketplace cleaners. Many of the companies that clean Tweed homes also work across the Gold Coast, where established companies charge around $55–$80 an hour – and a good-quality company typically charges **$65 to $70 an hour** on both sides of the border.",
    },
    {
      type: "p",
      text: "At that rate, a regular three-hour clean of a three-bedroom home costs about $195 to $210, and a two-bedroom unit around $130 to $175. What you're paying for is trained cleaners, a written checklist, insurance, reliable bookings and a business that fixes anything that isn't right. See what's included in a [regular home clean](/services/regular-house-cleaning).",
    },
    { type: "h3", text: "Deep cleaning" },
    {
      type: "p",
      text: "A [deep clean](/services/deep-cleaning) covers the details a regular visit doesn't – grout, cupboard fronts, skirting boards, light fittings, window tracks and the oven. It takes considerably longer than a regular clean, so it's priced higher, and it's the best first step if your home hasn't been professionally cleaned for a while.",
    },

    { type: "h2", text: "Bond cleaning prices in Tweed Heads" },
    {
      type: "p",
      text: "Bond cleans are usually quoted as a fixed price. In Tweed Heads, most cost around **$280 to $700** for a standard home, with a two-bedroom apartment typically around $280 to $380. Marketplace listings put the median bond clean near $300, with most jobs between about $212 and $430 – though very cheap bond cleans often leave out the details an agent checks at the final inspection.",
    },
    { type: "h3", text: "Tweed is in NSW – here's what that means for your bond" },
    {
      type: "ul",
      items: [
        "**You must leave the property reasonably clean.** In NSW, that's judged against the **ingoing condition report** you signed at the start of your lease, allowing for fair wear and tear – not Queensland's RTA Form 1a and Form 14a.",
        "**Your bond is held by NSW Fair Trading**, and claims are made through Rental Bonds Online. If you disagree with a claim, it can go to the NSW Civil and Administrative Tribunal (NCAT).",
        "**Check your lease for carpet cleaning.** Some leases ask for carpets to be professionally cleaned when you move out – if yours does, add [carpet steam cleaning](/services/carpet-cleaning) to your bond clean.",
        "**Keep evidence.** Take dated photos of every room after the clean and keep your cleaning invoice.",
      ],
    },
    {
      type: "p",
      text: "A good [bond clean](/services/bond-cleaning) is done room by room against your condition report. Send it with your quote request so nothing is missed.",
    },

    { type: "h2", text: "Airbnb and holiday rental cleaning prices" },
    {
      type: "p",
      text: "Tweed Heads and the nearby beaches are popular for short stays, especially with visitors heading across the border from Coolangatta. Turnover pricing is usually similar to the Gold Coast, where most turnovers cost **$80 to $240 per clean** depending on the number of bedrooms. Linen and laundry, restocking amenities and tight check-out-to-check-in windows can add to the price. A reliable [holiday rental clean](/services/airbnb-cleaning) keeps every guest's first impression the same.",
    },
    {
      type: "tip",
      title: "Two time zones",
      text: "From October to April, NSW runs on daylight saving time and Queensland doesn't – so Tweed is an hour ahead of the Gold Coast. When you book a clean or set a check-in time, confirm which time zone everyone is using.",
    },

    { type: "h2", text: "Carpet cleaning prices" },
    {
      type: "p",
      text: "Published Tweed-specific carpet cleaning prices are limited, but rates are typically similar to the neighbouring Gold Coast – about **$29 to $59 per room**, with a minimum call-out charge for small jobs. Booking carpets together with a bond or deep clean usually works out simpler than arranging them separately.",
    },

    { type: "h2", text: "Why cleaning costs differ across Tweed suburbs" },
    {
      type: "p",
      text: "A good cleaning company charges a similar hourly rate across the Tweed. What changes the total is the type of home and how it's lived in:",
    },
    {
      type: "ul",
      items: [
        "**Border and beach units** in [Tweed Heads](/areas/tweed-heads/tweed-heads) – apartments, older houses and units close to the border and the beach. Units are often quick to clean, but parking and building access can add time, and sand gets into everything.",
        "**Canal and riverside homes** in [Tweed Heads West](/areas/tweed-heads/tweed-heads-west) and [Banora Point](/areas/tweed-heads/banora-point) – canal, riverside and established family homes. Larger homes and humid, waterside living mean more time on bathrooms, glass and sliding doors.",
        "**Family and over-55s homes** in [Tweed Heads South](/areas/tweed-heads/tweed-heads-south) – family homes, townhouses and over-55s living. Regular, consistent cleans are popular with retirees and busy families alike.",
        "**Hillside homes and acreage** in [Terranora](/areas/tweed-heads/terranora) and [Bilambil Heights](/areas/tweed-heads/bilambil-heights) – hillside family homes and acreage, often with large windows and outdoor living areas that add to the cleaning time.",
        "**Coastal village homes** in [Fingal Head](/areas/tweed-heads/fingal-head) – a small coastal village where sand and salt air mean extra attention to floors, tracks and glass.",
        "**Riverside and new homes** in [Chinderah](/areas/tweed-heads/chinderah) – riverside homes and newer developments. A newly built home usually needs a deep clean first to remove builder's dust.",
      ],
    },
    {
      type: "p",
      text: "See every [Tweed suburb we clean](/areas/tweed-heads). If you're just over the border, read our [Gold Coast cleaning price guide](/cleaning-guides/average-price-cleaning-services-gold-coast) too.",
    },

    { type: "h2", text: "What a good cleaning company includes for the price" },
    {
      type: "ul",
      items: [
        "**Trained, experienced cleaners** who know the right products for stone, timber and glass",
        "**A written checklist**, so the standard is the same every visit",
        "**Insurance**, and a business that fixes anything that isn't right",
        "**Reliable bookings**, with cover if your cleaner is sick",
        "**Supplies and equipment** included",
        "**A clear written quote** before anything is booked",
      ],
    },
    {
      type: "p",
      text: "A cheaper cleaner might look like a saving, but a missed booking, a rushed bond clean or a different cleaner every visit quickly costs more than the difference. For more on what's behind a professional rate, see [how much house cleaning costs in Brisbane](/cleaning-guides/how-much-does-house-cleaning-cost-in-brisbane).",
    },

    { type: "h2", text: "How to compare cleaning quotes in Tweed Heads" },
    {
      type: "ol",
      items: [
        "Ask for the **total price per clean**, and how many hours it's based on.",
        "Get the **checklist in writing**, so you can compare what's included.",
        "Check what's **extra** – inside the oven, interior windows, blinds, carpets, laundry or linen.",
        "Ask about **insurance**, and what happens if you're not happy with part of the clean.",
        "For bond cleans, check the quote is based on your **NSW ingoing condition report**.",
        "Confirm **booking times** in NSW time during daylight saving.",
        "Ask whether the price **includes GST**, and whether there's a **lock-in contract**.",
      ],
    },

    { type: "h2", text: "Get an accurate price for your home" },
    {
      type: "p",
      text: "Averages are a good starting point, but your home is the only thing that sets your price. Swept cleans homes across [Tweed Heads and surrounds](/areas/tweed-heads) and right along the [Gold Coast](/areas/gold-coast). Tell us about your home and we'll send a clear written quote – checklist included, no lock-in contract, and bookings confirmed in NSW time. [Get your free quote](/quote).",
    },
  ],
  faqs: [
    {
      q: "What is the average cost of a house cleaner in Tweed Heads?",
      a: "Published guides put house cleaning in Tweed Heads at roughly $33 to $66 an hour, with most regular cleans costing $70 to $220 a visit. A good-quality cleaning company typically charges $65 to $70 an hour.",
    },
    {
      q: "How much is a bond clean in Tweed Heads?",
      a: "Most bond cleans in Tweed Heads cost around $280 to $700 for a standard home, and about $280 to $380 for a two-bedroom apartment. Carpets and the condition of the property can add to the price.",
    },
    {
      q: "Do NSW bond rules apply in Tweed Heads?",
      a: "Yes. Tweed Heads is in NSW, so you need to leave the property reasonably clean compared with your ingoing condition report, allowing for fair wear and tear. Your bond is held by NSW Fair Trading, and disputes can go to NCAT.",
    },
    {
      q: "Is cleaning cheaper in Tweed Heads than on the Gold Coast?",
      a: "Published hourly rates in Tweed are slightly lower, mostly because of solo and marketplace cleaners. A good-quality cleaning company charges a similar rate on both sides of the border – around $65 to $70 an hour.",
    },
    {
      q: "How much does Airbnb cleaning cost in Tweed Heads?",
      a: "Turnover prices are usually similar to the neighbouring Gold Coast, where most Airbnb and holiday rental turnovers cost $80 to $240 per clean. Linen, laundry and restocking are often extra.",
    },
    {
      q: "Which time zone are cleaning bookings in?",
      a: "Tweed Heads follows NSW time. From October to April, NSW is on daylight saving time and is an hour ahead of Queensland, so confirm your booking time in NSW time.",
    },
  ],
};
