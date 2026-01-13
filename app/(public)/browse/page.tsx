import { BrowseClient } from "@/app/(public)/browse/client";
import { HydrateClient, trpc } from "@/trpc/server";

export default async function Browse() {
  void trpc.browse.getAll.prefetch({
    limit: 24,
    sort: "latest",
  });

  return (
    <>
      <div className="mt-4 mb-8 space-y-3">
        <h1 className="md:text-6xl text-balance text-center bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/80">
          Browse AI Tools
        </h1>
        <p className="text-center md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Find the tools that are shaping the future with the help of advanced
          search filters.
        </p>
      </div>
      <HydrateClient>
        <BrowseClient />
      </HydrateClient>
    </>
  );
}
