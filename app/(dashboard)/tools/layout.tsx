import type { Metadata } from "next";
import type { PropsWithChildren } from "react";

export const metadata: Metadata = {
  title: "My Tools",
  description: "Manage and track the AI tools you have published.",
  robots: { index: false, follow: false },
};

export default function ToolsLayout({ children }: PropsWithChildren) {
  return children;
}
