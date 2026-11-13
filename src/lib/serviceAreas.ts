import type { Faq } from "./services";
import { suburbsIn, type Suburb } from "./suburbs";
import { profilesFor, type ProfileKey } from "./localProfiles";

/*
 * Service × area landing pages: /services/<service>/<area>.
 * Each targets the "hire" search for one service in one area ("bond cleaning Brisbane").
 * Content is written per combination – local, practical and factual. Prices are NOT repeated
 * here (they live in the area price/bond guides, which these pages link to), so the two never
 * compete for the same search. Titles are generated (≤ 60 chars); descriptions are 110–160 chars.
 */

export type ServiceArea = {
  description: string;
  intro: string;
  notes: { title: string; body: string }[];
  faqs: Faq[];
};

/** Search-style label used in titles and H1s, e.g. "Bond Cleaning" → "Bond Cleaning Brisbane". */
export const titleLabel: Record<string, string> = {
  "regular-house-cleaning": "Regular Home Cleaning",
  "deep-cleaning": "Deep Cleaning",
  "ndis-cleaning": "NDIS Cleaning",
  "bond-cleaning": "Bond Cleaning",
  "airbnb-cleaning": "Airbnb Cleaning",
  "carpet-cleaning": "Carpet Steam Cleaning",
  "commercial-cleaning": "Commercial Cleaning",
};

/** Short anchor text for suburb links, e.g. "Bond cleaning in Woodridge". */
export const anchorLabel: Record<string, string> = {
  "regular-house-cleaning": "House cleaning", "deep-cleaning": "Deep cleaning", "ndis-cleaning": "NDIS cleaning",
  "bond-cleaning": "Bond cleaning", "airbnb-cleaning": "Airbnb cleaning", "carpet-cleaning": "Carpet cleaning", "commercial-cleaning": "Office cleaning",
};

/** Which local home types make a suburb most relevant to each service (from each suburb's housing note). */
const serviceFit: Record<string, ProfileKey[]> = {
  "regular-house-cleaning": ["family", "acreage", "leafy", "hillside"],
  "deep-cleaning": ["newbuild", "character", "prestige", "waterside"],
  "ndis-cleaning": ["seniors", "family"],
  "bond-cleaning": ["rentals", "apartment"],
  "airbnb-cleaning": ["coastal", "apartment", "waterside"],
  "carpet-cleaning": ["rentals", "family", "acreage"],
  "commercial-cleaning": ["apartment", "rentals"],
};

/** The suburbs in an area where a service is the best fit, most relevant first. */
export function topSuburbs(service: string, area: string, n = 5): Suburb[] {
  const fit = serviceFit[service] ?? [];
  return suburbsIn(area)
    .map((x, i) => ({ x, i, score: profilesFor(x).filter((k) => fit.includes(k)).length }))
    .sort((p, q) => q.score - p.score || p.i - q.i)
    .slice(0, n)
    .map((p) => p.x);
}

export const serviceAreaPath = (service: string, area: string) => `/services/${service}/${area}`;

export const serviceAreas: Record<string, Record<string, ServiceArea>> = {
  "regular-house-cleaning": {
    brisbane: {
      description: "Weekly, fortnightly or monthly home cleaning across Brisbane – inner-city units to Queenslanders and family homes. Same checklist every visit, no lock-in.",
      intro: "Brisbane homes range from inner-city apartments to timber Queenslanders and big northside and southside family homes – and each needs a different routine. A regular clean from Swept follows a written, room-by-room checklist built around your home, weekly, fortnightly or monthly.",
      notes: [
        { title: "Queenslanders and timber floors", body: "Character homes in suburbs like Paddington, Red Hill and New Farm often have polished hardwood, VJ walls and high ceilings. We use timber-safe products, damp (not wet) mopping and reach the fans and fretwork that collect dust." },
        { title: "Summer humidity", body: "Brisbane's humid wet season means shower grout, silicone and window tracks need steady attention. A fortnightly clean keeps mildew from taking hold between visits." },
        { title: "Apartments and access", body: "For CBD, South Brisbane and Newstead units, tell us about parking, lifts and keys once – we keep it on your file so every visit starts on time." },
      ],
      faqs: [
        { q: "How often should I book a cleaner in Brisbane?", a: "Most Brisbane households choose fortnightly. Weekly suits busy homes with kids or pets, and monthly suits smaller, tidy homes. You can change frequency at any time – there's no lock-in." },
        { q: "Do you clean Queenslanders and older timber homes?", a: "Yes. We use timber-safe products on polished floors, take care with older fittings and allow extra time for high ceilings, fans and fretwork." },
        { q: "Which Brisbane suburbs do you visit regularly?", a: "All of our listed Brisbane suburbs – inner city, northside, southside, east and bayside, and the west. If yours isn't listed, ask and we'll confirm." },
      ],
    },
    logan: {
      description: "Regular house cleaning across Logan – big family homes, new estates and townhouses. Weekly, fortnightly or monthly visits on a written checklist. No lock-in.",
      intro: "Many Logan homes are bigger family homes – four bedrooms, two bathrooms, a separate living room and often a dog. A regular Swept clean keeps the busiest rooms under control on a schedule that suits you, from Springwood and Shailer Park to Park Ridge and Yarrabilba.",
      notes: [
        { title: "Larger family homes", body: "Extra bathrooms, an ensuite and a media room all add time. We plan each visit around your floor plan so the whole home is covered, not just the rooms we reach first." },
        { title: "Pets and outdoor living", body: "Dog hair, paw prints on sliding doors and dirt tracked in from big backyards are common in Logan. Tell us about pets and we'll allow extra vacuuming and floor time." },
        { title: "New estates", body: "In growth areas like Yarrabilba, Flagstone and Park Ridge, builder's dust keeps appearing for weeks. A detailed first clean, then fortnightly visits, keeps a new home looking new." },
      ],
      faqs: [
        { q: "Do you clean large family homes in Logan?", a: "Yes. Tell us your bedrooms, bathrooms and living areas and we'll allow the right amount of time, so the whole home is cleaned each visit." },
        { q: "Can you clean around kids and pets?", a: "Yes. We're used to busy family homes. Let us know if a pet needs to stay in a particular room and which areas matter most." },
        { q: "Do you travel to Jimboomba and the southern estates?", a: "Yes – Swept cleans across Logan, including Jimboomba, Yarrabilba, Flagstone and Park Ridge. Larger acreage homes may need a longer visit." },
      ],
    },
    "gold-coast": {
      description: "Regular home cleaning on the Gold Coast – beachside, canal and family homes. Weekly, fortnightly or monthly on a written checklist. No lock-in contract.",
      intro: "From beachside homes in Burleigh and Palm Beach to canal homes in Benowa and family estates in Coomera and Robina, Gold Coast homes deal with sand, salt and humidity. A regular Swept clean keeps on top of it with the same checklist every visit.",
      notes: [
        { title: "Sand and salt", body: "Close to the beach, sand builds up in sliding-door tracks and salt haze settles on glass. Tracks, sills and inside glass are part of every regular visit." },
        { title: "Canal and waterside humidity", body: "Homes on the Nerang River and Coomera River canals see more humidity – bathrooms, silicone and window frames get extra attention." },
        { title: "Northern growth corridor", body: "New homes in Pimpama, Coomera and Ormeau stay looking new with a fortnightly clean after an initial detailed clean to clear builder's dust." },
      ],
      faqs: [
        { q: "How often do Gold Coast homes need cleaning?", a: "Fortnightly suits most households. Homes close to the beach, or with pets and kids, often choose weekly because sand and dirt build up quickly." },
        { q: "Do you clean high-rise apartments?", a: "Yes. Tell us about building access, parking and lifts when you request a quote, and we'll keep it on file for every visit." },
        { q: "Which parts of the Gold Coast do you cover?", a: "From Ormeau and Coomera in the north to Coolangatta in the south, plus the hinterland edge from Nerang to Mudgeeraba." },
      ],
    },
    "tweed-heads": {
      description: "Regular home cleaning in Tweed Heads, Banora Point and surrounds. Weekly, fortnightly or monthly visits, booked in NSW time, on a written checklist.",
      intro: "Tweed homes range from units near the border to canal homes in Tweed Heads West and hillside homes in Terranora and Bilambil Heights. Swept's regular cleans follow a written checklist, and every booking is confirmed in NSW time.",
      notes: [
        { title: "Two time zones", body: "From October to April, NSW is an hour ahead of Queensland. We always confirm your clean in NSW time so there's no confusion." },
        { title: "Riverside humidity", body: "Homes on the Tweed River and Terranora Inlet see more humidity, so bathrooms, glass and window frames are a regular focus." },
        { title: "Over-55s and retirees", body: "Tweed Heads South and Banora Point have many retirees. A consistent, regular clean with the same checklist each visit makes life at home easier." },
      ],
      faqs: [
        { q: "Do you clean on both sides of the border?", a: "Yes – Tweed Heads and surrounds in NSW, and Coolangatta and the rest of the Gold Coast in Queensland." },
        { q: "What time zone is my booking in?", a: "NSW time. We confirm every Tweed booking in NSW time, which is an hour ahead of Queensland during daylight saving." },
        { q: "Which Tweed suburbs do you clean?", a: "Tweed Heads, Tweed Heads West, Tweed Heads South, Banora Point, Terranora, Bilambil Heights, Fingal Head and Chinderah." },
      ],
    },
  },
  "deep-cleaning": {
    brisbane: {
      description: "Deep and detailed home cleaning in Brisbane – a top-to-bottom reset for Queenslanders, apartments and family homes, before a regular plan or a sale.",
      intro: "A deep clean is a top-to-bottom reset – the first clean before a regular plan, a spring clean, or getting a Brisbane home ready to sell. It reaches the places a weekly clean doesn't: skirting boards, door frames, light fittings, fans and the build-up in bathrooms and kitchens.",
      notes: [
        { title: "Character homes", body: "Queenslanders collect dust on high ceilings, fretwork and VJ walls. A deep clean is the best way to bring an older timber home back to a fresh baseline." },
        { title: "Mould after the wet season", body: "After a humid summer, grout, silicone and window frames often need a proper clean. Tell us where you've noticed mould and we'll plan time for it." },
        { title: "Getting ready to sell", body: "Before photos or open homes, a deep clean of kitchens, bathrooms and floors makes the biggest difference to how a home presents." },
      ],
      faqs: [
        { q: "What's the difference between a deep clean and a regular clean?", a: "A regular clean maintains a home that's already clean. A deep clean resets it – including skirting boards, door frames, fans, light fittings and built-up grime in kitchens and bathrooms." },
        { q: "Should I book a deep clean before starting regular cleans?", a: "Usually, yes. It gets the home to a clean baseline so each regular visit is quicker and more consistent." },
        { q: "Can you deep clean before I sell my Brisbane home?", a: "Yes. Tell us your photo or open-home date and we'll focus on the kitchen, bathrooms and floors that buyers notice most." },
      ],
    },
    logan: {
      description: "Deep cleaning across Logan – new builds with builder's dust, big family homes and move-in cleans. A detailed top-to-bottom reset on a written checklist.",
      intro: "Logan's growth areas mean plenty of brand-new homes – and builder's dust that settles in tracks, cupboards and light fittings for weeks. A Swept deep clean removes it properly, and it's the right reset for a busy family home before a regular plan.",
      notes: [
        { title: "New-build handovers", body: "In Yarrabilba, Flagstone and Park Ridge, fine construction dust gets everywhere. We clean inside cupboards, tracks, sills and fittings so it stops coming back." },
        { title: "Family-home reset", body: "Big kitchens, several bathrooms and floors that see a lot of traffic all build up. A deep clean gets the whole home back to a fresh starting point." },
        { title: "Moving in", body: "Moving into a Logan rental or a home you've bought? A deep clean before your furniture arrives is the easiest time to do it." },
      ],
      faqs: [
        { q: "Do you clean new builds in Logan?", a: "Yes. We remove builder's dust from tracks, cupboards, sills and light fittings – book after the builder's final clean and before you move in, if you can." },
        { q: "How long does a deep clean take for a four-bedroom home?", a: "It depends on condition and bathrooms, but a deep clean of a larger family home usually takes most of a day. We'll tell you the expected time when we quote." },
        { q: "Can you deep clean before I move in?", a: "Yes – an empty home is the best time for a deep clean, because we can reach every cupboard and floor." },
      ],
    },
    "gold-coast": {
      description: "Deep cleaning on the Gold Coast – coastal homes, canal homes, apartments and new builds. A detailed top-to-bottom reset before a sale, move or regular plan.",
      intro: "Sand, salt and humidity build up in Gold Coast homes in ways a quick clean won't shift – in tracks, on glass and in bathrooms. A Swept deep clean resets the whole home, whether it's a beach house, a canal home or a new build in the northern corridor.",
      notes: [
        { title: "Coastal build-up", body: "Sliding-door tracks, window sills and outdoor-facing glass collect sand and salt film. A deep clean gets into the tracks and corners regular cleans can't fully reach." },
        { title: "Prestige finishes", body: "Hope Island, Sanctuary Cove and Benowa homes often have stone, glass and polished surfaces. We use the right product for each finish." },
        { title: "Between tenants or owners", body: "A deep clean is ideal between tenancies, after renovations or before a holiday home is listed." },
      ],
      faqs: [
        { q: "Do you deep clean beach houses?", a: "Yes. We focus on tracks, sills, glass and floors where sand and salt build up, as well as kitchens and bathrooms." },
        { q: "Can you clean stone benchtops and high-end finishes?", a: "Yes. We match products to the surface – stone, glass, polished timber and stainless steel. Let us know about any special finishes." },
        { q: "Do you clean after renovations?", a: "Yes, for renovation dust and grime. Builder's rubble and heavy construction waste need to be removed first." },
      ],
    },
    "tweed-heads": {
      description: "Deep cleaning in Tweed Heads and surrounds – riverside, coastal and hillside homes. A top-to-bottom reset before a regular plan, sale or move, in NSW time.",
      intro: "Tweed's riverside and coastal homes deal with humidity, sand and salt, while hillside homes in Terranora and Bilambil Heights tend to be larger. A Swept deep clean resets the whole home top to bottom, booked in NSW time.",
      notes: [
        { title: "Humidity and mould", body: "Riverside homes in Tweed Heads West and Chinderah are prone to mould in bathrooms, wardrobes and window frames. A deep clean tackles the build-up before regular cleans keep it away." },
        { title: "Coastal homes", body: "Fingal Head and Tweed Heads homes collect sand in tracks and salt on glass – both get a thorough clean." },
        { title: "Larger hillside homes", body: "Big windows and several living areas in Terranora homes need extra time, which we plan for when we quote." },
      ],
      faqs: [
        { q: "Do you deep clean in Tweed Heads?", a: "Yes – across Tweed Heads, Banora Point, Terranora, Bilambil Heights, Fingal Head, Chinderah and surrounds." },
        { q: "Can you remove mould during a deep clean?", a: "We clean surface mould on grout, silicone and window frames. If mould keeps returning because of a leak or poor ventilation, that's a repair for the owner." },
        { q: "Is a deep clean booked in NSW or Queensland time?", a: "NSW time – we confirm every Tweed booking in NSW time." },
      ],
    },
  },
  "ndis-cleaning": {
    brisbane: {
      description: "NDIS and home care cleaning in Brisbane, tailored to the person – consistent cleaners, a written checklist and routines respected. Self- or plan-managed.",
      intro: "Home cleaning is about more than a tidy house when it's part of an NDIS plan or support at home. Swept offers consistent, respectful cleaning across Brisbane that works around routines, preferences and the way you like things kept.",
      notes: [
        { title: "Consistency matters", body: "The same written checklist every visit, and changes only when you ask. We note preferences once – where things go, which products to use, what to leave alone." },
        { title: "Apartments and accessible homes", body: "From inner-city apartments to single-level homes on the southside, we plan around access, mobility equipment and parking." },
        { title: "Plan management", body: "Swept is not a registered NDIS provider, so we suit self-managed and plan-managed participants. We can invoice your plan manager directly." },
      ],
      faqs: [
        { q: "Can I use my NDIS plan for cleaning in Brisbane?", a: "Household tasks can be funded when they're in your plan. Swept is not NDIS-registered, so this usually suits self-managed or plan-managed participants – check with your plan manager." },
        { q: "Will I have the same cleaner?", a: "We aim for consistency and follow the same written checklist every visit, so your home is cleaned the way you like it." },
        { q: "Can you work around my routine?", a: "Yes. Tell us the times that suit, any areas to avoid and anything that helps you feel comfortable, and we'll plan around it." },
      ],
    },
    logan: {
      description: "NDIS and home care cleaning across Logan – consistent, respectful home cleaning on a written checklist for self-managed and plan-managed participants.",
      intro: "Logan families and NDIS participants often need cleaning that fits around therapy, school runs and care routines. Swept's NDIS and home care cleaning is consistent, flexible and built around the person, not a script.",
      notes: [
        { title: "Family homes", body: "Many participants in Logan live in busy family homes. We focus on the rooms that matter most to daily routines – kitchens, bathrooms and living areas." },
        { title: "Near Logan Hospital", body: "We clean right across Logan, including Meadowbrook and the suburbs around Logan Hospital and Griffith University's Logan campus." },
        { title: "Plan-managed invoicing", body: "Swept is not a registered NDIS provider. For self-managed and plan-managed participants, we can invoice you or your plan manager." },
      ],
      faqs: [
        { q: "Do you offer NDIS cleaning in Logan?", a: "Yes – across Logan, from Springwood and Shailer Park to Beenleigh, Jimboomba and the southern estates. Swept is not NDIS-registered, so it usually suits self- or plan-managed participants." },
        { q: "Can you clean around therapy and school routines?", a: "Yes. Tell us the times that work and we'll book around them, keeping the same day where possible." },
        { q: "Can a family member arrange the cleaning?", a: "Yes. A family member, carer or support coordinator can request the quote and be the main contact." },
      ],
    },
    "gold-coast": {
      description: "NDIS and home care cleaning on the Gold Coast – respectful, consistent home cleaning for participants and older residents, tailored to routines.",
      intro: "From apartments in Southport to family homes in Robina and retirees along the southern Gold Coast, Swept's NDIS and home care cleaning is built around the person – their routines, preferences and what helps them stay comfortable at home.",
      notes: [
        { title: "Apartments and lifts", body: "Many Gold Coast participants live in apartments. We plan around building access, lifts and parking so visits run smoothly." },
        { title: "Older residents", body: "Along the southern Gold Coast many older residents want help to stay independent at home. A consistent regular clean makes that easier." },
        { title: "Self- and plan-managed", body: "Swept is not NDIS-registered, so we suit self-managed and plan-managed participants – check with your plan manager." },
      ],
      faqs: [
        { q: "Do you provide NDIS cleaning on the Gold Coast?", a: "Yes – from Ormeau to Coolangatta. Swept is not NDIS-registered, so it usually suits self-managed or plan-managed participants." },
        { q: "Can you clean apartments in Southport and Surfers Paradise?", a: "Yes. Let us know about building access and parking, and any routines or preferences we should follow." },
        { q: "Can you help older residents who aren't on the NDIS?", a: "Yes. Our home care cleaning suits anyone who needs consistent, respectful help at home, funded or private." },
      ],
    },
    "tweed-heads": {
      description: "NDIS and home care cleaning in Tweed Heads and surrounds – consistent, respectful cleaning for participants and retirees, booked in NSW time.",
      intro: "Tweed Heads South and Banora Point are home to many retirees and older residents, and Swept's home care cleaning helps them stay comfortable at home. NDIS participants get the same consistent, tailored approach – booked in NSW time.",
      notes: [
        { title: "Retirees and over-55s", body: "Consistent visits on the same checklist, and cleaners who respect how you like your home kept." },
        { title: "The NDIS is national", body: "NDIS funding works the same in NSW as in Queensland. Swept is not NDIS-registered, so we suit self-managed and plan-managed participants." },
        { title: "NSW time", body: "Every booking is confirmed in NSW time, an hour ahead of Queensland during daylight saving." },
      ],
      faqs: [
        { q: "Do you offer NDIS cleaning in Tweed Heads?", a: "Yes. Swept is not NDIS-registered, so it usually suits self-managed or plan-managed participants – check with your plan manager." },
        { q: "Do you help retirees in Tweed Heads South and Banora Point?", a: "Yes. Our home care cleaning suits retirees and older residents who want consistent, reliable help at home." },
        { q: "Can a family member arrange the cleaning?", a: "Yes. A family member, carer or support coordinator can request the quote and be the main contact." },
      ],
    },
  },
  "bond-cleaning": {
    brisbane: {
      description: "Bond cleaning in Brisbane, done room by room against your RTA entry condition report (Form 1a). For units, Queenslanders and family homes.",
      intro: "When you move out of a Brisbane rental, your property manager compares the home with your entry condition report (Form 1a). Swept's bond clean works through that report room by room – kitchen, bathrooms, wardrobes, skirting boards, tracks and more – so you hand back the keys with confidence.",
      notes: [
        { title: "Student and inner-city rentals", body: "Bond cleans peak around semester changes near UQ in St Lucia and Toowong, and at end-of-month in inner-city units. Book as soon as you know your vacate date." },
        { title: "Mould and humidity", body: "Brisbane's humid summers leave mould on grout and silicone – one of the most common bond issues. We give bathrooms extra time." },
        { title: "Carpets", body: "In Queensland, carpets generally need to match their condition at the start of the tenancy. Add carpet steam cleaning if your lease or pet approval requires it." },
      ],
      faqs: [
        { q: "Do you clean against my RTA condition report?", a: "Yes. Send your entry condition report (Form 1a) with your quote request and we'll clean the property room by room against it." },
        { q: "How much does a bond clean cost in Brisbane?", a: "It depends on size, condition and carpets. Our Brisbane bond cleaning cost guide has 2026 price ranges by home size, and we'll send you a fixed written quote." },
        { q: "Can you clean after the removalists the same day?", a: "Often, depending on availability. Book early – end-of-month dates in Brisbane fill quickly." },
      ],
    },
    logan: {
      description: "Bond cleaning across Logan – large family homes, townhouses and units, cleaned against your RTA Form 1a. Pets and carpets planned in. Fixed written quote.",
      intro: "Logan has plenty of rentals, and many are big homes with several bathrooms, a family kitchen and a backyard dog. Swept's bond clean is planned around your entry condition report (Form 1a), so every room your property manager checks is covered.",
      notes: [
        { title: "Bigger homes, more bathrooms", body: "Four-bedroom estate homes in Marsden, Crestmead and Park Ridge often have an ensuite, a main bathroom and a separate toilet – each scrubbed in full." },
        { title: "Pets", body: "If you kept a pet, your approval may require professional carpet cleaning at the end. Add carpet steam cleaning and keep the receipt." },
        { title: "Rental hotspots", body: "Woodridge, Slacks Creek, Kingston and Logan Central have lots of rentals – book as soon as you know your vacate date." },
      ],
      faqs: [
        { q: "Do you do bond cleans for large homes in Logan?", a: "Yes. We plan the time around bedrooms, bathrooms, living areas and storeys, and quote a fixed price." },
        { q: "What does a bond clean cost in Logan?", a: "It depends on size, condition, pets and carpets. Our Logan bond cleaning cost guide has 2026 ranges, and we'll send a fixed written quote." },
        { q: "Do I need carpet cleaning for my Logan bond?", a: "Not automatically. In Queensland carpets should match their condition at the start; a pet approval can require professional cleaning. Check your lease." },
      ],
    },
    "gold-coast": {
      description: "Bond cleaning on the Gold Coast – apartments, beach houses and family homes, cleaned against your RTA entry report. Sand, salt and building access covered.",
      intro: "Gold Coast bond cleans range from high-rise units in Surfers Paradise and Broadbeach to family homes in Robina and Coomera. Swept cleans against your entry condition report (Form 1a), with extra attention to the sand, salt and humidity the coast is known for.",
      notes: [
        { title: "Apartment access", body: "For towers in Surfers Paradise, Broadbeach and Main Beach, tell us about lift bookings, parking and key collection so the clean starts on time." },
        { title: "Sand in every track", body: "Property managers check sliding-door tracks and window sills. We vacuum and wipe every track and sill." },
        { title: "Student rentals", body: "Near Bond University in Robina and Varsity Lakes, and Griffith University in Southport, bond cleans peak around the end of semester." },
      ],
      faqs: [
        { q: "Do you bond clean high-rise apartments?", a: "Yes. Tell us about building access, lifts and parking when you request a quote." },
        { q: "How much is a bond clean on the Gold Coast?", a: "It depends on size, condition and carpets. Our Gold Coast bond cleaning cost guide has 2026 ranges by bedroom, and we'll send a fixed written quote." },
        { q: "Do you clean against my RTA report?", a: "Yes. Send your entry condition report (Form 1a) with your quote request and we'll clean room by room against it." },
      ],
    },
    "tweed-heads": {
      description: "Bond cleaning in Tweed Heads under NSW rules – cleaned against your condition report, with bonds held by NSW Fair Trading. Booked in NSW time.",
      intro: "Tweed Heads is in NSW, so your bond is held by NSW Fair Trading and the benchmark is the condition report you signed at the start of your lease – not Queensland's RTA forms. Swept cleans the property room by room against that report, booked in NSW time.",
      notes: [
        { title: "NSW carpet rules", body: "In NSW, a lease generally can't require professional carpet cleaning at the end, except where it relates to keeping a pet. Check your agreement before you pay for it." },
        { title: "Bond disputes go to NCAT", body: "If your landlord claims part of the bond, you generally have 14 days to apply to NCAT. A thorough clean and dated photos protect you." },
        { title: "Coastal and riverside homes", body: "Sand in tracks and mould in humid riverside homes are common Tweed bond issues – both get extra time." },
      ],
      faqs: [
        { q: "Do NSW or Queensland bond rules apply in Tweed Heads?", a: "NSW rules. Your bond is held by NSW Fair Trading through Rental Bonds Online, and disputes go to NCAT." },
        { q: "How much does a bond clean cost in Tweed Heads?", a: "It depends on size, condition and carpets. Our Tweed Heads bond cleaning cost guide has 2026 ranges, and we'll send a fixed written quote." },
        { q: "Do I have to get carpets professionally cleaned in NSW?", a: "Generally no – a NSW lease generally can't require it, except in relation to pets. You do need to leave carpets reasonably clean." },
      ],
    },
  },
  "airbnb-cleaning": {
    brisbane: {
      description: "Airbnb and short-stay cleaning in Brisbane – turnovers between guests for inner-city apartments and homes, with linen, restocking and damage reports.",
      intro: "Brisbane's short-stay market is centred on inner-city apartments near South Bank, the CBD, Fortitude Valley and Newstead, where guests expect hotel-standard turnovers. Swept handles the clean between check-out and check-in so your listing is always guest-ready.",
      notes: [
        { title: "Apartment turnovers", body: "We plan around building access, lift rules and parking – and keep it on file for every turnover." },
        { title: "Event weekends", body: "Concerts, sport and conferences create back-to-back bookings. Share your calendar and we'll schedule turnovers around it." },
        { title: "Guest-ready details", body: "Beds made, bathrooms spotless, supplies you provide restocked, and anything damaged or missing reported to you with photos." },
      ],
      faqs: [
        { q: "Do you clean Airbnb apartments in Brisbane's inner city?", a: "Yes – including the CBD, South Brisbane, Fortitude Valley, Newstead, Kangaroo Point and New Farm." },
        { q: "Can you handle same-day turnovers?", a: "Yes, when they're scheduled in advance. Share your booking calendar and check-out/check-in times so we can plan each turnover." },
        { q: "Do you report damage or missing items?", a: "Yes. We let you know straight away, with photos, so you can raise it with the guest or the platform." },
      ],
    },
    logan: {
      description: "Airbnb and short-stay cleaning in Logan – turnovers for homes and townhouses between Brisbane and the Gold Coast, with linen, restocking and reports.",
      intro: "Logan's short-stay market is smaller than the coast's, but its location between Brisbane and the Gold Coast suits travellers, visiting families and longer stays. Swept turns your property around between guests with the same checklist every time.",
      notes: [
        { title: "Whole-home stays", body: "Many Logan listings are whole family homes – several bedrooms to reset, beds to make and outdoor areas guests use." },
        { title: "Longer stays", body: "Mid-term guests often book for weeks. A mid-stay clean keeps the home in good condition and protects your reviews." },
        { title: "Simple coordination", body: "Share your calendar and access details once – we schedule turnovers and report anything that needs attention." },
      ],
      faqs: [
        { q: "Do you clean Airbnb homes in Logan?", a: "Yes – houses, townhouses and units across Logan, from Springwood and Loganholme to Beenleigh." },
        { q: "Can you do mid-stay cleans for longer bookings?", a: "Yes. Many hosts book a mid-stay clean for guests staying a week or more." },
        { q: "Do you restock supplies?", a: "Yes – we restock the supplies you provide and let you know when stock is running low." },
      ],
    },
    "gold-coast": {
      description: "Airbnb and holiday rental cleaning on the Gold Coast – fast turnovers for beachfront apartments and holiday homes, with sand, linen and reports covered.",
      intro: "The Gold Coast is one of Australia's busiest holiday-letting markets, from high-rise apartments in Surfers Paradise and Broadbeach to beach houses in Burleigh, Palm Beach and Coolangatta. Swept's turnovers get your property guest-ready between check-out and check-in.",
      notes: [
        { title: "Sand everywhere", body: "Beach guests bring sand into tracks, floors and bathrooms. Every turnover includes tracks, floors and outdoor-facing glass." },
        { title: "Peak-season turnovers", body: "School holidays and summer bring back-to-back bookings. Share your calendar and we'll schedule around tight check-out and check-in windows." },
        { title: "High-rise logistics", body: "We plan around lifts, loading docks, parking and key collection for tower apartments." },
      ],
      faqs: [
        { q: "Do you clean holiday apartments in Surfers Paradise and Broadbeach?", a: "Yes. Tell us about building access, parking and key collection, and we'll keep it on file for every turnover." },
        { q: "Can you handle back-to-back summer bookings?", a: "Yes, when they're scheduled. Share your booking calendar and we'll plan each turnover around check-out and check-in times." },
        { q: "Do you report damage between guests?", a: "Yes – with photos, straight away, so you can raise it with the guest or platform." },
      ],
    },
    "tweed-heads": {
      description: "Airbnb and holiday rental cleaning in Tweed Heads and Fingal Head – turnovers between guests, booked in NSW time, with linen, restocking and reports.",
      intro: "Tweed's holiday rentals – from units near the border to beach homes at Fingal Head – need fast, consistent turnovers. Swept cleans between guests to the same checklist every time, with bookings confirmed in NSW time.",
      notes: [
        { title: "NSW short-term rental rules", body: "NSW requires short-term rental hosts to register their property on the NSW short-term rental accommodation register. Check your obligations with Tweed Shire Council and the NSW Government." },
        { title: "Check-in times across the border", body: "Guests often arrive from Queensland. We confirm turnovers in NSW time so check-out and check-in windows line up." },
        { title: "Beach and river", body: "Sand in tracks and humidity in bathrooms are covered in every turnover." },
      ],
      faqs: [
        { q: "Do you clean holiday rentals in Tweed Heads?", a: "Yes – across Tweed Heads, Fingal Head, Banora Point and surrounds." },
        { q: "Which time zone are turnovers booked in?", a: "NSW time, which is an hour ahead of Queensland during daylight saving." },
        { q: "Can you work with my booking calendar?", a: "Yes. Share your calendar and access details and we'll schedule turnovers around check-out and check-in." },
      ],
    },
  },
  "carpet-cleaning": {
    brisbane: {
      description: "Carpet steam cleaning in Brisbane – for bond cleans, pet homes and family carpets. Book on its own or with a bond or deep clean in the same visit.",
      intro: "Steam cleaning lifts the dirt, oils and odours vacuuming leaves behind. In Brisbane it's most often booked with a bond clean, for homes with pets, or before or after a busy family season – on its own or in the same visit as a deep clean.",
      notes: [
        { title: "Bond cleans", body: "In Queensland, carpets generally need to match their condition at the start of the tenancy. If they were professionally cleaned before you moved in, or your pet approval requires it, add steam cleaning." },
        { title: "Humidity and odours", body: "Brisbane's humid months can leave carpets smelling musty. Steam cleaning helps refresh them." },
        { title: "Bedrooms in mixed homes", body: "Many Brisbane homes have timber living areas and carpeted bedrooms – we quote by room, so you only pay for carpeted areas." },
      ],
      faqs: [
        { q: "Can you steam clean carpets as part of my bond clean?", a: "Yes. Add carpet steam cleaning to your bond clean and we'll do it in the same visit." },
        { q: "Do I need professional carpet cleaning to get my bond back in Queensland?", a: "Not automatically. Carpets should match their condition at the start of the tenancy; a pet approval or your lease may require it." },
        { q: "How is carpet cleaning priced?", a: "By the number of rooms, hallways and stairs. Tell us what's carpeted and we'll quote a fixed price." },
      ],
    },
    logan: {
      description: "Carpet steam cleaning across Logan – family homes, pet homes and bond cleans. Book on its own or add it to a bond or deep clean in the same visit.",
      intro: "Logan's big family homes often have carpeted bedrooms, hallways and media rooms that take a beating from kids and pets. Swept's carpet steam cleaning lifts the dirt and odours vacuuming leaves behind – on its own, or with a bond or deep clean.",
      notes: [
        { title: "Pets", body: "Pet hair and odours settle deep in carpet fibres. If your pet approval requires professional carpet cleaning at the end of a lease, add it to your bond clean." },
        { title: "Family traffic", body: "Hallways, media rooms and kids' bedrooms show wear first. A steam clean brings them back between deep cleans." },
        { title: "Same-visit bond cleans", body: "Combining carpets with your bond clean means one booking and one key handover." },
      ],
      faqs: [
        { q: "Do you steam clean carpets in pet homes?", a: "Yes. Let us know about pets so we can plan for hair and odours." },
        { q: "Can you add carpet cleaning to my Logan bond clean?", a: "Yes – it's done in the same visit." },
        { q: "How do you quote carpet cleaning?", a: "By rooms, hallways and stairs. Tell us what's carpeted and we'll quote a fixed price." },
      ],
    },
    "gold-coast": {
      description: "Carpet steam cleaning on the Gold Coast – sand, salt and humidity lifted from carpets in apartments, holiday homes and rentals. Add it to a bond clean.",
      intro: "Sand and salt work deep into Gold Coast carpets, and humidity can leave them musty. Swept's carpet steam cleaning refreshes carpeted bedrooms, apartments and holiday homes – on its own or added to a bond or deep clean.",
      notes: [
        { title: "Sand and grit", body: "Beach sand is abrasive and wears carpet fibres. Regular vacuuming plus a periodic steam clean keeps carpets lasting longer." },
        { title: "Holiday rentals", body: "Steam cleaning between seasons keeps holiday-let carpets fresh for guests." },
        { title: "Apartment bond cleans", body: "Many Gold Coast apartments have carpeted bedrooms. Add steam cleaning to your bond clean if your lease or pet approval needs it." },
      ],
      faqs: [
        { q: "Can you steam clean carpets in a Gold Coast apartment?", a: "Yes. Tell us about building access and parking when you request a quote." },
        { q: "Do holiday rentals need regular carpet cleaning?", a: "Many hosts book a steam clean between seasons or after heavy use, to keep carpets fresh for guests." },
        { q: "Can I add carpets to my bond clean?", a: "Yes – it's done in the same visit." },
      ],
    },
    "tweed-heads": {
      description: "Carpet steam cleaning in Tweed Heads and surrounds – on its own or with a bond clean. Check NSW rules before your lease ends; booked in NSW time.",
      intro: "Carpet steam cleaning in Tweed Heads is often booked when moving out – but NSW rules are different from Queensland's. Swept steam cleans carpets on their own or alongside a bond or deep clean, booked in NSW time.",
      notes: [
        { title: "Check NSW rules first", body: "In NSW, a lease generally can't require professional carpet cleaning at the end, except where it relates to keeping a pet. You need to leave carpets reasonably clean." },
        { title: "Humidity", body: "Riverside and coastal humidity can leave carpets musty. A steam clean helps freshen them." },
        { title: "Hillside homes", body: "Larger homes in Terranora and Bilambil Heights often have more carpeted rooms – we quote by room." },
      ],
      faqs: [
        { q: "Do I need carpet cleaning when I leave a NSW rental?", a: "Generally not unless it relates to a pet – check your agreement. You do need to leave carpets reasonably clean." },
        { q: "Can you add carpets to my Tweed bond clean?", a: "Yes – in the same visit, booked in NSW time." },
        { q: "How is carpet cleaning priced?", a: "By rooms, hallways and stairs. Tell us what's carpeted and we'll quote a fixed price." },
      ],
    },
  },
  "commercial-cleaning": {
    brisbane: {
      description: "Commercial and office cleaning in Brisbane – offices, studios, shops and consulting rooms, before or after hours, on a written checklist. No lock-in.",
      intro: "Swept cleans small and medium workplaces across Brisbane – offices, studios, shops and consulting rooms – on a schedule that suits your business. Every visit follows a written checklist, so standards stay consistent.",
      notes: [
        { title: "After-hours access", body: "Most offices prefer cleaning before or after business hours. We work with alarm codes, keys and building access arrangements." },
        { title: "Inner-city buildings", body: "For CBD, Fortitude Valley and Newstead tenancies, we plan around building management rules, loading docks and parking." },
        { title: "Consistent standards", body: "Kitchens, bathrooms, desks and floors cleaned to the same checklist every visit, with changes made when you ask." },
      ],
      faqs: [
        { q: "Do you clean offices in the Brisbane CBD?", a: "Yes, as well as Fortitude Valley, Newstead, South Brisbane and suburban offices." },
        { q: "Can you clean after hours?", a: "Yes. Tell us your preferred times and how access works, and we'll schedule around your business." },
        { q: "Do you provide a certificate of currency?", a: "Yes – Swept holds public liability insurance, and commercial clients can ask for a copy of our certificate of currency." },
      ],
    },
    logan: {
      description: "Commercial cleaning across Logan – offices, shops, clinics and small industrial premises, cleaned on a written checklist before or after hours.",
      intro: "Logan has busy commercial areas from Loganholme and Underwood to Slacks Creek, Crestmead and Logan Central. Swept cleans offices, shops, clinics and the office areas of small industrial premises on a schedule that suits your business.",
      notes: [
        { title: "Industrial offices", body: "We clean the office, kitchen and bathroom areas of warehouses and small industrial units in Crestmead, Slacks Creek and Loganholme." },
        { title: "Clinics and consulting rooms", body: "Waiting areas, bathrooms and touchpoints cleaned consistently, with a checklist you can see." },
        { title: "Flexible scheduling", body: "Daily, weekly or fortnightly, before or after hours, with no lock-in contract." },
      ],
      faqs: [
        { q: "Do you clean industrial premises in Logan?", a: "We clean the office, kitchen and bathroom areas of industrial units and warehouses. Specialised industrial cleaning isn't something we offer." },
        { q: "Can you clean clinics and consulting rooms?", a: "Yes – waiting areas, bathrooms, kitchens and touchpoints, on a written checklist." },
        { q: "Is there a lock-in contract?", a: "No. Commercial cleans run visit to visit, and you can change frequency when you need to." },
      ],
    },
    "gold-coast": {
      description: "Commercial and office cleaning on the Gold Coast – Southport, Robina and Varsity Lakes offices, shops and clinics, cleaned before or after hours.",
      intro: "The Gold Coast's business hubs – Southport's CBD, Robina, Varsity Lakes and Bundall – are full of offices, clinics and shops that need consistent cleaning. Swept works before or after hours on a written checklist, with no lock-in.",
      notes: [
        { title: "Office hubs", body: "We clean offices in Southport, Robina and Varsity Lakes, planning around building access and parking." },
        { title: "Retail and hospitality fronts", body: "Shop floors, glass shopfronts and customer bathrooms cleaned before you open." },
        { title: "Medical and allied health", body: "Clinics near Gold Coast University Hospital and across the Coast need consistent, careful cleaning of waiting areas and touchpoints." },
      ],
      faqs: [
        { q: "Do you clean offices in Southport and Robina?", a: "Yes, as well as Varsity Lakes, Bundall and suburban offices across the Gold Coast." },
        { q: "Can you clean before we open?", a: "Yes. Tell us your opening hours and how access works, and we'll schedule the clean around them." },
        { q: "Are you insured for commercial work?", a: "Yes – Swept holds public liability insurance, and we can provide a certificate of currency." },
      ],
    },
    "tweed-heads": {
      description: "Commercial cleaning in Tweed Heads – offices, shops and consulting rooms, cleaned before or after hours on a written checklist, in NSW time.",
      intro: "From offices and shops around Tweed Heads and Tweed City to consulting rooms in Tweed Heads South, Swept cleans small workplaces on a schedule that suits you – booked in NSW time.",
      notes: [
        { title: "Cross-border businesses", body: "Many Tweed businesses work across both states. We confirm every visit in NSW time to avoid daylight-saving mix-ups." },
        { title: "Consulting rooms", body: "Waiting areas, bathrooms and touchpoints cleaned consistently on a written checklist." },
        { title: "Shops", body: "Floors, glass and customer bathrooms cleaned before you open." },
      ],
      faqs: [
        { q: "Do you clean offices in Tweed Heads?", a: "Yes – offices, shops and consulting rooms across Tweed Heads, Tweed Heads South and Banora Point." },
        { q: "Which time zone are visits booked in?", a: "NSW time, an hour ahead of Queensland during daylight saving." },
        { q: "Can you provide a certificate of currency?", a: "Yes – Swept holds public liability insurance and can provide a copy for your records." },
      ],
    },
  },
};

export const getServiceArea = (service: string, area: string) => serviceAreas[service]?.[area];
