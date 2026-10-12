import type { Metadata, Viewport } from "next";
import { Figtree } from "next/font/google";
import Script from "next/script";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { type PropsWithChildren, Suspense } from "react";
import { Providers } from "@/components/app/providers";
import { config, url } from "@/config";
import { adsenseClientId, adsenseEnabled } from "@/lib/adsense";
import "./globals.css";

const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL(url),
  title: {
    template: `%s | ${config.name}`,
    default: config.name,
  },
  description: config.description,
  applicationName: config.name,
  creator: config.creator,
  category: "technology",
  icons: {
    icon: "/logo.webp",
    apple: "/logo.webp",
    shortcut: "/logo.webp",
  },
  openGraph: {
    siteName: config.name,
    locale: "en_US",
    type: "website",
    url: "/",
    images: [
      {
        url: "/preview.webp",
        width: 1200,
        height: 630,
        alt: `${config.name} Landing Page`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    creator: "Thunderbolt",
  },
  other: adsenseClientId
    ? { "google-adsense-account": adsenseClientId }
    : undefined,
  keywords: [
    "ai tools",
    "ai directory",
    "best ai tools",
    "ai tools directory",
    "ai productivity tools",
    "ai coding assistants",
    "ai marketing tools",
    "ai writing tools",
    "ai image generators",
    "ai video generators",
    "chatgpt alternatives",
    "llm comparison",
  ],
};

export const viewport: Viewport = {
  themeColor: config.themeColor,
  colorScheme: "dark light",
};

export default function RootLayout({ children }: Readonly<PropsWithChildren>) {
  return (
    <html lang="en" className={figtree.variable} suppressHydrationWarning>
      <head>
        <link
          rel="preconnect"
          href="https://umami-orcin-six.vercel.app"
          crossOrigin="anonymous"
        />
        {adsenseEnabled && adsenseClientId ? (
          <link
            rel="dns-prefetch"
            href="https://pagead2.googlesyndication.com"
          />
        ) : null}
      </head>
      <body>
        {adsenseEnabled && adsenseClientId ? (
          <Script
            id="google-adsense"
            strategy="lazyOnload"
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClientId}`}
            crossOrigin="anonymous"
          />
        ) : null}
        <NuqsAdapter>
          <Providers>
            <Suspense fallback={null}>{children}</Suspense>
          </Providers>
        </NuqsAdapter>
      </body>
      <Script
        strategy="lazyOnload"
        src="https://umami-orcin-six.vercel.app/script.js"
        data-website-id="9c7b6bf8-a958-4bfb-a35e-528117e8ca12"
      />
    </html>
  );
}
