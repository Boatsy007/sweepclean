import type { Guide } from "@/lib/guides";
import { photos } from "@/lib/photos";

/*
 * Sources (checked November 2026):
 * - Vetted, insured cleaners in Logan City ~$45–$65/hr (Bark Logan City cost guide).
 * - Outer Brisbane suburbs including Logan ~$48–$58/hr plus possible travel fee; marketplace/unvetted
 *   cleaners ~$30–$45/hr; vetted, police-checked, insured services ~$50–$65/hr (Family Clean, 2026).
 * - Airtasker Logan Central house cleaning cost guide: ~$115–$312 per job, median ~$195 (another page
 *   $120–$300, median $190). Gumtree Logan ads ~$30–$40/hr.
 * - Bond cleans: Airtasker Logan-area posted 3-bed jobs mostly ~$210–$450 (asking prices, not final);
 *   a Logan cleaning company quotes $300–$800 for a standard 3-bed house.
 * - NDIS house cleaning price limit ~$60.10/hr from 1 July 2026 (published 2026–27 price limit guide –
 *   confirm against the NDIS Pricing Arrangements each July).
 * - Good-quality company rate of $65–$70/hr: the owner's position for a high-quality cleaning company.
 * Worked examples are illustrative calculations at $65–$70/hr, not quotes.
 * Review the ranges yearly and update `updated`.
 */

const s = (slug: string, name: string) => `[${name}](/areas/logan/${slug})`;

export const guide: Guide = {
  slug: "how-much-does-house-cleaning-cost-in-logan",
  title: "How Much Does House Cleaning Cost in Logan?",
  metaTitle: "House Cleaning Cost in Logan (2026 Guide) | Swept",
  description:
    "What house cleaning costs in Logan in 2026, what a good cleaning company charges – $65 to $70 an hour – and how to compare quotes for bigger family homes.",
  published: "2026-11-04",
  categories: ["Pricing", "Regular cleaning", "Bond cleaning"],
  image: photos.bathroom,
  services: ["regular-house-cleaning", "deep-cleaning", "bond-cleaning", "ndis-cleaning", "carpet-cleaning"],
  areas: ["logan"],
  related: ["bond-cleaning-cost-logan", "how-much-does-house-cleaning-cost-in-brisbane", "average-price-cleaning-services-gold-coast"],
  body: [
    {
      type: "p",
      text: "Logan sits between Brisbane and the Gold Coast, and its cleaning prices sit somewhere in between too – with one big difference. A lot of Logan homes are larger, newer family homes on estates, often with pets, two or more bathrooms and open-plan living. That changes how long a clean takes, and time is what you're really paying for. This guide covers what Logan households pay in 2026, what a good-quality cleaning company charges, and how to tell whether a quote is good value.",
    },
    {
      type: "tip",
      title: "The short answer",
      text: "Marketplace and private cleaners in Logan typically charge **$30 to $45 an hour**. Vetted, insured cleaning services mostly charge **$45 to $65 an hour**. A good-quality cleaning company charges **$65 to $70 an hour**, so a three-hour fortnightly clean costs about **$195 to $210**, and a typical four-bedroom Logan family home usually takes longer.",
    },

    { type: "h2", text: "Logan house cleaning prices at a glance" },
    {
      type: "p",
      text: "These ranges come from published 2026 cost guides and local listings for Logan. They're a starting point – your home's size, condition and how often you book will move the price.",
    },
    {
      type: "ul",
      items: [
        "**Private and marketplace cleaners:** around $30–$45 an hour. Local classified ads and app listings sit at the lower end. Insurance, police checks and back-up cover usually aren't part of the price.",
        "**Vetted, insured cleaning services:** around $45–$65 an hour. Some services add a travel fee for outer suburbs.",
        "**Good-quality cleaning companies:** $65–$70 an hour, for trained, insured and police-checked cleaners working from a written checklist, with someone accountable for the result.",
        "**Per job on marketplace apps:** Airtasker's Logan Central cost guide puts a typical house clean at about $115–$312, with a median of around $195.",
        "**Bond (end-of-lease) cleans:** usually a fixed price. Posted marketplace jobs for three-bedroom Logan homes mostly ask $210–$450, while local cleaning companies quote from about $300 up to $800 depending on size, condition and carpets.",
      ],
    },

    { type: "h2", text: "Why a good cleaning company charges $65–$70 an hour" },
    {
      type: "p",
      text: "$65–$70 an hour is at the top of the Logan market. The difference isn't the mop and bucket – it's everything around the clean that protects you and makes the result consistent.",
    },
    { type: "h3", text: "Insurance and police checks" },
    {
      type: "p",
      text: "A good company holds public liability insurance and makes sure every cleaner has a current national police check. If something is damaged in your home, there's cover in place. If you hire a private cleaner without insurance, you could be the one left with the cost.",
    },
    { type: "h3", text: "A written checklist, every visit" },
    {
      type: "p",
      text: "Quality companies agree what's included before the first clean and follow the same room-by-room checklist each time. You know what you're paying for, and you can tell straight away if something has been missed.",
    },
    { type: "h3", text: "Someone accountable if it isn't right" },
    {
      type: "p",
      text: "Look for a clear process if a task is missed. That means a set time to let them know, a return visit to fix it and a real person who answers. A cheap cleaner who stops replying is no saving at all.",
    },
    { type: "h3", text: "Reliability and cover" },
    {
      type: "p",
      text: "Logan families run on tight schedules. A company can send a replacement cleaner when someone is sick or on leave, so your regular clean doesn't quietly drop off the calendar.",
    },
    { type: "h3", text: "Proper products and equipment" },
    {
      type: "p",
      text: "Good companies bring their own supplies and the right product for each surface – stone benchtops, glass shower screens, timber and vinyl floors – plus a vacuum that copes with pet hair.",
    },

    { type: "h2", text: "What makes cleaning a Logan home take longer" },
    {
      type: "p",
      text: "Because most good companies price by time, the features that add time are the ones that add cost. These come up often in Logan homes.",
    },
    {
      type: "ul",
      items: [
        "**Bigger family homes:** four bedrooms, two bathrooms, an ensuite and a separate living or media room are common on Logan's estates. Every extra bathroom and living area adds time to each visit.",
        "**New-build dust:** fine construction dust keeps settling in tracks, cupboards and light fittings for weeks after handover. A first [detailed clean](/services/deep-cleaning) removes it properly.",
        "**Pets and outdoor living:** dog hair, paw prints and tracked-in dirt mean more vacuuming and mopping, especially where homes open onto big backyards.",
        "**Acreage and semi-rural properties:** larger homes on bigger blocks take longer, and travel time to outer areas can be reflected in the price.",
        "**Condition and frequency:** a home cleaned fortnightly is quicker to clean each visit than one cleaned monthly or for the first time in a while.",
        "**Extras:** inside the oven, rangehood filters, inside cupboards and carpet steam cleaning are usually priced on top of a standard clean.",
      ],
    },

    { type: "h2", text: "What $65–$70 an hour looks like for Logan homes" },
    {
      type: "p",
      text: "Here's roughly what a good-quality company would charge at $65–$70 an hour for some common Logan homes. These are worked examples, not quotes – your home's condition and the checklist you choose will change them.",
    },
    {
      type: "ul",
      items: [
        "**Three-bedroom, one-bathroom home, fortnightly:** about 2.5–3 hours, or **$163–$210** a visit.",
        "**Four-bedroom, two-bathroom estate home, fortnightly:** about 3.5–4 hours, or **$228–$280** a visit.",
        "**Townhouse or unit, fortnightly:** about 2–2.5 hours, or **$130–$175** a visit.",
        "**First clean or one-off detailed clean of a four-bedroom home:** usually 5–7 hours, or **$325–$490**, because there's more build-up to remove.",
      ],
    },
    {
      type: "p",
      text: "For a regular booking, the first visit is often longer and priced accordingly. After that, each visit gets quicker because the home never gets far behind. That's why a [fortnightly clean](/services/regular-house-cleaning) is the most popular choice for Logan families.",
    },

    { type: "h2", text: "Bond cleaning costs in Logan" },
    {
      type: "p",
      text: "Logan has plenty of rental homes, so bond cleans are a common request. They're almost always quoted as a fixed price because the job is defined by your entry condition report, not by the hour.",
    },
    {
      type: "ul",
      items: [
        "**Posted marketplace jobs** for three-bedroom Logan homes mostly ask $210–$450. These are asking prices, so the final cost and what's included can vary.",
        "**Cleaning companies** quote from about $300 to $800 for a three-bedroom house, depending on the number of bathrooms, the home's condition and whether carpets, the oven and windows are included.",
        "**Carpet steam cleaning** is often priced separately – check whether your lease requires it and whether it's in the quote.",
      ],
    },
    {
      type: "p",
      text: "In Queensland, your property manager compares the home with your entry condition report (Form 1a) when you move out, using the exit condition report (Form 14a). Give your cleaner a copy of your entry report so they clean against it room by room. Read more about our [bond cleaning](/services/bond-cleaning).",
    },

    { type: "h2", text: "NDIS and home care cleaning in Logan" },
    {
      type: "p",
      text: "If your cleaning is funded through an NDIS plan, the NDIS sets a maximum hourly price for house cleaning. Published guides to the 2026–27 price limits put it at about $60 an hour from 1 July 2026, but check the current NDIS Pricing Arrangements or ask your plan manager, as the limits are reviewed each year. Self-managed participants can choose providers who charge differently. Learn more about our [NDIS and home care cleaning](/services/ndis-cleaning).",
    },

    { type: "h2", text: "Do prices differ across Logan suburbs?" },
    {
      type: "p",
      text: "Hourly rates are much the same across Logan. What changes is the type of home and how long it takes. Here's what we see in different parts of Logan.",
    },
    {
      type: "ul",
      items: [
        `**North Logan** – ${s("springwood", "Springwood")}, ${s("daisy-hill", "Daisy Hill")}, ${s("shailer-park", "Shailer Park")}, ${s("rochedale-south", "Rochedale South")}, ${s("slacks-creek", "Slacks Creek")}, ${s("underwood", "Underwood")} and ${s("kingston", "Kingston")}. Established brick family homes, many on larger blocks. Multiple bathrooms and living areas make regular cleans good value.`,
        `**Central Logan** – ${s("logan-central", "Logan Central")}, ${s("woodridge", "Woodridge")}, ${s("browns-plains", "Browns Plains")}, ${s("marsden", "Marsden")}, ${s("crestmead", "Crestmead")}, ${s("regents-park", "Regents Park")}, ${s("meadowbrook", "Meadowbrook")} and ${s("loganholme", "Loganholme")}. A mix of units, townhouses and family homes, with plenty of rentals. Smaller homes are quicker to clean, and bond cleans are common.`,
        `**South Logan and growth areas** – ${s("beenleigh", "Beenleigh")}, ${s("eagleby", "Eagleby")}, ${s("bethania", "Bethania")}, ${s("waterford", "Waterford")}, ${s("park-ridge", "Park Ridge")}, ${s("jimboomba", "Jimboomba")}, ${s("yarrabilba", "Yarrabilba")} and ${s("flagstone", "Flagstone")}. Many brand-new estate homes, plus acreage around Jimboomba. Expect a longer first clean to remove builder's dust, and more time for larger properties.`,
      ],
    },
    {
      type: "p",
      text: "See every [Logan suburb we clean](/areas/logan). If you're on the Brisbane side, our [Brisbane house cleaning cost guide](/cleaning-guides/how-much-does-house-cleaning-cost-in-brisbane) covers prices there too.",
    },

    { type: "h2", text: "How to compare cleaning quotes" },
    {
      type: "p",
      text: "Two quotes can look different simply because they cover different things. Before you choose, check each quote against these points.",
    },
    {
      type: "ol",
      items: [
        "**Hours and price:** for a fixed price, ask how long they expect to take. $150 for two hours is a higher rate than $200 for three.",
        "**What's included:** ask for a written checklist. Check whether inside the oven, rangehood, skirting boards and inside cupboards are included.",
        "**Insurance and police checks:** ask whether the business holds public liability insurance and whether every cleaner has a current police check.",
        "**Supplies and equipment:** check whether they bring their own products, vacuum and mop, or expect to use yours.",
        "**Contracts:** look for regular cleans with no lock-in contract, so you can pause or change frequency.",
        "**If something's missed:** ask how long you have to report it and whether they'll come back and fix it at no extra charge.",
        "**Travel fees:** for outer suburbs and acreage, check whether a travel or call-out fee is added.",
      ],
    },

    { type: "h2", text: "Is a cheaper cleaner a false economy?" },
    {
      type: "p",
      text: "Sometimes. A $35-an-hour cleaner can be great, but you take on more of the risk. If they're sick, the clean doesn't happen. If something breaks, there may be no insurance. If the standard slips, there's no checklist to hold them to. For a bond clean, a cheap job that fails inspection can cost you a re-clean or part of your bond. Paying $65–$70 an hour buys consistency, accountability and cover – things you only notice when they're missing.",
    },

    { type: "h2", text: "Get an accurate price for your Logan home" },
    {
      type: "p",
      text: "Averages help, but only your home sets your price. Swept cleans homes across [Logan](/areas/logan), [Brisbane](/areas/brisbane) and the [Gold Coast](/areas/gold-coast). Tell us about your home and we'll send a clear written quote with the checklist included. [Get your free quote](/quote).",
    },
  ],
  faqs: [
    {
      q: "How much does a cleaner cost per hour in Logan?",
      a: "Private and marketplace cleaners in Logan typically charge about $30–$45 an hour, and vetted, insured cleaning services mostly charge $45–$65 an hour. A good-quality cleaning company charges $65–$70 an hour.",
    },
    {
      q: "How much is a fortnightly clean for a four-bedroom house in Logan?",
      a: "A four-bedroom, two-bathroom home usually takes about 3.5–4 hours. At a good-quality company's rate of $65–$70 an hour, that's roughly $228–$280 a visit. The exact price depends on the home's condition, pets and what's on your checklist.",
    },
    {
      q: "How much does a bond clean cost in Logan?",
      a: "For a three-bedroom house, posted marketplace jobs mostly ask $210–$450, while cleaning companies quote from about $300 to $800 depending on bathrooms, condition and whether carpets and the oven are included. Always check what the price covers.",
    },
    {
      q: "Why does my first clean cost more?",
      a: "A first clean usually has more build-up to remove, especially in a new build with construction dust. It often takes longer than later visits, which are quicker because the home is kept on top of.",
    },
    {
      q: "Do Logan cleaners charge travel fees?",
      a: "Some do, especially for outer suburbs and acreage areas such as Jimboomba. Ask whether a travel or call-out fee is included before you book.",
    },
    {
      q: "Is it worth paying more for an insured, police-checked cleaner?",
      a: "For most households, yes. Insurance protects you if something is damaged, police checks give peace of mind when someone has access to your home, and a company can send a replacement if your usual cleaner is away.",
    },
  ],
};
