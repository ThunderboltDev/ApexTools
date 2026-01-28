import { Home01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { Metadata } from "next";
import { LinkButton } from "@/components/ui/link-button";

export const metadata: Metadata = {
  title: "Page Not Found",
  description: "The page you are looking for does not exist.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <div className="h-view flex flex-col items-center justify-center px-4">
      <div className="text-center space-y-6">
        <h1 className="text-8xl font-bold bg-clip-text text-transparent bg-linear-to-b from-foreground to-foreground/60">
          404
        </h1>
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">Page Not Found</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            The page you&apos;re looking for doesn&apos;t exist or has been
            moved.
          </p>
        </div>
        <LinkButton href="/browse" theme="accent" className="gap-2">
          <HugeiconsIcon icon={Home01Icon} />
          Back to Discovery
        </LinkButton>
      </div>
    </div>
  );
}
