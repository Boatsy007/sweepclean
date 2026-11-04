import { areas, type Area } from "./areas";

/*
 * Suburb data for /areas/[area]/[suburb] pages.
 *
 * Each entry carries facts that make the page genuinely local – postcode, council,
 * and a short note on the housing and what that means for cleaning. Keep notes
 * factual and practical. Owner: add real local proof over time (jobs completed,
 * photos, reviews from that suburb) – that is what makes these pages rank.
 */

export type Suburb = {
  slug: string;
  name: string;
  postcode: string;
  council: string;
  area: Area["slug"];
  group: string;
  note: string;
};

const BCC = "Brisbane City Council";
const LCC = "Logan City Council";
const GC = "City of Gold Coast";
const TSC = "Tweed Shire Council";
const MB = "City of Moreton Bay";

type Row = [name: string, postcode: string, council: string, note: string];

const data: Record<Area["slug"], Record<string, Row[]>> = {
  brisbane: {
    "Inner City": [
      ["Brisbane City", "4000", BCC, "Mostly high-rise apartments and serviced residences in the CBD. Building access, lift bookings and visitor parking are the main things we plan around, and floor-to-ceiling glass collects fingerprints fast."],
      ["New Farm", "4005", BCC, "A mix of Queenslanders, character apartment blocks and riverside towers. Older timber homes need timber-safe floor products and extra attention to dust on VJ walls and fretwork."],
      ["Fortitude Valley", "4006", BCC, "Inner-city apartments and townhouses, many with balconies facing busy streets. Road grime and dust build up on balcony glass and sliding-door tracks between cleans."],
      ["Kangaroo Point", "4169", BCC, "Riverside apartment towers alongside older houses on the peninsula. River breezes bring dust onto balconies, and tower buildings usually need lift and parking arrangements."],
      ["South Brisbane", "4101", BCC, "Modern apartment living close to South Bank, plus some older cottages. Compact kitchens and bathrooms in newer units suit a quick, efficient regular clean."],
      ["West End", "4101", BCC, "Workers' cottages and Queenslanders mixed with newer riverside apartments. Character homes often have polished timber floors and high ceilings that need careful dusting."],
      ["Spring Hill", "4000", BCC, "Historic terraces and cottages on narrow streets, plus apartments near the CBD. Older homes with steep stairs and tight parking take a little extra planning."],
      ["Newstead", "4006", BCC, "Newer apartment buildings, converted warehouses and townhouses. Large windows, stone benchtops and stainless appliances are common, so streak-free finishes matter."],
      ["Teneriffe", "4005", BCC, "Converted wool stores and warehouse apartments with exposed brick and timber, alongside Queenslanders. High ceilings, big windows and hardwood floors need the right products and reach."],
    ],
    Northside: [
      ["Chermside", "4032", BCC, "Post-war homes, townhouses and a growing number of apartments around the shopping precinct. Busy family homes here suit a fortnightly clean."],
      ["Aspley", "4034", BCC, "Established brick and low-set family homes on generous blocks. Larger floor plans and outdoor living areas mean more floor time each visit."],
      ["Kedron", "4031", BCC, "A mix of Queenslanders, post-war houses and newer townhouses near Kedron Brook. Older timber homes need gentle products on hardwood floors."],
      ["Stafford", "4053", BCC, "Post-war houses, renovated Queenslanders and new townhouse developments. Renovation dust is common – mention it if you've had recent work done."],
      ["Everton Park", "4053", BCC, "Family homes and townhouses, many on sloping blocks. Split-level homes and stairs are factored into how long each clean takes."],
      ["Nundah", "4012", BCC, "Character homes close to the village plus a growing number of apartments. Apartment cleans here are quick; Queenslanders need more dusting time."],
      ["Clayfield", "4011", BCC, "Large Queenslanders and grand character homes on leafy streets. Big homes with verandahs, high ceilings and timber floors suit a detailed regular clean."],
      ["Ascot", "4007", BCC, "Grand Queenslanders and prestige homes on tree-lined streets. Polished timber, stone and delicate finishes need the right products – tell us what your surfaces are."],
      ["Hamilton", "4007", BCC, "Riverside apartments and prestige hillside homes. Large glass areas, balconies and stone surfaces are the focus for a polished finish."],
      ["Albany Creek", "4035", MB, "Leafy family homes on larger blocks, just over the Brisbane boundary in the City of Moreton Bay. Bigger homes with pets and outdoor areas suit weekly or fortnightly cleans."],
      ["Bridgeman Downs", "4035", BCC, "Larger family homes on big blocks in a quieter acreage-style suburb. Big floor areas and multiple living spaces make a regular plan worthwhile."],
    ],
    Southside: [
      ["Mount Gravatt", "4122", BCC, "Post-war homes, townhouses and units near the university and shopping centre. Rentals are common, so bond cleans are a frequent request here."],
      ["Sunnybank", "4109", BCC, "Established brick family homes and townhouses. Busy kitchens get extra attention – rangehoods, splashbacks and stovetops collect grease quickly."],
      ["Holland Park", "4121", BCC, "Post-war houses and renovated Queenslanders on hilly streets. Timber floors and older bathrooms benefit from a careful deep clean before regular visits."],
      ["Coorparoo", "4151", BCC, "Character homes and a growing number of apartments near the shopping precinct. A good mix of quick unit cleans and larger family homes."],
      ["Annerley", "4103", BCC, "Queenslanders, workers' cottages and blocks of units close to the city. Older homes often have timber floors and VJ walls that need gentle products."],
      ["Greenslopes", "4120", BCC, "Character houses and low-rise unit blocks on hilly streets. Units suit fast regular cleans; older homes need more dusting time."],
      ["Moorooka", "4105", BCC, "Post-war homes and renovated cottages, plus new townhouses. Renovated homes often have stone benchtops and modern bathrooms that need streak-free care."],
      ["Carina", "4152", BCC, "Post-war houses, townhouses and newer homes on subdivided blocks. A popular area for families and renters alike."],
      ["Eight Mile Plains", "4113", BCC, "Modern brick homes, townhouses and estates close to the M1. Larger open-plan homes with multiple bathrooms suit a fortnightly plan."],
      ["Calamvale", "4116", BCC, "Newer family homes and townhouse estates. Open-plan living and tiled floors make regular mopping and kitchen care the priority."],
    ],
    "East & Bayside": [
      ["Bulimba", "4171", BCC, "Queenslanders, renovated cottages and riverside apartments near Oxford Street. Character homes with timber floors and high ceilings need careful dusting."],
      ["Hawthorne", "4171", BCC, "Renovated Queenslanders and prestige riverside homes. Large glass, stone and timber finishes are the focus for a polished result."],
      ["Camp Hill", "4152", BCC, "Character Queenslanders and post-war homes on leafy, hilly streets. Large family homes suit a fortnightly clean with a deep clean to start."],
      ["Carindale", "4152", BCC, "Larger brick family homes and townhouses around the shopping centre. Multiple bathrooms and living areas make a regular plan good value."],
      ["Wynnum", "4178", BCC, "Bayside cottages, Queenslanders and newer units. Salt air from Moreton Bay leaves a film on windows and sliding doors."],
      ["Manly", "4179", BCC, "Bayside homes and apartments near the harbour. Salt spray, sand and outdoor living mean glass, tracks and floors need regular attention."],
      ["Morningside", "4170", BCC, "Queenslanders, post-war houses and new townhouses. A mix of character and modern homes, each needing different floor care."],
      ["Cannon Hill", "4170", BCC, "Post-war homes and newer townhouses near the shopping centre. Busy family homes suit fortnightly cleans."],
    ],
    West: [
      ["Paddington", "4064", BCC, "Hillside workers' cottages and Queenslanders, many with stairs and steep driveways. Timber floors and VJ walls need gentle products and careful dusting."],
      ["Red Hill", "4059", BCC, "Character cottages and Queenslanders on steep streets. Older homes collect dust on fretwork and high ceilings."],
      ["Ashgrove", "4060", BCC, "Leafy streets of Queenslanders and post-war family homes. Big family homes with outdoor living suit a fortnightly plan."],
      ["Bardon", "4065", BCC, "Hillside family homes and renovated Queenslanders near the mountain. Leafy surroundings mean more leaf litter and dust tracked inside."],
      ["Toowong", "4066", BCC, "Apartments and townhouses close to the university and the city, plus character homes on the hills. Rentals are common, so bond cleans are often needed."],
      ["Indooroopilly", "4068", BCC, "Units, townhouses and established family homes near the shopping centre. A wide mix of home sizes, from quick unit cleans to large houses."],
      ["Kenmore", "4069", BCC, "Leafy family homes on larger blocks. Larger homes with pets and outdoor areas suit a weekly or fortnightly plan."],
      ["Chapel Hill", "4069", BCC, "Larger family homes on hillside blocks surrounded by bushland. Multiple living areas and big windows make regular cleaning worthwhile."],
      ["St Lucia", "4067", BCC, "Character homes and apartments near the university, with many rentals. Bond cleans around semester changes are a common request."],
      ["Graceville", "4075", BCC, "Queenslanders and family homes on quiet riverside streets. Timber floors and older bathrooms need the right products."],
    ],
  },
  logan: {
    "North Logan": [
      ["Springwood", "4127", LCC, "Established family homes, townhouses and units close to the motorway. Busy households here suit a fortnightly clean."],
      ["Daisy Hill", "4127", LCC, "Larger family homes on bushy, sloping blocks near the forest. Leafy surroundings mean more dust and leaf litter tracked inside."],
      ["Shailer Park", "4128", LCC, "Larger brick family homes on generous blocks. Multiple bathrooms and living areas make a regular plan good value."],
      ["Rochedale South", "4123", LCC, "Established low-set brick homes on quiet streets. Tiled floors and family kitchens are the main focus."],
      ["Slacks Creek", "4127", LCC, "Affordable family homes and units, with plenty of rentals. Bond cleans are a common request."],
      ["Underwood", "4119", LCC, "A mix of family homes and townhouses close to busy shopping strips. Townhouses suit a quick, regular clean."],
      ["Kingston", "4114", LCC, "Family homes and units with a mix of owners and renters. A good area for both regular and bond cleaning."],
    ],
    "Central Logan": [
      ["Logan Central", "4114", LCC, "Units, townhouses and family homes close to transport and services. Smaller homes suit an efficient fortnightly clean."],
      ["Woodridge", "4114", LCC, "Family homes, townhouses and units, with many rentals. Bond cleans and regular cleans are both common."],
      ["Browns Plains", "4118", LCC, "Established family homes and townhouses around the shopping centre. Open-plan living and tiled floors suit regular mopping."],
      ["Marsden", "4132", LCC, "Newer family homes and estates. Busy households with kids and pets often choose weekly or fortnightly visits."],
      ["Crestmead", "4132", LCC, "Family homes in established estates. Larger households benefit from a regular plan focused on kitchens and bathrooms."],
      ["Regents Park", "4118", LCC, "Brick family homes on quiet suburban streets. Pets and outdoor areas mean extra floor and door-track attention."],
      ["Meadowbrook", "4131", LCC, "Family homes and student accommodation near the university and hospital. Rentals make bond cleans a regular request."],
      ["Loganholme", "4129", LCC, "Established family homes and townhouses near the Logan River and shopping centre. Larger homes suit a fortnightly plan."],
    ],
    "South & growth areas": [
      ["Beenleigh", "4207", LCC, "Older Queenslanders and post-war homes alongside newer estates. A good mix of character homes and modern builds."],
      ["Eagleby", "4207", LCC, "Family homes on suburban blocks near the river. Pets and outdoor areas mean extra attention to floors and sliding doors."],
      ["Bethania", "4205", LCC, "Quiet residential streets of family homes. Regular fortnightly cleans keep busy family homes on track."],
      ["Waterford", "4133", LCC, "Established and newer family homes near the Logan River. Larger homes with multiple bathrooms suit a regular plan."],
      ["Park Ridge", "4125", LCC, "Rapidly growing estates with many brand-new homes. Builder's dust in tracks and cupboards makes a detailed clean the right first step."],
      ["Jimboomba", "4280", LCC, "Acreage and semi-rural family homes. Larger properties, dust and pets mean longer cleans – tell us the size of the home."],
      ["Yarrabilba", "4207", LCC, "A master-planned community with many new homes. New builds collect fine construction dust for weeks after handover."],
      ["Flagstone", "4280", LCC, "A growing master-planned area of new family homes. Move-in cleans and regular fortnightly cleans are both popular."],
    ],
  },
  "gold-coast": {
    "Northern Gold Coast": [
      ["Ormeau", "4208", GC, "Newer family homes and estates between Brisbane and the Gold Coast. Open-plan homes with tiled floors suit a fortnightly plan."],
      ["Pimpama", "4209", GC, "One of the fastest-growing areas on the Coast, with many brand-new homes. New builds need a detailed first clean to remove builder's dust."],
      ["Coomera", "4209", GC, "New estates and family homes near the theme parks and train line. Busy family homes suit weekly or fortnightly cleans."],
      ["Upper Coomera", "4209", GC, "Family homes in established estates on hilly streets. Larger homes with multiple living areas make a regular plan good value."],
      ["Oxenford", "4210", GC, "Family homes and acreage properties near the Coomera River. Larger homes and outdoor living mean more floor time."],
      ["Helensvale", "4212", GC, "Established family homes, canal-front homes and townhouses. Waterfront homes see humidity and outdoor living – glass and tracks need attention."],
      ["Hope Island", "4212", GC, "Canal and golf-course homes, many large and prestige. Stone, glass and high-end finishes need the right products – tell us your surfaces."],
      ["Sanctuary Cove", "4212", GC, "Prestige homes and apartments in a gated, resort-style community. Gate access arrangements are confirmed when we book."],
    ],
    "Central Gold Coast": [
      ["Southport", "4215", GC, "Apartments, older houses and townhouses around the CBD and Broadwater. A big rental market makes bond cleans common."],
      ["Labrador", "4215", GC, "Broadwater apartments and older houses. Salt air and sea breezes leave a film on glass and balcony doors."],
      ["Runaway Bay", "4216", GC, "Canal homes and Broadwater apartments. Waterside living means humidity, salt and sand to keep on top of."],
      ["Biggera Waters", "4216", GC, "Apartments and canal homes on the Broadwater. Balcony glass and sliding doors are the focus for coastal cleans."],
      ["Main Beach", "4217", GC, "Beachfront apartments and prestige towers. Building access, parking and lift bookings are planned before every clean."],
      ["Surfers Paradise", "4217", GC, "High-rise apartments and holiday units. Sand, salt and floor-to-ceiling glass are the main cleaning challenges."],
      ["Broadbeach", "4218", GC, "Beachside apartments, towers and canal homes. Tell us about building access and parking when you request a quote."],
      ["Mermaid Beach", "4218", GC, "Beach houses, new luxury homes and low-rise units. Sand tracked in from the beach means more floor and track cleaning."],
      ["Benowa", "4217", GC, "Established family homes and canal-front properties. Larger homes with pools and outdoor living suit a regular plan."],
      ["Ashmore", "4214", GC, "Established family homes and townhouses on quiet streets. A great area for fortnightly family cleans."],
    ],
    "Hinterland edge": [
      ["Nerang", "4211", GC, "Older houses, new estates and acreage at the foot of the hinterland. Larger homes and leafy blocks mean more dust and leaf litter."],
      ["Carrara", "4211", GC, "Family homes and townhouses near the stadium and river. Open-plan living suits regular fortnightly cleans."],
      ["Highland Park", "4211", GC, "Family homes on hilly, leafy blocks. Split-level homes and stairs are factored into each clean."],
      ["Mudgeeraba", "4213", GC, "A village-style suburb of family homes and acreage. Larger homes and pets suit weekly or fortnightly visits."],
      ["Worongary", "4213", GC, "Acreage and larger family homes in a semi-rural setting. Big homes with outdoor areas need longer cleans – tell us the size."],
    ],
    "Southern Gold Coast": [
      ["Robina", "4226", GC, "Planned family suburbs, lakeside homes and townhouses around the town centre. Busy family homes suit a fortnightly plan."],
      ["Varsity Lakes", "4227", GC, "Lakeside homes, townhouses and apartments near Bond University. Plenty of rentals make bond cleans a common request."],
      ["Burleigh Heads", "4220", GC, "Beach houses, renovated homes and apartments near the headland. Sand and salt air mean extra floor and glass attention."],
      ["Burleigh Waters", "4220", GC, "Canal and lakeside family homes. Humid, waterside living means bathrooms and sliding doors need regular care."],
      ["Miami", "4220", GC, "Beach houses, older units and new builds between the highway and the beach. Sand tracked in from the beach is a constant."],
      ["Palm Beach", "4221", GC, "Beach houses, new luxury homes and low-rise apartments. Salt film on glass and sand in tracks are the coastal basics."],
      ["Elanora", "4221", GC, "Established family homes on leafy streets near the creek. Family homes with pets suit a fortnightly clean."],
      ["Currumbin", "4223", GC, "Beach houses and family homes between the creek and the ocean. Salt air and outdoor living mean glass and floors need attention."],
      ["Tugun", "4224", GC, "Beachside cottages, units and new homes close to the airport. Sand and salt air are the main cleaning challenges."],
      ["Coolangatta", "4225", GC, "Beachfront apartments and holiday units on the Queensland side of the border. Building access and sand are planned for each clean."],
    ],
  },
  "tweed-heads": {
    "Tweed Heads & surrounds": [
      ["Tweed Heads", "2485", TSC, "Apartments, older houses and units on the NSW side of the border, next to Coolangatta. Bookings are confirmed in NSW time during daylight saving."],
      ["Tweed Heads West", "2485", TSC, "Canal and riverside family homes. Waterside living brings humidity – bathrooms, glass and sliding doors need regular care."],
      ["Tweed Heads South", "2486", TSC, "Family homes, townhouses and over-55s living near the shopping precinct. Regular, consistent cleans suit retirees and busy families alike."],
      ["Banora Point", "2486", TSC, "Established family homes, many with canal or river views. Larger homes suit a fortnightly plan."],
      ["Terranora", "2486", TSC, "Hillside family homes with views over the Terranora Broadwater. Large windows and outdoor living areas are the focus."],
      ["Bilambil Heights", "2486", TSC, "Family homes and acreage on the hills west of Tweed Heads. Larger properties need longer cleans – tell us the size of the home."],
      ["Fingal Head", "2487", TSC, "A small coastal village of beach homes. Sand and salt air mean glass, tracks and floors get extra attention."],
      ["Chinderah", "2487", TSC, "Riverside homes and newer developments along the Tweed River. Humidity and outdoor living mean bathrooms and glass need care."],
    ],
  },
};

export const slugify = (s: string) => s.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export const suburbs: Suburb[] = Object.entries(data).flatMap(([area, groups]) =>
  Object.entries(groups).flatMap(([group, rows]) =>
    rows.map(([name, postcode, council, note]) => ({ slug: slugify(name), name, postcode, council, area: area as Area["slug"], group, note })),
  ),
);

export function getSuburb(area: string, slug: string) {
  return suburbs.find((s) => s.area === area && s.slug === slug);
}

export function suburbsIn(area: string) {
  return suburbs.filter((s) => s.area === area);
}

export function areaFor(s: Suburb) {
  return areas.find((a) => a.slug === s.area)!;
}

/** Nearby suburbs: same group first, then others in the same area. */
export function nearby(s: Suburb, n = 8) {
  const same = suburbs.filter((o) => o.area === s.area && o.group === s.group && o.slug !== s.slug);
  const rest = suburbs.filter((o) => o.area === s.area && o.group !== s.group);
  return [...same, ...rest].slice(0, n);
}

export const suburbPath = (s: Suburb) => `/areas/${s.area}/${s.slug}`;
export const stateName = (st: "QLD" | "NSW") => (st === "QLD" ? "Queensland" : "New South Wales");
