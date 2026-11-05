import type { Guide } from "@/lib/guides";
import { photos } from "@/lib/photos";

/*
 * Sources (checked November 2026):
 * - Scamwatch (ACCC): payment redirection / business email compromise – scammers change bank details on real
 *   invoices; verify by calling a number you already have, not one in the email. Report scams to Scamwatch.
 * - Australian Cyber Security Centre (cyber.gov.au): contact your bank first if money has moved; ReportCyber for
 *   losses; IDCARE (1800 595 160) for identity support.
 * - ACCC online reviews guidance: fake reviews and hiding negative reviews can be misleading; check several sources.
 * - Unsolicited consumer agreements (ACL): 10 business day cooling-off period; supplier generally can't take payment
 *   or supply during it (NSW Government; Queensland Government termination notice).
 * - ACCC consumer guarantees; ABN Lookup.
 * No prices. Wording about scams is general – no specific businesses are named.
 */

export const guide: Guide = {
  slug: "how-to-avoid-getting-scammed-by-cleaning-services",
  title: "How to Avoid Getting Scammed by Cleaning Services",
  metaTitle: "How to Avoid Cleaning Service Scams | Swept Cleaning",
  description:
    "Common cleaning service scams in Australia – fake listings, upfront payments, fake invoices and bait-and-switch quotes – and how to protect yourself.",
  published: "2026-11-05",
  categories: ["Hiring a cleaner"],
  image: photos.apartment,
  services: ["regular-house-cleaning", "bond-cleaning", "carpet-cleaning", "ndis-cleaning"],
  related: ["questions-to-ask-before-hiring-a-house-cleaner", "emergency-cleaning-services-how-quickly-can-you-help", "bond-cleaning-cost-brisbane"],
  sources: [
    { title: "Business email compromise scams", url: "https://www.scamwatch.gov.au/types-of-scams/business-email-compromise-scams", publisher: "Scamwatch (ACCC)" },
    { title: "Report a scam", url: "https://www.scamwatch.gov.au/report-a-scam", publisher: "Scamwatch (ACCC)" },
    { title: "Recover from scams", url: "https://www.cyber.gov.au/report-and-recover/recover-from/scams", publisher: "Australian Cyber Security Centre" },
    { title: "Online reviews for products and services", url: "https://www.accc.gov.au/consumers/advertising-and-promotions/online-reviews-for-product-and-services", publisher: "ACCC" },
    { title: "Unsolicited consumer agreements", url: "https://www.nsw.gov.au/legal-and-justice/consumer-rights-and-protection/guarantees-contracts-and-warranties/unsolicited-consumer-agreements", publisher: "NSW Government" },
    { title: "Unsolicited consumer agreement termination notice", url: "https://www.publications.qld.gov.au/dataset/oft-business-resources/resource/dd249a2b-94e2-4369-a0a0-efc445ead0d2", publisher: "Queensland Government" },
    { title: "Consumer rights and guarantees", url: "https://www.accc.gov.au/consumers/buying-products-and-services/consumer-rights-and-guarantees", publisher: "ACCC" },
    { title: "ABN Lookup", url: "https://abr.business.gov.au/", publisher: "Australian Business Register" },
  ],
  body: [
    {
      type: "p",
      text: "Most cleaners are honest, hard-working people. But because cleaning is booked quickly, often online and often by people under time pressure – moving out, expecting guests, juggling work – it attracts its share of scams and shonky operators. The good news is that a few simple habits protect you from almost all of them. Here are the tactics to watch for, how to pay safely, and what to do if something goes wrong.",
    },
    {
      type: "tip",
      title: "The short version",
      text: "**Check the business is real** (ABN, phone number, address details that match), **get the price and checklist in writing**, **don't pay a stranger in full upfront**, **never pay by gift card, crypto or an unexpected bank-detail change**, and **call a number you already have** if anything about a payment request feels off.",
    },

    { type: "h2", text: "Common cleaning scams and how to spot them" },

    { type: "h3", text: "1. The no-show after an upfront payment" },
    {
      type: "p",
      text: "A cheap listing on social media, a classifieds site or a marketplace asks you to pay in full – or pay a large deposit – to \"lock in\" your booking. Then the cleaner never turns up and stops replying.",
    },
    {
      type: "ul",
      items: [
        "**Warning signs:** a price far below everyone else, pressure to pay now to secure a date, a new profile with no history, and payment requested to a personal account.",
        "**Protect yourself:** check the ABN on [ABN Lookup](https://abr.business.gov.au/), call the business before paying, and avoid paying a business you can't verify in full before the work is done.",
      ],
    },

    { type: "h3", text: "2. Fake invoices and changed bank details" },
    {
      type: "p",
      text: "Known as payment redirection, this scam targets genuine customers of genuine businesses. Scammers get into or copy a business's email and send an invoice that looks real – but with different bank details. You pay, and the money goes to the scammer. If you reply to ask about the change, the scammer replies with an \"explanation\".",
    },
    {
      type: "ul",
      items: [
        "**Warning signs:** a message saying the business has \"changed banks\", a BSB or account number that doesn't match earlier invoices, or urgency to pay today.",
        "**Protect yourself:** don't pay until you've called the business on a phone number you already have – not one in the email. An email confirming \"yes, those are our new details\" is not a check.",
      ],
    },

    { type: "h3", text: "3. Copycat businesses" },
    {
      type: "p",
      text: "Some scammers set up a website, ad or social media page using a real business's name or photos, then take bookings and payments themselves.",
    },
    {
      type: "ul",
      items: [
        "**Warning signs:** a web address that's slightly different, contact only by message or email, and an ABN that doesn't match the business name.",
        "**Protect yourself:** find the business through a search or a source you trust, check its ABN and phone number match, and call before you book.",
      ],
    },

    { type: "h3", text: "4. Bait-and-switch pricing" },
    {
      type: "p",
      text: "This one isn't always a scam in the legal sense, but it's the most common way people feel ripped off. A low advertised price gets you to book; then on the day you're told the home is \"dirtier than expected\", the oven is extra, the bathrooms are extra, and the final bill is double.",
    },
    {
      type: "ul",
      items: [
        "**Warning signs:** a price given without asking about your home, no written checklist, and vague answers about what's included.",
        "**Protect yourself:** get a written quote that lists what's included and what costs extra, and agree any changes before work starts. Our guide to the [questions to ask before hiring a house cleaner](/cleaning-guides/questions-to-ask-before-hiring-a-house-cleaner) covers what to check.",
      ],
    },

    { type: "h3", text: "5. Door-to-door and unsolicited offers" },
    {
      type: "p",
      text: "Someone knocks on the door or calls out of the blue offering a carpet clean or a \"special deal\" today only. Under the Australian Consumer Law, an agreement made this way is an unsolicited consumer agreement. You generally have a **10 business day cooling-off period** to cancel, and the business generally can't take payment or start work during that time. They must also tell you about your right to cancel.",
    },
    {
      type: "ul",
      items: [
        "**Warning signs:** pressure to decide on the spot, a request for cash today, or work started before the cooling-off period ends.",
        "**Protect yourself:** don't sign or pay on the doorstep. Take their details, check them, and get other quotes.",
      ],
    },

    { type: "h3", text: "6. Fake reviews" },
    {
      type: "p",
      text: "Fake positive reviews – and hiding genuine negative ones – can mislead customers, and the ACCC treats them seriously. They're hard to spot, so don't rely on one source.",
    },
    {
      type: "ul",
      items: [
        "**Warning signs:** lots of five-star reviews posted in a short burst, reviews that are vague or oddly similar, and no negative reviews at all.",
        "**Protect yourself:** check reviews on several independent platforms, not just the business's own website, and look at how the business responds to criticism.",
      ],
    },

    { type: "h3", text: "7. \"Guaranteed bond back\" promises" },
    {
      type: "p",
      text: "No cleaner can guarantee your whole bond, because bond claims can also cover damage, unpaid rent and other things outside cleaning. A \"100% bond back guarantee\" often comes with fine print – or simply isn't honoured.",
    },
    {
      type: "ul",
      items: [
        "**Protect yourself:** ask exactly what the guarantee covers, how long you have to report a problem, and whether they'll come back for a re-clean. Look for a cleaner who works from your entry condition report – see our [bond cleaning](/services/bond-cleaning) page.",
      ],
    },

    { type: "h3", text: "8. Requests for logins, codes or personal details" },
    {
      type: "p",
      text: "A cleaner doesn't need your banking passwords, your myGov or NDIS portal login, or your full identity documents. Be wary of anyone who asks for them.",
    },
    {
      type: "ul",
      items: [
        "**Protect yourself:** share only what's needed for the job – your address, access details and contact number. If you're an NDIS participant, never share your portal login; your plan manager or the provider's invoice handles payment. See our [NDIS and home care cleaning](/services/ndis-cleaning) page.",
      ],
    },

    { type: "h2", text: "How to pay a cleaner safely" },
    {
      type: "ul",
      items: [
        "**Ask for a written quote and a proper invoice** with the business name and ABN.",
        "**Use a traceable payment method,** such as bank transfer to details you've verified or a card – it gives you a record if there's a dispute.",
        "**Be cautious with cash-only arrangements** that come with no receipt.",
        "**Never pay with gift cards, cryptocurrency or money transfer services** – genuine cleaning businesses don't ask for these.",
        "**Treat any change of bank details as suspicious** until you've confirmed it by phone on a number you already had.",
        "**For new businesses, avoid paying in full upfront.** If a deposit is asked for, make sure it's reasonable, written on the quote and paid to a verified account.",
      ],
    },

    { type: "h2", text: "Before you hand over the keys" },
    {
      type: "p",
      text: "Scams aren't the only risk. Before you give anyone access to your home, check they hold public liability insurance and that every cleaner who might visit has a current police check. Find out how keys and alarm codes are stored, and who can see them. Then remove valuables, cash and important documents from sight as a matter of course.",
    },

    { type: "h2", text: "What to do if you've been scammed" },
    {
      type: "ol",
      items: [
        "**Contact your bank or card provider immediately** if money has moved – they may be able to stop or recover the payment.",
        "**Report it to Scamwatch** at scamwatch.gov.au to help warn others and get scam ads and websites taken down.",
        "**Report to ReportCyber** at cyber.gov.au if you've lost money or personal information.",
        "**Contact IDCARE** (1800 595 160) for free help if you've shared identity documents or account details.",
        "**Report the profile or ad** to the platform where you found it.",
        "**Change passwords and alarm or lockbox codes** if you shared them.",
      ],
    },
    {
      type: "p",
      text: "If the business is real but the service was poor, that's a consumer dispute rather than a scam. Under the Australian Consumer Law, services must be provided with due care and skill and within a reasonable time. Contact the business first, then Queensland's Office of Fair Trading or NSW Fair Trading if it isn't resolved.",
    },

    { type: "h2", text: "Checking a message really is from Swept" },
    {
      type: "p",
      text: "If you get a call, text or email claiming to be from Swept that you weren't expecting – especially one asking for payment or personal details – call us on 0490 216 363 or email hey@swept.com.au to check before you act. Our quotes are always in writing, and we'll never mind you calling to confirm. Learn more about [how we work](/why-swept) and [The Swept Promise](/swept-promise), or [request a free quote](/quote).",
    },
  ],
  faqs: [
    {
      q: "How do I know if a cleaning business is legitimate?",
      a: "Check its ABN on ABN Lookup, make sure the name, phone number and website match, ask for a written quote and invoice, and confirm its insurance and police checks. Check reviews on several independent platforms.",
    },
    {
      q: "Should I pay a cleaner upfront?",
      a: "Avoid paying a business you can't verify in full before the work is done. If a deposit is requested, it should be reasonable, written on the quote and paid to a verified account – never by gift card or cryptocurrency.",
    },
    {
      q: "What is a payment redirection scam?",
      a: "Scammers send a fake invoice that looks like it's from a real business but has different bank details. Before paying any changed details, call the business on a phone number you already have – not one in the email.",
    },
    {
      q: "Can I cancel a cleaning deal I agreed to at my door?",
      a: "Generally, yes. Under the Australian Consumer Law, an unsolicited consumer agreement made at your door or by an unexpected phone call usually has a 10 business day cooling-off period, and the business generally can't take payment or start work during that time.",
    },
    {
      q: "Who do I report a cleaning scam to?",
      a: "Contact your bank first if you've paid, then report it to Scamwatch. If you've lost money or personal information, also report it to ReportCyber, and contact IDCARE for help protecting your identity.",
    },
    {
      q: "Is a '100% bond back guarantee' a red flag?",
      a: "It's worth questioning. No cleaner can guarantee your full bond, because claims can cover damage or rent as well as cleaning. Ask exactly what's covered and whether they'll return for a re-clean.",
    },
  ],
};
