"use client";

import { ArrowUpBigIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth/context";
import type { ToolWithUpvoteStatus } from "@/lib/types";
import { normalizeCallbackUrl } from "@/lib/url";
import { cn } from "@/lib/utils";
import { trpc } from "@/trpc/provider";

interface UpvoteButtonProps {
  tool: ToolWithUpvoteStatus;
  className?: string;
}

export function UpvoteButton({ tool, className }: UpvoteButtonProps) {
  const { user, isLoading } = useAuth();

  const router = useRouter();
  const pathname = usePathname();

  const [upvotes, setUpvotes] = useState(tool.upvotes);
  const [isUpvoted, setIsUpvoted] = useState(tool.isUpvoted);

  const { mutate: upvoteTool } = trpc.tool.upvote.useMutation({
    onError: () => {
      setUpvotes((prev) => prev - (isUpvoted ? 1 : -1));
      setIsUpvoted((prev) => !prev);
    },
  });

  const handleUpvote = useCallback(() => {
    if (!user) {
      router.push(`/auth?callbackUrl=${normalizeCallbackUrl(pathname)}`);
    } else {
      setUpvotes((count) => count + (isUpvoted ? -1 : 1));
      setIsUpvoted((v) => !v);
      upvoteTool({ toolId: tool.id });
    }
  }, [tool.id, isUpvoted, upvoteTool, user, pathname, router]);

  if (isLoading) return null;

  return (
    <Button
      theme="default"
      variant="ghost"
      onClick={handleUpvote}
      disabled={!user}
      className={cn(
        "text-secondary-foreground [&>svg]:!size-5.5 !pl-2.5 !pr-3 !gap-1",
        {
          "[&>svg]:fill-accent text-accent hover:text-accent": isUpvoted,
        },
        className
      )}
    >
      <HugeiconsIcon icon={ArrowUpBigIcon} />
      <span className="text-base translate-y-[0.5px]">{upvotes}</span>
    </Button>
  );
}
