import {
  CrownIcon,
  Fire03Icon,
  SparklesIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { cva } from "class-variance-authority";
import { HOT_THRESHOLD } from "@/lib/constants";
import { getDaysInMs } from "@/lib/date";
import type { Tool } from "@/lib/types";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "absolute top-3 right-3 flex items-center gap-1.5 rounded-full border [&>svg]:pointer-events-none",
  {
    variants: {
      variant: {
        featured: "bg-gold/15 text-gold border-gold/30",
        hot: "bg-accent/15 text-accent border-accent/30",
        new: "bg-info/15 text-info border-info/30",
      },
      size: {
        sm: "px-2 py-0.5 text-xs font-medium [&>svg]:size-3.5",
        md: "px-3 py-1 text-sm font-semibold [&>svg]:size-4",
      },
    },
    defaultVariants: {
      variant: "featured",
      size: "sm",
    },
  }
);

const isFeatured = (featuredUntil: Date | null | undefined) => {
  if (!featuredUntil) return false;
  return new Date(featuredUntil) > new Date();
};

const isNew = (createdAt: Date) => {
  const today = Date.now();
  return today - createdAt.getTime() < getDaysInMs(7);
};

interface ToolBadgeProps {
  tool: Tool;
  size?: "sm" | "md";
}

export function ToolBadge({ tool, size = "sm" }: ToolBadgeProps) {
  if (isFeatured(tool.featuredUntil))
    return (
      <div className={cn(badgeVariants({ variant: "featured", size }))}>
        <HugeiconsIcon icon={CrownIcon} className="size-3" />
        <span>Featured</span>
      </div>
    );

  if (tool.score > HOT_THRESHOLD)
    return (
      <div className={cn(badgeVariants({ variant: "hot", size }))}>
        <HugeiconsIcon icon={Fire03Icon} className="size-3" />
        <span>Hot</span>
      </div>
    );

  if (isNew(tool.createdAt))
    return (
      <div className={cn(badgeVariants({ variant: "new", size }))}>
        <HugeiconsIcon icon={SparklesIcon} className="size-3" />
        <span>New</span>
      </div>
    );
}
