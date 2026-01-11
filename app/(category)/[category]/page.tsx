import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Footer } from "@/components/app/footer";
import { ToolDirectory } from "@/components/tool/directory";
import { FAQ } from "@/components/tool/faq";
import { categoryContent } from "@/lib/category-data";
import { categories } from "@/lib/constants";
import type { Category } from "@/lib/types";

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

  const content = categoryContent[category as Category];

  return {
    title: content.title,
    description: content.description,
    openGraph: {
      title: content.title,
      description: content.description,
      type: "website",
    },
    alternates: {
      canonical: `/${category}`,
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

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 container mx-auto px-4 py-12 md:py-16">
        <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            {content.headline}
          </h1>
          <p className="text-xl text-muted-foreground">{content.subheadline}</p>
        </div>

        <ToolDirectory category={category as Category} />

        {content.faqs.length > 0 && <FAQ items={content.faqs} />}
      </main>

      <Footer />
    </div>
  );
}
