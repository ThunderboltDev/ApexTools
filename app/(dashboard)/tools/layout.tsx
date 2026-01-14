import type { Metadata } from "next";
import { type PropsWithChildren, Suspense } from "react";
import { LoadingScreen } from "@/components/ui/loading-screen";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "My Tools",
  description: "Manage and track the AI tools you have published.",
  robots: { index: false, follow: false },
};

export default function ToolsLayout({ children }: PropsWithChildren) {
  return <Suspense fallback={<LoadingScreen />}>{children}</Suspense>;
}
