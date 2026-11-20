/*
 * TEST ONLY – loaded with NODE_OPTIONS="--require …" by scripts/delivery-check.cjs, never by the site.
 * Sends the site's calls to https://api.resend.com to a local mock (RESEND_MOCK_URL) so delivery can be
 * tested without a Resend account and without sending real email. Does nothing unless RESEND_MOCK_URL is set.
 */
const mock = process.env.RESEND_MOCK_URL;
if (mock) {
  const realFetch = globalThis.fetch;
  globalThis.fetch = (input, init) => {
    const url = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
    if (url.startsWith("https://api.resend.com/")) return realFetch(mock + url.slice("https://api.resend.com".length), init);
    return realFetch(input, init);
  };
}
