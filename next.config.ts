import type { NextConfig } from "next";

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
    return [{ source: "/:path*", headers: securityHeaders }];
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
