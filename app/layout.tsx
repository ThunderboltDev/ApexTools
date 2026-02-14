import type { Metadata, Viewport } from "next";
import { Figtree } from "next/font/google";
import Script from "next/script";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { type PropsWithChildren, Suspense } from "react";
import { Providers } from "@/components/app/providers";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { config, url } from "@/config";
import "./globals.css";

const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-sans",
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
      <body>
        <NuqsAdapter>
          <Providers>
            <Suspense fallback={<LoadingScreen />}>{children}</Suspense>
          </Providers>
        </NuqsAdapter>
      </body>
      <Script
        defer
        src="https://cloud.umami.is/script.js"
        data-website-id="13e97afd-bff1-46db-8ae9-d5be587709dc"
      ></Script>
    </html>
  );
}
