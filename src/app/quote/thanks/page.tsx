import Link from "next/link";
import { Icon } from "@/components/Icon";
import { SweptMark } from "@/components/SweptMark";
import { services } from "@/lib/services";
import { site } from "@/lib/site";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({ title: "Thanks – We've Got Your Request | Swept Cleaning", description: "Thanks for requesting a quote from Swept Cleaning. Here is what happens next.", path: "/quote/thanks", noindex: true });

type Props = { searchParams: Promise<{ type?: string; service?: string; name?: string }> };

export default async function Thanks({ searchParams }: Props) {
  const { type, service, name } = await searchParams;
  const callback = type === "callback";
  const svc = services.find((s) => s.slug === service);
  const first = name?.replace(/[^\p{L}' -]/gu, "").slice(0, 30);
  return (
    <section className="bg-gradient-to-b from-white to-lavender/70">
      <div className="container-x max-w-3xl py-16 text-center sm:py-24">
        <SweptMark size={84} className="mx-auto" />
        <h1 className="mt-6 text-4xl font-extrabold sm:text-5xl">Thanks{first ? `, ${first}` : ""} – we&apos;ve got it.</h1>
        <p className="mx-auto mt-4 max-w-xl text-lg">
          {callback ? `We'll call you back ${site.quoteResponse}.` : `We'll send your tailored ${svc ? svc.name.toLowerCase() : "cleaning"} quote ${site.quoteResponse}.`} {callback ? "" : "Check your inbox for a copy of your request."}
        </p>
        <div className="card mx-auto mt-10 max-w-xl p-6 text-left sm:p-8">
          <h2 className="text-xl font-bold">While you wait</h2>
          <ul className="mt-4 space-y-3">
            <li className="flex gap-3"><Icon name="key" className="size-6 shrink-0 text-violet" />Think about access – will you be home, or leave a key or lockbox code?</li>
            <li className="flex gap-3"><Icon name="sparkle" className="size-6 shrink-0 text-violet" />Jot down your top three priorities so we can put them on your plan.</li>
            {svc?.slug === "bond-cleaning" && <li className="flex gap-3"><Icon name="doc" className="size-6 shrink-0 text-violet" />Find your entry condition report – we clean against it.</li>}
            <li className="flex gap-3"><Icon name="calendar" className="size-6 shrink-0 text-violet" />Thinking regular? Weekly, fortnightly or monthly can be set up in the same quote.</li>
          </ul>
        </div>
        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/" className="btn-primary">Back to home</Link>
          <Link href="/faq" className="btn-outline">Read our FAQs</Link>
        </div>
      </div>
    </section>
  );
}
