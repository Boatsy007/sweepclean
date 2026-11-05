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
  icon: "home" | "sparkle" | "heart" | "box" | "key" | "carpet" | "city";
  /** Commercial premises rather than a home (changes the quote form questions). */
  commercial?: boolean;
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
    metaTitle: "Regular Home Cleaning Brisbane & Gold Coast | Swept Cleaning",
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
    metaTitle: "Deep Cleaning Brisbane, Logan & Gold Coast | Swept Cleaning",
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
    metaTitle: "NDIS Cleaning Brisbane, Logan & Gold Coast | Swept Cleaning",
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
    metaTitle: "Bond Cleaning Brisbane, Logan & Gold Coast | Swept Cleaning",
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
      { room: "Add to your bond clean", items: ["Carpet steam cleaning", "Blinds", "Fans & vents"] },
    ],
    pricing: [
      "Number of bedrooms, bathrooms and living areas",
      "Whether the property is empty (strongly recommended)",
      "Condition – heavy oven grease, mould or pet hair takes longer",
      "Extras such as carpet steam cleaning or blinds",
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
  {
    slug: "airbnb-cleaning",
    name: "Airbnb & holiday rental cleaning",
    label: "Airbnb / holiday rental",
    icon: "key",
    summary: "Turnover cleans between guests that leave your property spotless, restocked and photo-ready.",
    bestFor: "Airbnb, Stayz and holiday home hosts",
    metaTitle: "Airbnb Cleaning Gold Coast, Brisbane, Tweed | Swept Cleaning",
    metaDescription:
      "Airbnb and holiday rental turnover cleaning across the Gold Coast, Brisbane and Tweed Heads. Linen, laundry, restocking and a guest-ready checklist every stay.",
    h1: "Airbnb and holiday rental cleaning, guest-ready every time",
    intro:
      "Between check-out and the next check-in, a short-stay property has to look exactly like its listing photos. We clean to a property-specific turnover checklist, make the beds, take care of laundry and dishes, restock the amenities you supply and let you know about anything that needs your attention before the next guest arrives.",
    suits: [
      "Airbnb, Stayz and direct-booking hosts",
      "Holiday homes and investment apartments",
      "Co-hosts and property managers looking after several listings",
      "High-rise apartments with lift, parking or key-collection rules – tell us the details",
    ],
    checklist: [
      { room: "Kitchen", items: [...coreKitchen, "Dishes washed and put away", "Appliances wiped inside and out", "Guest leftovers cleared"] },
      { room: "Bathrooms", items: [...coreBathroom, "Fresh towels laid out", "Supplied amenities restocked"] },
      { room: "Bedrooms & living", items: ["Beds made with fresh linen", ...coreLiving.filter((i) => !i.startsWith("Beds"))] },
      { room: "Every turnover", items: ["Laundry of linen and towels", "Property set up to your listing – cushions, throws, welcome items", "Damage, breakages or missing items reported to you", "Lost property set aside"] },
    ],
    pricing: [
      "Property size and the number of beds to make",
      "How many turnovers you expect each month",
      "Linen and laundry – washed on site or swapped from your spare sets",
      "Building access and parking arrangements",
    ],
    steps: [
      { title: "Tell us about the property", body: "Size, beds, typical turnovers per month, check-out and check-in times, and how access works." },
      { title: "We build your checklist", body: "A turnover checklist set up for your property, with a per-clean price in writing." },
      { title: "Guest-ready between stays", body: "We clean to the checklist after each check-out and report anything you need to know." },
    ],
    faqs: [
      {
        q: "Can you clean between same-day check-out and check-in?",
        a: "That's what turnover cleaning is for. Share your usual check-out and check-in times when you request a quote so we can plan each clean around the window.",
      },
      {
        q: "Do you handle linen and laundry?",
        a: "Yes. We make the beds with fresh linen and look after laundry of linen and towels. Tell us whether you keep spare sets on site so we can plan the turnaround.",
      },
      {
        q: "Will you tell me if something is damaged or missing?",
        a: "Yes. Anything broken, missing or needing maintenance is reported to you after the clean, so you can sort it out before the next guest.",
      },
      {
        q: "Do you clean holiday rentals in Tweed Heads?",
        a: "Yes – along with the Gold Coast and Brisbane. Tweed Heads is in NSW, so during daylight saving we confirm turnover times in NSW time.",
      },
    ],
    recurring: false,
  },
  {
    slug: "carpet-cleaning",
    name: "Carpet steam cleaning",
    label: "Carpet cleaning",
    icon: "carpet",
    summary: "Professional carpet steam cleaning for bond cleans, high-traffic areas and a fresh start.",
    bestFor: "Renters moving out, pet owners and busy family homes",
    metaTitle: "Carpet Steam Cleaning Brisbane & Gold Coast | Swept Cleaning",
    metaDescription:
      "Carpet steam cleaning across Brisbane, Logan, the Gold Coast and Tweed Heads. Ideal with a bond clean, for pet homes or high-traffic rooms. Free written quote.",
    h1: "Carpet steam cleaning for homes and bond cleans",
    intro:
      "Vacuuming keeps carpets tidy, but it doesn't lift the dirt, oils and odours trapped deep in the fibres. A steam clean does. Book it on its own, or add it to a bond clean or deep clean so the whole home is done in one visit.",
    suits: [
      "Renters whose lease asks for carpets to be professionally cleaned at the end of the tenancy",
      "Homes with pets, young kids or high foot traffic",
      "Sellers preparing a home for inspections",
      "Anyone adding carpets to a bond clean or deep clean",
    ],
    checklist: [
      { room: "Before we start", items: ["Carpets inspected for stains and wear", "Furniture you've cleared moved aside where safe", "Thorough vacuum to lift loose dirt"] },
      { room: "Steam clean", items: ["Pre-treatment of high-traffic areas and spots", "Steam cleaning room by room", "Edges and corners worked carefully"] },
      { room: "After", items: ["Carpets left to dry – we'll tell you how long to expect", "Advice on keeping them fresh between cleans"] },
      { room: "Pair it with", items: ["Bond cleaning", "Deep cleaning", "Regular home cleaning"] },
    ],
    pricing: [
      "The number of rooms, hallways and stairs to be cleaned",
      "Carpet condition – heavy staining or pet accidents take longer",
      "Whether it's booked on its own or with a bond or deep clean",
    ],
    steps: [
      { title: "Tell us the rooms", body: "Bedrooms, living areas, hallways and stairs, plus any stains or pet issues." },
      { title: "Get your written quote", body: "A clear price, and a time that fits around your move or your week." },
      { title: "Fresh, clean carpets", body: "We steam clean room by room and let you know how long they'll take to dry." },
    ],
    faqs: [
      {
        q: "Do I need carpets professionally cleaned when I move out?",
        a: "Check your lease – some require carpets to be professionally cleaned at the end of the tenancy. If yours does, add carpet steam cleaning to your bond clean and we'll do both in one visit.",
      },
      {
        q: "Can every stain be removed?",
        a: "Most everyday stains lift well with a steam clean, but some – like bleach marks or old set-in stains – can be permanent. We'll tell you honestly what to expect when we see them.",
      },
      {
        q: "How long do carpets take to dry?",
        a: "It depends on the carpet, the weather and airflow in the home. We'll give you an estimate on the day; opening windows and running fans helps.",
      },
    ],
    recurring: false,
  },
  {
    slug: "commercial-cleaning",
    name: "Commercial & office cleaning",
    label: "Commercial / office cleaning",
    icon: "city",
    commercial: true,
    summary: "Reliable, scheduled cleaning for offices, shops and small business premises.",
    bestFor: "Offices, shops, studios and small businesses",
    metaTitle: "Commercial Cleaning Brisbane & Gold Coast | Swept Cleaning",
    metaDescription:
      "Commercial and office cleaning across Brisbane, Logan, the Gold Coast and Tweed Heads. Scheduled cleans for offices, shops and small businesses. Free quote.",
    h1: "Commercial and office cleaning for small businesses",
    intro:
      "A clean workplace looks professional to customers and is better for the people who work there. We bring the same written-checklist approach we use in homes to offices, shops, studios and consulting rooms – on a schedule that suits your business.",
    suits: [
      "Offices and co-working spaces",
      "Shops, showrooms and studios",
      "Consulting rooms and small clinics",
      "Body corporate common areas – tell us what's included",
    ],
    checklist: [
      { room: "Work areas & reception", items: ["Desks and surfaces dusted and wiped (clear areas)", "Glass doors and partitions spot-cleaned", "Bins emptied", "Skirting boards, sills and vents dusted"] },
      { room: "Kitchen & breakroom", items: ["Benchtops, sinks and splashbacks", "Appliance exteriors – microwave, fridge, kettle", "Dishes washed or dishwasher loaded", "Cabinet fronts wiped"] },
      { room: "Bathrooms", items: ["Toilets, basins and mirrors", "Tiles and floors", "Supplied consumables restocked"] },
      { room: "Floors", items: ["Carpets vacuumed", "Hard floors vacuumed and mopped", "Entry mats cleaned"] },
    ],
    pricing: [
      "The size and layout of the premises",
      "How often we clean – from weekly to several times a week",
      "The number of bathrooms and kitchen areas",
      "Access times and security arrangements",
    ],
    steps: [
      { title: "Tell us about the premises", body: "Type of business, approximate size, how often you'd like us and when we can access the site." },
      { title: "Agree the scope", body: "A written checklist and price per clean, with times that work around your business." },
      { title: "A clean workplace, on schedule", body: "We clean to the checklist every visit and keep you in the loop." },
    ],
    faqs: [
      {
        q: "Can you clean outside business hours?",
        a: "Tell us your preferred times when you request a quote and we'll agree a schedule that keeps disruption to a minimum.",
      },
      {
        q: "Do you supply cleaning products and equipment?",
        a: "Yes. If you'd like us to use particular products – for example on special flooring – let us know and we'll use yours.",
      },
      {
        q: "Is there a minimum contract?",
        a: "No lock-in contract. Regular commercial cleans run visit to visit, and you can change the schedule as your business changes.",
      },
    ],
    recurring: true,
  },
];

export function getService(slug: string) {
  return services.find((s) => s.slug === slug);
}
