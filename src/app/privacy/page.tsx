import { site } from "@/lib/site";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Privacy Policy | Swept Cleaning",
  description: "How Swept Cleaning collects, uses, stores and protects the personal information you share when you request a quote, under the Australian Privacy Principles.",
  path: "/privacy",
});

export default function Privacy() {
  return (
    <section className="container-x max-w-3xl py-14">
      <h1 className="text-4xl font-extrabold">Privacy policy</h1>
      <p className="mt-2 text-sm">Last updated: November 2026</p>
      <div className="prose-swept mt-8">
        <p>This policy explains how {site.legalName ?? "Swept Cleaning"} (&quot;Swept&quot;, &quot;we&quot;) handles personal information. We aim to handle your information in line with the Australian Privacy Principles.</p>
        <h2>What we collect</h2>
        <p>When you request a quote, a call back or a booking, we collect the details you give us: your name, phone number, email address, street address, suburb and postcode, information about your home and the cleaning you need (such as the package, how often, extras and your preferred date), and any notes you add.</p>
        <p>If you arrived at our website from an online ad, we also record the ad&apos;s click identifier (for example a Google Ads &quot;gclid&quot;) and campaign details (such as &quot;utm_source&quot;) with your request. These identify the ad you clicked, not you, but they are linked to your request once you submit it.</p>
        <h2>How we use it</h2>
        <p>We use your details to respond to your request, prepare and send quotes, confirm and schedule bookings, carry out cleaning, take payment, manage your customer account and keep in touch about your service. We use the ad click identifier and campaign details to understand which of our ads lead to enquiries and bookings.</p>
        <h2>Analytics, cookies and advertising</h2>
        <p>Our website (sweptcleans.com.au) uses Google Analytics, loaded through Google Tag Manager, to understand how people use the site so we can improve it and measure our advertising. Google Analytics uses cookies and similar technologies to collect information such as the pages you visit, how you arrived at the site, your device and browser, and your approximate location.</p>
        <p>We also measure actions on the site, such as clicking a booking or quote button, tapping our phone number or email address, and successfully submitting a quote, call-back or booking request. We don&apos;t send your name, email address, phone number, street address or notes to Google Analytics.</p>
        <p>To measure whether our ads lead to confirmed bookings, we may share the ad click identifier from your request, and the date and value of a resulting booking, with Google Ads. Google handles this information under its own privacy policy – see <a href="https://policies.google.com/technologies/partner-sites" className="text-violet underline">how Google uses information from sites that use its services</a>.</p>
        <p>You can block or delete cookies in your browser settings, opt out of Google Analytics with <a href="https://tools.google.com/dlpage/gaoptout" className="text-violet underline">Google&apos;s opt-out browser add-on</a>, and manage ad personalisation in <a href="https://myadcenter.google.com" className="text-violet underline">Google&apos;s My Ad Center</a>. The website works without analytics cookies.</p>
        <h2>Who we share it with</h2>
        <p>We don&apos;t sell your personal information. We share it only with service providers who help us run the business, and only so they can provide those services to us, or where the law requires it. These include our customer management, scheduling and payments platform (BookingKoala), the automation service that passes website enquiries into it, our email provider, our website hosting provider, and Google (analytics and advertising measurement, as described above).</p>
        <h2>Storage and security</h2>
        <p>We take reasonable steps to protect your information from misuse, loss and unauthorised access. Some of our providers store data outside Australia, including in the United States.</p>
        <h2>Access and correction</h2>
        <p>You can ask to see or correct the personal information we hold about you, or ask us to delete it, at any time{site.email ? <> by emailing <a href={`mailto:${site.email}`} className="text-violet underline">{site.email}</a></> : " by contacting us through this website"}.</p>
        <h2>Complaints</h2>
        <p>If you have a concern about how we&apos;ve handled your information, please contact us first. If you&apos;re not satisfied with our response, you can contact the Office of the Australian Information Commissioner (oaic.gov.au).</p>
      </div>
    </section>
  );
}
