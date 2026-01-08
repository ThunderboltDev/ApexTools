"use client";
/* eslint-disable @next/next/no-img-element */

import { ExternalLink, SparklesIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
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
import type { Tool } from "@/lib/types";

type ToolCardProps = {
  tool: Pick<
    Tool,
    "name" | "tagline" | "category" | "pricing" | "logo" | "url" | "slug"
  >;
};

export function ToolCard({ tool }: ToolCardProps) {
  return (
    <Card className="flex h-full flex-col">
      <CardHeader className="flex items-start gap-3">
        <div className="size-12 overflow-hidden rounded-md border border-border bg-muted/40">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {/** biome-ignore lint/performance/noImgElement: <temp> */}
          <img
            src={tool.logo}
            alt={`${tool.name} logo`}
            className="size-full object-cover"
          />
        </div>
        <div className="space-y-1">
          <CardTitle className="text-base leading-tight">{tool.name}</CardTitle>
          <CardDescription className="line-clamp-2 text-sm">
            {tool.tagline}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2">
        <Badge variant="secondary">{tool.category}</Badge>
        <Badge variant="outline" className="gap-1">
          <HugeiconsIcon icon={SparklesIcon} className="size-3.5" />
          {tool.pricing}
        </Badge>
      </CardContent>
      <CardFooter className="mt-auto">
        <LinkButton
          href={tool.url}
          size="sm"
          theme="accent"
          target="_blank"
          rel="noreferrer"
          className="w-full gap-2"
        >
          <HugeiconsIcon icon={ExternalLink} className="size-4" />
          Visit
        </LinkButton>
      </CardFooter>
    </Card>
  );
}
