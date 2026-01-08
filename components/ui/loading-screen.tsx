import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

interface LoadingScreenProps {
  className?: string;
}

export function LoadingScreen({ className }: LoadingScreenProps) {
  return (
    <div className={cn("grid place-items-center h-view", className)}>
      <Spinner className="size-12 text-accent" />
    </div>
  );
}
