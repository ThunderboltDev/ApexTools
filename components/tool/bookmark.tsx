"use client";

import { Bookmark02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@/components/ui/button";
import { useBookmarkStore } from "@/lib/store/bookmark";
import { cn } from "@/lib/utils";

interface BookmarkButtonProps {
  slug: string;
}

export function BookmarkButton({ slug }: BookmarkButtonProps) {
  const isBookmarked = useBookmarkStore((state) => state.isBookmarked(slug));
  const toggle = useBookmarkStore((state) => state.toggle);

  return (
    <Button
      size="icon"
      theme="info"
      variant="transparent"
      onClick={() => toggle(slug)}
      className={cn({
        "[&_svg]:fill-info": isBookmarked,
      })}
    >
      <HugeiconsIcon icon={Bookmark02Icon} />
      <span className="sr-only">Bookmark Tool</span>
    </Button>
  );
}
