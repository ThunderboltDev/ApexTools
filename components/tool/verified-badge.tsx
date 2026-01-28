"use client";

import { CheckmarkBadge02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Tool } from "@/lib/types";
import { cn } from "@/lib/utils";

interface VerifiedBadgeProps {
  tool: Tool;
  tooltip?: string;
  className?: string;
}

export function VerifiedBadge({
  tool,
  tooltip,
  className,
}: VerifiedBadgeProps) {
  if (!tool.verifiedAt) return null;

  return (
    <Tooltip>
      <TooltipTrigger>
        <HugeiconsIcon
          icon={CheckmarkBadge02Icon}
          className={cn("fill-info text-white", className)}
        />
      </TooltipTrigger>
      <TooltipContent>
        {tooltip ?? "This tool has a verified domain"}
      </TooltipContent>
    </Tooltip>
  );
}
