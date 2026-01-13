import type { Metadata } from "next";
import type { PropsWithChildren } from "react";

export const metadata: Metadata = {
  title: "Overview",
  description: "View your dashboard overview with stats and analytics.",
  robots: { index: false, follow: false },
};

export default function OverviewLayout({ children }: PropsWithChildren) {
  return children;
}
