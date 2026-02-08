import type { Metadata } from "next";
import { type PropsWithChildren, Suspense } from "react";
import { Footer } from "@/components/app/footer";
import {
  getBreadcrumbJsonLd,
  getSearchResultsJsonLd,
  JsonLd,
} from "@/components/seo/jsonLd";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { url } from "@/config";
import { HydrateClient, trpc } from "@/trpc/server";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Browse AI Tools",
  description:
    "Explore and discover the best AI tools with powerful search and filters. Find productivity, coding, marketing, writing, and more AI tools.",
  alternates: {
    canonical: "/browse",
  },
  openGraph: {
    title: "Browse AI Tools",
    description:
      "Explore and discover the best AI tools with powerful search and filters.",
    type: "website",
  },
};

const breadcrumbs = [
  {
    name: "Home",
    item: url,
  },
  {
    name: "Browse",
    item: `${url}/browse`,
  },
];

export default async function BrowseLayout({ children }: PropsWithChildren) {
  void trpc.browse.getAll.prefetch({
    limit: 24,
    sort: "latest",
  });

  const { tools } = await trpc.browse.getAll({
    limit: 24,
    sort: "latest",
  });

  return (
    <>
      <JsonLd data={getSearchResultsJsonLd(tools)} />
      <JsonLd data={getBreadcrumbJsonLd(breadcrumbs)} />
      <div className="mt-4 mb-8 space-y-3">
        <h1 className="md:text-6xl text-balance text-center bg-clip-text text-transparent bg-linear-to-b from-foreground to-foreground/80">
          Browse AI Tools
        </h1>
        <p className="text-center md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Find the tools that are shaping the future with the help of advanced
          search filters.
        </p>
      </div>
      <HydrateClient>
        <Suspense fallback={<LoadingScreen />}>{children}</Suspense>
      </HydrateClient>
      <Footer />
    </>
  );
}
