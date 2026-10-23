import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Footer } from "@/components/app/footer";
import { ToolDirectory } from "@/components/directory";
import {
  getBreadcrumbJsonLd,
  getFAQJsonLd,
  getToolCollectionJsonLd,
  JsonLd,
} from "@/components/seo/jsonLd";
import { FAQ } from "@/components/tool/faq";
import { config, url } from "@/config";
import { categoryContent } from "@/lib/category-data";
import { categories } from "@/lib/constants";
import type { Category } from "@/lib/types";
import { trpc } from "@/trpc/server";

interface PageProps {
  params: Promise<{ category: string }>;
}

function isCategory(value: string): value is Category {
  return categories.some((c) => c === value);
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { category } = await params;

  if (!isCategory(category)) {
    return {};
  }

  const { title, headline, description, keywords } = categoryContent[category];

  return {
    title: title,
    description: `${headline} | ${description}`,
    alternates: {
      canonical: `/${category}`,
    },
    openGraph: {
      siteName: config.name,
      locale: "en_US",
      type: "website",
      url: `/${category}`,
      images: [
        {
          url: "/preview.webp",
          width: 1200,
          height: 630,
          alt: `${config.name} Landing Page`,
        },
      ],
    },
    keywords: keywords,
  };
}

export async function generateStaticParams() {
  return categories.map((category) => ({
    category,
  }));
}

export default async function CategoryPage({ params }: PageProps) {
  const { category } = await params;

  if (!isCategory(category)) {
    notFound();
  }

  const content = categoryContent[category];

  const toolsData = await trpc.browse.getAll({
    category: category,
    limit: 24,
  });

  const breadcrumbs = [
    {
      name: "Home",
      item: url,
    },
    {
      name: content.headline,
      item: `${url}/${category}`,
    },
  ];

  return (
    <>
      <JsonLd
        data={getToolCollectionJsonLd(
          category,
          toolsData.tools,
          content.headline,
          content.description
        )}
      />
      <JsonLd data={getFAQJsonLd(content.faqs)} />
      <JsonLd data={getBreadcrumbJsonLd(breadcrumbs)} />
      <div className="mt-4 mb-8 space-y-3">
        <h1 className="md:text-5xl text-4xl text-center text-balance">
          {content.headline}
        </h1>
        <p className="text-center md:text-xl text-muted-foreground max-w-2xl mx-auto">
          {content.subheadline}
        </p>
      </div>
      <ToolDirectory category={category} />
      <FAQ items={content.faqs} />
      <Footer />
    </>
  );
}
