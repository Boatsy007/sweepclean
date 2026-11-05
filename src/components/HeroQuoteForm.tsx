"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { FREQUENCY_OPTIONS, SERVICE_OPTIONS, validateContact, type Errors, type QuoteRequest } from "@/lib/quote";
import { postcodeInArea } from "@/lib/areas";
import { services } from "@/lib/services";
import { site, telHref, trustLabel } from "@/lib/site";
import { track } from "@/lib/analytics";
import { Icon } from "./Icon";
import Image from "next/image";
import { photos } from "@/lib/photos";

type Data = Partial<QuoteRequest>;

/** Single-step quote form for the home page hero. Posts to the same API as the full quote. */
export function HeroQuoteForm({ defaultSuburb, title = "Request your free quote", promiseNote = false }: { defaultSuburb?: string; title?: string; promiseNote?: boolean } = {}) {
  const router = useRouter();
  const [d, setD] = useState<Data>({ kind: "quote", consent: false, frequency: "fortnightly", suburb: defaultSuburb });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  const [hp, setHp] = useState("");
  const started = useRef(false);
  const mountedAt = useRef(Date.now());

  const recurring = !d.service || !!services.find((s) => s.slug === d.service)?.recurring;

  function set<K extends keyof Data>(k: K, v: Data[K]) {
    if (!started.current) {
      started.current = true;
      track("quote_start", { mode: "hero" });
    }
    setD((x) => ({ ...x, [k]: v }));
    setErrors((e) => ({ ...e, [k]: undefined }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const errs: Errors = validateContact(d, "quote");
    if (!d.service) errs.service = "Choose a service.";
    if (Object.keys(errs).length) {
      setErrors(errs);
      track("quote_step_error", { step: "hero", fields: Object.keys(errs).join(",") });
      const first = document.getElementById(`hq-${Object.keys(errs)[0]}`);
      first?.focus();
      return;
    }
    setStatus("sending");
    const suburbMatch = d.suburb?.match(/\b(\d{4})\b/);
    const payload = {
      ...d,
      frequency: recurring ? d.frequency : "once",
      suburb: suburbMatch ? d.suburb!.replace(suburbMatch[0], "").replace(/[\s,]+$/, "").trim() || d.suburb : d.suburb,
      postcode: suburbMatch?.[1],
      source: `hero:${typeof document !== "undefined" ? document.referrer || "direct" : ""}`,
      website: hp,
      elapsed: Date.now() - mountedAt.current,
    };
    try {
      const res = await fetch("/api/quote", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error(String(res.status));
      track("generate_lead", {
        lead_type: "quote_hero",
        service: d.service ?? "",
        frequency: payload.frequency ?? "",
        recurring: payload.frequency !== "once",
        in_area: payload.postcode ? postcodeInArea(payload.postcode) : undefined,
      });
      const q = new URLSearchParams({ type: "quote", service: d.service ?? "", name: (d.name ?? "").split(" ")[0] });
      router.push(`/quote/thanks?${q.toString()}`);
    } catch {
      setStatus("error");
      track("quote_submit_error", { mode: "hero" });
    }
  }

  return (
    <form id="quote" onSubmit={submit} noValidate className="relative scroll-mt-24 overflow-hidden rounded-[1.75rem] bg-white p-5 text-slate shadow-[0_30px_60px_-20px_rgb(20_0_50/0.55)] sm:p-8" aria-labelledby="hq-title">
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>Website<input tabIndex={-1} autoComplete="off" value={hp} onChange={(e) => setHp(e.target.value)} name="website" /></label>
      </div>

      {/* Mobile: a real person front and centre, right where people enquire */}
      <div className="relative -mx-5 -mt-5 mb-4 aspect-[16/10] overflow-hidden lg:hidden">
        <Image src={photos.quoteCleaner.src} alt={photos.quoteCleaner.alt} fill sizes="(min-width: 640px) 600px, 100vw" quality={70} placeholder="blur" className="object-cover object-[50%_20%]" />
      </div>
      <h2 id="hq-title" className="text-center text-[1.3rem] font-extrabold uppercase tracking-wide sm:text-[1.65rem]">{title}</h2>
      <p className="mt-1 flex flex-wrap items-center justify-center gap-x-2 gap-y-0.5 text-center text-sm">
        <span>Free, no obligation</span>
        <span className="inline-flex items-center gap-1 whitespace-nowrap font-medium text-navy"><Icon name="clock" className="size-4 shrink-0 text-violet" />We reply {site.quoteResponse}</span>
        {trustLabel() && <span className="inline-flex items-center gap-1 whitespace-nowrap font-medium text-navy"><Icon name="shield" className="size-4 shrink-0 text-violet" />{trustLabel()}</span>}
      </p>

      <div className="mt-5 grid gap-3.5">
        <Field id="name" label="Name" error={errors.name}>
          <input id="hq-name" className={fieldCls(errors.name)} autoComplete="name" value={d.name ?? ""} onChange={(e) => set("name", e.target.value)} aria-invalid={!!errors.name} aria-describedby={errors.name ? "hq-name-error" : undefined} />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="phone" label="Mobile" error={errors.phone}>
            <input id="hq-phone" type="tel" inputMode="tel" className={fieldCls(errors.phone)} autoComplete="tel" placeholder="e.g. 0412 345 678" value={d.phone ?? ""} onChange={(e) => set("phone", e.target.value)} aria-invalid={!!errors.phone} aria-describedby={errors.phone ? "hq-phone-error" : undefined} />
          </Field>
          <Field id="email" label="Email" error={errors.email}>
            <input id="hq-email" type="email" inputMode="email" className={fieldCls(errors.email)} autoComplete="email" placeholder="you@example.com" value={d.email ?? ""} onChange={(e) => set("email", e.target.value)} aria-invalid={!!errors.email} aria-describedby={errors.email ? "hq-email-error" : undefined} />
          </Field>
        </div>
        <Field id="suburb" label="Suburb" error={errors.suburb}>
          <input id="hq-suburb" className={fieldCls(errors.suburb)} autoComplete="address-level2" placeholder="e.g. Robina or 4226" value={d.suburb ?? ""} onChange={(e) => set("suburb", e.target.value)} aria-invalid={!!errors.suburb} aria-describedby={errors.suburb ? "hq-suburb-error" : undefined} />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="service" label="Service" error={errors.service}>
            <Select id="hq-service" value={d.service ?? ""} onChange={(v) => set("service", v)} invalid={!!errors.service}>
              <option value="" disabled>Select one…</option>
              {SERVICE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </Select>
          </Field>
          <Field id="frequency" label="How often?">
            <Select id="hq-frequency" value={recurring ? d.frequency ?? "" : "once"} onChange={(v) => set("frequency", v)} disabled={!recurring}>
              {FREQUENCY_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </Select>
          </Field>
        </div>
        <Field id="notes" label="About your home" optional>
          <textarea id="hq-notes" rows={2} maxLength={2000} className={fieldCls()} placeholder="Bedrooms, bathrooms, pets, anything we should focus on…" value={d.notes ?? ""} onChange={(e) => set("notes", e.target.value)} />
        </Field>
        <div>
          <label className="flex cursor-pointer items-start gap-3 text-sm">
            <input id="hq-consent" type="checkbox" checked={!!d.consent} onChange={(e) => set("consent", e.target.checked)} className="mt-0.5 size-5 shrink-0 accent-violet" aria-invalid={!!errors.consent} aria-describedby={errors.consent ? "hq-consent-error" : undefined} />
            <span>Swept can contact me about this request. <a href="/privacy" target="_blank" className="font-semibold text-violet underline underline-offset-2">Privacy policy</a></span>
          </label>
          {errors.consent && <p id="hq-consent-error" role="alert" className="error">{errors.consent}</p>}
        </div>
      </div>

      {status === "error" && (
        <p role="alert" className="mt-5 rounded-xl border border-[#f4c7c3] bg-[#fef3f2] px-4 py-3 text-sm text-[#b42318]">
          Sorry – your request didn&apos;t send. Please try again in a moment{site.phone ? <> or call <a href={telHref(site.phone)} className="font-semibold underline">{site.phone}</a></> : null}.
        </p>
      )}

      <button type="submit" disabled={status === "sending"} className="btn-primary mt-6 w-full !min-h-14 text-lg disabled:opacity-60">
        {status === "sending" ? "Sending…" : "Get my free quote"} <Icon name="arrow" className="size-5" />
      </button>
      {promiseNote && (
        <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-sm font-medium text-navy">
          <Icon name="shieldSparkle" className="size-4 shrink-0 text-violet" />
          Something missed? <a href={site.promise.path} className="font-semibold text-violet underline underline-offset-2">We&apos;ll come back and fix it.</a>
        </p>
      )}
      <p className={`${promiseNote ? "mt-2" : "mt-3"} text-center text-sm`}>
        Want to add more detail? <a href="/quote" className="font-semibold text-violet underline underline-offset-2">Use the full quote form</a>
      </p>
    </form>
  );
}

const fieldCls = (err?: string) => `field !py-2.5 ${err ? "!border-[#d92d20]" : ""}`;

function Field({ id, label, error, optional, children }: { id: string; label: string; error?: string; optional?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={`hq-${id}`} className="label !text-[0.9rem]">{label}{optional && <span className="font-normal text-slate"> (optional)</span>}</label>
      {children}
      {error && <p id={`hq-${id}-error`} role="alert" className="error">{error}</p>}
    </div>
  );
}

function Select({ id, value, onChange, children, invalid, disabled }: { id: string; value: string; onChange: (v: string) => void; children: React.ReactNode; invalid?: boolean; disabled?: boolean }) {
  return (
    <div className="relative">
      <select id={id} value={value} disabled={disabled} onChange={(e) => onChange(e.target.value)} aria-invalid={invalid} aria-describedby={invalid ? `${id}-error` : undefined} className={`${fieldCls(invalid ? "x" : undefined)} appearance-none pr-10 disabled:bg-lavender/60 disabled:text-slate`}>
        {children}
      </select>
      <Icon name="chevron" className="pointer-events-none absolute right-3 top-1/2 size-5 -translate-y-1/2 text-violet" />
    </div>
  );
}
