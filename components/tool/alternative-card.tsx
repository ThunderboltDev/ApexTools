"use client";

import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Image from "next/image";
import Link from "next/link";
import { ToolBadge } from "@/components/tool/badge";
import { BookmarkButton } from "@/components/tool/bookmark";
import { CategoryBadge } from "@/components/tool/category";
import { ImpressionTracker } from "@/components/tool/impression-tracker";
import { UpvoteButton } from "@/components/tool/upvote";
import { VerifiedBadge } from "@/components/tool/verified-badge";
import { VisitButton } from "@/components/tool/visit-button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LinkButton } from "@/components/ui/link-button";
import { getAlternativeReason, getBestWhen } from "@/lib/alternatives";
import { trackToolCardClick } from "@/lib/analytics";
import { pricingLabels } from "@/lib/constants";
import type { Tool, ToolWithUpvoteStatus } from "@/lib/types";

interface AlternativeCardProps {
  sourceTool: Tool;
  alternative: Tool;
  rank: number;
  isUpvoted?: boolean;
}

export function AlternativeCard({
  sourceTool,
  alternative,
  rank,
  isUpvoted = false,
}: AlternativeCardProps) {
  const toolWithStatus: ToolWithUpvoteStatus = {
    ...alternative,
    isUpvoted,
  };

  const reason = getAlternativeReason(sourceTool, alternative);
  const bestWhen = getBestWhen(sourceTool, alternative);

  const sharedCategories = alternative.category.filter((cat) =>
    sourceTool.category.includes(cat)
  );
  const additionalCategories = alternative.category.filter(
    (cat) => !sourceTool.category.includes(cat)
  );

  return (
    <Card className="hover:-translate-y-1 transition-transform duration-200 ease-out relative gap-3 shadow-md hover:shadow-lg pt-4 border-border/80">
      <ImpressionTracker toolId={alternative.id} />
      <ToolBadge tool={alternative} />

      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-4 space-y-0 pb-3">
        <div className="flex items-center gap-3">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-sm">
            #{rank}
          </div>
          <div className="relative size-12 shrink-0 overflow-hidden rounded-md border bg-muted">
            <Image
              src={alternative.logo}
              alt={alternative.name}
              width={48}
              height={48}
              className="object-cover size-full rounded-md"
              loading="lazy"
            />
          </div>
        </div>

        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <Link
              href={`/tool/${alternative.slug}`}
              onClick={() =>
                trackToolCardClick(alternative.slug, alternative.name)
              }
              className="hover:underline"
            >
              <CardTitle className="text-xl font-bold tracking-tight text-foreground flex items-center gap-1.5">
                {alternative.name}
                <VerifiedBadge tool={alternative} className="size-5" />
              </CardTitle>
            </Link>
            <Badge variant="secondary" className="font-medium text-xs">
              {pricingLabels[alternative.pricing]}
            </Badge>
          </div>
          <CardDescription className="text-sm text-muted-foreground line-clamp-2">
            {alternative.tagline}
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pt-1 pb-4">
        <div className="rounded-lg bg-muted/50 p-3 space-y-1.5 border border-muted">
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="bg-primary/5 text-primary border-primary/20 text-xs font-semibold px-2 py-0.5"
            >
              Best When
            </Badge>
            <span className="text-xs font-medium text-foreground">
              {bestWhen}
            </span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {reason}
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs text-muted-foreground mr-1">
              Categories:
            </span>
            {sharedCategories.map((category) => (
              <CategoryBadge key={category} category={category} />
            ))}
            {additionalCategories.map((category) => (
              <CategoryBadge key={category} category={category} />
            ))}
          </div>

          {alternative.tags.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs text-muted-foreground mr-1">Tags:</span>
              {alternative.tags.slice(0, 4).map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="text-[11px] px-2 py-0 font-normal text-muted-foreground"
                >
                  #{tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between gap-2 border-t pt-3 bg-muted/20">
        <div className="flex items-center gap-2">
          <UpvoteButton tool={toolWithStatus} />
          <BookmarkButton slug={alternative.slug} />
        </div>
        <div className="flex items-center gap-2">
          <LinkButton
            variant="ghost"
            size="sm"
            href={`/tool/${alternative.slug}`}
          >
            Profile
            <HugeiconsIcon icon={ArrowRight01Icon} />
          </LinkButton>
          <VisitButton tool={toolWithStatus} />
        </div>
      </CardFooter>
    </Card>
  );
}
