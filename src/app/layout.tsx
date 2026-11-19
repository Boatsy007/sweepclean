import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileCtaBar } from "@/components/MobileCtaBar";
import { Analytics } from "@/components/Analytics";
import { SmoothScroll } from "@/components/SmoothScroll";
import { JsonLd } from "@/components/JsonLd";
import { businessSchema, websiteSchema } from "@/lib/schema";
import { indexable, site, siteUrl } from "@/lib/site";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit", weight: ["500", "600", "700", "800"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: { default: "House Cleaning Brisbane, Logan & Gold Coast | Swept Cleaning", template: "%s | Swept Cleaning" },
  description: site.description,
  applicationName: "Swept Cleaning",
  // No canonical here: every page sets its own through pageMeta(), so nothing (e.g. the 404 page)
  // can inherit the homepage canonical.
  openGraph: { type: "website", locale: "en_AU", siteName: "Swept Cleaning" },
  twitter: { card: "summary_large_image" },
  formatDetection: { telephone: false },
  // Favicons: stable URLs in /public (Google Search uses a square icon, a multiple of 48px).
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "16x16 32x32 48x48" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-48x48.png", sizes: "48x48", type: "image/png" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  // Previews and dev builds are noindex (see src/lib/siteConfig.ts); production pages are indexable.
  ...(indexable ? {} : { robots: { index: false, follow: false } }),
};

export const viewport: Viewport = { themeColor: "#ffffff", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-AU" data-scroll-behavior="smooth" className={`${inter.variable} ${outfit.variable}`} suppressHydrationWarning>
      <head>
        {/* Chrome on iPhone (CriOS) has an iOS 26 bug with headers pinned to the top: flag it before
            first paint so the mobile header can scroll with the page for those visitors only. */}
        <script dangerouslySetInnerHTML={{ __html: `if(navigator.userAgent.indexOf("CriOS")>-1)document.documentElement.classList.add("crios")` }} />
      </head>
      <body className="min-h-dvh antialiased">
        <JsonLd data={[businessSchema(), websiteSchema()]} />
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <MobileCtaBar />
        <Analytics />
        <SmoothScroll />
      </body>
    </html>
  );
}
