"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { DEFAULT_LEAD_CLEANING_TYPE, FREQUENCY_OPTIONS, LEAD_CLEANING_TYPES, leadCleaningTypeBy, splitSuburbPostcode, validateLead, type Errors, type LeadFormLocation, type QuoteRequest } from "@/lib/quote";
import { postcodeInArea } from "@/lib/areas";
import { site, telHref, trustLabel } from "@/lib/site";
import { getAttribution, track } from "@/lib/analytics";
import { photos } from "@/lib/photos";
import { Icon } from "./Icon";

type Data = Pick<Partial<QuoteRequest>, "firstName" | "lastName" | "cleaningType" | "suburb" | "phone" | "email" | "consent">;
type Key = keyof Data;
const FIELDS: Key[] = ["firstName", "lastName", "cleaningType", "suburb", "phone", "email", "consent"];
const TRACKED_KEY = "swept:lead-tracked";

function newEnquiryId() {
  try {
    return crypto.randomUUID();
  } catch {
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
  }
}

/** generate_lead once per enquiry, even if the same enquiry is confirmed twice (retry, Back). */
function firstConfirmation(id: string) {
  try {
    const seen = JSON.parse(sessionStorage.getItem(TRACKED_KEY) ?? "[]") as string[];
    if (seen.includes(id)) return false;
    sessionStorage.setItem(TRACKED_KEY, JSON.stringify([...seen.slice(-19), id]));
  } catch {}
  return true;
}

/**
 * The six-field quote form: first name, last name, cleaning type, suburb, phone and email.
 * Homepage hero (variant "hero", the original hero card) and /quote (variant "page").
 * Posts to /api/quote → Resend email to the business inbox + Make.com webhook → BookingKoala lead.
 * Swept phones the customer, then books the clean in BookingKoala – nothing is booked here.
 */
export function LeadQuoteForm({ variant = "page" }: { variant?: "hero" | "page" } = {}) {
  const router = useRouter();
  const p = variant === "hero" ? "hq" : "qf";
  const location: LeadFormLocation = variant === "hero" ? "homepage_hero" : "quote_page";
  const [d, setD] = useState<Data>({ consent: false });
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [hp, setHp] = useState("");
  const sending = useRef(false);
  const started = useRef(false);
  const mountedAt = useRef(Date.now());
  const enquiryId = useRef<string | null>(null);
  const frequency = useRef<string | undefined>(undefined);
  const blurTimer = useRef<number | undefined>(undefined);

  // /quote links preselect the cleaning type (?service=…, ?type=commercial) and can carry the
  // suburb and, from the regular cleaning frequency cards, the frequency (sent with the enquiry).
  useEffect(() => {
    if (variant !== "page") return;
    const q = new URLSearchParams(window.location.search);
    const preset = DEFAULT_LEAD_CLEANING_TYPE[q.get("service") ?? ""] ?? (q.get("type") === "commercial" ? "commercial" : undefined);
    const suburb = q.get("suburb")?.slice(0, 80);
    if (preset || suburb) setD((x) => ({ ...x, ...(preset ? { cleaningType: preset } : {}), ...(suburb ? { suburb } : {}) }));
    const f = q.get("frequency");
    if (preset === "regular" && FREQUENCY_OPTIONS.some((o) => o.value === f && o.value !== "once")) frequency.current = f!;
  }, [variant]);

  const check = (next: Data) => validateLead(next);

  function set<K extends Key>(k: K, v: Data[K]) {
    if (!started.current) {
      started.current = true;
      track("quote_start", { mode: variant });
    }
    const next = { ...d, [k]: v };
    setD(next);
    // Once an error is showing, it updates as the visitor types (and disappears when fixed).
    if (errors[k]) setErrors((e) => ({ ...e, [k]: check(next)[k] }));
  }

  /** After leaving a field: flag a value that's there but not right (empty fields wait for Submit).
   *  Not when moving to the Submit button – Submit checks everything, and a message appearing here
   *  would move the button away from the pointer mid-click. */
  function blur(k: Key, e: React.FocusEvent) {
    const to = e.relatedTarget as HTMLButtonElement | null;
    if (to?.type === "submit") return;
    const v = d[k];
    if (!(submitted || (typeof v === "string" && v.trim()))) return;
    const show = () => setErrors((x) => ({ ...x, [k]: check(d)[k] }));
    // Safari doesn't focus a clicked button (no relatedTarget): wait a moment, in case this is a Submit click.
    if (to) show();
    else blurTimer.current = window.setTimeout(show, 250);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    window.clearTimeout(blurTimer.current);
    if (sending.current || status === "sent") return; // no double sends
    setSubmitted(true);
    const errs = check(d);
    if (Object.keys(errs).length) {
      setErrors(errs);
      track("quote_step_error", { step: variant === "hero" ? "hero" : "quote_page", fields: Object.keys(errs).join(",") });
      document.getElementById(`${p}-${FIELDS.find((f) => errs[f])}`)?.focus();
      return;
    }
    sending.current = true;
    setStatus("sending");
    enquiryId.current ??= newEnquiryId(); // kept for retries of this enquiry
    const ct = leadCleaningTypeBy(d.cleaningType);
    const place = splitSuburbPostcode(d.suburb);
    const payload = {
      kind: "quote",
      formLocation: location,
      enquiryId: enquiryId.current,
      firstName: d.firstName?.trim(),
      lastName: d.lastName?.trim(),
      cleaningType: d.cleaningType,
      suburb: place.suburb,
      postcode: place.postcode,
      phone: d.phone,
      email: d.email?.trim(),
      consent: d.consent,
      frequency: frequency.current,
      source: new URLSearchParams(window.location.search).get("utm_source") ?? `${variant === "hero" ? "hero" : "quote"}:${document.referrer || "direct"}`,
      pageUrl: (window.location.pathname + window.location.search).slice(0, 300),
      website: hp,
      elapsed: Date.now() - mountedAt.current,
      attribution: getAttribution(),
    };
    try {
      const res = await fetch("/api/quote", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error(String(res.status));
      setStatus("sent");
      // Only after the server confirms delivery, once per enquiry. Category values only – never personal data.
      if (firstConfirmation(enquiryId.current)) {
        track("generate_lead", {
          lead_type: variant === "hero" ? "quote_hero" : "quote",
          form_location: location,
          cleaning_type: d.cleaningType ?? "",
          customer_type: ct?.customer ?? "",
          service: ct?.service ?? "",
          frequency: frequency.current ?? "",
          in_area: place.postcode ? postcodeInArea(place.postcode) : undefined,
        });
      }
      const q = new URLSearchParams({ type: "quote", ...(ct?.service ? { service: ct.service } : {}) });
      router.push(`/quote/thanks?${q.toString()}`);
    } catch {
      sending.current = false;
      setStatus("error");
      track("quote_submit_error", { mode: variant });
    }
  }

  const busy = status === "sending" || status === "sent";
  const fields = (
    // Two columns from 640px. In the homepage hero between 1024 and 1151px the card is too narrow
    // for two (fields ~160px wide), so it shows one column there.
    <div className={`grid gap-x-4 gap-y-2 sm:grid-cols-2 ${variant === "hero" ? "lg:grid-cols-1 min-[1152px]:grid-cols-2" : ""}`}>
      <Field p={p} id="firstName" label="First Name" error={errors.firstName}>
        <input id={`${p}-firstName`} name="given-name" className={fieldCls(errors.firstName)} autoComplete="given-name" autoCapitalize="words" maxLength={60} value={d.firstName ?? ""} onChange={(e) => set("firstName", e.target.value)} onBlur={(e) => blur("firstName", e)} required aria-required="true" aria-invalid={!!errors.firstName} aria-describedby={errors.firstName ? `${p}-firstName-error` : undefined} />
      </Field>
      <Field p={p} id="lastName" label="Last Name" error={errors.lastName}>
        <input id={`${p}-lastName`} name="family-name" className={fieldCls(errors.lastName)} autoComplete="family-name" autoCapitalize="words" maxLength={60} value={d.lastName ?? ""} onChange={(e) => set("lastName", e.target.value)} onBlur={(e) => blur("lastName", e)} required aria-required="true" aria-invalid={!!errors.lastName} aria-describedby={errors.lastName ? `${p}-lastName-error` : undefined} />
      </Field>
      <Field p={p} id="cleaningType" label="What type of cleaning do you need?" error={errors.cleaningType}>
        <div className="relative">
          <select id={`${p}-cleaningType`} name="cleaning-type" value={d.cleaningType ?? ""} onChange={(e) => set("cleaningType", e.target.value)} onBlur={(e) => blur("cleaningType", e)} required aria-required="true" aria-invalid={!!errors.cleaningType} aria-describedby={errors.cleaningType ? `${p}-cleaningType-error` : undefined} className={`${fieldCls(errors.cleaningType)} appearance-none truncate pr-10 ${d.cleaningType ? "" : "text-slate/70"}`}>
            <option value="" disabled>Select one…</option>
            {LEAD_CLEANING_TYPES.map((o) => <option key={o.value} value={o.value} className="text-navy">{o.label}</option>)}
          </select>
          <Icon name="chevron" className="pointer-events-none absolute right-3 top-1/2 size-5 -translate-y-1/2 text-violet" />
        </div>
      </Field>
      <Field p={p} id="suburb" label="What suburb is the property in?" error={errors.suburb}>
        <input id={`${p}-suburb`} name="suburb" className={fieldCls(errors.suburb)} autoComplete="address-level2" autoCapitalize="words" maxLength={80} placeholder="e.g. Robina" value={d.suburb ?? ""} onChange={(e) => set("suburb", e.target.value)} onBlur={(e) => blur("suburb", e)} required aria-required="true" aria-invalid={!!errors.suburb} aria-describedby={errors.suburb ? `${p}-suburb-error` : undefined} />
      </Field>
      <Field p={p} id="phone" label="Phone Number" error={errors.phone}>
        <input id={`${p}-phone`} name="tel" type="tel" inputMode="tel" className={fieldCls(errors.phone)} autoComplete="tel" maxLength={20} placeholder="e.g. 0412 345 678" value={d.phone ?? ""} onChange={(e) => set("phone", e.target.value)} onBlur={(e) => blur("phone", e)} required aria-required="true" aria-invalid={!!errors.phone} aria-describedby={errors.phone ? `${p}-phone-error` : undefined} />
      </Field>
      <Field p={p} id="email" label="Email" error={errors.email}>
        <input id={`${p}-email`} name="email" type="email" inputMode="email" className={fieldCls(errors.email)} autoComplete="email" autoCapitalize="none" spellCheck={false} maxLength={200} placeholder="you@example.com" value={d.email ?? ""} onChange={(e) => set("email", e.target.value)} onBlur={(e) => blur("email", e)} required aria-required="true" aria-invalid={!!errors.email} aria-describedby={errors.email ? `${p}-email-error` : undefined} />
      </Field>
    </div>
  );

  const rest = (
    <>
      <div className="mt-4">
        <label className="flex cursor-pointer items-start gap-3 text-sm">
          <input id={`${p}-consent`} type="checkbox" checked={!!d.consent} onChange={(e) => set("consent", e.target.checked)} className="mt-0.5 size-5 shrink-0 accent-violet" aria-invalid={!!errors.consent} aria-describedby={errors.consent ? `${p}-consent-error` : undefined} />
          <span>Swept can contact me about this request. <a href="/privacy" target="_blank" className="font-semibold text-violet underline underline-offset-2">Privacy policy</a></span>
        </label>
        {errors.consent && <p id={`${p}-consent-error`} role="alert" className="error">{errors.consent}</p>}
      </div>
      {status === "error" && (
        <p role="alert" className="mt-5 rounded-xl border border-[#f4c7c3] bg-[#fef3f2] px-4 py-3 text-sm text-[#b42318]">
          Sorry – your request didn&apos;t send. Please try again in a moment{site.phone ? <> or call <a href={telHref(site.phone)} className="font-semibold underline">{site.phone}</a></> : null}.
        </p>
      )}
      <button type="submit" disabled={busy} aria-busy={status === "sending"} className="btn-primary mt-5 w-full !min-h-14 text-lg disabled:cursor-wait disabled:opacity-60">
        {busy ? "Sending…" : "Get My Free Quote"} <Icon name="arrow" className="size-5" />
      </button>
    </>
  );

  const honeypot = (
    <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
      <label>Website<input tabIndex={-1} autoComplete="off" value={hp} onChange={(e) => setHp(e.target.value)} name="website" /></label>
    </div>
  );

  if (variant === "hero") {
    // The original homepage hero card: photo (phones), title and trust line, then the six fields.
    return (
      <form id="quote" onSubmit={submit} noValidate className="relative scroll-mt-24 overflow-hidden rounded-[1.75rem] bg-white p-5 text-slate shadow-[0_30px_60px_-20px_rgb(6_27_73/0.39)] sm:p-8" aria-labelledby="hq-title">
        {honeypot}
        {/* Mobile: a real person front and centre, right where people enquire */}
        <div className="relative -mx-5 -mt-5 mb-4 aspect-[16/10] overflow-hidden lg:hidden">
          <Image src={photos.quoteCleaner.src} alt={photos.quoteCleaner.alt} fill sizes="(min-width: 640px) 600px, 100vw" quality={70} placeholder="blur" className="object-cover object-[50%_20%]" />
        </div>
        <h2 id="hq-title" className="text-center text-[1.3rem] font-extrabold uppercase tracking-wide sm:text-[1.65rem]">Request your free quote</h2>
        <p className="mt-1 flex flex-wrap items-center justify-center gap-x-2 gap-y-0.5 text-center text-sm">
          <span>Free, no obligation</span>
          <span className="inline-flex items-center gap-1 whitespace-nowrap font-medium text-navy"><Icon name="clock" className="size-4 shrink-0 text-violet" />We reply within 1 hour during business hours</span>
          {trustLabel() && <span className="inline-flex items-center gap-1 whitespace-nowrap font-medium text-navy"><Icon name="shield" className="size-4 shrink-0 text-violet" />{trustLabel()}</span>}
        </p>
        <div className="mt-5">{fields}</div>
        {rest}
        <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-sm font-medium text-navy">
          <Icon name="shieldSparkle" className="size-4 shrink-0 text-violet" />
          Something missed? <a href={site.promise.path} className="font-semibold text-violet underline underline-offset-2">We&apos;ll come back and fix it.</a>
        </p>
      </form>
    );
  }

  // /quote: the page's own heading and introduction sit above, so the card holds just the form.
  return (
    <form onSubmit={submit} noValidate className="card relative overflow-hidden p-5 text-slate sm:p-8" aria-label="Request a free cleaning quote">
      {honeypot}
      {fields}
      {rest}
    </form>
  );
}

const fieldCls = (err?: string) => `field !py-2.5 ${err ? "!border-[#d92d20]" : ""}`;

/** Label, control and message on a shared row grid, so the fields in a row line up even when one label wraps. */
function Field({ p, id, label, error, children }: { p: string; id: string; label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="row-span-3 grid grid-rows-subgrid gap-y-0">
      <label htmlFor={`${p}-${id}`} className="label self-end !text-[0.9rem]">{label}</label>
      {children}
      <div>{error && <p id={`${p}-${id}-error`} role="alert" className="error">{error}</p>}</div>
    </div>
  );
}
