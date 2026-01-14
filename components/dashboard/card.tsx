import { Fire03Icon, SparklesIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { categoryLabels, HOT_THRESHOLD, pricingLabels } from "@/lib/constants";
import { isNew } from "@/lib/date";
import type { Tool } from "@/lib/types";

interface DashboardToolCardProps {
  tool: Tool;
}

export function DashboardToolCard({ tool }: DashboardToolCardProps) {
  return (
    <Link
      key={tool.id}
      href={`/tools/${tool.slug}`}
      className="rounded-lg border border-border bg-secondary p-4 shadow-md"
    >
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
      <div className="flex items-start gap-3">
        <Image
          src={tool.logo}
          alt={`${tool.name}'s Logo`}
          width={48}
          height={48}
          className="rounded-sm aspect-square object-cover"
        />
        <div className="space-y-1">
          <h3 className="text-base font-semibold">{tool.name}</h3>
          <p className="text-sm text-muted-foreground line-clamp-1">
            {tool.tagline}
          </p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2 text-xs text-muted-foreground">
        <Badge variant="outline">{categoryLabels[tool.category]}</Badge>
        <Badge variant="outline">{pricingLabels[tool.pricing]}</Badge>
        {/* <Badge variant="outline">{statusLabels[tool.status]}</Badge> */}
      </div>
    </Link>
  );
}
