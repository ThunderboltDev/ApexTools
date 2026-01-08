import { ExternalLink, SparklesIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ViewTracker } from "@/components/tool/view-tracker";
import { Badge } from "@/components/ui/badge";
import { PageContent, PageHeader, PageTitle } from "@/components/ui/page";
import { trpc } from "@/trpc/server";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  try {
    const tool = await trpc.browse.getBySlug({ slug });

    return {
      title: `${tool.name} - ${tool.tagline} | ApexAura`,
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

import { LinkButton } from "@/components/ui/link-button";
import type { Tool } from "@/lib/types";

// ...

export default async function ToolPage({ params }: Props) {
  const { slug } = await params;
  let tool: Tool;

  try {
    tool = await trpc.browse.getBySlug({ slug });
  } catch {
    notFound();
  }

  const similarTools = await trpc.browse.getSimilarTools({
    category: tool.category,
    excludeSlug: tool.slug,
    limit: 3,
  });

  return (
    <PageContent className="wrapper-xl py-10">
      <ViewTracker toolId={tool.id} />
      <div className="grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          <PageHeader className="flex-row items-start gap-6 space-y-0">
            <div className="size-20 shrink-0 overflow-hidden rounded-xl border border-border bg-muted/40 shadow-sm">
              <Image
                src={tool.logo}
                alt={`${tool.name} logo`}
                width={80}
                height={80}
                className="size-full object-cover"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <PageTitle className="text-3xl">{tool.name}</PageTitle>
                <Badge variant="secondary" className="text-sm">
                  {tool.category}
                </Badge>
              </div>
              <p className="text-xl text-muted-foreground">{tool.tagline}</p>
              <div className="flex items-center gap-2 pt-2">
                <LinkButton
                  size="lg"
                  theme="accent"
                  className="gap-2"
                  href={tool.url}
                >
                  <HugeiconsIcon icon={ExternalLink} className="size-5" />
                  Visit Website
                </LinkButton>
                <Badge variant="outline" className="h-10 px-4 text-sm gap-2">
                  <HugeiconsIcon icon={SparklesIcon} className="size-4" />
                  {tool.pricing}
                </Badge>
              </div>
            </div>
          </PageHeader>

          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <h3 className="text-xl font-semibold mb-4">About {tool.name}</h3>
            <p className="whitespace-pre-wrap leading-relaxed text-muted-foreground">
              {tool.description}
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <h3 className="font-semibold mb-4">Similar Tools</h3>
            {similarTools.length > 0 ? (
              <div className="grid gap-4">
                {similarTools.map((similar) => (
                  <Link
                    key={similar.id}
                    href={`/tool/${similar.slug}`}
                    className="group flex items-start gap-3 rounded-lg p-2 hover:bg-muted/50 transition-colors"
                  >
                    <div className="size-10 shrink-0 overflow-hidden rounded-md border border-border bg-muted/40">
                      <Image
                        src={similar.logo}
                        alt={`${similar.name} logo`}
                        width={40}
                        height={40}
                        className="size-full object-cover"
                      />
                    </div>
                    <div className="space-y-1 overflow-hidden">
                      <p className="font-medium leading-none group-hover:text-primary transition-colors">
                        {similar.name}
                      </p>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {similar.tagline}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No similar tools found in this category.
              </p>
            )}
          </div>
        </div>
      </div>
    </PageContent>
  );
}
