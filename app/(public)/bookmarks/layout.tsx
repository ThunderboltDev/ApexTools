import type { Metadata } from "next";
import { type PropsWithChildren, Suspense } from "react";
import { Footer } from "@/components/app/footer";
import { LoadingScreen } from "@/components/ui/loading-screen";
import {
  PageContent,
  PageDescription,
  PageHeader,
  PageTitle,
} from "@/components/ui/page";

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
      <PageHeader>
        <PageTitle>Bookmarks</PageTitle>
        <PageDescription>
          Tools you&apos;ve saved for later. Stored locally in your browser.
        </PageDescription>
      </PageHeader>
      <Suspense fallback={<LoadingScreen />}>
        <PageContent>{children}</PageContent>
      </Suspense>
      <Footer />
    </>
  );
}
