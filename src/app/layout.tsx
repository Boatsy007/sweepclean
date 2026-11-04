import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileCtaBar } from "@/components/MobileCtaBar";
import { Analytics } from "@/components/Analytics";
import { SmoothScroll } from "@/components/SmoothScroll";
import { ScrollReveal } from "@/components/ScrollReveal";
import { ScrollDebug } from "@/components/ScrollDebug";
import { JsonLd } from "@/components/JsonLd";
import { businessSchema, websiteSchema } from "@/lib/schema";
import { site, siteUrl } from "@/lib/site";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit", weight: ["500", "600", "700", "800"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: { default: "House Cleaning Brisbane, Logan & Gold Coast | Swept Cleaning", template: "%s | Swept Cleaning" },
  description: site.description,
  applicationName: "Swept Cleaning",
  alternates: { canonical: "/" },
  openGraph: { type: "website", locale: "en_AU", siteName: "Swept Cleaning", url: "/" },
  twitter: { card: "summary_large_image" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = { themeColor: "#ffffff", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-AU" className={`${inter.variable} ${outfit.variable}`}>
      <body className="antialiased">
        <JsonLd data={[businessSchema(), websiteSchema()]} />
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <MobileCtaBar />
        <Analytics />
        <SmoothScroll />
        <ScrollReveal />
        <ScrollDebug />
      </body>
    </html>
  );
}
