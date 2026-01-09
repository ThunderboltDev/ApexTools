import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { PropsWithChildren } from "react";
import { ToolProvider } from "@/app/(public)/tool/[slug]/tool-context";
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
      title: `${tool.name} - ${tool.tagline}`,
      description: tool.description,
      openGraph: {
        title: tool.name,
        description: tool.tagline,
        images: [tool.logo],
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

  if (!tool || tool.status !== "approved") notFound();

  return <ToolProvider tool={tool}>{children}</ToolProvider>;
}
