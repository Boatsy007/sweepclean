/**
 * The first name shown on the thank-you page ("Thanks, Jane").
 *
 * It's handed over in sessionStorage (this tab only, deleted as soon as the page reads it) rather
 * than in the URL: page URLs are sent to analytics, and a name is personal information.
 */
const KEY = "swept:thanks-name";

export function rememberThanksName(fullName?: string) {
  const first = (fullName ?? "").trim().split(/\s+/)[0]?.replace(/[^\p{L}' -]/gu, "").slice(0, 30);
  try {
    if (first) sessionStorage.setItem(KEY, first);
    else sessionStorage.removeItem(KEY);
  } catch {}
}

export function takeThanksName(): string | null {
  try {
    const v = sessionStorage.getItem(KEY);
    sessionStorage.removeItem(KEY);
    return v;
  } catch {
    return null;
  }
}
