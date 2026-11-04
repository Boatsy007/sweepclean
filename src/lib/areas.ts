import type { Faq } from "./services";

export type Area = {
  slug: string;
  name: string;
  state: "QLD" | "NSW";
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string;
  /** Genuinely local, practical notes – what makes cleaning here different */
  notes: { title: string; body: string }[];
  faqs: Faq[];
};

/* Suburbs for each area live in ./suburbs.ts. */
export const areas: Area[] = [
  {
    slug: "brisbane",
    name: "Brisbane",
    state: "QLD",
    metaTitle: "House Cleaning Brisbane: North, South & Inner City | Swept",
    metaDescription:
      "Regular, deep and bond cleaning across Brisbane's northside, southside, inner city, east and west. Weekly, fortnightly or monthly. Get a free quote.",
    h1: "House cleaning across Brisbane",
    intro:
      "From inner-city apartments in New Farm to family homes in Carindale and Chermside, Swept cleans homes right across Brisbane. Choose weekly, fortnightly or monthly visits, a one-off detailed clean, or a bond clean when you move out.",
    notes: [
      {
        title: "Queenslanders and timber floors",
        body: "Many Brisbane homes have polished hardwood floors, VJ walls and high ceilings. We use timber-safe products, a damp – not wet – mop, and dust the fretwork and fans that collect cobwebs fast in the humid months.",
      },
      {
        title: "Apartments and townhouses",
        body: "For inner-city units, tell us about parking, lift bookings and key collection when you request a quote so the clean starts on time.",
      },
      {
        title: "Humidity, mould and storm season",
        body: "Brisbane's wet summers mean bathrooms, laundries and window tracks need extra attention. Mention any mould spots in your quote request and we'll plan time for them.",
      },
    ],
    faqs: [
      {
        q: "Do you clean on the northside and southside?",
        a: "Yes – Swept covers Brisbane's northside, southside, inner city, eastern and western suburbs. If you can't see your suburb listed, request a quote and we'll confirm.",
      },
      {
        q: "Can you clean an apartment in the CBD?",
        a: "Yes. Let us know about building access, parking and any lift booking rules when you request a quote.",
      },
    ],
  },
  {
    slug: "logan",
    name: "Logan",
    state: "QLD",
    metaTitle: "House Cleaning Logan: Springwood to Yarrabilba | Swept",
    metaDescription:
      "Home cleaning across Logan, from Springwood and Shailer Park to Yarrabilba and Flagstone. Regular, deep, NDIS and bond cleaning. Free quote online.",
    h1: "House cleaning across Logan",
    intro:
      "Logan has everything from established homes in Springwood and Daisy Hill to brand-new estates in Yarrabilba, Flagstone and Park Ridge. Whatever the home, Swept offers regular cleaning, detailed one-off cleans, NDIS and home care cleaning, and bond cleans.",
    notes: [
      {
        title: "Bigger family homes",
        body: "Four-bedroom, two-bathroom homes with open-plan living are common across Logan's estates. A regular fortnightly clean keeps a busy family home in order without a weekend spent catching up.",
      },
      {
        title: "New builds and builder's dust",
        body: "Just moved into a new estate home? Fine construction dust settles in tracks, cupboards and light fittings for weeks. A detailed clean is the right place to start – tell us it's a new build when you enquire.",
      },
      {
        title: "Pets and outdoor living",
        body: "Plenty of Logan homes have dogs and big outdoor areas, which means hair and tracked-in dirt. Tell us about pets and we'll plan the vacuuming and floor time accordingly.",
      },
    ],
    faqs: [
      {
        q: "Do you service the new estates like Yarrabilba and Flagstone?",
        a: "Yes. New estates are part of our Logan service area – request a quote with your suburb and preferred day.",
      },
      {
        q: "Can you clean a brand-new home before we move in?",
        a: "Yes. Choose a detailed clean and mention it's a new build so we allow time for builder's dust in tracks, cupboards and fittings.",
      },
    ],
  },
  {
    slug: "gold-coast",
    name: "Gold Coast",
    state: "QLD",
    metaTitle: "House Cleaning Gold Coast: Regular & Bond Cleans | Swept",
    metaDescription:
      "Home cleaning across the Gold Coast, from Coomera to Burleigh, Robina and Coolangatta. Weekly, fortnightly or monthly cleans and bond cleaning. Free quote.",
    h1: "House cleaning across the Gold Coast",
    intro:
      "From the northern growth corridor around Coomera and Pimpama to the beachside suburbs between Surfers Paradise and Coolangatta, Swept offers regular home cleaning, detailed cleans, NDIS and home care cleaning, and bond cleans right along the Gold Coast.",
    notes: [
      {
        title: "Sand, salt and sliding doors",
        body: "Close to the beach, sand finds its way into everything and salt air leaves a film on glass. We pay extra attention to door tracks, floors and glass in coastal homes.",
      },
      {
        title: "High-rise apartments",
        body: "For towers in Surfers Paradise, Broadbeach and Main Beach, tell us about visitor parking, lift access and key collection so the clean runs smoothly.",
      },
      {
        title: "A busy rental market",
        body: "With so many renters on the Coast, bond cleans book out around the end of each month. If you're moving, request your quote as soon as you know your vacate date.",
      },
    ],
    faqs: [
      {
        q: "Do you clean high-rise apartments on the Gold Coast?",
        a: "Yes. Let us know your building's parking and lift arrangements when you request a quote.",
      },
      {
        q: "How far ahead should I book a bond clean on the Gold Coast?",
        a: "As soon as you know your vacate date. End-of-month dates are the busiest, so earlier is better.",
      },
    ],
  },
  {
    slug: "tweed-heads",
    name: "Tweed Heads",
    state: "NSW",
    metaTitle: "House Cleaning Tweed Heads & Banora Point | Swept",
    metaDescription:
      "Home cleaning in Tweed Heads, Tweed Heads South, Banora Point and Terranora. Regular, deep, NDIS and end-of-lease cleaning over the border. Free quote.",
    h1: "House cleaning in Tweed Heads and surrounds",
    intro:
      "Just over the border from Coolangatta, Tweed Heads and its neighbouring suburbs are part of Swept's regular service area. We offer weekly, fortnightly and monthly cleaning, detailed one-off cleans, NDIS and home care cleaning, and end-of-lease cleans.",
    notes: [
      {
        title: "Two states, two time zones",
        body: "From October to April, NSW runs on daylight saving time and Queensland doesn't – so Tweed Heads is an hour ahead of Coolangatta. We confirm every Tweed booking in your local time.",
      },
      {
        title: "NSW tenancy rules for bond cleans",
        body: "Tweed Heads rentals fall under NSW tenancy law, not Queensland's RTA. Your end-of-lease clean is checked against the condition report you signed at the start of your lease – send it to us with your quote request.",
      },
      {
        title: "Waterside living",
        body: "Canal and river homes in Tweed Heads West and Banora Point see a lot of outdoor living and humidity. We pay attention to sliding doors, glass and damp-prone bathrooms.",
      },
    ],
    faqs: [
      {
        q: "Do you cross the border to clean in NSW?",
        a: "Yes – Tweed Heads and the surrounding suburbs are part of our regular service area.",
      },
      {
        q: "Which time zone are bookings in?",
        a: "We confirm Tweed bookings in NSW time. During daylight saving (October to April), that's an hour ahead of Queensland.",
      },
    ],
  },
];

export function getArea(slug: string) {
  return areas.find((a) => a.slug === slug);
}

/** Soft coverage check – never blocks a lead, just sets expectations. */
export function postcodeInArea(postcode: string): boolean {
  const n = Number(postcode);
  if (!/^\d{4}$/.test(postcode)) return false;
  return (n >= 4000 && n <= 4230) || n === 4280 || (n >= 2485 && n <= 2487);
}
