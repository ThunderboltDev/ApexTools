import type { Metadata } from "next";
import { type PropsWithChildren, Suspense } from "react";
import { Footer } from "@/components/app/footer";
import { getWebPageJsonLd, JsonLd } from "@/components/seo/jsonLd";
import { LoadingScreen } from "@/components/ui/loading-screen";
import {
  PageContent,
  PageDescription,
  PageHeader,
  PageTitle,
} from "@/components/ui/page";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Bookmarks",
  description: "View and manage your bookmarked AI tools.",
  alternates: {
    canonical: "/bookmarks",
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function BookmarksLayout({ children }: PropsWithChildren) {
  return (
    <>
      <JsonLd
        data={getWebPageJsonLd(
          "Bookmarks",
          "View and manage your bookmarked AI tools.",
          "/bookmarks"
        )}
      />
      <PageHeader>
        <PageTitle>Bookmarks</PageTitle>
        <PageDescription>
          Tools you&apos;ve saved for later. Stored locally in your browser.
        </PageDescription>
      </PageHeader>
      <PageContent>
        <Suspense fallback={<LoadingScreen />}>{children}</Suspense>
      </PageContent>
      <Footer />
    </>
  );
}
