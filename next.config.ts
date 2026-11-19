import type { NextConfig } from "next";
import { isIndexable, resolveSiteOrigin } from "./src/lib/siteConfig";

// Validates NEXT_PUBLIC_SITE_URL at build time – an invalid production domain fails the build.
const canonicalHost = new URL(resolveSiteOrigin()).host;
const indexable = isIndexable();

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: { qualities: [70, 75] },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      // Previews / dev: never indexable, whatever the page metadata says.
      ...(indexable ? [] : [{ source: "/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] }]),
      // Production served on any other host (e.g. the *.vercel.app alias) is noindex too, so only
      // the canonical domain can be indexed. (www → non-www is a redirect set in Vercel → Domains.)
      ...(indexable && process.env.VERCEL_ENV === "production"
        ? [{ source: "/:path*", missing: [{ type: "host" as const, value: canonicalHost }], headers: [{ key: "X-Robots-Tag", value: "noindex" }] }]
        : []),
    ];
  },
  async redirects() {
    // Common alternative URLs people (and other sites) may link to.
    return [
      { source: "/end-of-lease-cleaning", destination: "/services/bond-cleaning", permanent: true },
      { source: "/services/end-of-lease-cleaning", destination: "/services/bond-cleaning", permanent: true },
      { source: "/book", destination: "/quote", permanent: true },
      { source: "/get-a-quote", destination: "/quote", permanent: true },
      { source: "/about", destination: "/why-swept", permanent: true },
    ];
  },
};

export default nextConfig;
