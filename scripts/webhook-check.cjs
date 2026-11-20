#!/usr/bin/env node
/*
 * Lead webhook compatibility check (the Make.com → BookingKoala payload).
 *
 *   WEBHOOK_PORT=3299 BASE=http://localhost:3205 CASES=a node scripts/webhook-check.cjs
 *   (the server under test must run with LEAD_WEBHOOK_URL=http://127.0.0.1:3299/hook – npm run test:all does this)
 *
 * Posts real requests to /api/quote exactly as each form sends them, captures what the server posts to
 * the webhook (a local capture server – nothing leaves this machine) and checks:
 *  - every field of payload version 1 is present, with the same type;
 *  - fields that existed before only carry values they could already carry for a quote or call-back
 *    request (so an existing Make.com mapping never receives a new kind of value);
 *  - the new fields (customer_type, cleaning_type, customer.business_name, details) are filled in;
 *  - no price, package or estimate is sent; rejected and spam requests send nothing.
 * At most 5 requests per run (the API rate limit is per server – each CASES set gets a fresh server).
 */
const http = require("http");

const BASE = (process.env.BASE || "http://localhost:3100").replace(/\/$/, "");
const PORT = Number(process.env.WEBHOOK_PORT || 3299);
const CASES = process.env.CASES || "a";
const failures = [];
const fail = (m) => failures.push(m);
const notes = [];

/* ---- Payload version 1 as production sent it before the quote-only change (7a293f1). ---- */
const V1_PATHS = [
  "version", "type", "submitted_at",
  "customer", "customer.name", "customer.first_name", "customer.last_name", "customer.email", "customer.phone", "customer.contact_preference",
  "property", "property.address", "property.suburb", "property.postcode", "property.state", "property.in_service_area", "property.type", "property.bedrooms", "property.bathrooms", "property.premises_size", "property.pets",
  "service", "package", "frequency", "extra_hours", "extras", "extras.bed_making_beds", "extras.linen_change_beds", "extras.quote_add_ons",
  "preferred_date", "preferred_time", "estimate", "notes", "source", "attribution", "summary",
];
const SERVICES = { "regular-house-cleaning": "Regular home cleaning", "deep-cleaning": "Detailed / deep clean", "ndis-cleaning": "NDIS / home care cleaning", "bond-cleaning": "Bond / end-of-lease clean", "airbnb-cleaning": "Airbnb / holiday rental", "carpet-cleaning": "Carpet cleaning", "commercial-cleaning": "Commercial / office cleaning" };
const OLD_FREQ = { weekly: "Weekly", fortnightly: "Fortnightly", monthly: "Monthly", once: "Just once for now" };
const OLD_PROPERTY = ["House", "Townhouse", "Apartment / unit", "Office", "Shop / retail", "Medical / consulting", "Other"];
const OLD_SIZE = ["Small (under 150m²)", "Medium (150–400m²)", "Large (400m²+)"];
const OLD_TIME = ["Morning", "Afternoon", "Flexible"];
const OLD_SUMMARY_KEYS = ["Type", "Service", "Package", "Extra time", "Bed making", "Fresh linen change", "Estimated price", "Size check", "Address", "Frequency", "Property", "Bedrooms / bathrooms", "Premises size", "Pets", "Add-ons", "Preferred date", "Time of day", "Suburb", "In usual area", "Name", "Phone", "Email", "Contact preference", "Notes", "Source"];

const get = (o, p) => p.split(".").reduce((x, k) => (x == null ? undefined : x[k]), o);
const isStrOrNull = (v) => v === null || typeof v === "string";

function checkV1(label, j) {
  for (const p of V1_PATHS) if (get(j, p) === undefined) fail(`${label}: field ${p} missing`);
  if (j.version !== 1) fail(`${label}: version ${j.version}`);
  if (!["quote_request", "callback_request"].includes(j.type)) fail(`${label}: type ${j.type}`);
  if (typeof j.submitted_at !== "string") fail(`${label}: submitted_at`);
  for (const k of ["name", "first_name", "last_name", "phone"]) if (typeof j.customer[k] !== "string") fail(`${label}: customer.${k} not a string`);
  for (const k of ["email", "contact_preference"]) if (!isStrOrNull(j.customer[k])) fail(`${label}: customer.${k} type`);
  if (j.customer.contact_preference !== null && !["Phone", "SMS", "Email"].includes(j.customer.contact_preference)) fail(`${label}: contact_preference ${j.customer.contact_preference}`);
  if (typeof j.property.suburb !== "string") fail(`${label}: property.suburb`);
  for (const k of ["address", "postcode", "state", "type", "bedrooms", "bathrooms", "premises_size", "pets"]) if (!isStrOrNull(j.property[k])) fail(`${label}: property.${k} type`);
  if (j.property.in_service_area !== null && typeof j.property.in_service_area !== "boolean") fail(`${label}: in_service_area type`);
  if (j.property.type !== null && !OLD_PROPERTY.includes(j.property.type)) fail(`${label}: property.type has a new value "${j.property.type}"`);
  if (j.property.premises_size !== null && !OLD_SIZE.includes(j.property.premises_size)) fail(`${label}: property.premises_size has a new value "${j.property.premises_size}"`);
  if (j.service !== null && (SERVICES[j.service.slug] !== j.service.name)) fail(`${label}: service ${JSON.stringify(j.service)}`);
  if (j.frequency !== null && OLD_FREQ[j.frequency.value] !== j.frequency.label) fail(`${label}: frequency has a new value ${JSON.stringify(j.frequency)}`);
  if (j.preferred_time !== null && !OLD_TIME.includes(j.preferred_time)) fail(`${label}: preferred_time has a new value "${j.preferred_time}"`);
  if (!isStrOrNull(j.preferred_date) || !isStrOrNull(j.notes) || !isStrOrNull(j.source)) fail(`${label}: preferred_date/notes/source type`);
  // Quote and call-back requests always had these empty.
  if (j.package !== null || j.estimate !== null || j.extra_hours !== null || j.extras.bed_making_beds !== null || j.extras.linen_change_beds !== null) fail(`${label}: package/estimate/extras not null`);
  if (!Array.isArray(j.extras.quote_add_ons)) fail(`${label}: quote_add_ons not an array`);
  if (j.attribution !== null && typeof j.attribution !== "object") fail(`${label}: attribution type`);
  if (!j.summary || typeof j.summary !== "object" || Object.values(j.summary).some((v) => typeof v !== "string")) fail(`${label}: summary must be an object of strings`);
  if (/\$\s?\d|\+\s?GST|from_price|per_clean/i.test(JSON.stringify(j))) fail(`${label}: price found in payload`);
  // New fields.
  if (!("customer_type" in j) || !("cleaning_type" in j) || !("business_name" in j.customer) || !j.details) fail(`${label}: new fields missing`);
  return Object.keys(j.summary).filter((k) => !OLD_SUMMARY_KEYS.includes(k));
}

const T = 2600; // older than the 2.5s bot timing trap
const att = { gclid: "TEST-GCLID", utm_source: "google", utm_medium: "cpc", utm_campaign: "test", landing_page: "/services/regular-house-cleaning" };
const cases = {
  a: [
    ["new residential (regular, fortnightly, no email)", { kind: "quote", customerType: "residential", cleaningType: "regular", service: "regular-house-cleaning", frequency: "fortnightly", bedrooms: "3", bathrooms: "2", suburb: "Robina", postcode: "4226", startDate: "2030-01-15", name: "Test Resident", phone: "0412 345 678", notes: "Two dogs", consent: true, source: "google", attribution: att },
      (j) => j.customer_type === "residential" && j.cleaning_type?.value === "regular" && j.service?.slug === "regular-house-cleaning" && j.frequency?.value === "fortnightly" && j.details.frequency?.value === "fortnightly" && j.property.bedrooms === "3" && j.customer.email === null && j.attribution?.gclid === "TEST-GCLID" && j.preferred_date === "2030-01-15"],
    ["new commercial (strata, not sure, several times a week, after hours)", { kind: "quote", customerType: "commercial", cleaningType: "strata", service: "commercial-cleaning", frequency: "several_weekly", propertyType: "Strata / common areas", size: "Not sure", timePref: "After hours / overnight", suburb: "Southport", postcode: "4215", businessName: "Test Body Corporate", name: "Test Manager", phone: "0412 345 679", email: "test@example.com", notes: "Lobby and lifts", consent: true },
      (j) => j.customer_type === "commercial" && j.cleaning_type?.label === "Strata / common area cleaning" && j.customer.business_name === "Test Body Corporate" && j.frequency === null && j.details.frequency?.value === "several_weekly" && j.property.type === "Other" && j.details.premises_type === "Strata / common areas" && j.property.premises_size === null && j.details.floor_area === "Not sure" && j.preferred_time === null && j.details.preferred_times === "After hours / overnight" && j.summary["Business name"] === "Test Body Corporate" && j.summary["Frequency"] === "Several times a week"],
    ["hero quick form (unchanged)", { kind: "quote", consent: true, frequency: "weekly", suburb: "Burleigh Heads", postcode: "4220", name: "Hero Person", phone: "0412 111 222", email: "hero@example.com", service: "deep-cleaning", source: "hero:direct" },
      (j) => j.customer_type === "residential" && j.cleaning_type === null && j.service?.slug === "deep-cleaning" && j.frequency?.value === "weekly" && j.customer.email === "hero@example.com"],
    ["contact call-back (unchanged)", { kind: "callback", name: "Call Me", phone: "0400 111 222", suburb: "Tweed Heads", timePref: "Morning", consent: true },
      (j) => j.type === "callback_request" && j.customer_type === null && j.preferred_time === "Morning" && j.service === null],
    ["stale /book-now tab (retired booking form)", { kind: "booking", service: "regular-house-cleaning", package: "spotless", bedrooms: "4", bathrooms: "2", frequency: "fortnightly", extraHours: "1", bedMaking: "2", linenChange: "0", startDate: "2030-02-01", name: "Old Tab", phone: "0412 333 444", email: "old@example.com", address: "1 Test Street", suburb: "Robina", postcode: "4226", consent: true },
      (j) => j.type === "quote_request" && j.customer_type === "residential" && j.service?.slug === "regular-house-cleaning" && j.property.address === "1 Test Street" && j.details.legacy_booking === true && /Spotless package/.test(j.summary["Old booking page"] || "") && j.package === null && j.estimate === null],
  ],
  b: [
    ["residential other + not sure", { kind: "quote", customerType: "residential", cleaningType: "other", frequency: "not_sure", bedrooms: "2", bathrooms: "1", suburb: "4000", postcode: "4000", name: "Other Person", phone: "0412 555 666", consent: true },
      (j) => j.service === null && j.cleaning_type?.value === "other" && j.frequency === null && j.details.frequency?.label === "Not sure yet" && j.customer_type === "residential"],
    ["carpet (no rooms)", { kind: "quote", customerType: "residential", cleaningType: "carpet", service: "carpet-cleaning", frequency: "once", suburb: "Logan Central", name: "Carpet Person", phone: "0412 777 888", consent: true },
      (j) => j.service?.slug === "carpet-cleaning" && j.frequency?.value === "once" && j.property.bedrooms === null],
    ["older multi-step quote tab (pre-change fields)", { kind: "quote", service: "regular-house-cleaning", propertyType: "House", bedrooms: "3", bathrooms: "2", pets: "Yes", extras: ["Oven & stove"], frequency: "monthly", timePref: "Morning", suburb: "Robina", postcode: "4226", name: "Older Tab", phone: "0412 999 000", email: "older@example.com", contactPref: "SMS", consent: true },
      (j) => j.property.type === "House" && j.property.pets === "Yes" && j.extras.quote_add_ons[0] === "Oven & stove" && j.customer.contact_preference === "SMS" && j.preferred_time === "Morning" && j.frequency?.value === "monthly"],
  ],
};

(async () => {
  const received = [];
  const srv = http.createServer((req, res) => {
    let body = "";
    req.on("data", (c) => (body += c));
    req.on("end", () => { try { received.push(JSON.parse(body)); } catch { received.push({ bad: body }); } res.end("ok"); });
  });
  await new Promise((r) => srv.listen(PORT, "127.0.0.1", r));
  const post = (b) => fetch(`${BASE}/api/quote`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ website: "", elapsed: T, ...b }) });
  const newSummaryKeys = new Set();

  for (const [label, body, expect] of cases[CASES]) {
    const before = received.length;
    const r = await post(body);
    const out = await r.json().catch(() => ({}));
    await new Promise((x) => setTimeout(x, 150));
    if (r.status !== 200 || !(out.delivered || []).includes("webhook")) { fail(`${label}: ${r.status} ${JSON.stringify(out)}`); continue; }
    if (received.length !== before + 1) { fail(`${label}: expected exactly one webhook post, got ${received.length - before}`); continue; }
    const j = received[received.length - 1];
    checkV1(label, j).forEach((k) => newSummaryKeys.add(k));
    if (!expect(j)) fail(`${label}: unexpected values ${JSON.stringify(j).slice(0, 900)}`);
    else notes.push(`${label}: OK`);
  }
  if (CASES === "b") {
    // Rejected (invalid cleaning type) and spam (honeypot) requests send nothing to Make.com.
    const before = received.length;
    const bad = await post({ kind: "quote", cleaningType: "window", suburb: "Robina", name: "Bad Type", phone: "0412 000 111", consent: true });
    if (bad.status !== 422) fail(`invalid cleaning type → ${bad.status}`);
    const spam = await post({ kind: "quote", cleaningType: "regular", frequency: "weekly", suburb: "Robina", name: "Spam Bot", phone: "0412 000 222", consent: true, website: "http://spam" });
    if (spam.status !== 200) fail(`honeypot → ${spam.status}`);
    await new Promise((x) => setTimeout(x, 300));
    if (received.length !== before) fail(`rejected/spam requests reached the webhook (${received.length - before})`);
    else notes.push("invalid cleaning type → 422, honeypot → silent 200; neither reached the webhook");
  }
  srv.close();
  notes.push(`new summary rows seen: ${[...newSummaryKeys].join(", ") || "none"}`);
  console.log(notes.join("\n"));
  if (failures.length) {
    console.log(`\n${failures.length} failure(s):\n  ` + failures.join("\n  "));
    process.exit(1);
  }
  console.log(`\nWebhook payload compatible (set ${CASES})`);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
