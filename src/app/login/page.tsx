import Link from "next/link";
import { BookingKoalaEmbed } from "@/components/BookingKoalaEmbed";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { LOGIN_PATH, PACKAGES_HREF } from "@/lib/bookingKoala";
import { site, telHref } from "@/lib/site";
import { pageMeta } from "@/lib/seo";

/* Customer login (BookingKoala handles authentication). noindex, follow and not in the sitemap. */
export const metadata = pageMeta({
  title: "Customer Login | Swept Cleaning",
  description: "Log in to your Swept customer account to view and manage your cleaning bookings.",
  path: LOGIN_PATH,
  noindex: true,
});

export default function LoginPage() {
  return (
    <section className="bg-gradient-to-b from-white to-lavender/70">
      <div className="container-x max-w-3xl pb-20 pt-8 lg:pt-12">
        <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "Customer login", path: LOGIN_PATH }]} />
        <h1 className="text-3xl font-extrabold sm:text-[2.6rem]">Customer login</h1>
        <p className="mt-3 text-lg">Log in to view and manage your Swept bookings.</p>
        <BookingKoalaEmbed form="login" className="mt-8" />
        <p className="mt-6 text-[0.95rem]">
          New to Swept? <Link href={PACKAGES_HREF} className="font-semibold text-violet-ink underline underline-offset-2">Book a clean</Link> or <Link href="/quote" className="font-semibold text-violet-ink underline underline-offset-2">get a free quote</Link>.
          {site.phone ? <> Need help logging in? Call <a href={telHref(site.phone)} className="font-semibold text-violet-ink underline underline-offset-2">{site.phone}</a>.</> : null}
        </p>
      </div>
    </section>
  );
}
