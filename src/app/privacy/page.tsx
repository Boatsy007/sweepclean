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
        <p>When you request a quote or call back, we collect the details you give us: your name, phone number, email address, suburb and postcode, information about your home and the cleaning you need, and any notes you add. If analytics is enabled, we also collect anonymous usage information such as pages visited and the device and browser you use.</p>
        <h2>How we use it</h2>
        <p>We use your details to respond to your request, prepare and send quotes, arrange and carry out cleaning, and keep in touch about your service. We use analytics to understand how people use the site so we can improve it.</p>
        <h2>Who we share it with</h2>
        <p>We don&apos;t sell your personal information. We share it only with service providers who help us run the business – for example, our email and website hosting providers – and only so they can provide those services to us, or where the law requires it.</p>
        <h2>Storage and security</h2>
        <p>We take reasonable steps to protect your information from misuse, loss and unauthorised access. Some of our providers may store data outside Australia.</p>
        <h2>Access and correction</h2>
        <p>You can ask to see or correct the personal information we hold about you, or ask us to delete it, at any time{site.email ? <> by emailing <a href={`mailto:${site.email}`} className="text-violet underline">{site.email}</a></> : " by contacting us through this website"}.</p>
        <h2>Complaints</h2>
        <p>If you have a concern about how we&apos;ve handled your information, please contact us first. If you&apos;re not satisfied with our response, you can contact the Office of the Australian Information Commissioner (oaic.gov.au).</p>
      </div>
    </section>
  );
}
