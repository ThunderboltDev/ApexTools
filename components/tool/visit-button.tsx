"use client";

import { LinkSquare02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { LinkButton } from "@/components/ui/link-button";
import { getVisitorId } from "@/lib/store/visitor";
import type { ToolWithUpvoteStatus } from "@/lib/types";
import { trpc } from "@/trpc/provider";

interface VisitButtonProps {
  tool: ToolWithUpvoteStatus;
}

export function VisitButton({ tool }: VisitButtonProps) {
  const { mutate: incrementVisit } = trpc.browse.incrementVisit.useMutation();

  const handleVisit = () => {
    incrementVisit({ toolId: tool.id, visitorId: getVisitorId() });
  };

  return (
    <LinkButton
      theme="accent"
      href={`${tool.url}?ref=apextools`}
      onClick={handleVisit}
      target="_blank"
      rel="noopener noreferrer"
    >
      <HugeiconsIcon icon={LinkSquare02Icon} />
      Visit Website
    </LinkButton>
  );
}
