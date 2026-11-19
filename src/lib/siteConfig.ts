/**
 * Single source of truth for the production domain and indexing mode.
 *
 * Imported by next.config.ts (headers/redirects) and src/lib/site.ts (canonicals, sitemap,
 * Open Graph, structured data), so it uses relative imports only.
 *
 * - The canonical origin is always the production domain – on production, on previews and
 *   locally – so every build emits the same canonical URLs. It never falls back to a
 *   *.vercel.app address. NEXT_PUBLIC_SITE_URL is optional and may only repeat PRODUCTION_ORIGIN:
 *   any other value (http, www, *.vercel.app, another domain) fails the build instead of silently
 *   producing wrong canonicals. To move domains, change PRODUCTION_ORIGIN here.
 * - Indexing is on only for production deployments. Vercel previews and `next dev` are
 *   noindex (X-Robots-Tag header + robots meta; robots.txt still allows crawling so Google can see the noindex).
 */

export const PRODUCTION_ORIGIN = "https://sweptcleans.com.au";

type Env = Record<string, string | undefined>;

export function resolveSiteOrigin(env: Env = process.env): string {
  const raw = env.NEXT_PUBLIC_SITE_URL?.trim() || PRODUCTION_ORIGIN;
  let u: URL;
  try {
    u = new URL(raw);
  } catch {
    throw new Error(`NEXT_PUBLIC_SITE_URL is not a valid URL: "${raw}"`);
  }
  if (u.protocol !== "https:") throw new Error(`NEXT_PUBLIC_SITE_URL must use https: "${raw}"`);
  if (u.pathname !== "/" || u.search || u.hash || u.username || u.port) throw new Error(`NEXT_PUBLIC_SITE_URL must be a bare origin like ${PRODUCTION_ORIGIN}: "${raw}"`);
  if (/\.vercel\.app$/i.test(u.hostname) || /^www\./i.test(u.hostname)) throw new Error(`NEXT_PUBLIC_SITE_URL must be the permanent non-www domain, not "${u.hostname}"`);
  // Only the permanent domain is accepted, so a stray value (an old domain, a typo, a staging host)
  // can never silently replace it. Moving to a new domain is a deliberate edit of PRODUCTION_ORIGIN.
  if (u.origin !== PRODUCTION_ORIGIN) throw new Error(`NEXT_PUBLIC_SITE_URL must be ${PRODUCTION_ORIGIN} (got "${raw}"). To change domain, edit PRODUCTION_ORIGIN in src/lib/siteConfig.ts.`);
  return u.origin;
}

/**
 * Whether this build may be indexed by search engines.
 * SITE_INDEXING=on|off overrides; otherwise Vercel production = on, Vercel preview/development = off,
 * `next dev` = off and a local `next build` = on (so local tests check production output).
 */
export function isIndexable(env: Env = process.env): boolean {
  const o = env.SITE_INDEXING?.toLowerCase();
  if (o === "on") return true;
  if (o === "off") return false;
  if (env.VERCEL_ENV) return env.VERCEL_ENV === "production";
  return env.NODE_ENV !== "development";
}
