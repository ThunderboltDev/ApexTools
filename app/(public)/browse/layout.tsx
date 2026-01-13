import type { Metadata } from "next";
import type { PropsWithChildren } from "react";
import { Footer } from "@/components/app/footer";

export const metadata: Metadata = {
  title: "Browse AI Tools",
  description:
    "Explore and discover the best AI tools with powerful search and filters. Find productivity, coding, marketing, writing, and more AI tools.",
  alternates: {
    canonical: "/browse",
  },
  openGraph: {
    title: "Browse AI Tools",
    description:
      "Explore and discover the best AI tools with powerful search and filters.",
    type: "website",
  },
};

export default function BrowseLayout({ children }: PropsWithChildren) {
  return (
    <>
      {children}
      <Footer />
    </>
  );
}
