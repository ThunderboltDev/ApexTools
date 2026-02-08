import type { Metadata } from "next";
import type { PropsWithChildren } from "react";

export const metadata: Metadata = {
  title: "Featured Purchase Success",
  description: "Your tool is now featured on ApexTools",
  alternates: {
    canonical: "/featured/success",
  },
  robots: { index: false, follow: false },
};

export default function FeaturedSuccessLayout({ children }: PropsWithChildren) {
  return children;
}
