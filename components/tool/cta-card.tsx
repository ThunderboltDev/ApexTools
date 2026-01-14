import { Idea01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface ToolCTACard {
  className?: string;
}

export function ToolCTACard({ className }: ToolCTACard) {
  return (
    <Link
      href="/submit"
      className={cn(
        "h-[208px] rounded-2xl border border-dashed",
        "flex flex-col items-center justify-center gap-3",
        "text-center transition ease-out duration-200",
        "hover:-translate-y-1 hover:border-accent hover:bg-accent/5",
        className
      )}
    >
      <HugeiconsIcon
        className="bg-secondary p-2 size-10 rounded-full"
        icon={Idea01Icon}
      />
      <span className="text-xs uppercase tracking-wide text-muted-foreground">
        Empty spot
      </span>
      <p className="px-10 text-balance text-secondary-foreground font-medium">
        Submit your own AI tool to have a chance to claim this spot
      </p>
    </Link>
  );
}
