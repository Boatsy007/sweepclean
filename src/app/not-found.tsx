import Link from "next/link";
import { SweptMark } from "@/components/SweptMark";

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
