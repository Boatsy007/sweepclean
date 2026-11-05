import { TrackedLink } from "./TrackedLink";
import { Icon } from "./Icon";
import { site, trustLabel } from "@/lib/site";

export function CtaBand({ title = "Make coming home the best part of your day.", body = "Get a tailored quote and a cleaning plan to suit your home.", href = "/quote", cta = "Request a quote", id = "footer_band" }: { title?: string; body?: string; href?: string; cta?: string; id?: string }) {
  return (
    <section className="container-x py-12 sm:py-16">
      <div className="reveal relative overflow-hidden rounded-[1.75rem] border border-lilac bg-lavender px-6 py-12 sm:px-12 sm:py-16">
        <div className="relative mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold leading-tight sm:text-[2.6rem]">{title}</h2>
          <p className="mt-3 text-lg">{body}</p>
          <TrackedLink cta={id} href={href} className="btn-primary mt-7 !min-h-14 !px-8 text-lg">
            {cta} <Icon name="arrow" className="size-5" />
          </TrackedLink>
          <p className="mt-4 text-sm">Free, no-obligation quote · We reply {site.quoteResponse}{trustLabel() ? ` · ${trustLabel()}` : ""}</p>
        </div>
      </div>
    </section>
  );
}
