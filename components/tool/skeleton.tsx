import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonToolCard() {
  return (
    <Skeleton className="flex flex-col h-[212px] bg-secondary p-6 rounded-2xl gap-3">
      <div className="flex flex-row items-start gap-4">
        <div className="size-12 bg-muted/50 rounded-md" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-7 w-24" />
          <div className="flex flex-wrap gap-1">
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-5 w-10 rounded-full" />
          </div>
        </div>
      </div>
      <div className="space-y-2 my-1">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
      </div>

      <div className="flex justify-between">
        <div className="flex items-center gap-2">
          <Skeleton className="w-18 h-9 rounded-md" />
          <Skeleton className="size-9 rounded-md" />
        </div>
        <Skeleton className="h-9 w-18 rounded-md" />
      </div>
    </Skeleton>
  );
}
