import type { Metadata } from "next";
import type { PropsWithChildren } from "react";

export const metadata: Metadata = {
  title: "Profile",
  description: "Manage your profile information and account settings.",
  robots: { index: false, follow: false },
};

export default function ProfileLayout({ children }: PropsWithChildren) {
  return children;
}
