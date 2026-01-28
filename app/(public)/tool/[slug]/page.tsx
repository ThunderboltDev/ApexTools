"use client";

import { LinkSquare02Icon, Tag01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";
import { BookmarkButton } from "@/components/tool/bookmark";
import { ToolCard } from "@/components/tool/card";
import { CategoryBadge } from "@/components/tool/category";
import { useTool } from "@/components/tool/tool-context";
import { UpvoteButton } from "@/components/tool/upvote";
import { VerifiedBadge } from "@/components/tool/verified-badge";
import { ViewTracker } from "@/components/tool/view-tracker";
import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/link-button";
import { getVisitorId } from "@/lib/store/visitor";
import { cn } from "@/lib/utils";
import { trpc } from "@/trpc/provider";

export default function ToolPage() {
  const tool = useTool();

  const { data: similarTools } = trpc.browse.getSimilarTools.useQuery({
    categories: tool.category,
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

      <div className="relative w-full h-[200px] md:h-[300px] rounded-xl overflow-hidden mb-8 bg-muted">
        <Image
          src={tool.banner}
          alt={`${tool.name} Banner`}
          fill
          className="object-cover"
          priority
          unoptimized
        />
        <div className="absolute inset-0 bg-linear-to-t from-background/80 to-transparent" />
      </div>

      <div className="relative px-4 sm:px-6 -mt-20 mb-8">
        <div className="flex flex-col md:flex-row md:items-end gap-6">
          <div className="relative rounded-xl border-4 border-background bg-background shadow-sm shrink-0 size-32 md:size-40 overflow-hidden">
            <Image
              src={tool.logo}
              alt={`${tool.name} Logo`}
              fill
              className="object-cover"
              loading="eager"
              unoptimized
            />
          </div>

          <div className="flex-1 space-y-2 pb-2">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                {tool.name}
              </h1>
              <VerifiedBadge tool={tool} />
            </div>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl">
              {tool.tagline}
            </p>

            <div className="flex items-center gap-2 overflow-auto scrollbar-2 pt-2">
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

          <div className="flex flex-wrap items-center gap-3 pb-2">
            <div className="flex items-center gap-2">
              <UpvoteButton className="hover:bg-secondary" tool={tool} />
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
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-12">
        <div className="lg:col-span-2 space-y-10">
          <section className="space-y-6">
            <h2 className="text-2xl font-bold">About {tool.name}</h2>
            <div
              className={cn(
                "prose prose-neutral dark:prose-invert max-w-none",
                "prose-headings:font-bold prose-headings:tracking-tight",
                "prose-h1:text-3xl prose-h1:font-extrabold prose-h1:lg:text-4xl prose-h1:mb-4 prose-h1:mt-8 prose-h1:first:mt-0",
                "prose-h2:text-2xl prose-h2:font-semibold prose-h2:mt-8 prose-h2:mb-3",
                "prose-h3:text-xl prose-h3:font-semibold prose-h3:mt-6 prose-h3:mb-2",
                "prose-h4:text-lg prose-h4:font-semibold prose-h4:mt-6 prose-h4:mb-2",
                "prose-p:leading-7 prose-p:text-muted-foreground prose-p:mb-4 last:prose-p:mb-0",
                "prose-blockquote:border-l-2 prose-blockquote:border-primary prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-muted-foreground prose-blockquote:my-6",
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
            <section className="space-y-4 pt-8 border-t">
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

        <div className="space-y-8">
          {/* Sidebar content can go here, e.g. similar tools, ad, etc. */}
          <div className="sticky top-24 space-y-8">
            <div className="rounded-xl border bg-card p-6 space-y-4">
              <h3 className="font-semibold text-lg">Similar Tools</h3>
              {similarTools && similarTools.length > 0 ? (
                <div className="space-y-4">
                  {similarTools.map((tool) => (
                    <ToolCard key={tool.id} tool={tool} />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No similar tools found.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
