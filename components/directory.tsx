import { DirectoryClient } from "@/components/directory-client";
import type { Category } from "@/lib/types";
import { HydrateClient, trpc } from "@/trpc/server";

interface ToolDirectoryProps {
  category?: Category;
}

export async function ToolDirectory({ category }: ToolDirectoryProps) {
  void trpc.browse.getAll.prefetch({
    category,
    limit: 24,
    sort: "hot",
  });

  return (
    <HydrateClient>
      <DirectoryClient category={category} />
    </HydrateClient>
  );
}
