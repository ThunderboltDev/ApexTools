import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { PropsWithChildren } from "react";
import {
  getBreadcrumbJsonLd,
  getToolJsonLd,
  JsonLd,
} from "@/components/seo/jsonLd";
import { ToolProvider } from "@/components/tool/tool-context";
import { url } from "@/config";
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
      description: tool.tagline,
      openGraph: {
        title: tool.name,
        description: tool.tagline,
        images: [tool.logo],
      },
      alternates: {
        canonical: `/tool/${slug}`,
      },
    };
  } catch {
    return {
      title: "Tool Not Found",
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

  const breadcrumbs = [
    { name: "Home", item: url },
    { name: "Tool", item: `${url}/tool` },
    { name: tool.name, item: `${url}/tool/${tool.slug}` },
  ];

  return (
    <ToolProvider tool={tool}>
      <JsonLd data={getToolJsonLd(tool)} />
      <JsonLd data={getBreadcrumbJsonLd(breadcrumbs)} />
      {children}
    </ToolProvider>
  );
}
