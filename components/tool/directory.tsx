import { Suspense } from "react";
import { DirectoryClient } from "@/components/tool/directory-client";
import { LoadingScreen } from "@/components/ui/loading-screen";
import type { Category } from "@/lib/types";
import { HydrateClient, trpc } from "@/trpc/server";

interface ToolDirectoryProps {
  category?: Category;
}

export async function ToolDirectory({ category }: ToolDirectoryProps) {
  void trpc.browse.getAll.prefetch({
    category,
    limit: 24,
    sort: "latest",
  });

  return (
    <HydrateClient>
      <Suspense fallback={<LoadingScreen />}>
        <DirectoryClient category={category} />
      </Suspense>
    </HydrateClient>
  );
}
