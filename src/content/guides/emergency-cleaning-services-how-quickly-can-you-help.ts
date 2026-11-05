import type { Guide } from "@/lib/guides";
import { photos } from "@/lib/photos";

/*
 * Sources (checked November 2026):
 * - Queensland Government "Flood health and safety": floodwater often contaminated with sewage and chemicals;
 *   gloves and boots for sewage backflow; throw out food that touched floodwater.
 * - Queensland Health: PPE, hand washing, cover cuts, tetanus advice; mould fact sheet (don't dry-brush mould,
 *   don't mix vinegar and bleach, people with asthma/allergies should avoid mould clean-up).
 * - NSW Government "Staying healthy after a flood" and Tweed Shire Council cleaning and health advice (Tweed is NSW).
 * - ASIC flood guidance: contact your insurer, keep records/photos of damage.
 * - Swept facts from site.ts: quote reply within one business day; enquiries Mon–Sat 7am–6pm; availability for
 *   bond cleans depends on dates and location. No same-day promise and no prices (owner hasn't set either).
 */

export const guide: Guide = {
  slug: "emergency-cleaning-services-how-quickly-can-you-help",
  title: "Emergency Cleaning Services: How Quickly Can You Help?",
  metaTitle: "Emergency Cleaning: How Quickly We Can Help | Swept Cleaning",
  description:
    "Need a clean in a hurry? How quickly Swept can help with urgent bond, inspection and guest cleans – and when a flood, sewage or fire needs a specialist.",
  published: "2026-11-05",
  categories: ["Urgent cleaning", "Bond cleaning"],
  image: photos.cleaner,
  services: ["bond-cleaning", "deep-cleaning", "airbnb-cleaning", "commercial-cleaning"],
  related: ["bond-cleaning-cost-brisbane", "bond-cleaning-cost-gold-coast", "bond-cleaning-cost-tweed-heads"],
  sources: [
    { title: "Flood health and safety", url: "https://www.qld.gov.au/emergency/dealing-disasters/disaster-types/flood/flood-health-and-safety", publisher: "Queensland Government" },
    { title: "Beware of health risks lurking in floodwaters and mud", url: "https://www.health.qld.gov.au/newsroom/beware-of-health-risks-lurking-in-seq-floodwaters-and-mud", publisher: "Queensland Health" },
    { title: "Cleaning up mould after a disaster (fact sheet)", url: "https://www.health.qld.gov.au/__data/assets/pdf_file/0034/1297366/cleaning-up-mould-after-a-disaster.pdf", publisher: "Queensland Health" },
    { title: "Staying healthy after a flood", url: "https://www.nsw.gov.au/emergency/floods/recover/staying-healthy", publisher: "NSW Government" },
    { title: "Cleaning and health advice", url: "https://www.tweed.nsw.gov.au/community/emergency-planning-recovery/recovery-dashboard/cleaning-health-advice", publisher: "Tweed Shire Council" },
    { title: "What to do if you are affected by floods in Queensland", url: "https://asic.gov.au/about-asic/news-centre/news-items/what-to-do-if-you-are-affected-by-floods-in-queensland/", publisher: "ASIC" },
  ],
  body: [
    {
      type: "p",
      text: "\"Emergency cleaning\" means different things to different people. For most, it's a bond inspection that's suddenly tomorrow, guests arriving sooner than expected, or a holiday rental with back-to-back bookings. For others, it's water through the ceiling or a flooded lounge room. These need very different help, so this guide explains how quickly Swept can step in for urgent cleans – and when you need a specialist first.",
    },
    {
      type: "tip",
      title: "The short answer",
      text: "For an urgent clean, **call us** – it's the fastest way to find out whether we can fit you in. We reply to quote requests **within one business day**, and short-notice availability depends on your date and location, so we'll always tell you honestly what's possible. For **floodwater, sewage, fire damage or biohazards**, contact your insurer and a specialist restoration service first – those jobs need equipment and training a cleaning company doesn't have.",
    },

    { type: "h2", text: "What counts as an emergency clean?" },
    {
      type: "p",
      text: "It helps to sort the problem into one of two groups before you pick up the phone.",
    },
    { type: "h3", text: "Urgent cleans we can help with" },
    {
      type: "ul",
      items: [
        "**A last-minute bond clean** – your move-out has been brought forward, or a clean fell through before the final inspection.",
        "**A rental inspection, open home or settlement** that's coming up fast.",
        "**Guests on their way** – family visiting, an event at home, or a party that's left its mark.",
        "**An Airbnb or holiday rental turnover** with a tight gap between check-out and check-in.",
        "**A workplace that needs attention** before a client visit or after an event.",
        "**A home that's fallen behind** – after illness, a new baby or a hard few weeks – and needs a reset.",
      ],
    },
    { type: "h3", text: "Situations that need a specialist first" },
    {
      type: "ul",
      items: [
        "**Floodwater or storm water** inside the home, especially if it's reached carpets, walls or furniture.",
        "**Sewage** backing up from drains, toilets or a septic system.",
        "**Fire and smoke damage.**",
        "**Biohazards** – blood, bodily fluids, needles or a death in the home.",
        "**Large areas of mould** after a leak or flood.",
      ],
    },
    {
      type: "p",
      text: "These can carry real health risks and are often part of an insurance claim. Once a specialist has made the home safe, a [detailed clean](/services/deep-cleaning) is a good way to get it back to feeling like home.",
    },

    { type: "h2", text: "How quickly can Swept help?" },
    {
      type: "p",
      text: "We'd rather be honest than promise a time we can't keep. Here's how it works:",
    },
    {
      type: "ul",
      items: [
        "**Phone is fastest.** We answer enquiries Monday to Saturday, 7am–6pm (Queensland time). Call, tell us the date you need, and we'll tell you straight away whether we can make it.",
        "**Online requests get a reply within one business day.** That's fine if your deadline is a few days away – for anything sooner, call.",
        "**Availability depends on the date and where you are.** End-of-month vacate dates, school holidays and the summer moving season book out first. The more notice you can give, the better your chances.",
        "**We'll tell you what's realistic.** If we can't fit you in properly, we'll say so – a rushed clean that misses half the checklist doesn't help anyone.",
      ],
    },

    { type: "h2", text: "Urgent cleans, case by case" },
    { type: "h3", text: "Last-minute bond cleans" },
    {
      type: "p",
      text: "A [bond clean](/services/bond-cleaning) is done on the empty property, after the removalists and before the final inspection. If you're short on time, send us your vacate date and a copy of your entry condition report straight away so we can plan the clean room by room. In Queensland, the report is compared with your exit condition report (Form 14a). In Tweed Heads, NSW rules apply. Our bond guides for [Brisbane](/cleaning-guides/bond-cleaning-cost-brisbane), [Logan](/cleaning-guides/bond-cleaning-cost-logan), the [Gold Coast](/cleaning-guides/bond-cleaning-cost-gold-coast) and [Tweed Heads](/cleaning-guides/bond-cleaning-cost-tweed-heads) explain the process in each area.",
    },
    { type: "h3", text: "Inspections, open homes and settlement" },
    {
      type: "p",
      text: "For a routine inspection or an open home, a thorough clean of the kitchen, bathrooms and floors makes the biggest difference. If the home hasn't had a proper clean in a while, a detailed clean is the better choice. Tell us the inspection time so we can finish well before it.",
    },
    { type: "h3", text: "Guests arriving or after a party" },
    {
      type: "p",
      text: "Tell us which rooms matter most – usually the kitchen, bathrooms and living areas – so we can focus there first if time is tight. If there's damage, such as broken glass or stains that need a specialist, mention it when you call.",
    },
    { type: "h3", text: "Airbnb and holiday rental turnovers" },
    {
      type: "p",
      text: "Tight turnovers go best when they're planned. Our [Airbnb and holiday rental cleaning](/services/airbnb-cleaning) works around your booking calendar, so a same-day check-out and check-in becomes routine rather than an emergency.",
    },
    { type: "h3", text: "Offices and workplaces" },
    {
      type: "p",
      text: "Need the office presentable before a client visit, or cleaned after an event? Our [commercial cleaning](/services/commercial-cleaning) covers offices, shops and consulting rooms. Tell us the size of the premises and when you need access.",
    },

    { type: "h2", text: "After a flood, storm or sewage leak: do this first" },
    {
      type: "p",
      text: "If water or sewage has come into your home, safety and your insurance claim come before any cleaning.",
    },
    {
      type: "ol",
      items: [
        "**Make sure it's safe.** Only go back in when emergency services say it's safe. Call **000** in an emergency, or the **SES on 132 500** for storm and flood help.",
        "**Photograph everything before you clean.** Photos and video of the damage help your insurance claim.",
        "**Contact your insurer.** Ask what's covered and whether they'll arrange a restoration specialist. If you rent, tell your property manager or landlord straight away.",
        "**Treat floodwater as contaminated.** Floodwater often contains sewage and chemicals. Wear gloves, enclosed waterproof footwear and protective clothing, cover cuts, and wash your hands well.",
        "**Throw out food that's touched floodwater.**",
        "**Take care with mould.** Don't scrub it with a dry brush, which spreads spores, and never mix vinegar with bleach. People with asthma, allergies or other health conditions should avoid cleaning up mould.",
      ],
    },
    {
      type: "p",
      text: "Queensland Health (13 HEALTH – 13 43 25 84) and NSW Health have detailed flood clean-up advice – see the sources at the end of this guide.",
    },

    { type: "h2", text: "How to get help as fast as possible" },
    {
      type: "ol",
      items: [
        "**Call rather than email** when your deadline is within a few days.",
        "**Have the details ready:** suburb, type of home, bedrooms and bathrooms, the date and time you need, and what's happened.",
        "**Send photos** if the home is in poor condition – it helps us plan the right time and team.",
        "**Sort out access early:** keys, lockbox codes, building access and parking.",
        "**Be flexible on timing** if you can – an early start or a later finish can open up more options.",
      ],
    },

    { type: "h2", text: "Plan ahead so it's never an emergency" },
    {
      type: "p",
      text: "Most urgent cleans are easier when they're on the calendar early. Book your bond clean as soon as you know your vacate date. Keep a holiday rental on a regular turnover schedule. And if life is busy, a [regular fortnightly clean](/services/regular-house-cleaning) means the home is never far from guest-ready.",
    },

    { type: "h2", text: "Need a clean in a hurry?" },
    {
      type: "p",
      text: "Swept cleans homes and workplaces across [Brisbane](/areas/brisbane), [Logan](/areas/logan), the [Gold Coast](/areas/gold-coast) and [Tweed Heads](/areas/tweed-heads). Call us and we'll tell you straight away what's possible, or [request a quote online](/quote) and we'll reply within one business day.",
    },
  ],
  faqs: [
    {
      q: "Do you offer same-day cleaning?",
      a: "Sometimes, when we have availability on the day – but we can't guarantee it. Call us as early as you can and we'll tell you straight away whether we can fit you in.",
    },
    {
      q: "How quickly will I hear back?",
      a: "We reply to online quote requests within one business day. For anything urgent, call us between 7am and 6pm, Monday to Saturday (Queensland time), for the fastest answer.",
    },
    {
      q: "Can you do a bond clean at short notice?",
      a: "Often, yes, depending on the date and your location – end-of-month dates book out first. Send your vacate date and entry condition report as soon as you can so we can plan the clean.",
    },
    {
      q: "Do you clean up after floods, sewage or fire?",
      a: "No. Floodwater, sewage, fire damage and biohazards need a specialist restoration service with the right protective equipment, and are often arranged through your insurer. Once the home has been made safe, we can help with a detailed clean.",
    },
    {
      q: "What should I do first if my home floods?",
      a: "Make sure it's safe to go back in, photograph the damage before cleaning, and contact your insurer – and your property manager if you rent. Treat floodwater as contaminated and follow Queensland Health or NSW Health clean-up advice.",
    },
    {
      q: "Can you help before an inspection tomorrow?",
      a: "Call us and we'll check availability. If we can make it, we'll focus on the areas inspectors look at most – the kitchen, bathrooms and floors – and finish before the inspection time.",
    },
  ],
};
