import { Suspense } from "react";
import { DirectoryClient } from "@/components/directory-client";
import { LoadingScreen } from "@/components/ui/loading-screen";
import type { Category } from "@/lib/types";

interface ToolDirectoryProps {
  category?: Category;
}

export function ToolDirectory({ category }: ToolDirectoryProps) {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <DirectoryClient category={category} />
    </Suspense>
  );
}
