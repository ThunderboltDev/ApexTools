"use client";

import { LinkSquare02Icon, Tag01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Image from "next/image";
import { BookmarkButton } from "@/components/tool/bookmark";
import { ToolCard } from "@/components/tool/card";
import { useTool } from "@/components/tool/tool-context";
import { UpvoteButton } from "@/components/tool/upvote";
import { ViewTracker } from "@/components/tool/view-tracker";
import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/link-button";
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
      <div className="flex flex-col md:flex-row md:items-center gap-6 mb-8">
        <Image
          src={tool.logo}
          alt={`${tool.name} Logo`}
          width={120}
          height={120}
          className="rounded-md shrink-0 object-cover size-24 md:size-32 mt-4"
        />

        <div>
          <h1>{tool.name}</h1>
          <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl md:line-clamp-1">
            {tool.tagline}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <UpvoteButton tool={tool} />
          <BookmarkButton slug={tool.slug} />
        </div>
        <LinkButton
          theme="accent"
          href={tool.url}
          onClick={handleVisit}
          target="_blank"
          rel="noopener noreferrer"
        >
          <HugeiconsIcon icon={LinkSquare02Icon} />
          Visit Website
        </LinkButton>
      </div>

      <div className="space-y-10 mt-8">
        <section className="space-y-4">
          <h2>About {tool.name}</h2>
          <p className="whitespace-pre-wrap text-muted-foreground">
            {tool.description}
          </p>
        </section>

        {tool.tags && tool.tags.length > 0 && (
          <section className="space-y-4 pt-4 border-t">
            <h3 className="flex items-center gap-3">
              <HugeiconsIcon
                icon={Tag01Icon}
                className="size-6 text-muted-foreground"
              />
              Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {tool.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="px-2.5 py-1 hover:bg-secondary/50"
                >
                  #{tag}
                </Badge>
              ))}
            </div>
          </section>
        )}
      </div>

      <div className="mt-12 space-y-6">
        <h2>Similar Tools</h2>

        {similarTools && similarTools.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {similarTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-muted/30 rounded-2xl border border-dashed">
            <p className="text-muted-foreground">
              No similar tools found in this category yet.
            </p>
          </div>
        )}
      </div>
    </>
  );
}
