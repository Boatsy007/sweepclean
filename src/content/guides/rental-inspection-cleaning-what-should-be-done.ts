import type { Guide } from "@/lib/guides";
import { photos } from "@/lib/photos";

/*
 * Sources (checked November 2026):
 * - RTA Queensland routine inspections: no more than once every 3 months unless the tenant agrees in writing;
 *   Entry notice (Form 9) with at least 7 days' notice, stating a date and a time or 2-hour window.
 * - RTA: tenants must keep the property clean, having regard to its condition at the start, and return it in the
 *   same condition apart from fair wear and tear (RTRA Act 2008 s188, summarised in "Managing general tenancies").
 *   Dirt, grime and grease are not fair wear and tear (RTA fair wear and tear page).
 * - NSW: routine inspections generally up to 4 times in 12 months with at least 7 days' written notice
 *   (Residential Tenancies Act 2010 (NSW)); tenants keep the premises reasonably clean.
 * - Queensland Health mould fact sheet (don't dry-brush mould; people with asthma/allergies should avoid it).
 * No prices. Swept services referenced: regular, deep, carpet, bond.
 */

export const guide: Guide = {
  slug: "rental-inspection-cleaning-what-should-be-done",
  title: "Rental Inspection Cleaning: What Should Be Done?",
  metaTitle: "Rental Inspection Cleaning Checklist | Swept Cleaning",
  description:
    "What to clean before a routine rental inspection – a room-by-room checklist, how clean is clean enough, and the QLD and NSW inspection rules to know.",
  published: "2026-11-05",
  categories: ["Renting", "Regular cleaning"],
  image: photos.bathroom,
  services: ["regular-house-cleaning", "deep-cleaning", "carpet-cleaning", "bond-cleaning"],
  related: ["bond-cleaning-cost-brisbane", "questions-to-ask-before-hiring-a-house-cleaner", "emergency-cleaning-services-how-quickly-can-you-help"],
  sources: [
    { title: "Routine inspections", url: "https://www.rta.qld.gov.au/during-a-tenancy/living-in-the-property/routine-inspections", publisher: "Residential Tenancies Authority (QLD)" },
    { title: "Entry notice (Form 9)", url: "https://www.rta.qld.gov.au/forms-resources/forms/forms-for-general-tenancies/entry-notice-form-9", publisher: "Residential Tenancies Authority (QLD)" },
    { title: "Fair wear and tear", url: "https://www.rta.qld.gov.au/ending-a-tenancy/vacating-a-property/fair-wear-and-tear", publisher: "Residential Tenancies Authority (QLD)" },
    { title: "Managing general tenancies in Queensland", url: "https://www.rta.qld.gov.au/sites/default/files/2023-08/Managing-general-tenancies-in-Queensland_0.pdf", publisher: "Residential Tenancies Authority (QLD)" },
    { title: "Who is responsible for repairs", url: "https://www.rta.qld.gov.au/who-is-responsible-for-repairs", publisher: "Residential Tenancies Authority (QLD)" },
    { title: "Residential Tenancies Act 2010 (NSW)", url: "https://legislation.nsw.gov.au/view/html/inforce/current/act-2010-042", publisher: "NSW Legislation" },
    { title: "Cleaning up mould after a disaster (fact sheet)", url: "https://www.health.qld.gov.au/__data/assets/pdf_file/0034/1297366/cleaning-up-mould-after-a-disaster.pdf", publisher: "Queensland Health" },
  ],
  body: [
    {
      type: "p",
      text: "An entry notice for a routine inspection can send anyone into a cleaning frenzy. But a routine inspection isn't a bond clean, and it isn't a white-glove test. Your property manager is there to check the home is being looked after, spot maintenance problems early and report back to the owner. Knowing what they actually look for means you can focus your time where it counts – and skip the jobs that don't matter.",
    },
    {
      type: "tip",
      title: "The short answer",
      text: "Before a routine inspection, aim for a home that's **clean, tidy and well looked after** – not bond-clean perfect. Focus on the **kitchen, bathrooms, floors and anything that shows damage or neglect**, such as grease, mould, marks and pet mess. Use the inspection to **report any repairs** in writing, and take your own dated photos afterwards.",
    },

    { type: "h2", text: "What property managers actually look for" },
    {
      type: "ul",
      items: [
        "**General cleanliness** compared with the condition the home was in when you moved in.",
        "**Damage** – holes, breakages, burns, stains or pet damage beyond normal wear.",
        "**Maintenance issues** – leaks, dripping taps, mould, broken fittings or anything that needs repair.",
        "**Signs of neglect** – built-up grease, mould left to spread, blocked drains or overflowing rubbish.",
        "**Lease conditions** – for example, that an approved pet isn't damaging the property, or that outdoor areas you're responsible for are maintained.",
      ],
    },
    {
      type: "p",
      text: "Everyday clutter is generally not the issue – an unmade bed or a few dishes in the sink won't usually be noted. What gets written down is dirt that's become damage, and problems the owner needs to know about.",
    },

    { type: "h2", text: "Your obligations and the inspection rules" },
    { type: "h3", text: "Queensland (Brisbane, Logan and the Gold Coast)" },
    {
      type: "ul",
      items: [
        "**How often:** routine inspections can't be carried out more than once every three months, unless you agree in writing.",
        "**Notice:** your property manager must give you an Entry notice (Form 9) at least 7 days beforehand, with the date and either a time or a two-hour window.",
        "**Your cleaning obligation:** keep the property clean, having regard to its condition at the start of the tenancy, and return it in the same condition apart from fair wear and tear.",
        "**Fair wear and tear** covers normal ageing – faded paint or worn carpet in walkways – but not dirt, grime or grease.",
      ],
    },
    { type: "h3", text: "NSW (Tweed Heads)" },
    {
      type: "ul",
      items: [
        "**How often:** routine inspections are generally limited to four in any 12-month period.",
        "**Notice:** you must generally be given at least 7 days' written notice.",
        "**Your cleaning obligation:** keep the premises reasonably clean, allowing for fair wear and tear.",
      ],
    },
    {
      type: "p",
      text: "If you're unsure about a notice or a request, check with the RTA in Queensland or NSW Fair Trading.",
    },

    { type: "h2", text: "Room-by-room inspection cleaning checklist" },
    { type: "h3", text: "Kitchen" },
    {
      type: "ul",
      items: [
        "Wipe benchtops, splashback and cupboard fronts, paying attention to handles.",
        "Degrease the stovetop and rangehood, and wash the rangehood filter if it's greasy.",
        "Clean the oven door and, if it's heavily greased, the inside of the oven.",
        "Clean the sink, tapware and drain, and run the dishwasher filter under water.",
        "Sweep and mop the floor, including edges and under the kickboards you can reach.",
      ],
    },
    { type: "h3", text: "Bathrooms and toilets" },
    {
      type: "ul",
      items: [
        "Scrub the shower screen, tiles, grout and silicone – soap scum and mould are the most common inspection notes.",
        "Clean the toilet inside and out, including the base and behind it.",
        "Wipe the vanity, basin, mirror and tapware.",
        "Dust the exhaust fan cover.",
      ],
    },
    { type: "h3", text: "Living areas and bedrooms" },
    {
      type: "ul",
      items: [
        "Vacuum carpets and rugs, and vacuum and mop hard floors.",
        "Dust surfaces, skirting boards, ceiling fans and light fittings.",
        "Wipe marks from light switches, door frames and handles.",
        "Clear cobwebs from corners and ceilings.",
        "Clean window sills, sliding-door tracks and inside glass.",
      ],
    },
    { type: "h3", text: "Laundry" },
    {
      type: "ul",
      items: [
        "Wipe the tub and cabinets, and clean the dryer lint filter.",
        "Check behind and around the machines for lint, dust and spills.",
      ],
    },
    { type: "h3", text: "General" },
    {
      type: "ul",
      items: [
        "Empty the bins and take out the rubbish.",
        "Tidy enough that the property manager can see floors, benches and fittings clearly.",
        "Clean up after pets – hair, litter areas and any accidents.",
        "If outdoor areas are your responsibility under the lease, tidy them too – check your agreement for what's required.",
      ],
    },

    { type: "h2", text: "Mould: clean it, but report it" },
    {
      type: "p",
      text: "In humid South East Queensland and around the Tweed, mould on shower grout, silicone and window frames is common. Surface mould from everyday condensation is usually part of keeping the home clean. But if mould keeps coming back because of a leak, a broken exhaust fan or poor ventilation, tell your property manager in writing – that may be a repair issue rather than a cleaning one. When cleaning mould, don't scrub it with a dry brush, which spreads spores, and never mix vinegar with bleach. People with asthma or allergies should avoid cleaning up mould themselves.",
    },

    { type: "h2", text: "Use the inspection to report repairs" },
    {
      type: "p",
      text: "Inspections work both ways. If something needs fixing – a leaking tap, a broken blind, a faulty exhaust fan, damp patches – raise it in writing before or at the inspection. It creates a record that you reported it, which protects you if the problem gets worse. Generally, damage caused by a tenant is the tenant's responsibility, while wear and tear and faults are the owner's.",
    },

    { type: "h2", text: "What you don't need to do" },
    {
      type: "ul",
      items: [
        "**A full bond clean.** That level of detail is for when you move out. Save inside-every-cupboard cleaning for your [bond clean](/services/bond-cleaning).",
        "**Professional carpet cleaning** for a routine inspection – unless carpets are stained or your lease says otherwise. Regular vacuuming is usually enough.",
        "**Hide your belongings.** It's your home. Tidy is enough.",
      ],
    },

    { type: "h2", text: "When to clean – and when to get help" },
    {
      type: "p",
      text: "Clean a day or two before the inspection, so the home is fresh on the day without leaving it to the last minute. If you're on a [regular fortnightly clean](/services/regular-house-cleaning), you're most of the way there already – just let your cleaner know the inspection date so the kitchen and bathrooms get extra attention. If the home has fallen behind, a one-off [detailed clean](/services/deep-cleaning) a few days before the inspection is the quickest way to catch up. Stubborn carpet stains can be treated with [carpet steam cleaning](/services/carpet-cleaning).",
    },

    { type: "h2", text: "After the inspection" },
    {
      type: "ol",
      items: [
        "**Take your own dated photos** of each room after you've cleaned – a simple record of the home's condition.",
        "**Ask for a copy of the inspection report** if you don't receive one, and check it's accurate.",
        "**Respond in writing** if anything in the report is wrong, or if you need time to fix something.",
        "**Follow up on repairs** you reported, and keep a copy of your messages.",
      ],
    },

    { type: "h2", text: "Need help before your inspection?" },
    {
      type: "p",
      text: "Swept cleans rentals across [Brisbane](/areas/brisbane), [Logan](/areas/logan), the [Gold Coast](/areas/gold-coast) and [Tweed Heads](/areas/tweed-heads). Tell us your inspection date when you [request a quote](/quote), and we'll focus on what property managers look at most. Moving out instead? See our bond cleaning guides for [Brisbane](/cleaning-guides/bond-cleaning-cost-brisbane), [Logan](/cleaning-guides/bond-cleaning-cost-logan), the [Gold Coast](/cleaning-guides/bond-cleaning-cost-gold-coast) and [Tweed Heads](/cleaning-guides/bond-cleaning-cost-tweed-heads).",
    },
  ],
  faqs: [
    {
      q: "How clean does my rental need to be for a routine inspection?",
      a: "Clean and well looked after, compared with when you moved in – not bond-clean perfect. Focus on the kitchen, bathrooms and floors, and deal with grease, mould and pet mess, which are the most common inspection notes.",
    },
    {
      q: "How much notice do I get for a rental inspection?",
      a: "In Queensland, at least 7 days through an Entry notice (Form 9), and routine inspections can't happen more than once every three months unless you agree. In NSW, generally at least 7 days' written notice, with up to four routine inspections in 12 months.",
    },
    {
      q: "Can I fail a routine rental inspection?",
      a: "There's no pass or fail. The property manager notes the home's condition and any issues. If something needs attention, they'll usually ask you to fix it; if a problem isn't fixed, they can issue a formal notice to remedy a breach.",
    },
    {
      q: "Is a rental inspection clean the same as a bond clean?",
      a: "No. A bond clean is done on the empty home when you move out and is checked against your entry condition report in detail. A routine inspection clean is about keeping the home clean and showing it's well maintained.",
    },
    {
      q: "Do I need to clean the oven for a rental inspection?",
      a: "Wipe the oven door and stovetop, and clean inside the oven if it's heavily greased. Built-up grease isn't fair wear and tear, so it's worth keeping on top of before it becomes a bond issue.",
    },
    {
      q: "Should I hire a cleaner before a rental inspection?",
      a: "It's not required, but it helps if you're short on time or the home has fallen behind. A regular clean keeps you inspection-ready, and a one-off detailed clean is the quickest way to catch up.",
    },
  ],
};
