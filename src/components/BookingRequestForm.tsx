"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { Consent, FieldError, Pills, TextField } from "./QuoteForm";
import { Icon } from "./Icon";
import { estimatePackage, exceedsBasis, packageById, packageExtras, regularPackages } from "@/lib/packages";
import { BOOKING_BATHROOMS, BOOKING_BEDROOMS, BOOKING_BEDS, FREQUENCY_OPTIONS, todayInBrisbane, validateBooking, validateContact, type Errors, type QuoteRequest } from "@/lib/quote";
import { postcodeInArea } from "@/lib/areas";
import { rememberThanksName } from "@/lib/thanksName";
import { site, telHref } from "@/lib/site";
import { getAttribution, track } from "@/lib/analytics";

type Data = Partial<QuoteRequest>;
const HOURS = [
  ["0", "None"],
  ["1", "1 hour"],
  ["2", "2 hours"],
  ["3", "3 hours"],
] as const;
const ids = regularPackages.map((p) => p.id);

/**
 * Booking request for a regular cleaning package (/book-now?package=…).
 * The package comes from the card the customer clicked; prices come from src/lib/packages.ts.
 * This is a request – Swept confirms the appointment and final price (in BookingKoala) afterwards.
 * Posts to /api/quote (kind "booking") → Resend email + LEAD_WEBHOOK_URL, like the quote forms.
 */
export function BookingRequestForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [data, setData] = useState<Data>({ kind: "booking", extraHours: "0", bedMaking: "0", linenChange: "0", consent: false });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  const [hp, setHp] = useState("");
  const mountedAt = useRef(Date.now());
  const minDate = useMemo(() => todayInBrisbane(), []);

  // Package from the card the customer clicked (/book-now?package=spotless).
  useEffect(() => {
    const pkg = packageById(params.get("package"));
    if (pkg) setData((d) => ({ ...d, package: pkg.id }));
  }, [params]);

  const set = <K extends keyof Data>(k: K, v: Data[K]) => {
    setData((d) => ({ ...d, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  };
  const pkg = packageById(data.package);
  const est = pkg ? estimatePackage(pkg, { extraHours: Number(data.extraHours), bedMaking: Number(data.bedMaking), linenChange: Number(data.linenChange) }) : undefined;
  const bigger = pkg && data.bedrooms && data.bathrooms ? exceedsBasis(pkg, parseInt(data.bedrooms), parseInt(data.bathrooms)) : false;
  const freqLabel = (v?: string) => FREQUENCY_OPTIONS.find((f) => f.value === v)?.label;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const errs = { ...validateBooking(data, ids), ...validateContact(data, "booking") };
    for (const k of Object.keys(errs) as (keyof Errors)[]) if (!errs[k]) delete errs[k];
    if (Object.keys(errs).length) {
      setErrors(errs);
      const first = Object.keys(errs)[0];
      requestAnimationFrame(() => document.getElementById(`br-${first}`)?.scrollIntoView({ block: "center", behavior: "smooth" }));
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, kind: "booking", service: "regular-house-cleaning", website: hp, elapsed: Date.now() - mountedAt.current, source: window.location.pathname + window.location.search, attribution: getAttribution() }),
      });
      if (!res.ok) throw new Error(String(res.status));
      // A booking REQUEST, confirmed later by Swept – its own event, never counted as a confirmed booking.
      track("booking_request", {
        lead_type: "booking_request",
        service: "regular-house-cleaning",
        package: data.package,
        frequency: data.frequency,
        recurring: data.frequency !== "once",
        value: est?.total,
        currency: "AUD",
        in_area: data.postcode ? postcodeInArea(data.postcode) : undefined,
      });
      rememberThanksName(data.name);
      router.push(`/quote/thanks?type=booking&package=${data.package}`);
    } catch {
      setStatus("error");
      track("quote_submit_error", { mode: "booking" });
    }
  }

  return (
    <form onSubmit={submit} noValidate className="card overflow-hidden" aria-describedby="br-help">
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>Website<input tabIndex={-1} autoComplete="off" value={hp} onChange={(e) => setHp(e.target.value)} name="website" /></label>
      </div>
      <div className="px-5 py-7 sm:px-8 sm:py-9">
        {/* 1. Package – preselected from the card; can be changed here. */}
        <fieldset id="br-package" aria-describedby={errors.package ? "package-error" : undefined}>
          <legend className="label">Your package</legend>
          <div className="mt-1 grid gap-2.5 sm:grid-cols-3">
            {regularPackages.map((p) => {
              const on = data.package === p.id;
              return (
                <label key={p.id} className={`flex cursor-pointer flex-col rounded-2xl border-2 p-4 transition has-[:focus-visible]:outline has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-electric ${on ? "border-violet bg-lavender" : "border-lilac bg-white hover:border-violet/50"}`}>
                  <input type="radio" name="package" value={p.id} checked={on} onChange={() => set("package", p.id)} className="sr-only" />
                  <span className="flex items-center justify-between gap-2 font-display font-semibold text-navy">{p.name}{on && <Icon name="checkCircle" className="size-5 text-violet" />}</span>
                  <span className="mt-1 text-sm">From <strong className="text-navy">${p.from}</strong> + GST per clean</span>
                  <span className="text-sm">{p.basis}</span>
                </label>
              );
            })}
          </div>
          <FieldError id="package" msg={errors.package} />
          <p className="mt-2 text-sm"><a href="/services/regular-house-cleaning#prices" className="font-semibold text-violet-ink underline underline-offset-2">Compare what each package includes</a></p>
        </fieldset>

        {/* 2. The home and how often */}
        <div className="mt-7 grid gap-x-8 sm:grid-cols-2">
          <div id="br-bedrooms"><Pills label="Bedrooms" name="bedrooms" options={BOOKING_BEDROOMS} value={data.bedrooms} onChange={(v) => set("bedrooms", v)} error={errors.bedrooms} compact noTopMargin /></div>
          <div id="br-bathrooms" className="mt-7 sm:mt-0"><Pills label="Bathrooms" name="bathrooms" options={BOOKING_BATHROOMS} value={data.bathrooms} onChange={(v) => set("bathrooms", v)} error={errors.bathrooms} compact noTopMargin /></div>
        </div>
        {bigger && pkg && (
          <p className="mt-4 flex gap-2.5 rounded-2xl bg-lavender px-4 py-3 text-[0.95rem] text-navy" role="status">
            <Icon name="clock" className="mt-0.5 size-5 shrink-0 text-violet" />
            <span>Your home is larger than the {pkg.name} starting size ({pkg.basis}), so extra cleaning time may be needed. We&apos;ll confirm your final price before your first clean.</span>
          </p>
        )}
        <div id="br-frequency">
          <Pills label="How often?" name="frequency" options={FREQUENCY_OPTIONS.map((f) => f.label)} value={freqLabel(data.frequency)} onChange={(l) => set("frequency", FREQUENCY_OPTIONS.find((f) => f.label === l)?.value)} error={errors.frequency} />
        </div>

        {/* 3. Extra time and extras (published prices) */}
        <div id="br-extraHours">
          <Pills label={`Extra cleaning time ($${packageExtras.extraHour} + GST per hour)`} name="extraHours" options={HOURS.map(([, l]) => l)} value={HOURS.find(([v]) => v === data.extraHours)?.[1]} onChange={(l) => set("extraHours", HOURS.find(([, x]) => x === l)?.[0])} error={errors.extraHours} optional />
        </div>
        <fieldset className="mt-7">
          <legend className="label">Extras <span className="font-normal text-slate">(optional)</span></legend>
          <div className="mt-1 grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="br-bedMaking" className="text-[0.95rem] font-medium text-navy">Bed making <span className="font-normal text-slate">(${packageExtras.bedMaking} + GST per bed)</span></label>
              <select id="br-bedMaking" className="field mt-1" value={data.bedMaking} onChange={(e) => set("bedMaking", e.target.value)}>
                {BOOKING_BEDS.map((b) => <option key={b} value={b}>{b === "0" ? "No thanks" : `${b} bed${b === "1" ? "" : "s"}`}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="br-linenChange" className="text-[0.95rem] font-medium text-navy">Fresh linen change <span className="font-normal text-slate">(${packageExtras.linenChange} + GST per bed)</span></label>
              <select id="br-linenChange" className="field mt-1" value={data.linenChange} onChange={(e) => set("linenChange", e.target.value)}>
                {BOOKING_BEDS.map((b) => <option key={b} value={b}>{b === "0" ? "No thanks" : `${b} bed${b === "1" ? "" : "s"}`}</option>)}
              </select>
            </div>
          </div>
          <p className="mt-2 text-sm">We change linen you supply – laundry and ironing aren&apos;t included.</p>
        </fieldset>

        {/* 4. Date */}
        <div className="mt-7 max-w-xs">
          <label htmlFor="br-startDate" className="label">Preferred date for your first clean</label>
          <input id="br-startDate" type="date" min={minDate} className={`field ${errors.startDate ? "!border-[#d92d20]" : ""}`} value={data.startDate ?? ""} onChange={(e) => set("startDate", e.target.value)} aria-invalid={!!errors.startDate} aria-describedby={errors.startDate ? "startDate-error" : undefined} />
          <FieldError id="startDate" msg={errors.startDate} />
        </div>

        {/* 5. Contact and address */}
        <h2 className="mt-9 text-xl font-bold">Your details</h2>
        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          <TextField id="br-name" label="Your name" autoComplete="name" value={data.name} onChange={(v) => set("name", v)} error={errors.name} required />
          <TextField id="br-phone" label="Mobile" type="tel" inputMode="tel" autoComplete="tel" value={data.phone} onChange={(v) => set("phone", v)} error={errors.phone} required />
          <div className="sm:col-span-2">
            <TextField id="br-email" label="Email" type="email" autoComplete="email" value={data.email} onChange={(v) => set("email", v)} error={errors.email} required />
          </div>
          <div className="sm:col-span-2">
            <TextField id="br-address" label="Street address" autoComplete="street-address" value={data.address} onChange={(v) => set("address", v)} error={errors.address} required />
          </div>
          <TextField id="br-suburb" label="Suburb" autoComplete="address-level2" value={data.suburb} onChange={(v) => set("suburb", v)} error={errors.suburb} required />
          <TextField id="br-postcode" label="Postcode" inputMode="numeric" autoComplete="postal-code" maxLength={4} value={data.postcode} onChange={(v) => set("postcode", v.replace(/\D/g, ""))} error={errors.postcode} required />
        </div>
        {data.postcode && /^\d{4}$/.test(data.postcode) && !postcodeInArea(data.postcode) && (
          <p className="mt-3 text-sm">That postcode is outside our usual area – send your request anyway and we&apos;ll let you know if we can help.</p>
        )}
        <div className="mt-5">
          <label htmlFor="br-notes" className="label">Anything we should know? <span className="font-normal text-slate">(optional)</span></label>
          <textarea id="br-notes" rows={3} maxLength={2000} className="field" placeholder="Access, parking, pets, priorities…" value={data.notes ?? ""} onChange={(e) => set("notes", e.target.value)} />
        </div>

        {/* 6. Estimate and what happens next */}
        <div className="mt-8 rounded-2xl border border-lilac bg-lavender/60 p-5" aria-live="polite">
          {pkg && est ? (
            <>
              <p className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="font-display font-semibold text-navy">Estimated price</span>
                <span><strong className="font-display text-2xl font-extrabold text-navy">${est.total}</strong> + GST per clean</span>
              </p>
              <ul className="mt-2 space-y-1 text-sm">
                <li className="flex justify-between gap-3"><span>{pkg.name} (from, for {pkg.basis})</span><span>${est.from}</span></li>
                {est.extraHours > 0 && <li className="flex justify-between gap-3"><span>Extra time ({data.extraHours} hr)</span><span>${est.extraHours}</span></li>}
                {est.bedMaking > 0 && <li className="flex justify-between gap-3"><span>Bed making ({data.bedMaking})</span><span>${est.bedMaking}</span></li>}
                {est.linenChange > 0 && <li className="flex justify-between gap-3"><span>Fresh linen change ({data.linenChange})</span><span>${est.linenChange}</span></li>}
              </ul>
            </>
          ) : (
            <p className="font-display font-semibold text-navy">Choose a package to see your estimated price.</p>
          )}
          <p id="br-help" className="mt-3 text-sm">
            This is a booking request, not a confirmed booking. We&apos;ll contact you {site.quoteResponse} to confirm your appointment and final price. <strong className="text-navy">No payment is needed now.</strong>
          </p>
        </div>

        <Consent checked={!!data.consent} onChange={(v) => set("consent", v)} error={errors.consent} />
        {status === "error" && (
          <p className="error mt-4" role="alert">
            Sorry – your request didn&apos;t send. Please try again in a moment{site.phone ? <> or call us on <a className="font-semibold underline" href={telHref(site.phone)}>{site.phone}</a></> : null}.
          </p>
        )}
        <button type="submit" disabled={status === "sending"} className="btn-primary mt-6 w-full !min-h-14 text-lg disabled:opacity-60">
          {status === "sending" ? "Sending…" : "Request My Booking"} {status !== "sending" && <Icon name="arrow" className="size-5" />}
        </button>
      </div>
    </form>
  );
}
