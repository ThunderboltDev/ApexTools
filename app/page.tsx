import type { Metadata } from "next";
import { Footer } from "@/components/app/footer";
import { Navbar } from "@/components/app/navbar";
import { ToolDirectory } from "@/components/directory";
import {
  getBreadcrumbJsonLd,
  getOrganizationJsonLd,
  getPersonJsonLd,
  getWebSiteJsonLd,
  JsonLd,
} from "@/components/seo/jsonLd";
import { url } from "@/config";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Discover the Best AI Tools | AI Tools Directory | ApexTools",
  alternates: {
    canonical: "/",
  },
  robots: {
    follow: true,
    index: true,
  },
};

const breadcrumbs = [{ name: "Home", item: url }];

export default async function Home() {
  return (
    <Navbar>
      <JsonLd data={getPersonJsonLd()} />
      <JsonLd data={getWebSiteJsonLd()} />
      <JsonLd data={getOrganizationJsonLd()} />
      <JsonLd data={getBreadcrumbJsonLd(breadcrumbs)} />
      <div className="mt-4 mb-8 space-y-3">
        <h1 className="md:text-6xl text-balance text-center bg-clip-text text-transparent bg-linear-to-b from-foreground to-foreground/80">
          Discover the <span className="text-primary">Apex</span> of AI
        </h1>
        <p className="text-center md:text-xl text-muted-foreground max-w-2xl mx-auto">
          The curated directory for power users. Find the tools that are shaping
          the future, updated in real-time.
        </p>
      </div>
      <ToolDirectory />
      <Footer />
    </Navbar>
  );
}
