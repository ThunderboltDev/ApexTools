import type { PropsWithChildren } from "react";
import { Suspense } from "react";
import { LoadingScreen } from "@/components/ui/loading-screen";

export const revalidate = 86400;
export const dynamicParams = false;

export default function CategoryLayout({ children }: PropsWithChildren) {
  return <Suspense fallback={<LoadingScreen />}>{children}</Suspense>;
}
