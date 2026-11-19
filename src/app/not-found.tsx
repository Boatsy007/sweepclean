import type { Metadata } from "next";
import Link from "next/link";
import { SweptMark } from "@/components/SweptMark";

// Next.js returns HTTP 404 and adds its own robots noindex; no canonical (none is inherited from the layout).
export const metadata: Metadata = { title: { absolute: "Page Not Found | Swept Cleaning" } };

export default function NotFound() {
  return (
    <section className="container-x py-24 text-center">
      <SweptMark size={80} className="mx-auto" />
      <h1 className="mt-6 text-4xl font-extrabold">This page has been swept away</h1>
      <p className="mt-3 text-lg">We couldn&apos;t find what you were looking for.</p>
      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <Link href="/" className="btn-primary">Go home</Link>
        <Link href="/quote" className="btn-outline">Get a free quote</Link>
      </div>
    </section>
  );
}
