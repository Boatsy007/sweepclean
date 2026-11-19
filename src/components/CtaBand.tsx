import { CtaLink, type CtaContext } from "./CtaLink";
import { Icon } from "./Icon";
import { quoteHref, type CtaIntent, PACKAGES_HREF } from "@/lib/bookingKoala";
import { site, trustLabel } from "@/lib/site";

/**
 * Closing call-to-action band.
 * intent "book" (default, residential): Book a clean → the regular cleaning packages, with a quieter link to a free quote.
 * intent "quote" (bond, commercial, custom scopes): quote first, as before.
 */
export function CtaBand({
  title = "Make coming home the best part of your day.",
  body,
  intent = "book",
  href,
  cta,
  quote = quoteHref(),
  id = "footer_band",
  context,
}: { title?: string; body?: string; intent?: CtaIntent; href?: string; cta?: string; quote?: string; id?: string; context?: CtaContext }) {
  const book = intent === "book";
  const trust = trustLabel();
  return (
    <section className="container-x py-12 sm:py-16">
      <div className="reveal relative overflow-hidden rounded-[1.75rem] border border-lilac bg-lavender px-6 py-12 sm:px-12 sm:py-16">
        <div className="relative mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold leading-tight sm:text-[2.6rem]">{title}</h2>
          <p className="mt-3 text-lg">{body ?? (book ? "Choose your package and request your booking in minutes." : "Get a tailored quote and a cleaning plan to suit your home.")}</p>
          <CtaLink intent={intent} location={id} context={context} href={href ?? (book ? PACKAGES_HREF : quote)} className="btn-primary mt-7 !min-h-14 !px-8 text-lg">
            {cta ?? (book ? "Book a clean" : "Request a quote")} <Icon name="arrow" className="size-5" />
          </CtaLink>
          {book ? (
            <p className="mt-4 text-sm">
              Prefer a written price first?{" "}
              <CtaLink intent="quote" location={`${id}_quote`} context={context} href={quote} className="font-semibold text-violet-ink underline underline-offset-2">Get a free quote</CtaLink>
              {trust ? ` · ${trust}` : ""}
            </p>
          ) : (
            <p className="mt-4 text-sm">Free, no-obligation quote · We reply {site.quoteResponse}{trust ? ` · ${trust}` : ""}</p>
          )}
        </div>
      </div>
    </section>
  );
}
