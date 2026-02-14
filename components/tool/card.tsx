"use client";

import Image from "next/image";
import Link from "next/link";
import { ToolBadge } from "@/components/tool/badge";
import { BookmarkButton } from "@/components/tool/bookmark";
import { ImpressionTracker } from "@/components/tool/impression-tracker";
import { UpvoteButton } from "@/components/tool/upvote";
import { VerifiedBadge } from "@/components/tool/verified-badge";
import { VisitButton } from "@/components/tool/visit-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { trackToolCardClick } from "@/lib/analytics";
import type { ToolWithUpvoteStatus } from "@/lib/types";

interface ToolCardProps {
  tool: ToolWithUpvoteStatus;
}

export function ToolCard({ tool }: ToolCardProps) {
  return (
    <Card className="hover:-translate-y-1 transition-transform duration-200 ease-out relative gap-3 shadow-md hover:shadow-lg pt-4">
      <ImpressionTracker toolId={tool.id} />
      <ToolBadge tool={tool} />

      <CardHeader className="flex flex-row items-start gap-4 space-y-0">
        <Image
          src={tool.logo}
          alt={tool.name}
          width={48}
          height={48}
          loading="lazy"
          className="object-cover rounded-md"
          unoptimized
        />
        <div className="flex-1">
          <Link
            href={`/tool/${tool.slug}`}
            onClick={() => trackToolCardClick(tool.slug, tool.name)}
          >
            <CardTitle className="text-lg font-bold text-foreground transition-colors flex items-center gap-1.5">
              {tool.name}
              <VerifiedBadge tool={tool} className="size-5" />
            </CardTitle>
          </Link>
        </div>
      </CardHeader>

      <CardContent>
        <CardDescription className="line-clamp-2 text-responsive text-muted-foreground">
          {tool.tagline}
        </CardDescription>
      </CardContent>

      <CardFooter className="flex justify-between">
        <div className="flex items-center gap-2">
          <UpvoteButton tool={tool} />
          <BookmarkButton slug={tool.slug} />
        </div>
        <VisitButton tool={tool} />
      </CardFooter>
    </Card>
  );
}
