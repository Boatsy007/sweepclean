import type { Suburb } from "./suburbs";

/*
 * Local cleaning profiles for suburb pages.
 *
 * Each suburb's `note` (src/lib/suburbs.ts) describes its housing. These rules pick out the
 * home types it mentions – apartments, Queenslanders, new estates, beach sand, canal humidity,
 * rentals and so on – and turn them into practical cleaning advice, the services that suit,
 * and suburb-specific FAQs. Profiles are ordered by where they first appear in the note, so the
 * most defining feature of each suburb leads. Keep the copy practical and limited to services
 * Swept actually offers.
 */

export type ProfileKey =
  | "apartment" | "character" | "family" | "newbuild" | "acreage" | "coastal"
  | "waterside" | "rentals" | "prestige" | "seniors" | "hillside" | "leafy";

type Ctx = { s: string; nsw: boolean };

type Profile = {
  match: RegExp;
  title: string;
  icon: string;
  body: (c: Ctx) => string;
  tellUs: string;
  service: string;
  faq: (c: Ctx) => { q: string; a: string };
};

export const profiles: Record<ProfileKey, Profile> = {
  apartment: {
    match: /apartment|\bunits?\b|tower|high-rise|serviced residences/i,
    title: "Apartments and units",
    icon: "city",
    body: ({ s }) => `Plenty of ${s} homes are apartments or units. They're quicker to clean than a house, so regular visits are short – but building access, lift bookings and visitor parking all need planning, and large glass doors show every fingerprint.`,
    tellUs: "How building access and parking work, and which floor you're on",
    service: "regular-house-cleaning",
    faq: ({ s }) => ({ q: `Do you clean apartments in ${s}?`, a: `Yes. We clean apartments and units in ${s} weekly, fortnightly or monthly, and do bond cleans when you move out. Let us know how building access, lifts and visitor parking work when you request a quote.` }),
  },
  character: {
    match: /queenslander|cottage|character|timber|\bVJ\b|warehouse|terrace|historic/i,
    title: "Queenslanders and character homes",
    icon: "home",
    body: ({ s }) => `Character homes in ${s} often have polished timber floors, high ceilings, fretwork and older bathrooms. They need timber-safe products, a gentle hand on older fittings and extra time for dusting up high. A detailed first clean is a good way to start a regular plan.`,
    tellUs: "Your floor types and any delicate or original finishes",
    service: "deep-cleaning",
    faq: ({ s }) => ({ q: `Can you clean Queenslanders and timber floors in ${s}?`, a: `Yes. We use timber-safe products on polished floors and take care with older fittings, high ceilings and fretwork. For a character home in ${s}, we usually suggest a detailed clean first, then regular visits.` }),
  },
  family: {
    match: /family|families|open-plan homes|multiple bathrooms/i,
    title: "Busy family homes",
    icon: "heart",
    body: ({ s }) => `Family homes in ${s} work hard – the kitchen, bathrooms and floors most of all. A fortnightly clean suits most households, and weekly suits homes with young children or pets. Tell us your priority rooms once and we'll keep them on your checklist.`,
    tellUs: "Bedrooms, bathrooms, living areas and any pets",
    service: "regular-house-cleaning",
    faq: ({ s }) => ({ q: `How often should a family home in ${s} be cleaned?`, a: `Most ${s} families choose fortnightly cleans, which keep the kitchen, bathrooms and floors under control. Weekly suits busy homes with young kids or pets, and monthly suits smaller households that tidy as they go.` }),
  },
  newbuild: {
    match: /new estates?|newer|brand-new|new builds?|new homes|new family homes|fastest-growing|rapidly growing|master-planned|new townhouse|new developments|newer developments|new luxury/i,
    title: "New builds and new estates",
    icon: "sparkle",
    body: ({ s }) => `Newer homes in ${s} are easy to keep clean once they're on a regular plan, but fine builder's dust keeps settling in tracks, cupboards and light fittings for weeks after handover. Start with a detailed clean, then move to fortnightly visits.`,
    tellUs: "Whether it's a new build and when you moved in",
    service: "deep-cleaning",
    faq: ({ s }) => ({ q: `Can you clean a new build in ${s}?`, a: `Yes. A detailed clean removes the fine construction dust that settles in tracks, cupboards, light fittings and window sills after handover. After that, a fortnightly clean keeps a new ${s} home looking new.` }),
  },
  acreage: {
    match: /acreage|semi-rural|larger blocks|big blocks|generous blocks|larger properties/i,
    title: "Larger homes and acreage",
    icon: "pin",
    body: ({ s }) => `Bigger homes on larger ${s} blocks usually have more living areas, more bathrooms and more dirt tracked in from outside. Tell us the size of the home and how many living areas it has, so we allow enough time for a thorough clean.`,
    tellUs: "The size of the home and the number of living areas",
    service: "regular-house-cleaning",
    faq: ({ s }) => ({ q: `Do you clean larger homes and acreage properties in ${s}?`, a: `Yes. We'll ask about the number of bedrooms, bathrooms and living areas so the quote allows enough time. Larger ${s} homes often suit a weekly or fortnightly plan so dust and tracked-in dirt don't build up.` }),
  },
  coastal: {
    match: /beach|salt|\bsand\b|bayside|coastal|ocean|harbour/i,
    title: "Sand and salt air",
    icon: "wave",
    body: ({ s }) => `Close to the water in ${s}, sand finds its way into sliding-door tracks and corners, and salt air leaves a haze on glass. Tracks, sills and inside glass are on our checklist, so they're cleaned every visit instead of building up.`,
    tellUs: "How close you are to the beach and how many glass doors you have",
    service: "regular-house-cleaning",
    faq: ({ s }) => ({ q: `How do you deal with sand and salt in ${s} homes?`, a: `We vacuum and wipe sliding-door tracks and sills, clean inside glass to remove salt haze, and give floors extra attention where sand is tracked in. Regular visits stop it building up in ${s}'s coastal conditions.` }),
  },
  waterside: {
    match: /canal|riverside|lakeside|waterside|\briver\b|broadwater|creek/i,
    title: "Humid, waterside living",
    icon: "bridge",
    body: ({ s }) => `Canal, river and lakeside homes in ${s} deal with more humidity, which shows up as mould and mildew on shower grout, silicone and window frames. Regular bathroom cleaning stops it taking hold, and heavy build-up is best tackled with a detailed clean first.`,
    tellUs: "Any mould or mildew you've noticed, and where",
    service: "deep-cleaning",
    faq: ({ s }) => ({ q: `Do waterside homes in ${s} need extra cleaning?`, a: `Often, yes. Humidity near the water encourages mould on grout, silicone and window frames. Regular cleans keep bathrooms on top of it; if there's existing build-up, we recommend a detailed clean first.` }),
  },
  rentals: {
    match: /rental|\bbond\b|renters|student|university/i,
    title: "Rentals and moving out",
    icon: "key",
    body: ({ s, nsw }) => `${s} has plenty of rentals, so end-of-lease cleans are a regular request. A bond clean is done on the empty home and checked room by room against your ${nsw ? "condition report" : "entry condition report (Form 1a)"} – send it with your quote request so nothing is missed.`,
    tellUs: "Your vacate date and a copy of your condition report",
    service: "bond-cleaning",
    faq: ({ s, nsw }) => ({ q: `Do you do bond cleans in ${s}?`, a: `Yes. We clean the empty property room by room against the ${nsw ? "condition report you signed at the start of the lease, following NSW rules" : "entry condition report (Form 1a), following Queensland's RTA rules"}. Book for after the removalists and before your final inspection.` }),
  },
  prestige: {
    match: /prestige|luxury|grand/i,
    title: "Stone, glass and high-end finishes",
    icon: "sparkle",
    body: ({ s }) => `Prestige homes in ${s} often have stone benchtops, large glass areas, polished timber and delicate finishes. Each surface needs the right product – tell us what yours are made of and we'll plan the clean around them.`,
    tellUs: "Your benchtop, floor and splashback materials",
    service: "deep-cleaning",
    faq: ({ s }) => ({ q: `Can you clean stone benchtops and high-end finishes in ${s}?`, a: `Yes. We match products to the surface – stone, glass, polished timber and stainless steel – and you can note any surfaces that need special care. Tell us about them when you request a quote.` }),
  },
  seniors: {
    match: /over-55|retiree/i,
    title: "Over-55s and home care",
    icon: "heart",
    body: ({ s }) => `For older residents in ${s}, a regular clean makes staying comfortable at home easier. We offer NDIS and home care cleaning with a consistent, written checklist, and we're happy to work around routines and preferences.`,
    tellUs: "Any routines, mobility needs or areas to avoid",
    service: "ndis-cleaning",
    faq: ({ s }) => ({ q: `Do you offer NDIS or home care cleaning in ${s}?`, a: `Yes. We offer NDIS and home care cleaning in ${s}, tailored to the person – with a consistent checklist and the flexibility to work around routines.` }),
  },
  hillside: {
    match: /\bhills?\b|hilly|hillside|sloping|split-level|stairs|steep/i,
    title: "Stairs, slopes and split levels",
    icon: "home",
    body: ({ s }) => `Hilly blocks in ${s} often mean split-level homes, internal stairs and steep driveways. Stairs and extra levels add time to every clean, so tell us how many levels your home has when you request a quote.`,
    tellUs: "How many levels the home has and where to park",
    service: "regular-house-cleaning",
    faq: ({ s }) => ({ q: `Do stairs or split levels affect the price in ${s}?`, a: `They can. Stairs, landings and extra levels add time, so we ask about them when we quote. Let us know about steep driveways or tricky parking too.` }),
  },
  leafy: {
    match: /leafy|bush|leaf litter|tree-lined|forest/i,
    title: "Leafy streets, more dust",
    icon: "palm",
    body: ({ s }) => `Leafy surroundings in ${s} mean more leaf litter, pollen and dust carried indoors, especially onto floors, sills and tracks. Regular visits keep it from building up between cleans.`,
    tellUs: "Which doors get the most use and any pets",
    service: "regular-house-cleaning",
    faq: ({ s }) => ({ q: `Why does my ${s} home get dusty so quickly?`, a: `Leafy surroundings bring in more leaf litter, pollen and dust, especially through doors and windows that are often open. A weekly or fortnightly clean keeps floors, sills and tracks on top of it.` }),
  },
};

/** Profiles that apply to a suburb, ordered by where they first appear in its note. */
export function profilesFor(sb: Suburb): ProfileKey[] {
  return (Object.keys(profiles) as ProfileKey[])
    .map((k) => ({ k, i: sb.note.search(profiles[k].match) }))
    .filter((x) => x.i >= 0)
    .sort((a, b) => a.i - b.i)
    .map((x) => x.k);
}

const why: Record<string, (s: string) => string> = {
  "regular-house-cleaning": (s) => `Weekly, fortnightly or monthly visits that keep your ${s} home under control, following the same checklist every time.`,
  "deep-cleaning": (s) => `A top-to-bottom reset – ideal as a first clean, after building work, or before starting a regular plan in ${s}.`,
  "bond-cleaning": (s) => `An end-of-lease clean on the empty property, checked against your condition report before you hand back the ${s} keys.`,
  "ndis-cleaning": (s) => `Supportive, consistent cleaning for NDIS participants and older residents in ${s}.`,
  "airbnb-cleaning": (s) => `Turnover cleans between guests for holiday rentals and short stays in ${s}.`,
  "carpet-cleaning": (s) => `Carpet steam cleaning on its own or added to a bond or detailed clean in ${s}.`,
};

/** Up to three services that suit this suburb's homes, most relevant first. */
export function servicesFor(sb: Suburb, keys: ProfileKey[]): { slug: string; why: string }[] {
  const order: string[] = [];
  const add = (slug: string) => { if (!order.includes(slug)) order.push(slug); };
  keys.forEach((k, i) => {
    add(profiles[k].service);
    if (i === 0 && (sb.area === "gold-coast" || sb.area === "tweed-heads") && (k === "coastal" || k === "apartment")) add("airbnb-cleaning");
  });
  ["regular-house-cleaning", "deep-cleaning", "bond-cleaning"].forEach(add);
  return order.slice(0, 3).map((slug) => ({ slug, why: why[slug](sb.name) }));
}
