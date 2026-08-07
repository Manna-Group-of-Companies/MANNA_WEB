import type { Metadata, Viewport } from "next";
import { Inter, Sora } from "next/font/google";
import { QuoteProvider } from "@/components/QuoteContext";
import { ToastProvider } from "@/components/ui/Toast";
import { themeInitScript } from "@/components/ui/ThemeToggle";
import { site } from "@/data/site";
import { jsonLd } from "@/lib/schema";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const sora = Sora({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-sora",
  display: "swap",
});

const ORIGIN = process.env.NEXT_PUBLIC_SITE_URL ?? site.url;

export const metadata: Metadata = {
  metadataBase: new URL(ORIGIN),
  title: {
    default: `Tyre Retreading — Pre-Cure & Hot Process Tread Rubber | ${site.shortName}`,
    template: `%s | ${site.shortName}`,
  },
  description:
    "Premium tyre retreading solutions from Manna Rubber Products Pvt. Ltd. Pre-cure tread rubber (PCTR), PCTR Radial, PCTR Nylon, hot retreading and off-road ranges — 43 published sizes for commercial, industrial and off-road vehicles. Exporting to Africa and the Middle East.",
  keywords: [
    "tyre retreading",
    "tread rubber manufacturer",
    "pre cure tread rubber",
    "PCTR",
    "PCTR radial",
    "PCTR nylon",
    "hot retreading",
    "off road tread rubber",
    "cushion gum",
    "retreading India",
    "tread rubber Kerala",
    "tread rubber export Africa",
    "tread rubber Middle East",
    "Manna Rubber Products",
  ],
  authors: [{ name: site.name, url: ORIGIN }],
  creator: site.name,
  publisher: site.name,
  applicationName: site.shortName,
  category: "Manufacturing",
  alternates: { canonical: site.pagePath },
  openGraph: {
    type: "website",
    siteName: site.name,
    title: `Premium Tyre Retreading Solutions | ${site.shortName}`,
    description:
      "High-performance retreading for commercial, industrial and off-road vehicles. Five ranges, 43 published sizes, three decades of compounding.",
    url: site.pagePath,
    locale: "en_IN",
    images: [
      {
        url: "/images/og.svg",
        width: 1200,
        height: 630,
        alt: "Manna Rubber Products — Premium Tyre Retreading Solutions",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `Premium Tyre Retreading Solutions | ${site.shortName}`,
    description:
      "Pre-cure and hot-process tread rubber across 43 published sizes. Exporting to Africa and the Middle East.",
    images: ["/images/og.svg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  manifest: "/manifest.webmanifest",
  icons: {
    // .ico first for legacy, SVG for modern browsers, PNGs for launchers
    icon: [
      { url: "/favicon.ico", sizes: "16x16 32x32 48x48" },
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/icon-512.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [{ url: "/apple-icon.png", type: "image/png", sizes: "180x180" }],
    shortcut: ["/favicon.ico"],
  },
  formatDetection: { telephone: true, address: true, email: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#08080a" },
  ],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${sora.variable}`}>
      <head>
        {/* Applies the stored theme before first paint to avoid a flash */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <link rel="preconnect" href="https://www.google.com" />
      </head>
      <body className="antialiased">
        <ToastProvider>
          <QuoteProvider>{children}</QuoteProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
