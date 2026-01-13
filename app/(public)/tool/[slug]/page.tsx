"use client";

import { LinkSquare02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Image from "next/image";
import { useTool } from "@/app/(public)/tool/[slug]/tool-context";
import { BookmarkButton } from "@/components/tool/bookmark";
import { ToolCard } from "@/components/tool/card";
import { CategoryBadge } from "@/components/tool/category";
import { UpvoteButton } from "@/components/tool/upvote";
import { ViewTracker } from "@/components/tool/view-tracker";
import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/link-button";
import {
  PageContent,
  PageDescription,
  PageHeader,
  PageTitle,
} from "@/components/ui/page";
import { pricingLabels } from "@/lib/constants";
import { getVisitorId } from "@/lib/store/visitor";
import { trpc } from "@/trpc/provider";

export default function ToolPage() {
  const tool = useTool();

  const { data: similarTools } = trpc.browse.getSimilarTools.useQuery({
    category: tool.category,
    excludeSlug: tool.slug,
    limit: 3,
  });

  const { mutate: incrementVisit } = trpc.browse.incrementVisit.useMutation();

  const handleVisit = () => {
    incrementVisit({ toolId: tool.id, visitorId: getVisitorId() });
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
          <CategoryBadge category={tool.category} />
          <Badge>{pricingLabels[tool.pricing]}</Badge>
        </div>
        <div className="flex items-center justify-between gap-2 mt-4">
          <div className="flex items-center gap-2">
            <UpvoteButton tool={tool} className="hover:bg-secondary" />
            <BookmarkButton slug={tool.slug} />
          </div>
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
            {similarTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
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
