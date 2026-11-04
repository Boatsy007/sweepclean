"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  EXTRA_OPTIONS,
  FREQUENCY_OPTIONS,
  PREMISES_OPTIONS,
  PROPERTY_OPTIONS,
  SIZE_OPTIONS,
  SERVICE_OPTIONS,
  TIME_OPTIONS,
  validateContact,
  type Errors,
  type QuoteRequest,
} from "@/lib/quote";
import { services } from "@/lib/services";
import { postcodeInArea } from "@/lib/areas";
import { site, telHref } from "@/lib/site";
import { track } from "@/lib/analytics";
import { Icon } from "./Icon";

type Data = Partial<QuoteRequest> & { extras: string[] };
const STORAGE_KEY = "swept-quote-v1";
const STEPS = ["Service", "Your home", "Timing", "Your details"] as const;

const empty: Data = { kind: "quote", extras: [], consent: false, contactPref: "Phone" };

function load(): Data | null {
  try {
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

export function QuoteForm({ initialMode = "quote" }: { initialMode?: "quote" | "callback" } = {}) {
  const router = useRouter();
  const params = useSearchParams();
  const [data, setData] = useState<Data>(empty);
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  const [hp, setHp] = useState("");
  const [resumed, setResumed] = useState(false);
  const started = useRef(false);
  const mountedAt = useRef(Date.now());
  const headingRef = useRef<HTMLHeadingElement>(null);

  // Restore saved progress, then apply URL prefill (URL wins).
  useEffect(() => {
    const saved = load();
    const next: Data = { ...(saved ?? empty) };
    if (saved?.service && !params.get("service")) setResumed(true);
    const svc = params.get("service");
    const freq = params.get("frequency");
    const suburb = params.get("suburb");
    if (svc && SERVICE_OPTIONS.some((o) => o.value === svc)) next.service = svc;
    if (freq && FREQUENCY_OPTIONS.some((o) => o.value === freq)) next.frequency = freq;
    if (suburb) {
      if (/^\d{4}$/.test(suburb)) next.postcode = suburb;
      else next.suburb = suburb.slice(0, 80);
    }
    next.kind = params.get("mode") === "callback" || initialMode === "callback" ? "callback" : "quote";
    next.source = params.get("utm_source") ?? params.get("source") ?? next.source ?? (typeof document !== "undefined" ? document.referrer || "direct" : undefined);
    setData(next);
    if (svc && next.service && next.kind === "quote") setStep(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (data.service || data.suburb) save(data);
  }, [data]);

  const service = useMemo(() => services.find((s) => s.slug === data.service), [data.service]);
  const isCallback = data.kind === "callback";

  function set<K extends keyof Data>(k: K, v: Data[K]) {
    if (!started.current) {
      started.current = true;
      track("quote_start", { service: data.service ?? "", mode: data.kind ?? "quote" });
    }
    setData((d) => ({ ...d, [k]: v }));
    setErrors((e) => ({ ...e, [k]: undefined }));
  }

  function validateStep(i: number): Errors {
    const e: Errors = {};
    if (i === 0 && !data.service) e.service = "Choose the type of clean you need.";
    if (i === 1) {
      if (!data.propertyType) e.propertyType = service?.commercial ? "Choose a type of premises." : "Choose a property type.";
      if (service?.commercial) {
        if (!data.size) e.size = "Roughly how big is the space?";
      } else {
        if (!data.bedrooms) e.bedrooms = "How many bedrooms?";
        if (!data.bathrooms) e.bathrooms = "How many bathrooms?";
      }
    }
    if (i === 2 && service?.recurring && !data.frequency) e.frequency = "How often would you like us to come?";
    if (i === 3) Object.assign(e, validateContact(data, "quote"));
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
      track("quote_step_error", { step: step + 1, fields: Object.keys(e).join(",") });
      return;
    }
    track("quote_step", { step: step + 1, step_name: STEPS[step], service: data.service ?? "" });
    go(step + 1);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!isCallback && step < STEPS.length - 1) return next();
    const errs = isCallback ? validateContact(data, "callback") : validateStep(3);
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, website: hp, elapsed: Date.now() - mountedAt.current, page: window.location.pathname + window.location.search }),
      });
      if (!res.ok) throw new Error(String(res.status));
      track("generate_lead", {
        lead_type: data.kind ?? "quote",
        service: data.service ?? "",
        frequency: data.frequency ?? "",
        recurring: data.frequency ? data.frequency !== "once" : false,
        in_area: data.postcode ? postcodeInArea(data.postcode) : undefined,
      });
      clear();
      const q = new URLSearchParams({ type: data.kind ?? "quote", ...(data.service ? { service: data.service } : {}), ...(data.name ? { name: data.name.split(" ")[0] } : {}) });
      router.push(`/quote/thanks?${q.toString()}`);
    } catch {
      setStatus("error");
      track("quote_submit_error", {});
    }
  }

  const outOfArea = data.postcode && /^\d{4}$/.test(data.postcode) && !postcodeInArea(data.postcode);

  return (
    <form onSubmit={submit} noValidate className="card overflow-hidden" aria-describedby="form-help">
      {/* Honeypot – hidden from people, tempting to bots */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>Website<input tabIndex={-1} autoComplete="off" value={hp} onChange={(e) => setHp(e.target.value)} name="website" /></label>
      </div>

      {!isCallback && (
        <div className="border-b border-lilac bg-lavender/60 px-5 py-4 sm:px-8">
          <ol className="flex items-center gap-2" aria-label="Progress">
            {STEPS.map((s, i) => (
              <li key={s} className="flex flex-1 flex-col gap-1.5" aria-current={i === step ? "step" : undefined}>
                <span className={`h-1.5 rounded-full transition-colors ${i <= step ? "bg-violet" : "bg-lilac"}`} />
                <span className={`hidden text-xs font-semibold sm:block ${i === step ? "text-violet" : "text-slate"}`}>{i + 1}. {s}</span>
              </li>
            ))}
          </ol>
          <p className="mt-2 text-sm sm:hidden">Step {step + 1} of {STEPS.length}: <strong className="text-navy">{STEPS[step]}</strong></p>
        </div>
      )}

      <div className="px-5 py-7 sm:px-8 sm:py-9">
        <p id="form-help" className="sr-only">All fields marked required must be completed.</p>
        {resumed && !isCallback && (
          <p className="mb-6 flex flex-wrap items-center justify-between gap-2 rounded-xl bg-lavender px-4 py-3 text-sm text-violet-ink">
            Welcome back – we&apos;ve kept your answers so far.
            <button type="button" className="font-semibold underline underline-offset-2" onClick={() => { clear(); setData({ ...empty, source: data.source }); setResumed(false); go(0); }}>Start over</button>
          </p>
        )}

        {isCallback ? (
          <CallbackFields data={data} set={set} errors={errors} headingRef={headingRef} onBack={() => { set("kind", "quote"); go(0); }} />
        ) : (
          <>
            {step === 0 && (
              <fieldset>
                <legend><h2 ref={headingRef} tabIndex={-1} className="text-2xl font-bold outline-none sm:text-3xl">What kind of clean do you need?</h2></legend>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {services.map((s) => (
                    <ChoiceCard key={s.slug} name="service" value={s.slug} checked={data.service === s.slug} onChange={() => set("service", s.slug)} icon={s.icon} title={s.name} body={s.bestFor} />
                  ))}
                </div>
                <FieldError id="service" msg={errors.service} />
                <p className="mt-6 text-sm">
                  Rather talk it through?{" "}
                  <button type="button" onClick={() => { set("kind", "callback"); track("callback_mode", {}); requestAnimationFrame(() => headingRef.current?.focus()); }} className="font-semibold text-violet underline underline-offset-4">Request a quick call back</button>
                </p>
              </fieldset>
            )}

            {step === 1 && (
              <div>
                <h2 ref={headingRef} tabIndex={-1} className="text-2xl font-bold outline-none sm:text-3xl">{service?.commercial ? "Tell us about the premises" : "Tell us about your home"}</h2>
                {service?.commercial ? (
                  <>
                    <Pills label="Type of premises" name="propertyType" options={PREMISES_OPTIONS} value={data.propertyType} onChange={(v) => set("propertyType", v)} error={errors.propertyType} />
                    <Pills label="Approximate size" name="size" options={SIZE_OPTIONS} value={data.size} onChange={(v) => set("size", v)} error={errors.size} />
                    <Pills label="Bathrooms" name="bathrooms" options={["1", "2", "3", "4+"]} value={data.bathrooms} onChange={(v) => set("bathrooms", v)} compact optional />
                  </>
                ) : (
                <>
                <Pills label="Property type" name="propertyType" options={PROPERTY_OPTIONS} value={data.propertyType} onChange={(v) => set("propertyType", v)} error={errors.propertyType} />
                <div className="grid gap-x-6 sm:grid-cols-2">
                  <Pills label="Bedrooms" name="bedrooms" options={["1", "2", "3", "4", "5+"]} value={data.bedrooms} onChange={(v) => set("bedrooms", v)} error={errors.bedrooms} compact />
                  <Pills label="Bathrooms" name="bathrooms" options={["1", "2", "3", "4+"]} value={data.bathrooms} onChange={(v) => set("bathrooms", v)} error={errors.bathrooms} compact />
                </div>
                <Pills label="Any pets at home?" name="pets" options={["No", "Yes"]} value={data.pets} onChange={(v) => set("pets", v)} compact optional />
                </>
                )}
                {!service?.commercial && service?.slug !== "carpet-cleaning" && (
                <fieldset className="mt-7">
                  <legend className="label">Anything extra to include? <span className="font-normal text-slate">(optional)</span></legend>
                  <div className="mt-1 flex flex-wrap gap-2.5">
                    {EXTRA_OPTIONS.map((x) => {
                      const on = data.extras.includes(x);
                      return (
                        <label key={x} className={`inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border-2 px-4 font-medium transition has-[:focus-visible]:outline has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-electric ${on ? "border-violet bg-violet text-white" : "border-lilac bg-white text-navy hover:border-violet/60"}`}>
                          <input type="checkbox" className="sr-only" checked={on} onChange={() => set("extras", on ? data.extras.filter((e) => e !== x) : [...data.extras, x])} />
                          {on && <Icon name="check" className="size-4" />}{x}
                        </label>
                      );
                    })}
                  </div>
                </fieldset>
                )}
              </div>
            )}

            {step === 2 && (
              <div>
                <h2 ref={headingRef} tabIndex={-1} className="text-2xl font-bold outline-none sm:text-3xl">{service?.recurring ? "How often, and when?" : "When do you need us?"}</h2>
                {service?.recurring && (
                  <fieldset className="mt-6">
                    <legend className="label">How often?</legend>
                    <div className="mt-1 grid gap-3 sm:grid-cols-2">
                      {FREQUENCY_OPTIONS.map((f) => (
                        <ChoiceCard key={f.value} name="frequency" value={f.value} checked={data.frequency === f.value} onChange={() => set("frequency", f.value)} icon="calendar" title={f.label} body={f.value === "once" ? "Try us with a single clean first" : f.value === "fortnightly" ? "A popular balance for most homes" : f.value === "weekly" ? "Best for kids, pets and busy homes" : "A regular reset for tidy homes"} />
                      ))}
                    </div>
                    <FieldError id="frequency" msg={errors.frequency} />
                    {site.recurringOffer && <p className="mt-3 text-sm font-semibold text-violet">{site.recurringOffer}</p>}
                  </fieldset>
                )}
                <div className="mt-7 grid gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="startDate" className="label">{service?.slug === "bond-cleaning" ? "Vacate / clean date" : "Preferred start date"} <span className="font-normal text-slate">(optional)</span></label>
                    <input id="startDate" type="date" className="field" min={new Date().toISOString().slice(0, 10)} value={data.startDate ?? ""} onChange={(e) => set("startDate", e.target.value)} />
                  </div>
                  <Pills label="Time of day" name="timePref" options={TIME_OPTIONS} value={data.timePref} onChange={(v) => set("timePref", v)} compact optional noTopMargin />
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <h2 ref={headingRef} tabIndex={-1} className="text-2xl font-bold outline-none sm:text-3xl">Where should we send your quote?</h2>
                <p className="mt-2">We&apos;ll reply {site.quoteResponse}. No spam, no sharing your details.</p>
                <div className="mt-6 grid gap-5 sm:grid-cols-[1fr_9rem]">
                  <TextField id="suburb" label="Suburb" autoComplete="address-level2" value={data.suburb} onChange={(v) => set("suburb", v)} error={errors.suburb} required />
                  <TextField id="postcode" label="Postcode" inputMode="numeric" autoComplete="postal-code" maxLength={4} value={data.postcode} onChange={(v) => set("postcode", v.replace(/\D/g, ""))} error={errors.postcode} />
                </div>
                {outOfArea && <p className="mt-3 rounded-xl bg-lavender px-4 py-3 text-sm text-violet-ink">That postcode may be outside our usual Brisbane-to-Tweed area – send your request anyway and we&apos;ll let you know if we can help.</p>}
                <div className="mt-5 grid gap-5 sm:grid-cols-2">
                  <TextField id="name" label="Your name" autoComplete="name" value={data.name} onChange={(v) => set("name", v)} error={errors.name} required />
                  <TextField id="phone" label="Mobile" type="tel" inputMode="tel" autoComplete="tel" value={data.phone} onChange={(v) => set("phone", v)} error={errors.phone} required />
                </div>
                <div className="mt-5">
                  <TextField id="email" label="Email" type="email" inputMode="email" autoComplete="email" value={data.email} onChange={(v) => set("email", v)} error={errors.email} required />
                </div>
                <Pills label="Best way to reach you" name="contactPref" options={["Phone", "SMS", "Email"]} value={data.contactPref} onChange={(v) => set("contactPref", v)} compact optional />
                <div className="mt-6">
                  <label htmlFor="notes" className="label">Anything we should know? <span className="font-normal text-slate">(optional)</span></label>
                  <textarea id="notes" rows={3} className="field" maxLength={2000} placeholder="Priorities, access, parking, pets…" value={data.notes ?? ""} onChange={(e) => set("notes", e.target.value)} />
                </div>
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
          {!isCallback && step < STEPS.length - 1 ? (
            <button type="button" onClick={next} className="btn-primary">Continue <Icon name="arrow" className="size-4" /></button>
          ) : (
            <button type="submit" disabled={status === "sending"} className="btn-primary disabled:opacity-60">
              {status === "sending" ? "Sending…" : isCallback ? "Request a call back" : "Get my free quote"} <Icon name="arrow" className="size-4" />
            </button>
          )}
        </div>
      </div>
    </form>
  );
}

/* ---------- field primitives ---------- */

function FieldError({ id, msg }: { id: string; msg?: string }) {
  return msg ? <p id={`${id}-error`} className="error" role="alert">{msg}</p> : null;
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

function Pills({ label, name, options, value, onChange, error, compact, optional, noTopMargin }: { label: string; name: string; options: readonly string[]; value?: string; onChange: (v: string) => void; error?: string; compact?: boolean; optional?: boolean; noTopMargin?: boolean }) {
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

function TextField({ id, label, value, onChange, error, required, ...rest }: { id: string; label: string; value?: string; onChange: (v: string) => void; error?: string; required?: boolean } & Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange" | "id">) {
  return (
    <div>
      <label htmlFor={id} className="label">{label}{!required && <span className="font-normal text-slate"> (optional)</span>}</label>
      <input id={id} className={`field ${error ? "!border-[#d92d20]" : ""}`} value={value ?? ""} onChange={(e) => onChange(e.target.value)} aria-invalid={!!error} aria-required={required} aria-describedby={error ? `${id}-error` : undefined} {...rest} />
      <FieldError id={id} msg={error} />
    </div>
  );
}

function Consent({ checked, onChange, error }: { checked: boolean; onChange: (v: boolean) => void; error?: string }) {
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
