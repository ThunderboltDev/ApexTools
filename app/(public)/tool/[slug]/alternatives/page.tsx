import { ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { eq } from "drizzle-orm";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer } from "@/components/app/footer";
import {
  getAlternativesJsonLd,
  getBreadcrumbJsonLd,
  getFAQJsonLd,
  JsonLd,
} from "@/components/seo/jsonLd";
import { AlternativeCard } from "@/components/tool/alternative-card";
import { ToolBadge } from "@/components/tool/badge";
import { CategoryBadge } from "@/components/tool/category";
import { FAQ } from "@/components/tool/faq";
import { VerifiedBadge } from "@/components/tool/verified-badge";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LinkButton } from "@/components/ui/link-button";
import { config, url } from "@/config";
import { db } from "@/db/index";
import { toolsTable } from "@/db/schema";
import {
  getAlternativesFaqs,
  getAlternativesIntro,
  isIndexableAlternativesPage,
} from "@/lib/alternatives";
import { queryAlternativeTools } from "@/lib/alternatives.server";
import { categoryLabels, pricingLabels } from "@/lib/constants";
import type { Category } from "@/lib/types";

interface AlternativesPageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 3600;

export async function generateStaticParams() {
  const tools = await db.query.tool.findMany({
    columns: { slug: true },
  });

  return tools.map((tool) => ({
    slug: tool.slug,
  }));
}

export async function generateMetadata({
  params,
}: AlternativesPageProps): Promise<Metadata> {
  const { slug } = await params;

  const tool = await db.query.tool.findFirst({
    where: eq(toolsTable.slug, slug),
  });

  if (!tool) {
    return {
      title: "Tool Not Found",
      description: "The alternatives page you are looking for does not exist.",
    };
  }

  const alternatives = await queryAlternativeTools(tool);
  const isIndexable = isIndexableAlternativesPage(alternatives.length);
  const intro = getAlternativesIntro(tool, alternatives);
  const primaryCategoryLabel = tool.category[0]
    ? categoryLabels[tool.category[0]]
    : "AI";

  const title = `Best ${tool.name} Alternatives in ${intro.year} (${alternatives.length}+ Compared)`;
  const description = `Looking for the best ${tool.name} alternatives? Compare top ${primaryCategoryLabel} tools side-by-side with pricing, features, community upvotes, and key differences.`;

  return {
    title,
    description,
    alternates: {
      canonical: `/tool/${slug}/alternatives`,
    },
    robots: {
      index: isIndexable,
      follow: true,
      googleBot: {
        index: isIndexable,
        follow: true,
        "max-snippet": -1,
        "max-image-preview": "large",
      },
    },
    openGraph: {
      title,
      description,
      siteName: config.name,
      locale: "en_US",
      type: "article",
      url: `/tool/${slug}/alternatives`,
      images: [
        {
          url: tool.banner,
          width: 1200,
          height: 630,
          alt: `${tool.name} Alternatives Banner`,
        },
      ],
    },
    keywords: [
      `${tool.name} alternatives`,
      `best ${tool.name} alternatives`,
      `tools like ${tool.name}`,
      `free ${tool.name} alternative`,
      ...tool.category,
      ...tool.tags,
    ],
  };
}

export default async function AlternativesPage({
  params,
}: AlternativesPageProps) {
  const { slug } = await params;

  const tool = await db.query.tool.findFirst({
    where: eq(toolsTable.slug, slug),
  });

  if (!tool) {
    notFound();
  }

  const alternatives = await queryAlternativeTools(tool);
  const isIndexable = isIndexableAlternativesPage(alternatives.length);
  const intro = getAlternativesIntro(tool, alternatives);
  const faqs = getAlternativesFaqs(tool, alternatives);
  const primaryCategory: Category | undefined = tool.category[0];
  const primaryLabel = primaryCategory
    ? categoryLabels[primaryCategory]
    : "General";

  const breadcrumbs = [
    { name: "Home", item: url },
    { name: "Tool", item: `${url}/tool` },
    { name: tool.name, item: `${url}/tool/${tool.slug}` },
    {
      name: "Alternatives",
      item: `${url}/tool/${tool.slug}/alternatives`,
    },
  ];

  return (
    <>
      <JsonLd data={getAlternativesJsonLd(tool, alternatives, intro.first)} />
      <JsonLd data={getFAQJsonLd(faqs)} />
      <JsonLd data={getBreadcrumbJsonLd(breadcrumbs)} />

      <div className="space-y-8">
        {/* Back Link & Breadcrumbs */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <LinkButton
            variant="ghost"
            size="sm"
            href={`/tool/${tool.slug}`}
            className="text-muted-foreground hover:text-foreground -ml-2 w-fit"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} />
            Back to {tool.name}
          </LinkButton>

          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1.5 text-xs text-muted-foreground flex-wrap"
          >
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link
              href="/browse"
              className="hover:text-foreground transition-colors"
            >
              Tools
            </Link>
            <span>/</span>
            <Link
              href={`/tool/${tool.slug}`}
              className="hover:text-foreground transition-colors"
            >
              {tool.name}
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium">Alternatives</span>
          </nav>
        </div>

        {/* Hero Banner matching tool page */}
        <div className="relative w-full h-[180px] md:h-[260px] rounded-xl overflow-hidden bg-muted">
          <Image
            src={tool.banner}
            alt={`${tool.name} Banner`}
            fill
            sizes="(max-width: 768px) 100vw, 896px"
            className="object-cover"
            priority
          />
        </div>

        {/* Header Identity Section */}
        <div className="px-1 sm:px-2 space-y-6">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="relative rounded-xl overflow-hidden shrink-0 size-20 md:size-24 ring-4 ring-background border bg-muted">
              <Image
                src={tool.logo}
                alt={`${tool.name} Logo`}
                fill
                sizes="(max-width: 768px) 80px, 96px"
                className="object-cover"
                priority
              />
            </div>

            <div className="flex-1 min-w-0 space-y-3">
              <div className="flex items-center gap-2.5 flex-wrap">
                <Badge
                  variant="outline"
                  className="bg-primary/10 text-primary border-primary/20 text-xs font-semibold px-2.5 py-0.5"
                >
                  pSEO Alternatives Guide
                </Badge>
                {primaryCategory && (
                  <CategoryBadge category={primaryCategory} />
                )}
                <Badge variant="secondary" className="text-xs">
                  Updated {intro.year}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {pricingLabels[tool.pricing]}
                </Badge>
              </div>

              <div className="flex items-start gap-3 flex-wrap">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
                  Best {tool.name} Alternatives in {intro.year}
                </h1>
                <VerifiedBadge tool={tool} />
                <ToolBadge tool={tool} size="md" />
              </div>

              <p className="text-base text-muted-foreground leading-relaxed max-w-3xl">
                Comparing options to{" "}
                <span className="font-semibold text-foreground">
                  {tool.name}
                </span>
                ? We ranked the top {primaryLabel.toLowerCase()} alternatives
                based on category alignment, features, pricing, and verified
                community upvotes.
              </p>
            </div>
          </div>

          {/* Market Overview Card matching OverviewPage patterns */}
          <Card className="bg-muted/30 border-border/80">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold tracking-wide uppercase text-foreground">
                Market Overview & Ranking Methodology
              </CardTitle>
              <CardDescription className="text-xs">
                How ApexTools compares and scores alternatives for {tool.name}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground leading-relaxed">
              <p>{intro.first}</p>
              <p>{intro.second}</p>
            </CardContent>
          </Card>
        </div>

        {/* Alternatives Listing Section */}
        <section className="space-y-6" aria-labelledby="alternatives-heading">
          <div className="flex items-center justify-between gap-4 flex-wrap pb-2 border-b">
            <div>
              <h2
                id="alternatives-heading"
                className="text-xl md:text-2xl font-bold tracking-tight text-foreground"
              >
                Top {tool.name} Alternatives ({alternatives.length})
              </h2>
              <p className="text-xs md:text-sm text-muted-foreground">
                Ranked by category similarity, shared capabilities, and user
                upvotes
              </p>
            </div>
            {primaryCategory && (
              <LinkButton
                variant="ghost"
                size="sm"
                href={`/${primaryCategory}`}
              >
                Browse all {primaryLabel} tools
                <HugeiconsIcon icon={ArrowRight01Icon} />
              </LinkButton>
            )}
          </div>

          {alternatives.length > 0 ? (
            <div className="grid grid-cols-1 gap-5">
              {alternatives.map((alternative, index) => (
                <AlternativeCard
                  key={alternative.id}
                  sourceTool={tool}
                  alternative={alternative}
                  rank={index + 1}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 px-4 rounded-xl border border-dashed bg-muted/30 space-y-4">
              <h3 className="text-lg font-semibold text-foreground">
                No Direct Alternatives Found Yet
              </h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                ApexTools is continually expanding. We do not yet have enough
                tools in the same exact niche to recommend verified alternatives
                for {tool.name}.
              </p>
              {primaryCategory && (
                <div className="pt-2">
                  <LinkButton theme="accent" href={`/${primaryCategory}`}>
                    Explore all {primaryLabel} Tools
                    <HugeiconsIcon icon={ArrowRight01Icon} />
                  </LinkButton>
                </div>
              )}
            </div>
          )}
        </section>

        {/* Low count notice if under indexable threshold */}
        {!isIndexable && alternatives.length > 0 && (
          <div className="p-4 rounded-lg bg-secondary/60 text-xs text-muted-foreground border">
            <span className="font-semibold text-foreground">
              Directory note:
            </span>{" "}
            We currently list fewer than 3 closely matching alternatives for{" "}
            {tool.name}. As new tools join the directory, this page will update
            with more verified side-by-side options.
          </div>
        )}

        {/* FAQ Section */}
        {faqs.length > 0 && (
          <section className="pt-4 border-t" aria-labelledby="faq-heading">
            <FAQ items={faqs} />
          </section>
        )}

        {/* Internal Linking Hub / Related Categories */}
        <section
          className="pt-6 border-t space-y-4"
          aria-labelledby="related-heading"
        >
          <h2
            id="related-heading"
            className="text-lg font-semibold tracking-tight text-foreground"
          >
            Related Categories & Resources
          </h2>
          <div className="flex flex-wrap gap-2">
            <LinkButton variant="outline" size="sm" href={`/tool/${tool.slug}`}>
              {tool.name} Profile
            </LinkButton>
            {tool.category.map((category) => (
              <LinkButton
                key={category}
                variant="outline"
                size="sm"
                href={`/${category}`}
              >
                All {categoryLabels[category]} Tools
              </LinkButton>
            ))}
            <LinkButton variant="outline" size="sm" href="/browse">
              Browse All AI Tools
            </LinkButton>
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
}
