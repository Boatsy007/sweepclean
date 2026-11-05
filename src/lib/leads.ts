import { site } from "./site";

/**
 * Lead delivery settings. Only RESEND_API_KEY is required (with swept.com.au verified in
 * Resend): leads go to the business email and are sent from quotes@swept.com.au unless
 * LEAD_TO_EMAIL / LEAD_FROM_EMAIL override them. LEAD_WEBHOOK_URL adds a second channel.
 */
export const leadTo = () => process.env.LEAD_TO_EMAIL || site.email || "";
export const leadFrom = () => process.env.LEAD_FROM_EMAIL || "Swept Cleaning <quotes@swept.com.au>";

/** Which delivery channels are configured – no secrets, safe to expose. */
export function leadChannels() {
  return {
    email: Boolean(process.env.RESEND_API_KEY && leadTo()),
    webhook: Boolean(process.env.LEAD_WEBHOOK_URL),
  };
}
