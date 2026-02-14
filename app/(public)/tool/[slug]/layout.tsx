import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { PropsWithChildren } from "react";
import {
  getBreadcrumbJsonLd,
  getToolJsonLd,
  JsonLd,
} from "@/components/seo/jsonLd";
import { ToolProvider } from "@/components/tool/tool-context";
import { config, url } from "@/config";
import { trpc } from "@/trpc/server";

interface ToolLayoutProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ToolLayoutProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const tool = await trpc.browse.getBySlug({ slug });

    return {
      title: `${tool.name}`,
      description: `${tool.tagline} Category: ${tool.category.slice(0, 3).join(", ")}`,
      alternates: {
        canonical: `/tool/${slug}`,
      },
      openGraph: {
        siteName: config.name,
        locale: "en_US",
        type: "website",
        url: `/tool/${slug}`,
        images: [
          {
            url: tool.banner,
            width: 1200,
            height: 630,
            alt: tool.name,
          },
        ],
      },
      keywords: [tool.name, ...tool.category, ...tool.tags],
    };
  } catch {
    return {
      title: "Tool Not Found",
      description: "The tool you are looking for does not exist.",
    };
  }
}

export default async function ToolLayout({
  children,
  params,
}: PropsWithChildren<ToolLayoutProps>) {
  const { slug } = await params;

  const tool = await trpc.browse.getBySlug({ slug });

  if (!tool) notFound();

  void trpc.browse.getBySlug.prefetch({ slug });
  void trpc.user.getById.prefetch({ id: tool.userId });

  const user = await trpc.user.getById({ id: tool.userId });

  const breadcrumbs = [
    { name: "Home", item: url },
    { name: "Tool", item: `${url}/tool` },
    { name: tool.name, item: `${url}/tool/${tool.slug}` },
  ];

  return (
    <ToolProvider tool={tool}>
      <JsonLd data={getToolJsonLd(tool, user.name)} />
      <JsonLd data={getBreadcrumbJsonLd(breadcrumbs)} />
      {children}
    </ToolProvider>
  );
}
