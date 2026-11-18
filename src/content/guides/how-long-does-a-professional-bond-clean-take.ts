import type { Guide } from "@/lib/guides";
import { photos } from "@/lib/photos";

/*
 * Sources (checked November 2026):
 * - Published duration estimates from Australian cleaning companies (Brisbane, Gold Coast, Sydney, Perth, Melbourne).
 *   They cluster around: 1 bed ~3–5 hrs; 2 bed ~4–7 hrs; 3 bed ~5–8 hrs, with some guides allowing up to ~12 hrs
 *   for a 3-bed house. Estimates assume different team sizes (usually one to three cleaners) – treat as on-site time.
 * - Simply Maid: booked hours are a one-cleaner planning allowance; two cleaners are on site for roughly half that.
 * - RTA Queensland: tenant completes the Exit condition report (Form 14a) and gives it to the agent/owner with the
 *   keys; the agent/owner inspects, adds comments and returns a signed copy within 3 business days. Compared with
 *   the Entry condition report (Form 1a).
 * - NSW (Tweed Heads): the property is compared with the condition report signed at the start of the tenancy.
 * No prices – those live in the area bond cleaning cost guides. No Swept-specific timings are claimed.
 */

export const guide: Guide = {
  slug: "how-long-does-a-professional-bond-clean-take",
  title: "How Long Does a Professional Bond Clean Take?",
  metaTitle: "How Long Does a Bond Clean Take? | Swept Cleaning",
  description:
    "How long a professional bond clean takes for 1 to 4+ bedroom homes, what makes it take longer, and how to plan your move-out day around the clean.",
  published: "2026-11-18",
  categories: ["Bond cleaning", "Tips & how-to"],
  image: photos.apartment,
  services: ["bond-cleaning", "carpet-cleaning"],
  related: ["bond-cleaning-cost-brisbane", "bond-cleaning-cost-gold-coast", "rental-inspection-cleaning-what-should-be-done"],
  sources: [
    { title: "How long does a bond clean take in Brisbane?", url: "https://www.bondcleaningservice.com.au/how-long-does-a-bond-clean-take-in-brisbane/", publisher: "Bond Cleaning Service" },
    { title: "How long does a bond clean take?", url: "https://www.goldcoastcleanandsheen.com.au/how-long-does-bond-clean-take/", publisher: "Gold Coast Clean and Sheen" },
    { title: "How long does a bond clean take for a 1, 2, 3 or 4 bedroom home?", url: "https://allinoneaussiecleaning.com.au/how-long-does-a-bond-clean-take-for-a-1-2-3-or-4-bedroom-home/", publisher: "All In One Aussie Cleaning" },
    { title: "How long does a full bond clean take in Melbourne?", url: "https://melbournevacateandcarpetcleaning.com.au/blog/how-long-does-bond-cleaning-take-melbourne/", publisher: "Melbourne Vacate and Carpet Cleaning" },
    { title: "Bond clean cost Perth by house size", url: "https://www.bondcleanperth.com.au/blog/bond-clean-cost-perth-by-house-size/", publisher: "Bond Clean Perth" },
    { title: "End of lease cleaning cost", url: "https://simplymaid.com.au/cleaning-101/end-of-lease-cleaning-cost", publisher: "Simply Maid" },
    { title: "Exit condition report", url: "https://www.rta.qld.gov.au/renting/ending-a-tenancy/exit-condition-report", publisher: "Residential Tenancies Authority (QLD)" },
    { title: "Exit condition report – general tenancies (Form 14a)", url: "https://www.rta.qld.gov.au/forms-resources/forms/forms-for-general-tenancies/exit-condition-report-general-tenancies-form-14a", publisher: "Residential Tenancies Authority (QLD)" },
    { title: "Residential Tenancies Act 2010 (NSW)", url: "https://legislation.nsw.gov.au/view/html/inforce/current/act-2010-042", publisher: "NSW Legislation" },
  ],
  body: [
    {
      type: "p",
      text: "Moving day has a lot of moving parts: removalists, utilities, key handover and a final inspection. The bond clean has to fit in between them, so it helps to know how long it will actually take. The honest answer is that it depends on the size of the home, its condition and how many cleaners are on the job. Here's what to expect, what slows a bond clean down, and how to plan your last few days in the property.",
    },
    {
      type: "tip",
      title: "The short answer",
      text: "Published estimates from Australian cleaning companies put a professional bond clean at roughly **3–5 hours for a one-bedroom unit**, **4–7 hours for two bedrooms** and **5–8 hours for a three-bedroom house**, with **four bedrooms or more usually taking most of a day**. That's time on site for a small team. More cleaners shorten the day; heavy grease, mould, pet hair or a home that isn't empty make it longer.",
    },

    { type: "h2", text: "Bond clean times by home size" },
    {
      type: "p",
      text: "These ranges are drawn from duration guides published by bond cleaning companies in Brisbane, the Gold Coast and other Australian cities. They're not all measured the same way – some assume one cleaner, others a team of two or three – so treat them as typical time on site rather than exact figures.",
    },
    {
      type: "ul",
      items: [
        "**Studio or one-bedroom unit:** about 3–5 hours.",
        "**Two-bedroom unit or townhouse:** about 4–7 hours.",
        "**Three-bedroom house:** about 5–8 hours. Some guides allow up to around 12 hours for a larger three-bedroom home, particularly when counting each cleaner's time separately.",
        "**Four bedrooms or more:** longer again – usually most of a day, and most companies send a bigger team.",
      ],
    },
    {
      type: "p",
      text: "Bathrooms matter as much as bedrooms. A three-bedroom house with two bathrooms and an ensuite takes noticeably longer than one with a single bathroom, because showers, tiles, grout and vanities are some of the most detailed work in a bond clean.",
    },

    { type: "h2", text: "Time on site vs total cleaning hours" },
    {
      type: "p",
      text: "When a company says a clean \"takes 8 hours\", check what they mean. Total cleaning hours are the combined time of everyone working. Time on site is how long the team is actually in your home. Two cleaners working together are on site for roughly half the total cleaning hours, and three cleaners for about a third.",
    },
    {
      type: "p",
      text: "That's why two quotes for the same home can describe very different days. One cleaner might spend most of a day on a three-bedroom house; a team of three might finish by lunchtime. Neither is wrong – but if you need to hand back keys by a set time, ask how many cleaners are coming and how long they expect to be there.",
    },
    {
      type: "tip",
      title: "Swept tip",
      text: "A fast finish isn't always a good sign. If a quote promises a full bond clean of a large home in an unusually short time, ask what's included. The [checklist](/services/bond-cleaning) – inside every cupboard, the oven, tracks, skirting boards and fittings – is what takes the time.",
    },

    { type: "h2", text: "Why a bond clean takes longer than a regular clean" },
    {
      type: "p",
      text: "A [regular clean](/services/regular-house-cleaning) maintains a home that's lived in. A bond clean returns an empty home to the condition it was in when you moved in, and it's checked against your entry condition report. That means cleaning the places a regular visit doesn't touch:",
    },
    {
      type: "ul",
      items: [
        "**Inside and outside every cupboard, drawer and wardrobe** – often the single biggest job in the kitchen and bedrooms.",
        "**The oven, grill trays, stovetop and rangehood filters** – built-up grease is slow, detailed work.",
        "**Showers, tiles, grout and silicone** in every bathroom, plus exhaust fan covers.",
        "**Skirting boards, door frames, light switches and power points** throughout the home.",
        "**Window sills, sliding-door tracks and interior glass** – tracks near the coast often hold sand and salt.",
        "**Ceiling fans and light fittings,** and floors vacuumed and mopped edge to edge.",
      ],
    },

    { type: "h2", text: "What makes a bond clean take longer" },
    {
      type: "ul",
      items: [
        "**Furniture or boxes still in the home.** Cleaners have to work around them, and the areas underneath can't be finished. Book the clean for after the removalists.",
        "**Heavy oven and rangehood grease,** especially if the oven hasn't been cleaned during the tenancy.",
        "**Mould** on shower grout, silicone, ceilings or window frames – common in humid South East Queensland.",
        "**Pet hair, odours and marks,** including hair in carpets, tracks and vents.",
        "**Extra bathrooms, a second living area, a study or a large laundry.**",
        "**Add-ons** such as [carpet steam cleaning](/services/carpet-cleaning), blinds or wall marks.",
        "**Access** – apartments with lifts, loading docks or limited parking add time getting equipment in and out.",
      ],
    },

    { type: "h2", text: "How long a DIY bond clean takes" },
    {
      type: "p",
      text: "Doing it yourself usually takes much longer than a professional clean, because you're working alone, without commercial equipment, and often after a day of packing. For anything bigger than a small unit, many renters find it takes a full weekend. If you go the DIY route, start early, work top to bottom in each room, and leave floors until last. Our [rental inspection cleaning checklist](/cleaning-guides/rental-inspection-cleaning-what-should-be-done) is a useful starting point, though a bond clean goes further – inside every cupboard and behind every appliance.",
    },

    { type: "h2", text: "Planning your move-out day" },
    {
      type: "ol",
      items: [
        "**Book the clean for after the removalists.** An empty home is faster to clean and nothing gets missed under furniture.",
        "**Leave a buffer before the key handover.** Don't book the clean for the morning you return the keys. The day before is ideal.",
        "**Schedule carpet steam cleaning last.** Carpets need time to dry, so they're best done after the rest of the clean.",
        "**Have power and water connected** until the clean is finished – cleaners need both.",
        "**Do a walk-through with your entry condition report** once the clean is done, and take your own dated photos of each room.",
        "**Return the keys and your exit condition report** to your property manager.",
      ],
    },

    { type: "h2", text: "What happens after the clean" },
    { type: "h3", text: "Queensland (Brisbane, Logan and the Gold Coast)" },
    {
      type: "p",
      text: "When you return the keys, you complete an Exit condition report (Form 14a) and give it to your property manager or owner. They inspect the property, add their comments, and must give you a signed copy within 3 business days. The exit report is compared with your Entry condition report (Form 1a) – so a clean that's matched against your entry report from the start is the best preparation.",
    },
    { type: "h3", text: "NSW (Tweed Heads)" },
    {
      type: "p",
      text: "In Tweed Heads, NSW rules apply. At the end of the tenancy the property is compared with the condition report you signed when you moved in, allowing for fair wear and tear. Keep a copy of that report handy for your cleaner.",
    },

    { type: "h2", text: "How to get an accurate time for your home" },
    {
      type: "p",
      text: "The quickest way to an accurate estimate is to give your cleaner the details that change the job: the number of bedrooms, bathrooms and living areas, whether the home will be empty, its current condition, any pets, and any extras such as carpets. A copy of your entry condition report helps most of all, because it shows exactly what the property manager will be checking.",
    },
    {
      type: "p",
      text: "Swept does [bond cleaning](/services/bond-cleaning) across [Brisbane](/areas/brisbane), [Logan](/areas/logan), the [Gold Coast](/areas/gold-coast) and [Tweed Heads](/areas/tweed-heads), cleaned room by room against your entry condition report. Send us your vacate date and property details and we'll send a written, fixed price with the checklist included. [Get your free quote](/quote?service=bond-cleaning). Wondering what it should cost? See our bond cleaning price guides for [Brisbane](/cleaning-guides/bond-cleaning-cost-brisbane), [Logan](/cleaning-guides/bond-cleaning-cost-logan), the [Gold Coast](/cleaning-guides/bond-cleaning-cost-gold-coast) and [Tweed Heads](/cleaning-guides/bond-cleaning-cost-tweed-heads).",
    },
  ],
  faqs: [
    {
      q: "How long does a bond clean take for a 3-bedroom house?",
      a: "Published estimates from Australian cleaning companies put a professional bond clean of a three-bedroom house at roughly 5–8 hours on site, depending on the number of bathrooms, the home's condition and how many cleaners are working. Larger or heavily soiled homes can take longer.",
    },
    {
      q: "How long does a bond clean take for a 1 or 2-bedroom unit?",
      a: "Roughly 3–5 hours for a one-bedroom unit and 4–7 hours for a two-bedroom unit, based on published estimates. A second bathroom, heavy oven grease or pet hair adds time.",
    },
    {
      q: "Does a bigger cleaning team make the bond clean faster?",
      a: "Yes. The total amount of cleaning stays the same, but two cleaners are on site for about half as long as one, and three for about a third. Ask your cleaner how many people are coming and how long they expect to be there.",
    },
    {
      q: "Should I be home during the bond clean?",
      a: "You don't need to be, as long as the cleaners can get in and the power and water are on. Many renters arrange access and come back for a walk-through with their entry condition report once the clean is finished.",
    },
    {
      q: "When should I book my bond clean?",
      a: "After the removalists have taken everything out, and ideally the day before you hand back the keys. That leaves time for carpets to dry and for a walk-through before your final inspection.",
    },
    {
      q: "How long does carpet steam cleaning add to a bond clean?",
      a: "The cleaning itself is usually quick, but carpets then need time to dry before the final inspection. That's why it's best scheduled after the rest of the clean, not on the morning of the key handover.",
    },
  ],
};
