import type { Guide } from "@/lib/guides";
import { photos } from "@/lib/photos";

/*
 * Sources (checked November 2026):
 * - ACCC consumer rights and guarantees: services must be provided with due care and skill, fit for any
 *   specified purpose, and within a reasonable time.
 * - ABN Lookup (Australian Business Register): free check of whether an ABN is active, business type and GST status.
 * - AFP National Police Checks: a summary of a person's disclosable police history.
 * - NDIS: NDIA-managed plans must use registered providers; self- and plan-managed participants can usually
 *   choose unregistered providers (NDIS guide to working with providers).
 * - RTA Queensland bond refunds (entry condition report Form 1a); NSW bond disputes (Tweed).
 * No prices in this guide (owner hasn't asked). Swept facts come from site.ts and services.ts.
 */

export const guide: Guide = {
  slug: "questions-to-ask-before-hiring-a-house-cleaner",
  title: "Questions to Ask Before Hiring a House Cleaner",
  metaTitle: "Questions to Ask Before Hiring a Cleaner | Swept Cleaning",
  description:
    "The questions to ask before you hire a house cleaner – insurance, police checks, what's included, pricing, contracts and what happens if something's missed.",
  published: "2026-11-05",
  categories: ["Hiring a cleaner", "Regular cleaning"],
  image: photos.homeCare,
  services: ["regular-house-cleaning", "deep-cleaning", "bond-cleaning", "ndis-cleaning"],
  related: ["how-much-does-house-cleaning-cost-in-brisbane", "how-much-does-house-cleaning-cost-in-logan", "emergency-cleaning-services-how-quickly-can-you-help"],
  sources: [
    { title: "Consumer rights and guarantees", url: "https://www.accc.gov.au/consumers/buying-products-and-services/consumer-rights-and-guarantees", publisher: "ACCC" },
    { title: "ABN Lookup", url: "https://abr.business.gov.au/", publisher: "Australian Business Register" },
    { title: "National police checks", url: "https://afp.gov.au/services/national-police-checks", publisher: "Australian Federal Police" },
    { title: "Guide to working with providers", url: "https://ndis.gov.au/participants/working-providers/get-know-your-providers/guide-working-providers", publisher: "NDIS" },
    { title: "Bond refunds", url: "https://www.rta.qld.gov.au/renting/ending-a-tenancy/bond-refunds", publisher: "Residential Tenancies Authority (QLD)" },
    { title: "Dealing with bond disputes for tenants", url: "https://www.nsw.gov.au/housing-and-construction/renting-a-place-to-live/residential-rental-bonds/dealing-bond-disputes-for-tenants", publisher: "NSW Government" },
  ],
  body: [
    {
      type: "p",
      text: "Letting someone into your home to clean it is a big decision. The price matters, but it's rarely what makes or breaks the experience. What matters is whether they turn up when they say they will, clean to the same standard every time, look after your home, and fix things if they get something wrong. Ask the right questions before you book and you'll know which cleaner is going to deliver – and which one will leave you looking again in a month.",
    },
    {
      type: "tip",
      title: "The five questions that matter most",
      text: "1. **Are you insured, and are your cleaners police-checked?** 2. **Can I have a written quote and checklist?** 3. **Who will actually be cleaning my home?** 4. **Is there a lock-in contract?** 5. **What happens if something isn't done properly?** A good cleaning business will answer all five clearly, without hesitation.",
    },

    { type: "h2", text: "Trust and safety" },
    { type: "h3", text: "\"Do you have public liability insurance?\"" },
    {
      type: "p",
      text: "Accidents happen – a dropped vase, a scratched benchtop, water on a timber floor. Public liability insurance means there's cover in place if your property is damaged during a clean. Without it, you may be left to sort it out yourself. It's reasonable to ask for a copy of the business's certificate of currency, which proves the policy is current.",
    },
    { type: "h3", text: "\"Are your cleaners police-checked?\"" },
    {
      type: "p",
      text: "A national police check is a summary of a person's disclosable police history. It's one of the simplest ways to get peace of mind, especially if you'll be out while the cleaner is in your home. Ask whether every cleaner who could visit has a current check – not just the business owner.",
    },
    { type: "h3", text: "\"Who will be cleaning my home?\"" },
    {
      type: "p",
      text: "Find out whether cleaners are employed by the business or are contractors, whether you'll usually see the same person, and what happens when they're sick or on holiday. A business that can send a replacement means your clean doesn't quietly drop off the calendar.",
    },
    { type: "h3", text: "\"How do you look after keys and access?\"" },
    {
      type: "p",
      text: "If you'll be out, ask how keys, lockbox codes or alarm details are stored and who can see them. Ask too what happens if a cleaner can't get in on the day.",
    },
    { type: "h3", text: "\"What's your ABN?\"" },
    {
      type: "p",
      text: "A legitimate business will have an Australian Business Number. You can check it for free on [ABN Lookup](https://abr.business.gov.au/) to see that it's active and whether the business is registered for GST. It confirms the business is registered – not that it's good – but it's a quick first check.",
    },

    { type: "h2", text: "The clean itself" },
    { type: "h3", text: "\"What exactly is included?\"" },
    {
      type: "p",
      text: "Ask for a written, room-by-room checklist. \"A general clean\" can mean very different things to different cleaners. A checklist tells you what you're paying for – and makes it easy to spot if something's been missed.",
    },
    { type: "h3", text: "\"What isn't included?\"" },
    {
      type: "p",
      text: "This is just as important. Inside the oven, inside cupboards, blinds, outside windows and carpet steam cleaning are often extras or not offered at all. Ask up front so there are no surprises.",
    },
    { type: "h3", text: "\"Can I choose what matters most?\"" },
    {
      type: "p",
      text: "Every home is different. A good cleaner will ask about your priorities – the shower screen, the pet hair, the kitchen – and keep them on your file so you only have to say it once.",
    },
    { type: "h3", text: "\"Do you bring your own products and equipment?\"" },
    {
      type: "p",
      text: "Most cleaning businesses bring everything. Ask whether their products are suitable for your surfaces – stone, timber, glass, stainless steel – and mention allergies, sensitivities, babies or pets. If you'd prefer they use your own products on certain surfaces, say so.",
    },
    { type: "h3", text: "\"How long will each clean take?\"" },
    {
      type: "p",
      text: "Even with a fixed price, ask roughly how long they expect to spend. It tells you whether the quote is realistic for the size of your home, and makes it easier to compare quotes fairly.",
    },

    { type: "h2", text: "Price, quotes and contracts" },
    {
      type: "ul",
      items: [
        "**\"Can I have the price in writing before I book?\"** A written quote that lists what's included protects both of you.",
        "**\"Is it a fixed price or hourly?\"** Either can be fair. With hourly pricing, ask for an estimate of the hours; with a fixed price, ask what it covers.",
        "**\"Does the price include GST?\"** Check whether the quoted amount is the full amount you'll pay.",
        "**\"What costs extra?\"** Ovens, inside cupboards, carpets and heavily soiled areas are common extras.",
        "**\"Is there a lock-in contract?\"** For regular cleans, look for a service you can pause, change or stop without penalty.",
        "**\"What's your policy on cancelling or rescheduling?\"** Find out how much notice you need to give, and whether there's a fee.",
        "**\"How do I pay, and will I get an invoice?\"** Be wary of cash-only arrangements with no paperwork.",
      ],
    },
    {
      type: "p",
      text: "For what cleaning typically costs where you live, see our price guides for [Brisbane](/cleaning-guides/how-much-does-house-cleaning-cost-in-brisbane), [Logan](/cleaning-guides/how-much-does-house-cleaning-cost-in-logan), the [Gold Coast](/cleaning-guides/average-price-cleaning-services-gold-coast) and [Tweed Heads](/cleaning-guides/average-price-cleaning-services-tweed-heads).",
    },

    { type: "h2", text: "If something goes wrong" },
    { type: "h3", text: "\"What happens if something's missed or not done properly?\"" },
    {
      type: "p",
      text: "Ask how long you have to let them know, and whether they'll come back and fix it at no extra charge. A clear answer here tells you a lot about a business. Remember that under the Australian Consumer Law, services must be provided with due care and skill and within a reasonable time – a business's own guarantee is in addition to those rights.",
    },
    { type: "h3", text: "\"What if something gets damaged?\"" },
    {
      type: "p",
      text: "Ask how they handle breakages: who you tell, how quickly, and how it's resolved. This is where insurance matters.",
    },
    { type: "h3", text: "\"Who do I talk to if I'm not happy?\"" },
    {
      type: "p",
      text: "There should be a real person you can contact – by phone or email – not just the cleaner on the day.",
    },

    { type: "h2", text: "Questions for particular situations" },
    { type: "h3", text: "Bond and end-of-lease cleans" },
    {
      type: "p",
      text: "Ask whether the cleaner works from your entry condition report – in Queensland, your Form 1a; in Tweed Heads, the condition report under NSW rules – and what they'll do if your property manager raises a cleaning item. Be cautious of anyone who \"guarantees\" your full bond back: bond claims can also cover damage, rent or other items outside cleaning. Our [bond cleaning](/services/bond-cleaning) page explains how it works.",
    },
    { type: "h3", text: "NDIS and home care cleaning" },
    {
      type: "p",
      text: "Ask whether the provider is NDIS-registered, and check how your plan is managed. If your plan is NDIA-managed, you'll need a registered provider. If it's self-managed or plan-managed, you can usually choose an unregistered provider – check with your plan manager or support coordinator. Also ask about consistency, routines and anything the cleaner needs to know to work comfortably in your home. See our [NDIS and home care cleaning](/services/ndis-cleaning) page for details.",
    },
    { type: "h3", text: "Pets" },
    {
      type: "p",
      text: "Ask whether they're comfortable with pets, how they handle gates and doors, and whether pet hair takes extra time. Let them know if a pet needs to be kept in a particular room.",
    },
    { type: "h3", text: "New builds, renovations and one-off cleans" },
    {
      type: "p",
      text: "Builder's dust and renovation grime take longer than everyday dirt. Ask whether a [detailed clean](/services/deep-cleaning) is recommended before regular visits begin.",
    },

    { type: "h2", text: "Red flags to watch for" },
    {
      type: "ul",
      items: [
        "Won't put the price or the checklist in writing.",
        "Can't or won't confirm insurance or police checks.",
        "No ABN, cash only, and no invoice.",
        "Vague about who will actually be cleaning your home.",
        "Pressure to sign up to a long contract or pay well in advance.",
        "A price that seems far too low for the size of your home – ask how many hours it includes.",
        "Promises that sound too good, such as a guaranteed full bond refund.",
      ],
    },

    { type: "h2", text: "Your quick checklist" },
    {
      type: "ol",
      items: [
        "Are you insured, and can I see your certificate of currency?",
        "Is every cleaner police-checked?",
        "Who will clean my home, and what happens if they're away?",
        "What's your ABN?",
        "Can I have a written quote and room-by-room checklist?",
        "What isn't included, and what costs extra?",
        "Do you bring your own products and equipment?",
        "How long will each clean take?",
        "Is there a lock-in contract, and what's your cancellation policy?",
        "What happens if something is missed or damaged?",
      ],
    },

    { type: "h2", text: "How Swept answers these questions" },
    {
      type: "p",
      text: "We think every cleaner should be happy to answer all of the above, so here are our answers. Swept is insured and every cleaner holds a current national police check. You'll get a written quote and checklist before anything is booked, regular cleans have no lock-in contract, and every clean is backed by [The Swept Promise](/swept-promise). Have more questions? [Contact us](/contact) or [request a free quote](/quote).",
    },
  ],
  faqs: [
    {
      q: "What should I ask a cleaner before hiring them?",
      a: "Ask whether they're insured and police-checked, who will clean your home, what's included in writing, what costs extra, whether there's a lock-in contract, and what happens if something is missed or damaged.",
    },
    {
      q: "Should a house cleaner have insurance?",
      a: "Yes. Public liability insurance means there's cover if your property is damaged during a clean. You can ask for a copy of the certificate of currency to confirm the policy is current.",
    },
    {
      q: "How do I check a cleaning business is legitimate?",
      a: "Ask for their ABN and check it for free on ABN Lookup, ask for a written quote and invoice, and confirm their insurance and police checks. Be wary of cash-only arrangements with no paperwork.",
    },
    {
      q: "Is it better to hire a cleaning company or an individual cleaner?",
      a: "Either can work well. A company can usually provide insurance, police-checked staff and a replacement when your cleaner is away; an individual may offer more flexibility. Ask the same questions of both.",
    },
    {
      q: "Can I use NDIS funding for house cleaning?",
      a: "Household tasks can be funded when they're in your plan. If your plan is NDIA-managed you'll need a registered provider; self-managed and plan-managed participants can usually choose unregistered providers. Check with your plan manager.",
    },
    {
      q: "What are my rights if a clean isn't done properly?",
      a: "Under the Australian Consumer Law, services must be provided with due care and skill and within a reasonable time. Contact the business first – many, like Swept, will come back to fix agreed tasks that were missed.",
    },
  ],
};
