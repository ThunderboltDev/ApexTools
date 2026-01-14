import type { PropsWithChildren } from "react";
import { Suspense } from "react";
import { LoadingScreen } from "@/components/ui/loading-screen";

export const dynamic = "force-dynamic";

export default function CategoryLayout({ children }: PropsWithChildren) {
  return <Suspense fallback={<LoadingScreen />}>{children}</Suspense>;
}
