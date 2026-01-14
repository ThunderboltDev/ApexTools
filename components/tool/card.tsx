"use client";

import {
  Fire03Icon,
  LinkSquare02Icon,
  SparklesIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Image from "next/image";
import Link from "next/link";
import { BookmarkButton } from "@/components/tool/bookmark";
import { CategoryBadge } from "@/components/tool/category";
import { ImpressionTracker } from "@/components/tool/impression-tracker";
import { UpvoteButton } from "@/components/tool/upvote";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LinkButton } from "@/components/ui/link-button";
import { trackOutboundClick, trackToolCardClick } from "@/lib/analytics";
import { HOT_THRESHOLD } from "@/lib/constants";
import { isNew } from "@/lib/date";
import { getVisitorId } from "@/lib/store/visitor";
import type { ToolWithUpvoteStatus } from "@/lib/types";
import { trpc } from "@/trpc/provider";

interface ToolCardProps {
  tool: ToolWithUpvoteStatus;
}

export function ToolCard({ tool }: ToolCardProps) {
  const { mutate: incrementVisit } = trpc.browse.incrementVisit.useMutation();

  const handleVisit = () => {
    trackOutboundClick(tool.slug, tool.url);
    incrementVisit({ toolId: tool.id, visitorId: getVisitorId() });
  };

  return (
    <Card className="hover:-translate-y-1 transition-transform duration-200 ease-out relative gap-3 shadow-md hover:shadow-lg">
      <ImpressionTracker toolId={tool.id} />
      {tool.score > HOT_THRESHOLD ? (
        <div className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full bg-orange/20 px-2 py-0.5 text-xs font-medium text-orange-foreground border border-orange/30">
          <HugeiconsIcon icon={Fire03Icon} className="size-3" />
          <span>Hot</span>
        </div>
      ) : (
        isNew(tool.createdAt) && (
          <div className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent border border-accent/50">
            <HugeiconsIcon icon={SparklesIcon} className="size-3" />
            <span>New</span>
          </div>
        )
      )}

      <CardHeader className="flex flex-row items-start gap-4 space-y-0">
        <Image
          src={tool.logo}
          alt={tool.name}
          width={48}
          height={48}
          loading="lazy"
          className="object-cover rounded-md"
        />
        <div className="flex-1">
          <Link
            href={`/tool/${tool.slug}`}
            onClick={() => trackToolCardClick(tool.slug, tool.name)}
          >
            <CardTitle className="text-lg font-bold text-foreground transition-colors">
              {tool.name}
            </CardTitle>
          </Link>
          <CategoryBadge category={tool.category} />
        </div>
      </CardHeader>

      <CardContent>
        <CardDescription className="line-clamp-2 text-base md:text-sm text-muted-foreground">
          {tool.tagline}
        </CardDescription>
      </CardContent>

      <CardFooter className="flex justify-between">
        <div className="flex items-center gap-2">
          <UpvoteButton tool={tool} />
          <BookmarkButton slug={tool.slug} />
        </div>
        <LinkButton
          size="sm"
          variant="outline"
          href={tool.url}
          rel="noopener noreferrer"
          target="_blank"
          onClick={handleVisit}
        >
          Visit <HugeiconsIcon icon={LinkSquare02Icon} />
        </LinkButton>
      </CardFooter>
    </Card>
  );
}
