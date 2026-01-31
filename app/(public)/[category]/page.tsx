import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Footer } from "@/components/app/footer";
import { ToolDirectory } from "@/components/directory";
import {
  getFAQJsonLd,
  getToolCollectionJsonLd,
  JsonLd,
} from "@/components/seo/jsonLd";
import { FAQ } from "@/components/tool/faq";
import { categoryContent } from "@/lib/category-data";
import { categories } from "@/lib/constants";
import type { Category } from "@/lib/types";
import { trpc } from "@/trpc/server";

interface PageProps {
  params: Promise<{ category: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { category } = await params;

  if (!categories.includes(category as Category)) {
    return {};
  }

  const { title, headline, description } =
    categoryContent[category as Category];

  return {
    title: title,
    description: `${headline} | ${description}`,
    alternates: {
      canonical: `/${category}`,
    },
    openGraph: {
      type: "website",
      url: `/${category}`,
    },
  };
}

export async function generateStaticParams() {
  return categories.map((category) => ({
    category,
  }));
}

export default async function CategoryPage({ params }: PageProps) {
  const { category } = await params;

  if (!categories.includes(category as Category)) {
    notFound();
  }

  const content = categoryContent[category as Category];

  const toolsData = await trpc.browse.getAll({
    category: category as Category,
    limit: 24,
  });

  return (
    <>
      <JsonLd
        data={getToolCollectionJsonLd(
          category,
          toolsData.tools,
          content.headline,
          content.description,
        )}
      />
      <JsonLd data={getFAQJsonLd(content.faqs)} />
      <div className="mt-4 mb-8 space-y-3">
        <h1 className="md:text-5xl text-center text-balance">
          {content.headline}
        </h1>
        <p className="text-center md:text-xl text-muted-foreground max-w-2xl mx-auto">
          {content.subheadline}
        </p>
      </div>
      <ToolDirectory category={category as Category} />
      <FAQ items={content.faqs} />
      <Footer />
    </>
  );
}
