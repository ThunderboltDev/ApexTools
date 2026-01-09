"use client";

import { ArrowUpBigIcon, LinkSquare02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useTool } from "@/app/(public)/tool/[slug]/tool-context";
import { ViewTracker } from "@/components/tool/view-tracker";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LinkButton } from "@/components/ui/link-button";
import {
  PageContent,
  PageDescription,
  PageHeader,
  PageTitle,
} from "@/components/ui/page";
import { categoryLabels, pricingLabels } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { getVisitorId } from "@/lib/visitor";
import { trpc } from "@/trpc/provider";

export default function ToolPage() {
  const [isUpvoted, setIsUpvoted] = useState(false);
  const tool = useTool();

  const { mutate: upvoteTool } = trpc.tool.upvote.useMutation();

  const { data: similarTools } = trpc.browse.getSimilarTools.useQuery({
    category: tool.category,
    excludeSlug: tool.slug,
    limit: 3,
  });

  const { mutate: incrementVisit } = trpc.browse.incrementVisit.useMutation();

  const handleVisit = () => {
    incrementVisit({ toolId: tool.id, visitorId: getVisitorId() });
  };

  const handleUpvote = () => {
    upvoteTool({ toolId: tool.id });
    setIsUpvoted((prev) => !prev);
  };

  return (
    <>
      <ViewTracker toolId={tool.id} />
      <PageHeader>
        <Image
          src={tool.logo}
          alt={`${tool.name} Logo`}
          width={72}
          height={72}
          className="rounded-sm object-cover"
        />
        <PageTitle>{tool.name}</PageTitle>
        <PageDescription>{tool.tagline}</PageDescription>
        <div className="flex items-center gap-2">
          <Badge>{categoryLabels[tool.category]}</Badge>
          <Badge>{pricingLabels[tool.pricing]}</Badge>
        </div>
        <div className="flex items-center gap-2 mt-4">
          <Button
            theme="default"
            variant="outline"
            size="icon"
            className={cn("gap-2 [&>svg]:!size-5.5", {
              "[&>svg]:fill-accent text-accent hover:text-accent": isUpvoted,
            })}
            onClick={handleUpvote}
          >
            <HugeiconsIcon icon={ArrowUpBigIcon} />
            <span className="sr-only">Upvote Tool</span>
          </Button>
          <LinkButton
            theme="accent"
            href={tool.url}
            onClick={handleVisit}
            target="_blank"
            rel="noopener noreferrer"
            className="gap-2"
          >
            <HugeiconsIcon icon={LinkSquare02Icon} />
            Visit Website
          </LinkButton>
        </div>
      </PageHeader>
      <PageContent>
        <h3>About {tool.name}</h3>
        <p className="whitespace-pre-wrap leading-relaxed text-muted-foreground">
          {tool.description}
        </p>
      </PageContent>
      <div className="mt-6">
        <h3 className="font-semibold mb-4">Similar Tools</h3>
        {similarTools && similarTools.length > 0 ? (
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
    </>
  );
}
