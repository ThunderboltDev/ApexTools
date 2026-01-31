import Image from "next/image";
import Link from "next/link";
import { ToolBadge } from "@/components/tool/badge";
import { VerifiedBadge } from "@/components/tool/verified-badge";
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
      <ToolBadge tool={tool} />
      <div className="flex items-start gap-3">
        <Image
          src={tool.logo}
          alt={`${tool.name}'s Logo`}
          width={48}
          height={48}
          className="rounded-sm aspect-square object-cover"
          loading="lazy"
          unoptimized
        />
        <div className="space-y-1">
          <h3 className="text-base font-semibold flex items-center gap-1.5">
            {tool.name}
            <VerifiedBadge
              tool={tool}
              className="size-4"
              tooltip="Verified Tool"
            />
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-1">
            {tool.tagline}
          </p>
        </div>
      </div>
    </Link>
  );
}
