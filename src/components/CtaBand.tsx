import { CtaLink, type CtaContext } from "./CtaLink";
import { Icon } from "./Icon";
import { quoteHref, type CtaIntent } from "@/lib/bookingKoala";
import { site, trustLabel } from "@/lib/site";

/**
 * Closing call-to-action band.
 * Every band leads to the central quote form. The default (residential pages) says "Get a free quote";
 * intent "quote" with custom copy is used by bond, commercial and other service pages, as before.
 * (`intent` "book" is accepted for compatibility and behaves as the default.)
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
  const book = intent === "book"; // the default band (no online booking any more – it quotes)
  const trust = trustLabel();
  return (
    <section className="container-x py-12 sm:py-16">
      <div className="reveal relative overflow-hidden rounded-[1.75rem] border border-lilac bg-lavender px-6 py-12 sm:px-12 sm:py-16">
        <div className="relative mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold leading-tight sm:text-[2.6rem]">{title}</h2>
          <p className="mt-3 text-lg">{body ?? "Get a tailored quote and a cleaning plan to suit your home."}</p>
          <CtaLink intent="quote" location={id} context={context} href={href ?? quote} className="btn-primary mt-7 !min-h-14 !px-8 text-lg">
            {cta ?? (book ? "Get a free quote" : "Request a quote")} <Icon name="arrow" className="size-5" />
          </CtaLink>
          <p className="mt-4 text-sm">Free, no-obligation quote · We reply {site.quoteResponse}{trust ? ` · ${trust}` : ""}</p>
        </div>
      </div>
    </section>
  );
}
