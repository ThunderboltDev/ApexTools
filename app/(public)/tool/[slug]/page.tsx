"use client";

import { LinkSquare02Icon, Tag01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";
import { FeaturedToolCTA } from "@/components/featured/cta";
import { ToolBadge } from "@/components/tool/badge";
import { BookmarkButton } from "@/components/tool/bookmark";
import { ToolCard } from "@/components/tool/card";
import { CategoryBadge } from "@/components/tool/category";
import { ClaimTool } from "@/components/tool/claim";
import { SkeletonToolCard } from "@/components/tool/skeleton";
import { useTool } from "@/components/tool/tool-context";
import { UpvoteButton } from "@/components/tool/upvote";
import { VerifiedBadge } from "@/components/tool/verified-badge";
import { ViewTracker } from "@/components/tool/view-tracker";
import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/link-button";
import { useSession } from "@/lib/auth/client";
import { getVisitorId } from "@/lib/store/visitor";
import { cn } from "@/lib/utils";
import { trpc } from "@/trpc/provider";

export default function ToolPage() {
  const tool = useTool();

  const { data: session, isPending } = useSession();

  const { data: similarTools, isLoading: isLoadingSimilar } =
    trpc.browse.getSimilarTools.useQuery({
      categories: tool.category,
      excludeSlug: tool.slug,
      limit: 6,
    });

  const { mutate: incrementVisit } = trpc.browse.incrementVisit.useMutation();

  const handleVisit = () => {
    incrementVisit({ toolId: tool.id, visitorId: getVisitorId() });
  };

  const isOwner = !isPending && session?.user?.id === tool.userId;

  return (
    <>
      <ViewTracker toolId={tool.id} />

      <div className="relative w-full h-[200px] md:h-[300px] rounded-xl overflow-hidden mb-6 bg-muted">
        <Image
          src={tool.banner}
          alt={`${tool.name} Banner`}
          fill
          className="object-cover"
          priority
          unoptimized
        />
      </div>

      <div className="px-4 sm:px-6 mb-8">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="relative rounded-xl overflow-hidden shrink-0 size-24 md:size-28 ring-4 ring-background shadow-lg">
            <Image
              src={tool.logo}
              alt={`${tool.name} Logo`}
              fill
              className="object-cover"
              loading="eager"
              unoptimized
            />
          </div>

          <div className="flex-1 min-w-0 space-y-3">
            <div className="flex items-start gap-3 flex-wrap">
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                {tool.name}
              </h1>
              <VerifiedBadge tool={tool} />
              <ToolBadge tool={tool} size="md" />
            </div>

            <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl">
              {tool.tagline}
            </p>

            <div className="flex items-center gap-2 flex-wrap">
              {tool.category.slice(0, 3).map((category) => (
                <CategoryBadge key={category} category={category} />
              ))}
              {tool.category.length > 3 && (
                <Badge
                  variant="outline"
                  className="px-2.5 py-0.5 border-0 bg-muted text-muted-foreground"
                >
                  +{tool.category.length - 3}
                </Badge>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-row justify-between gap-3 mt-6 pt-4 border-t">
          <div className="flex items-center gap-2">
            <UpvoteButton className="hover:bg-secondary" tool={tool} />
            <BookmarkButton slug={tool.slug} />
          </div>
          <div className="flex items-center gap-2">
            <ClaimTool tool={tool} />
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
        </div>

        {isOwner && !isPending && <FeaturedToolCTA tool={tool} />}
      </div>

      <div className="px-4 sm:px-6 mt-8">
        <div className="max-w-3xl">
          <section className="space-y-6">
            <h2 className="text-xl font-semibold">About {tool.name}</h2>
            <div
              className={cn(
                "prose prose-neutral dark:prose-invert max-w-none",
                "prose-headings:font-bold prose-headings:tracking-tight",
                "prose-h1:text-2xl prose-h1:font-bold prose-h1:mb-4 prose-h1:mt-8 prose-h1:first:mt-0",
                "prose-h2:text-xl prose-h2:font-semibold prose-h2:mt-6 prose-h2:mb-3",
                "prose-h3:text-lg prose-h3:font-semibold prose-h3:mt-4 prose-h3:mb-2",
                "prose-h4:text-base prose-h4:font-semibold prose-h4:mt-4 prose-h4:mb-2",
                "prose-p:leading-7 prose-p:text-muted-foreground prose-p:mb-4 last:prose-p:mb-0",
                "prose-blockquote:border-l-2 prose-blockquote:border-primary prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-muted-foreground prose-blockquote:my-4",
                "prose-ul:my-4 prose-ul:ml-4 prose-ul:list-disc [&>li]:mt-1",
                "prose-ol:my-4 prose-ol:ml-4 prose-ol:list-decimal [&>li]:mt-1",
                "prose-code:relative prose-code:rounded prose-code:bg-secondary prose-code:px-[0.3rem] prose-code:py-[0.2rem] prose-code:font-mono prose-code:text-sm prose-code:font-semibold",
                "prose-pre:p-4 prose-pre:rounded-lg prose-pre:bg-muted prose-pre:overflow-x-auto prose-pre:my-6",
                "prose-img:rounded-lg prose-img:border prose-img:my-6",
                "prose-hr:my-8 prose-hr:border-muted",
                "prose-a:text-primary prose-a:underline prose-a:underline-offset-4 hover:prose-a:text-primary/80"
              )}
            >
              <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
                {tool.description}
              </ReactMarkdown>
            </div>
          </section>

          {tool.tags && tool.tags.length > 0 && (
            <section className="space-y-4 pt-8 mt-8 border-t">
              <h3 className="flex items-center gap-2 text-lg font-semibold">
                <HugeiconsIcon
                  icon={Tag01Icon}
                  className="size-5 text-muted-foreground"
                />
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {tool.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="px-3 py-1 text-sm font-normal hover:bg-secondary/80"
                  >
                    #{tag}
                  </Badge>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      <div className="px-4 sm:px-6 mt-16 pt-8 border-t">
        <div className="space-y-6">
          <h3 className="text-xl font-semibold">Similar Tools</h3>

          {isLoadingSimilar ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map(() => (
                <SkeletonToolCard key={crypto.randomUUID()} />
              ))}
            </div>
          ) : similarTools && similarTools.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {similarTools.map((similarTool) => (
                <ToolCard key={similarTool.id} tool={similarTool} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-muted/30 rounded-lg">
              <p className="text-muted-foreground text-sm">
                No similar tools found.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
