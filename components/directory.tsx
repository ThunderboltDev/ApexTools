import { Suspense } from "react";
import { DirectoryClient } from "@/components/directory-client";
import { SkeletonToolCard } from "@/components/tool/skeleton";
import type { Category } from "@/lib/types";

interface ToolDirectoryProps {
  category?: Category;
}

function DirectorySkeleton() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 max-w-lg mx-auto">
        <div className="h-10 w-full rounded-full bg-secondary animate-pulse" />
        <div className="h-9 w-64 mx-auto rounded-full bg-secondary animate-pulse" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: order is stable
          <SkeletonToolCard key={`directory-skeleton-${index}`} />
        ))}
      </div>
    </div>
  );
}

export function ToolDirectory({ category }: ToolDirectoryProps) {
  return (
    <Suspense fallback={<DirectorySkeleton />}>
      <DirectoryClient category={category} />
    </Suspense>
  );
}
