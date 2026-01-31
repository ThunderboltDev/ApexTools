import { CrownIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { format } from "date-fns";
import type { Tool } from "@/lib/types";
import { FeaturedToolPurchaseDialog } from "./dialog";

interface FeaturedToolCTAProps {
  tool: Tool;
}

export function FeaturedToolCTA({ tool }: FeaturedToolCTAProps) {
  const isFeatured =
    tool.featuredUntil && new Date(tool.featuredUntil) > new Date();

  return (
    <div className="mt-6 p-4 rounded-lg border border-gold/30 bg-gold/5 shadow-sm shadow-gold/10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {isFeatured ? (
          <>
            <div className="flex items-center gap-3">
              <HugeiconsIcon
                icon={CrownIcon}
                className="size-6 text-amber-500"
              />
              <div>
                <p className="font-medium">This tool is featured</p>
                <p className="text-sm text-muted-foreground">
                  Featured until{" "}
                  {tool.featuredUntil &&
                    format(new Date(tool.featuredUntil), "MMMM d, yyyy")}
                </p>
              </div>
            </div>
            <FeaturedToolPurchaseDialog
              toolSlug={tool.slug}
              toolName={tool.name}
              isVerified={!!tool.verifiedAt}
              currentFeaturedUntil={tool.featuredUntil}
            />
          </>
        ) : (
          <>
            <div>
              <p className="font-medium">Boost your tool's visibility</p>
              <p className="text-sm text-muted-foreground">
                Get featured to appear first in search results
              </p>
            </div>
            <FeaturedToolPurchaseDialog
              toolSlug={tool.slug}
              toolName={tool.name}
              isVerified={!!tool.verifiedAt}
              currentFeaturedUntil={tool.featuredUntil}
            />
          </>
        )}
      </div>
    </div>
  );
}
