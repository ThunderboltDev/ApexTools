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
  keywords: [...config.keywords],
  applicationName: config.name,
  creator: config.creator,
  category: "technology",
  icons: {
    icon: config.logo.url,
    apple: config.logo.url,
    shortcut: config.logo.url,
  },
  openGraph: {
    title: {
      template: `%s | ${config.name}`,
      default: config.name,
    },
    url,
    siteName: config.name,
    description: config.description,
    locale: "en_US",
    type: "website",
    images: [
      {
        url: config.preview.url,
        width: config.preview.width,
        height: config.preview.height,
        alt: `${config.name} Landing Page`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: {
      template: `%s | ${config.name}`,
      default: config.name,
    },
    description: config.description,
    creator: "Thunderbolt",
    images: [config.preview.url],
  },
  robots: {
    index: true,
    follow: true,
  },
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
