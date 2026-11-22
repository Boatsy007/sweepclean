"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { rememberThanksName } from "@/lib/thanksName";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  BATHROOM_OPTIONS,
  BEDROOM_OPTIONS,
  COMMERCIAL_FREQUENCIES,
  COMMERCIAL_PROPERTY_OPTIONS,
  COMMERCIAL_TIME_OPTIONS,
  DEFAULT_CLEANING_TYPE,
  FLOOR_AREA_OPTIONS,
  RESIDENTIAL_FREQUENCIES,
  TIME_OPTIONS,
  cleaningTypeBy,
  cleaningTypesFor,
  splitSuburbPostcode,
  validateContact,
  type CustomerType,
  type Errors,
  type QuoteRequest,
} from "@/lib/quote";
import { postcodeInArea } from "@/lib/areas";
import { site, telHref } from "@/lib/site";
import { getAttribution, track } from "@/lib/analytics";
import { Icon } from "./Icon";

/** Form state. `suburb` holds what the customer typed ("Robina", "4226" or "Robina 4226"). */
type Data = Partial<QuoteRequest> & { customerType: CustomerType };
const STORAGE_KEY = "swept-quote-v2";
const LEGACY_STORAGE_KEY = "swept-quote-v1";
const STEPS: Record<CustomerType, readonly string[]> = {
  residential: ["Service", "Your home", "Timing", "Your details"],
  commercial: ["Service", "Premises", "Schedule", "Your details"],
};
const LAST = 3;
const RECURRING = ["weekly", "fortnightly", "monthly", "several_weekly"];

const FREQUENCY_NOTES: Record<string, string> = {
  weekly: "Best for kids, pets and busy homes",
  fortnightly: "A popular balance for most homes",
  monthly: "A regular reset for tidy homes",
  once: "Try us with a single clean first",
  not_sure: "We'll help you choose",
};

const empty: Data = { kind: "quote", customerType: "residential", consent: false };

function load(): Data | null {
  try {
    window.localStorage.removeItem(LEGACY_STORAGE_KEY);
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? { ...empty, ...JSON.parse(raw) } : null;
  } catch {
    return null;
  }
}
function save(d: Data) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...d, consent: false }));
  } catch {}
}
function clear() {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {}
}

/**
 * The central quote form (/quote, and the call-back form on /contact).
 * Residential and Commercial tabs switch in place (no reload, no URL change); each is a short
 * four-step form. Every quote goes to /api/quote → email + Make.com webhook → BookingKoala lead.
 */
export function QuoteForm({ initialMode = "quote", onBackToQuote }: { initialMode?: "quote" | "callback"; /** /quote: "Back to the online quote" returns to the quote form. */ onBackToQuote?: () => void } = {}) {
  const router = useRouter();
  const params = useSearchParams();
  // Start in the requested mode so the first render already has the right layout (no shift).
  const [data, setData] = useState<Data>(() => (initialMode === "callback" ? { ...empty, kind: "callback" } : empty));
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  const [hp, setHp] = useState("");
  const [resumed, setResumed] = useState(false);
  const started = useRef(false);
  const mountedAt = useRef(Date.now());
  const headingRef = useRef<HTMLHeadingElement>(null);
  const tabRefs = useRef<Record<CustomerType, HTMLButtonElement | null>>({ residential: null, commercial: null });

  // Restore saved progress, then apply URL prefill (URL wins). ?package= (retired) is ignored.
  useEffect(() => {
    const svc = params.get("service");
    const saved = svc ? null : load();
    const next: Data = { ...(saved ?? empty) };
    if (saved?.cleaningType) setResumed(true);
    const preset = svc ? cleaningTypeBy(DEFAULT_CLEANING_TYPE[svc]) : undefined;
    if (preset) {
      next.customerType = preset.customer;
      next.cleaningType = preset.value;
      next.service = preset.service;
      next.frequency = preset.fixedFrequency;
    } else if (params.get("type") === "commercial") {
      next.customerType = "commercial";
      next.cleaningType = undefined;
      next.service = undefined;
    }
    const freq = params.get("frequency");
    const freqs = next.customerType === "commercial" ? COMMERCIAL_FREQUENCIES : RESIDENTIAL_FREQUENCIES;
    if (freq && freqs.some((f) => f.value === freq) && (!preset || preset.recurring)) next.frequency = freq;
    const suburb = params.get("suburb");
    if (suburb) next.suburb = suburb.slice(0, 80);
    next.kind = params.get("mode") === "callback" || initialMode === "callback" ? "callback" : "quote";
    next.source = params.get("utm_source") ?? params.get("source") ?? next.source ?? (typeof document !== "undefined" ? document.referrer || "direct" : undefined);
    setData(next);
    // A residential service chosen on the page it came from: go straight to the home details.
    if (preset && next.kind === "quote" && preset.customer === "residential" && (!preset.recurring || next.frequency)) setStep(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (data.cleaningType || data.suburb) save(data);
  }, [data]);

  const ct = useMemo(() => cleaningTypeBy(data.cleaningType), [data.cleaningType]);
  const isCallback = data.kind === "callback";
  const commercial = data.customerType === "commercial";
  const steps = STEPS[data.customerType];
  const place = splitSuburbPostcode(data.suburb);

  function begin() {
    if (!started.current) {
      started.current = true;
      track("quote_start", { service: data.service ?? "", mode: data.kind ?? "quote", customer_type: data.customerType });
    }
  }

  function set<K extends keyof Data>(k: K, v: Data[K]) {
    begin();
    setData((d) => ({ ...d, [k]: v }));
    setErrors((e) => ({ ...e, [k]: undefined }));
  }

  function chooseType(value: string) {
    begin();
    const t = cleaningTypeBy(value);
    setData((d) => ({
      ...d,
      cleaningType: t?.value,
      service: t?.service,
      // Bond, deep, carpet and other one-off cleans are a single visit; recurring cleans ask how often.
      // A frequency fixed by the previous choice (one-off) is cleared rather than carried over.
      frequency: t?.fixedFrequency ?? (t?.recurring && d.frequency !== "once" ? d.frequency : undefined),
    }));
    setErrors((e) => ({ ...e, cleaningType: undefined, frequency: undefined }));
  }

  function switchTab(to: CustomerType) {
    if (to === data.customerType) return;
    setData((d) => ({ ...d, customerType: to, cleaningType: undefined, service: undefined, frequency: undefined, propertyType: undefined, size: undefined, timePref: undefined }));
    setErrors({});
    setStep(0);
  }

  function onTabKey(e: React.KeyboardEvent) {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight" && e.key !== "Home" && e.key !== "End") return;
    e.preventDefault();
    const to: CustomerType = e.key === "Home" ? "residential" : e.key === "End" ? "commercial" : data.customerType === "residential" ? "commercial" : "residential";
    switchTab(to);
    tabRefs.current[to]?.focus();
  }

  function validateStep(i: number): Errors {
    const e: Errors = {};
    if (i === 0) {
      if (!ct) e.cleaningType = "Choose the type of cleaning you need.";
      else if (!commercial && ct.recurring && !data.frequency) e.frequency = "How often would you like us to come?";
      if (commercial && !data.propertyType) e.propertyType = "Choose the type of property.";
    }
    if (i === 1) {
      if (!commercial && ct?.rooms) {
        if (!data.bedrooms) e.bedrooms = "How many bedrooms?";
        if (!data.bathrooms) e.bathrooms = "How many bathrooms?";
      }
      if (commercial && !data.size) e.size = "Roughly how big is the space? Choose “Not sure” if you don't know.";
      if (!data.suburb || data.suburb.trim().length < 2) e.suburb = "Please enter your suburb or postcode.";
    }
    if (i === 2 && commercial && !data.frequency) e.frequency = "How often would you like us to clean?";
    if (i === LAST) Object.assign(e, validateContact({ ...data, suburb: place.suburb, postcode: place.postcode }, "quote"));
    return e;
  }

  function go(to: number) {
    setStep(to);
    setErrors({});
    requestAnimationFrame(() => {
      headingRef.current?.focus();
      headingRef.current?.scrollIntoView({ block: "start", behavior: "smooth" });
    });
  }

  function next() {
    const e = validateStep(step);
    if (Object.keys(e).length) {
      setErrors(e);
      track("quote_step_error", { step: step + 1, fields: Object.keys(e).join(","), customer_type: data.customerType });
      return;
    }
    track("quote_step", { step: step + 1, step_name: steps[step], service: data.service ?? "", customer_type: data.customerType });
    go(step + 1);
  }

  /** Only the answers that belong to the chosen tab and cleaning type are sent. */
  function body() {
    const base = { website: hp, elapsed: Date.now() - mountedAt.current, page: window.location.pathname + window.location.search, attribution: getAttribution(), source: data.source };
    if (isCallback) {
      return { ...base, kind: "callback", service: data.service, name: data.name, phone: data.phone, email: data.email, suburb: data.suburb, timePref: data.timePref, consent: data.consent };
    }
    const common = {
      ...base,
      kind: "quote",
      customerType: data.customerType,
      cleaningType: data.cleaningType,
      service: data.service,
      frequency: data.frequency,
      suburb: place.suburb,
      postcode: place.postcode,
      name: data.name,
      phone: data.phone,
      email: data.email || undefined,
      notes: data.notes,
      consent: data.consent,
    };
    return commercial
      ? { ...common, businessName: data.businessName, propertyType: data.propertyType, size: data.size, timePref: data.timePref }
      : { ...common, startDate: data.startDate, ...(ct?.rooms ? { bedrooms: data.bedrooms, bathrooms: data.bathrooms } : {}) };
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!isCallback && step < LAST) return next();
    const errs = isCallback ? validateContact(data, "callback") : validateStep(LAST);
    if (Object.keys(errs).length) {
      setErrors(errs);
      if (!isCallback) track("quote_step_error", { step: LAST + 1, fields: Object.keys(errs).join(","), customer_type: data.customerType });
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch("/api/quote", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body()) });
      if (!res.ok) throw new Error(String(res.status));
      // Once per successful (server-confirmed) enquiry. Category values only – never personal data.
      track("generate_lead", {
        lead_type: data.kind ?? "quote",
        ...(isCallback ? {} : { customer_type: data.customerType, cleaning_type: data.cleaningType ?? "" }),
        service: data.service ?? "",
        frequency: data.frequency ?? "",
        recurring: !!data.frequency && RECURRING.includes(data.frequency),
        in_area: place.postcode ? postcodeInArea(place.postcode) : undefined,
      });
      clear();
      rememberThanksName(data.name); // shown on the thank-you page – kept out of the URL (analytics)
      const q = new URLSearchParams({ type: data.kind ?? "quote", ...(data.service ? { service: data.service } : {}) });
      router.push(`/quote/thanks?${q.toString()}`);
    } catch {
      setStatus("error");
      track("quote_submit_error", {});
    }
  }

  const outOfArea = place.postcode && !postcodeInArea(place.postcode);
  const frequencies = commercial ? COMMERCIAL_FREQUENCIES : RESIDENTIAL_FREQUENCIES;

  return (
    <form onSubmit={submit} noValidate className="card overflow-hidden" aria-describedby="form-help">
      {/* Honeypot – hidden from people, tempting to bots */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>Website<input tabIndex={-1} autoComplete="off" value={hp} onChange={(e) => setHp(e.target.value)} name="website" /></label>
      </div>

      {!isCallback && (
        <>
          <div role="tablist" aria-label="Type of customer" className="grid grid-cols-2 gap-1.5 border-b border-lilac bg-white p-2 sm:p-2.5" onKeyDown={onTabKey}>
            {(["residential", "commercial"] as const).map((c) => {
              const on = data.customerType === c;
              return (
                <button
                  key={c}
                  ref={(el) => { tabRefs.current[c] = el; }}
                  type="button"
                  role="tab"
                  id={`tab-${c}`}
                  aria-selected={on}
                  aria-controls="quote-panel"
                  tabIndex={on ? 0 : -1}
                  data-quote-tab={c}
                  onClick={() => switchTab(c)}
                  className={`flex min-h-12 items-center justify-center gap-2 rounded-xl font-display text-[1.02rem] font-bold transition focus-visible:outline focus-visible:outline-3 focus-visible:outline-electric ${on ? "bg-violet text-white shadow-soft" : "text-navy hover:bg-lavender"}`}
                >
                  <Icon name={c === "residential" ? "home" : "city"} className="size-5" />
                  {c === "residential" ? "Residential" : "Commercial"}
                </button>
              );
            })}
          </div>
          <div className="border-b border-lilac bg-lavender/60 px-5 py-4 sm:px-8">
            <ol className="flex items-center gap-2" aria-label="Progress">
              {steps.map((s, i) => (
                <li key={s} className="flex flex-1 flex-col gap-1.5" aria-current={i === step ? "step" : undefined}>
                  <span className={`h-1.5 rounded-full transition-colors ${i <= step ? "bg-violet" : "bg-lilac"}`} />
                  <span className={`hidden text-xs font-semibold sm:block ${i === step ? "text-violet-ink" : "text-slate"}`}>{i + 1}. {s}</span>
                </li>
              ))}
            </ol>
            <p className="mt-2 text-sm sm:hidden">Step {step + 1} of {steps.length}: <strong className="text-navy">{steps[step]}</strong></p>
          </div>
        </>
      )}

      <div id="quote-panel" role={isCallback ? undefined : "tabpanel"} aria-labelledby={isCallback ? undefined : `tab-${data.customerType}`} className="px-5 py-7 sm:px-8 sm:py-9">
        <p id="form-help" className="sr-only">All fields marked required must be completed.</p>
        {resumed && !isCallback && (
          <p className="mb-6 flex flex-wrap items-center justify-between gap-2 rounded-xl bg-lavender px-4 py-3 text-sm text-violet-ink">
            Welcome back – we&apos;ve kept your answers so far.
            <button type="button" className="font-semibold underline underline-offset-2" onClick={() => { clear(); setData({ ...empty, source: data.source }); setResumed(false); go(0); }}>Start over</button>
          </p>
        )}

        {isCallback ? (
          <CallbackFields data={data} set={set} errors={errors} headingRef={headingRef} onBack={onBackToQuote ?? (() => { set("kind", "quote"); go(0); })} />
        ) : (
          <>
            {step === 0 && (
              <div>
                <h2 ref={headingRef} tabIndex={-1} className="text-2xl font-bold outline-none sm:text-3xl">{commercial ? "What cleaning does your business need?" : "What kind of clean do you need?"}</h2>
                <div className="mt-6">
                  <label htmlFor="cleaningType" className="label">Type of cleaning</label>
                  <div className="relative">
                    <select id="cleaningType" value={data.cleaningType ?? ""} onChange={(e) => chooseType(e.target.value)} aria-invalid={!!errors.cleaningType} aria-required aria-describedby={errors.cleaningType ? "cleaningType-error" : undefined} className={`field appearance-none pr-10 ${errors.cleaningType ? "!border-[#d92d20]" : ""}`}>
                      <option value="" disabled>Choose a service…</option>
                      {cleaningTypesFor(data.customerType).map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                    </select>
                    <Icon name="chevron" className="pointer-events-none absolute right-3 top-1/2 size-5 -translate-y-1/2 text-violet" />
                  </div>
                  <FieldError id="cleaningType" msg={errors.cleaningType} />
                </div>

                {!commercial && ct?.recurring && (
                  <fieldset className="mt-7" aria-describedby={errors.frequency ? "frequency-error" : undefined}>
                    <legend className="label">How often?</legend>
                    <div className="mt-1 grid gap-3 sm:grid-cols-2">
                      {RESIDENTIAL_FREQUENCIES.map((f) => (
                        <ChoiceCard key={f.value} name="frequency" value={f.value} checked={data.frequency === f.value} onChange={() => set("frequency", f.value)} icon="calendar" title={f.label} body={FREQUENCY_NOTES[f.value]} />
                      ))}
                    </div>
                    <FieldError id="frequency" msg={errors.frequency} />
                    {site.recurringOffer && <p className="mt-3 text-sm font-semibold text-violet">{site.recurringOffer}</p>}
                  </fieldset>
                )}
                {!commercial && ct?.value === "bond" && <p className="mt-4 text-sm">Bond cleans are a one-off clean before your final inspection.</p>}

                {commercial && (
                  <Pills label="Type of property" name="propertyType" options={COMMERCIAL_PROPERTY_OPTIONS} value={data.propertyType} onChange={(v) => set("propertyType", v)} error={errors.propertyType} />
                )}

                <p className="mt-6 text-sm">
                  Rather talk it through?{" "}
                  <button type="button" onClick={() => { set("kind", "callback"); track("callback_mode", {}); requestAnimationFrame(() => headingRef.current?.focus()); }} className="font-semibold text-violet underline underline-offset-4">Request a quick call back</button>
                </p>
              </div>
            )}

            {step === 1 && (
              <div>
                <h2 ref={headingRef} tabIndex={-1} className="text-2xl font-bold outline-none sm:text-3xl">{commercial ? "Tell us about the premises" : "Tell us about your home"}</h2>
                {!commercial && ct?.rooms && (
                  <div className="grid gap-x-6 sm:grid-cols-2">
                    <Pills label="Bedrooms" name="bedrooms" options={BEDROOM_OPTIONS} value={data.bedrooms} onChange={(v) => set("bedrooms", v)} error={errors.bedrooms} compact />
                    <Pills label="Bathrooms" name="bathrooms" options={BATHROOM_OPTIONS} value={data.bathrooms} onChange={(v) => set("bathrooms", v)} error={errors.bathrooms} compact />
                  </div>
                )}
                {commercial && <Pills label="Approximate floor area" name="size" options={FLOOR_AREA_OPTIONS} value={data.size} onChange={(v) => set("size", v)} error={errors.size} />}
                <div className="mt-7 max-w-md">
                  <TextField id="suburb" label="Suburb or postcode" autoComplete="address-level2" placeholder="e.g. Robina or 4226" value={data.suburb} onChange={(v) => set("suburb", v)} error={errors.suburb} required />
                </div>
                {outOfArea && <p className="mt-3 rounded-xl bg-lavender px-4 py-3 text-sm text-violet-ink">That postcode may be outside our usual Brisbane-to-Tweed area – send your request anyway and we&apos;ll let you know if we can help.</p>}
              </div>
            )}

            {step === 2 && (
              <div>
                <h2 ref={headingRef} tabIndex={-1} className="text-2xl font-bold outline-none sm:text-3xl">{commercial ? "How often, and when?" : "When, and anything else?"}</h2>
                {commercial ? (
                  <>
                    <Pills label="How often?" name="frequency" options={frequencies.map((f) => f.label)} value={frequencies.find((f) => f.value === data.frequency)?.label} onChange={(v) => set("frequency", frequencies.find((f) => f.label === v)?.value)} error={errors.frequency} />
                    <Pills label="Preferred times" name="timePref" options={COMMERCIAL_TIME_OPTIONS} value={data.timePref} onChange={(v) => set("timePref", v)} optional />
                  </>
                ) : (
                  <>
                    <div className="mt-6 max-w-xs">
                      <label htmlFor="startDate" className="label">{ct?.value === "bond" ? "Vacate / clean date" : "Preferred date"} <span className="font-normal text-slate">(optional)</span></label>
                      <input id="startDate" type="date" className="field" min={new Date().toISOString().slice(0, 10)} value={data.startDate ?? ""} onChange={(e) => set("startDate", e.target.value)} />
                    </div>
                    <Requirements value={data.notes} onChange={(v) => set("notes", v)} placeholder="Priorities, access, pets, anything we should focus on…" />
                  </>
                )}
              </div>
            )}

            {step === LAST && (
              <div>
                <h2 ref={headingRef} tabIndex={-1} className="text-2xl font-bold outline-none sm:text-3xl">How can we reach you?</h2>
                <p className="mt-2">We&apos;ll be in touch {site.quoteResponse} to discuss your requirements. No spam, no sharing your details.</p>
                {commercial && (
                  <div className="mt-6">
                    <TextField id="businessName" label="Business name" autoComplete="organization" value={data.businessName} onChange={(v) => set("businessName", v)} />
                  </div>
                )}
                <div className={`${commercial ? "mt-5" : "mt-6"} grid gap-5 sm:grid-cols-2`}>
                  <TextField id="name" label={commercial ? "Contact name" : "Full name"} autoComplete="name" value={data.name} onChange={(v) => set("name", v)} error={errors.name} required />
                  <TextField id="phone" label="Phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="e.g. 0412 345 678" value={data.phone} onChange={(v) => set("phone", v)} error={errors.phone} required />
                </div>
                <div className="mt-5">
                  <TextField id="email" label="Email" type="email" inputMode="email" autoComplete="email" value={data.email} onChange={(v) => set("email", v)} error={errors.email} required />
                </div>
                {commercial && <Requirements value={data.notes} onChange={(v) => set("notes", v)} placeholder="Areas to clean, access and security, anything we should know…" />}
                <Consent checked={!!data.consent} onChange={(v) => set("consent", v)} error={errors.consent} />
              </div>
            )}
          </>
        )}

        {status === "error" && (
          <p role="alert" className="mt-6 rounded-xl border border-[#f4c7c3] bg-[#fef3f2] px-4 py-3 text-sm text-[#b42318]">
            Sorry – your request didn&apos;t send. Please try again in a moment{site.phone ? <> or call us on <a className="font-semibold underline" href={telHref(site.phone)}>{site.phone}</a></> : null}{site.email ? <> or email <a className="font-semibold underline" href={`mailto:${site.email}`}>{site.email}</a></> : null}.
          </p>
        )}

        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
          {!isCallback && step > 0 ? (
            <button type="button" onClick={() => go(step - 1)} className="btn !px-4 text-slate hover:text-violet">← Back</button>
          ) : <span />}
          {!isCallback && step < LAST ? (
            // Distinct keys: React must not turn the clicked Continue button into the submit button
            // mid-click (the browser would then submit the empty last step).
            <button key="continue" type="button" onClick={next} className="btn-primary">Continue <Icon name="arrow" className="size-4" /></button>
          ) : (
            <button key="submit" type="submit" disabled={status === "sending"} className="btn-primary disabled:opacity-60">
              {status === "sending" ? "Sending…" : isCallback ? "Request a call back" : "Request My Free Quote"} <Icon name="arrow" className="size-4" />
            </button>
          )}
        </div>
        {!isCallback && <p className="mt-5 text-center text-sm text-slate sm:text-right">No obligation. Personalised quotes. Clear upfront pricing.</p>}
      </div>
    </form>
  );
}

/* ---------- field primitives ---------- */

export function FieldError({ id, msg }: { id: string; msg?: string }) {
  return msg ? <p id={`${id}-error`} className="error" role="alert">{msg}</p> : null;
}

function Requirements({ value, onChange, placeholder }: { value?: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <div className="mt-6">
      <label htmlFor="notes" className="label">Additional requirements <span className="font-normal text-slate">(optional)</span></label>
      <textarea id="notes" rows={3} className="field" maxLength={2000} placeholder={placeholder} value={value ?? ""} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

function ChoiceCard({ name, value, checked, onChange, icon, title, body }: { name: string; value: string; checked: boolean; onChange: () => void; icon: string; title: string; body: string }) {
  return (
    <label className={`flex cursor-pointer items-start gap-3 rounded-2xl border-2 p-4 transition has-[:focus-visible]:outline has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-electric ${checked ? "border-violet bg-lavender" : "border-lilac bg-white hover:border-violet/50"}`}>
      <input type="radio" name={name} value={value} checked={checked} onChange={onChange} className="sr-only" />
      <span className={`grid size-10 shrink-0 place-items-center rounded-xl ${checked ? "bg-violet text-white" : "bg-lavender text-violet"}`}><Icon name={icon} className="size-5" /></span>
      <span>
        <span className="block font-display text-[1.05rem] font-semibold text-navy">{title}</span>
        <span className="block text-sm">{body}</span>
      </span>
    </label>
  );
}

export function Pills({ label, name, options, value, onChange, error, compact, optional, noTopMargin }: { label: string; name: string; options: readonly string[]; value?: string; onChange: (v: string) => void; error?: string; compact?: boolean; optional?: boolean; noTopMargin?: boolean }) {
  return (
    <fieldset className={noTopMargin ? "" : "mt-7"} aria-describedby={error ? `${name}-error` : undefined}>
      <legend className="label">{label}{optional && <span className="font-normal text-slate"> (optional)</span>}</legend>
      <div className="mt-1 flex flex-wrap gap-2.5">
        {options.map((o) => (
          <label key={o} className={`inline-flex min-h-11 cursor-pointer items-center justify-center rounded-full border-2 font-semibold transition has-[:focus-visible]:outline has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-electric ${compact ? "min-w-12 px-3.5" : "px-5"} ${value === o ? "border-violet bg-violet text-white" : "border-lilac bg-white text-navy hover:border-violet/60"}`}>
            <input type="radio" name={name} value={o} checked={value === o} onChange={() => onChange(o)} className="sr-only" />
            {o}
          </label>
        ))}
      </div>
      <FieldError id={name} msg={error} />
    </fieldset>
  );
}

export function TextField({ id, label, value, onChange, error, required, ...rest }: { id: string; label: string; value?: string; onChange: (v: string) => void; error?: string; required?: boolean } & Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange" | "id">) {
  return (
    <div>
      <label htmlFor={id} className="label">{label}{!required && <span className="font-normal text-slate"> (optional)</span>}</label>
      <input id={id} className={`field ${error ? "!border-[#d92d20]" : ""}`} value={value ?? ""} onChange={(e) => onChange(e.target.value)} aria-invalid={!!error} aria-required={required} aria-describedby={error ? `${id}-error` : undefined} {...rest} />
      <FieldError id={id} msg={error} />
    </div>
  );
}

export function Consent({ checked, onChange, error }: { checked: boolean; onChange: (v: boolean) => void; error?: string }) {
  return (
    <div className="mt-6">
      <label className="flex cursor-pointer items-start gap-3 text-sm">
        <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="mt-0.5 size-5 shrink-0 accent-violet" aria-invalid={!!error} aria-describedby={error ? "consent-error" : undefined} />
        <span>Swept can contact me about this request. See our <a href="/privacy" target="_blank" className="font-semibold text-violet underline underline-offset-2">privacy policy</a>.</span>
      </label>
      <FieldError id="consent" msg={error} />
    </div>
  );
}

function CallbackFields({ data, set, errors, headingRef, onBack }: { data: Data; set: <K extends keyof Data>(k: K, v: Data[K]) => void; errors: Errors; headingRef: React.RefObject<HTMLHeadingElement | null>; onBack: () => void }) {
  return (
    <div>
      <h2 ref={headingRef} tabIndex={-1} className="text-2xl font-bold outline-none sm:text-3xl">Request a call back</h2>
      <p className="mt-2">Leave your number and we&apos;ll call you {site.quoteResponse} to talk through your clean.</p>
      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <TextField id="name" label="Your name" autoComplete="name" value={data.name} onChange={(v) => set("name", v)} error={errors.name} required />
        <TextField id="phone" label="Mobile" type="tel" inputMode="tel" autoComplete="tel" value={data.phone} onChange={(v) => set("phone", v)} error={errors.phone} required />
      </div>
      <div className="mt-5">
        <TextField id="suburb" label="Suburb" autoComplete="address-level2" value={data.suburb} onChange={(v) => set("suburb", v)} error={errors.suburb} required />
      </div>
      <Pills label="Best time to call" name="timePref" options={TIME_OPTIONS} value={data.timePref} onChange={(v) => set("timePref", v)} compact optional />
      <Consent checked={!!data.consent} onChange={(v) => set("consent", v)} error={errors.consent} />
      <p className="mt-6 text-sm"><button type="button" onClick={onBack} className="font-semibold text-violet underline underline-offset-4">← Back to the online quote</button></p>
    </div>
  );
}
