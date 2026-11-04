export type ChecklistGroup = { room: string; items: string[] };
export type Faq = { q: string; a: string };

export type Service = {
  slug: string;
  name: string;
  /** Short label for nav + form */
  label: string;
  /** One-line summary used in lists */
  summary: string;
  bestFor: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string;
  /** Who this is (and isn't) for */
  suits: string[];
  checklist: ChecklistGroup[];
  /** What changes the price – honest, no invented numbers */
  pricing: string[];
  steps: { title: string; body: string }[];
  faqs: Faq[];
  /** Is a visit frequency relevant? */
  recurring: boolean;
  /** Optional honesty note shown near the CTA */
  availability?: string;
  /** Short icon key for UI */
  icon: "home" | "sparkle" | "heart" | "box";
};

const coreKitchen = [
  "Benchtops, splashbacks and cupboard fronts wiped",
  "Sink and tapware cleaned and polished",
  "Stovetop and rangehood exterior degreased",
  "Microwave inside and out",
  "Appliance exteriors and handles",
  "Floors vacuumed and mopped",
];

const coreBathroom = [
  "Shower, screen and tiles scrubbed",
  "Bath, basin and vanity cleaned",
  "Toilet cleaned inside and out",
  "Mirrors and chrome polished",
  "Floors vacuumed and mopped",
];

const coreLiving = [
  "Dusting of reachable surfaces, sills and skirting",
  "Beds made (fresh linen if left out)",
  "Light switches and door handles wiped",
  "Carpets and rugs vacuumed",
  "Hard floors vacuumed and mopped",
  "Bins emptied",
];

export const services: Service[] = [
  {
    slug: "regular-house-cleaning",
    name: "Regular home cleaning",
    label: "Regular home cleaning",
    icon: "home",
    summary: "Weekly, fortnightly or monthly visits that keep your whole home fresh, clean and under control.",
    bestFor: "Busy households who want the weekend back",
    metaTitle: "Regular House Cleaning Brisbane to Tweed Heads | Swept",
    metaDescription:
      "Weekly, fortnightly or monthly house cleaning across Brisbane, Logan, the Gold Coast and Tweed Heads. Same checklist every visit, no lock-in. Free quote.",
    h1: "Regular house cleaning, on a schedule that suits you",
    intro:
      "A regular clean is the difference between a house that gets cleaned and a house that stays clean. We come weekly, fortnightly or monthly, work through the same room-by-room checklist each time, and keep notes on the things you care about most.",
    suits: [
      "Families and couples who'd rather spend weekends out of the house",
      "Pet owners fighting a constant battle with hair and paw prints",
      "Anyone who works long hours or shifts and wants to come home to a reset house",
      "Homes that are generally tidy – we clean, we don't declutter",
    ],
    checklist: [
      { room: "Kitchen", items: coreKitchen },
      { room: "Bathrooms & laundry", items: [...coreBathroom, "Laundry tub and benches wiped"] },
      { room: "Living areas & bedrooms", items: coreLiving },
      {
        room: "Add to any visit",
        items: ["Dishes", "Laundry", "Oven & stove", "Kitchen cabinets", "Blinds", "Fans & vents", "Windows & tracks"],
      },
    ],
    pricing: [
      "The size of the home – bedrooms, bathrooms and living areas",
      "How often we visit – shorter gaps mean less build-up each time",
      "The condition of the first visit (a longer first clean may be needed to bring everything up to standard)",
      "Any extras, such as the oven and stove, blinds or windows and tracks",
    ],
    steps: [
      { title: "Tell us about your home", body: "Answer a few quick questions online – rooms, frequency, suburb and any priorities." },
      { title: "Get your written quote", body: "We confirm the price per visit, what's included and a regular day and time." },
      { title: "First clean, then the rhythm", body: "The first visit brings everything up to standard. After that, each visit maintains it." },
    ],
    faqs: [
      {
        q: "What's the difference between weekly and fortnightly cleaning?",
        a: "Weekly suits larger households, young kids or pets, where mess builds up quickly. Fortnightly suits most couples and smaller families who keep on top of day-to-day tidying. Monthly works for tidy homes that just want a regular deep reset. You can change frequency at any time.",
      },
      {
        q: "Do I need to be home during the clean?",
        a: "No. Many customers leave a key or a lockbox code, or let us in and head to work. Tell us how you'd like access to work when you request your quote.",
      },
      {
        q: "Do you bring your own equipment and products?",
        a: "Yes. If you'd prefer we use particular products – for example on stone benchtops or timber floors – let us know and we'll use yours.",
      },
      {
        q: "Can I skip a visit when I'm away?",
        a: "Yes. Let us know ahead of time and we'll skip the visit with no charge, then pick up your usual schedule when you're back.",
      },
    ],
    recurring: true,
  },
  {
    slug: "deep-cleaning",
    name: "Detailed home cleaning",
    label: "Detailed / deep clean",
    icon: "sparkle",
    summary: "A more thorough top-to-bottom clean to refresh your home – ideal for seasonal or periodic cleans.",
    bestFor: "Spring cleans, pre-sale, or starting a regular plan",
    metaTitle: "Deep Cleaning Brisbane, Gold Coast & Tweed | Swept",
    metaDescription:
      "Once-off deep cleaning across Brisbane, Logan, the Gold Coast and Tweed Heads. Detailed kitchens, bathrooms and whole-home resets. Request a free quote.",
    h1: "Detailed and deep home cleaning for a proper reset",
    intro:
      "A deep clean goes past the surfaces you see every day: grease on cupboard doors, soap scum in grout lines, dust along skirting boards and on top of door frames. It's the right first step before a regular plan, before a sale or an inspection, or simply when the house has got away from you.",
    suits: [
      "Homes that haven't had a professional clean in a while",
      "Preparing for a sale, an open home or family arriving",
      "A one-off reset before starting regular cleaning",
      "After renovations or a busy season – tell us about any builder's dust",
    ],
    checklist: [
      {
        room: "Kitchen",
        items: [...coreKitchen, "Cupboard and drawer fronts degreased", "Inside the oven (included)", "Rangehood filters soaked where removable"],
      },
      {
        room: "Bathrooms & laundry",
        items: [...coreBathroom, "Grout lines scrubbed", "Exhaust fan covers dusted", "Laundry tub, benches and cabinet fronts"],
      },
      {
        room: "Living areas & bedrooms",
        items: [...coreLiving, "Skirting boards and door frames wiped", "Ceiling fans and light fittings dusted", "Window sills and tracks vacuumed"],
      },
      { room: "Add to your deep clean", items: ["Blinds", "Interior windows", "Dishes", "Laundry", "Bed making"] },
    ],
    pricing: [
      "The size of the home",
      "How long since the last thorough clean",
      "Specific problem areas such as heavy grease or mould",
      "Extras such as blinds, interior windows or laundry",
    ],
    steps: [
      { title: "Describe the job", body: "Tell us the size of the home and anything that needs special attention." },
      { title: "Confirm the scope", body: "We send a written quote with the checklist and an estimated time on site." },
      { title: "We reset the house", body: "A detailed top-to-bottom clean – and the option to keep it that way with a regular plan." },
    ],
    faqs: [
      {
        q: "How long does a deep clean take?",
        a: "It depends on the size and condition of the home. Your quote includes an estimated time on site so you can plan your day.",
      },
      {
        q: "Is a deep clean the same as a bond clean?",
        a: "Not quite. A bond clean is built around the end-of-lease inspection and includes things like inside every cupboard and wardrobe in an empty property. If you're moving out of a rental, choose bond cleaning instead.",
      },
      {
        q: "Should I get a deep clean before starting regular cleaning?",
        a: "If the home hasn't been professionally cleaned recently, yes – it makes every regular visit after that faster and more effective. We'll suggest it in your quote if we think it's needed.",
      },
    ],
    recurring: false,
  },
  {
    slug: "ndis-cleaning",
    name: "NDIS & home care cleaning",
    label: "NDIS / home care cleaning",
    icon: "heart",
    summary: "Supportive, personalised home cleaning with the flexibility to fit individual needs.",
    bestFor: "NDIS participants, older Australians and their families",
    metaTitle: "NDIS & Home Care Cleaning Brisbane to Tweed | Swept",
    metaDescription:
      "Personalised home cleaning for NDIS participants and older people across Brisbane, Logan, the Gold Coast and Tweed Heads. Regular, consistent visits.",
    h1: "NDIS and home care cleaning, tailored to the person",
    intro:
      "Some people need more than a standard clean. They need a cleaner who works around their routine, explains what they're doing, respects their space and keeps things the way they like them. We offer regular, personalised home cleaning for NDIS participants, older people living at home and the families who support them.",
    availability:
      "Swept is not a registered NDIS provider. If your plan is self-managed or plan-managed, you may be able to use a non-registered provider – check with your plan manager or support coordinator. We'll confirm availability for your area when we reply.",
    suits: [
      "NDIS participants with household tasks funded in their plan",
      "Older people who want help keeping their home safe and comfortable",
      "Families arranging cleaning for a parent or relative",
      "Anyone who'd like a patient, consistent cleaning routine",
    ],
    checklist: [
      { room: "Kitchen", items: coreKitchen },
      { room: "Bathrooms & laundry", items: [...coreBathroom, "Laundry tub and benches wiped"] },
      { room: "Living areas & bedrooms", items: [...coreLiving, "Clear, safe walkways kept free of trip hazards"] },
      { room: "Tailored to you", items: ["Bed making and linen changes", "Laundry – a load washed and folded", "Dishes washed and put away", "Tasks agreed with you, written into your plan"] },
    ],
    pricing: [
      "The size of the home and the tasks agreed",
      "How often we visit and how long each visit runs",
      "Any specific requirements in your plan or care arrangements",
    ],
    steps: [
      { title: "Tell us what's needed", body: "Share the home, the tasks and anything that helps us support the person well." },
      { title: "Agree a plan together", body: "We put the tasks, visit length and frequency in writing, with a clear price." },
      { title: "A consistent routine", body: "Regular visits that follow the same plan, adjusted whenever needs change." },
    ],
    faqs: [
      {
        q: "Can I use my NDIS funding for cleaning with Swept?",
        a: "Household tasks can be funded under the NDIS when they're in your plan. Swept is not a registered NDIS provider, so this usually applies to self-managed or plan-managed participants. Check with your plan manager before booking, and we'll provide the invoices you need.",
      },
      {
        q: "Can a family member arrange the cleaning?",
        a: "Yes. Many enquiries come from family members or support coordinators. Tell us who our main contact should be and how the person likes to be communicated with.",
      },
      {
        q: "What if needs change over time?",
        a: "Tell us and we'll update the plan. Visit length, frequency and tasks can all be adjusted.",
      },
    ],
    recurring: true,
  },
  {
    slug: "bond-cleaning",
    name: "Bond cleaning",
    label: "Bond / end-of-lease clean",
    icon: "box",
    availability: "Bond cleaning availability depends on your dates and location – we'll confirm when we reply to your enquiry.",
    summary: "A detailed bond clean built around your entry condition report.",
    bestFor: "Renters moving out who want their bond back",
    metaTitle: "Bond Cleaning Brisbane, Gold Coast & Tweed Heads | Swept",
    metaDescription:
      "End-of-lease bond cleaning across Brisbane, Logan, the Gold Coast and Tweed Heads, cleaned against your entry condition report. Book your move-out clean online.",
    h1: "Bond cleaning and end-of-lease cleaning, checked against your entry report",
    intro:
      "When you move out of a rental, the property needs to be left in the same condition it was in when you moved in, apart from fair wear and tear. In Queensland, your entry condition report (Form 1a) is compared with the exit condition report (Form 14a). In Tweed Heads and the rest of NSW, the condition report you signed at the start of the lease does the same job. We clean the property against that report, room by room.",
    suits: [
      "Renters leaving a house, townhouse or apartment",
      "Property managers and landlords between tenancies",
      "Sellers handing over a property at settlement",
      "Best booked for an empty property, after furniture has gone",
    ],
    checklist: [
      {
        room: "Kitchen",
        items: [
          "Inside and outside every cupboard and drawer",
          "Oven, grill trays, stovetop and rangehood (including filters)",
          "Dishwasher exterior and filter area",
          "Benchtops, splashbacks, sink and tapware",
          "Floors cleaned including edges and under removable kickboards where accessible",
        ],
      },
      {
        room: "Bathrooms & laundry",
        items: [
          "Shower, screen, tiles and grout scrubbed",
          "Toilet, basin, vanity and cabinets inside and out",
          "Mirrors, chrome and exhaust fan covers",
          "Laundry tub, cabinets and behind-appliance spaces",
        ],
      },
      {
        room: "Every room",
        items: [
          "Wardrobes and built-ins inside and out",
          "Skirting boards, door frames, doors and handles",
          "Light switches and power points",
          "Window sills, tracks and interior glass",
          "Ceiling fans and light fittings dusted",
          "Floors vacuumed and mopped",
        ],
      },
      { room: "Add to your bond clean", items: ["Blinds", "Fans & vents"] },
    ],
    pricing: [
      "Number of bedrooms, bathrooms and living areas",
      "Whether the property is empty (strongly recommended)",
      "Condition – heavy oven grease, mould or pet hair takes longer",
      "Extras such as blinds",
    ],
    steps: [
      { title: "Send us your move-out details", body: "Your vacate date, property size and – ideally – a copy of your entry condition report." },
      { title: "We quote against the report", body: "A written price and checklist, with any areas of concern flagged up front." },
      { title: "Clean before the final inspection", body: "We clean the empty property room by room so you can do your exit report with confidence." },
    ],
    faqs: [
      {
        q: "Do you guarantee I'll get my bond back?",
        a: "No honest cleaner can guarantee your full bond, because bond decisions also cover damage, unpaid rent and other items outside cleaning. What we do is clean against your entry condition report. If your agent raises a cleaning issue we covered, tell us and we'll work with you to fix it.",
      },
      {
        q: "When should I book my bond clean?",
        a: "Ideally for the day after the removalists, once the property is empty and before your final inspection. Book as early as you know your vacate date – end-of-month dates fill quickly.",
      },
      {
        q: "Is the oven included in a bond clean?",
        a: "Yes. Every bond clean includes the oven, grill trays, stovetop and rangehood, along with inside and outside every kitchen cabinet and drawer.",
      },
      {
        q: "Does the process differ in Tweed Heads?",
        a: "Tweed Heads is in NSW, so NSW tenancy rules apply rather than Queensland's RTA forms. The cleaning standard is the same: the property should match its condition report, allowing for fair wear and tear. Send us the report you signed at the start of your lease.",
      },
    ],
    recurring: false,
  },
];

export function getService(slug: string) {
  return services.find((s) => s.slug === slug);
}
