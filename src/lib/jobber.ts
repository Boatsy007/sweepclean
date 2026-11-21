/**
 * Jobber – the official embedded work request form used on /quote (enquiries go straight into Jobber).
 * Values from the embed code supplied by Swept (Jobber → Requests → Request form → Embed).
 *
 * Which quote form /quote shows: NEXT_PUBLIC_QUOTE_FORM = "jobber" (default) | "native".
 * "native" is the rollback path: the site's own quote form (src/components/QuoteForm.tsx →
 * /api/quote → Resend email + optional webhook), which is kept unchanged.
 */
export const JOBBER_CLIENTHUB_ID = "9f3975e1-6497-4cc8-b29f-1f42950d978f-5384111";
export const JOBBER_FORM_URL = "https://clienthub.getjobber.com/client_hubs/9f3975e1-6497-4cc8-b29f-1f42950d978f/public/work_request/embedded_work_request_form?form_id=5384111";
export const JOBBER_SCRIPT_SRC = "https://d3ey4dbjkt2f6s.cloudfront.net/assets/static_link/work_request_embed_snippet.js";
export const JOBBER_CSS_HREF = "https://d3ey4dbjkt2f6s.cloudfront.net/assets/external/work_request_embed.css";

/** Attribution keys Jobber's snippet forwards to the request (it reads them from the page URL). */
export const JOBBER_ATTRIBUTION_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid"] as const;

/** If Jobber hasn't shown its form within this time, the backup form is offered. */
export const JOBBER_LOAD_TIMEOUT_MS = 15_000;

export const quoteFormMode = (): "jobber" | "native" => (process.env.NEXT_PUBLIC_QUOTE_FORM === "native" ? "native" : "jobber");
