"use client";

import {
  ChevronLeft,
  CrownIcon,
  LinkSquare02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import confetti from "canvas-confetti";
import { format } from "date-fns";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { LinkButton } from "@/components/ui/link-button";
import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/trpc/provider";

function SuccessContent() {
  const searchParams = useSearchParams();

  const slug = searchParams.get("toolSlug");
  const duration = searchParams.get("duration");

  const { data: tool, isLoading } = trpc.tool.getBySlug.useQuery(
    { slug: slug || "" },
    {
      enabled: !!slug,
      retry: 0,
      staleTime: Infinity,
    }
  );

  useEffect(() => {
    const animDuration = 3000;
    const end = Date.now() + animDuration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.8 },
        colors: ["#c78700", "#db9f17", "#ecc563", "#faf0cf"],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.8 },
        colors: ["#c78700", "#db9f17", "#ecc563", "#faf0cf"],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  }, []);

  const durationText = duration === "7" ? "1 week" : "4 weeks";
  const featuredUntil = tool?.featuredUntil;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center text-center gap-6 max-w-md mx-auto p-6">
        <Skeleton className="size-20 rounded-full" />
        <div className="space-y-2 w-full">
          <Skeleton className="h-8 w-48 mx-auto" />
          <Skeleton className="h-4 w-64 mx-auto" />
        </div>
        <Skeleton className="h-20 w-full rounded-lg" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center text-center gap-6 max-w-md mx-auto p-6">
      <div className="p-4 rounded-full bg-linear-to-br from-gold/5 via-gold/10 to-gold/5 border border-gold/25">
        <HugeiconsIcon
          icon={CrownIcon}
          className="size-12 text-gold"
          strokeWidth={1.5}
        />
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl font-bold">
          {tool?.name ?? "Your tool"} is Now Featured!
        </h1>
        <p className="text-muted-foreground">
          Congratulations! {tool?.name ?? "Your tool"} will now appear first in
          search results.
        </p>
      </div>

      {tool && (
        <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50 border w-full">
          {tool.logo && (
            <Image
              className="rounded-lg"
              src={tool.logo}
              alt={tool.name}
              width={48}
              height={48}
              unoptimized
            />
          )}
          <div className="text-left">
            <p className="font-semibold">{tool.name}</p>
            <p className="text-sm text-muted-foreground">
              Featured for {durationText}
            </p>
          </div>
        </div>
      )}

      {featuredUntil && (
        <p className="text-sm text-success">
          <span className="font-semibold">Featured until:</span>{" "}
          {format(new Date(featuredUntil), "MMMM d, yyyy")}
        </p>
      )}

      <div className="space-y-3 w-full pt-4">
        {tool && (
          <LinkButton
            href={`/tool/${tool.slug}`}
            className="w-full"
            theme="accent"
          >
            <HugeiconsIcon icon={LinkSquare02Icon} className="size-4" />
            View Your Tool
          </LinkButton>
        )}
        <LinkButton href="/overview" variant="outline" className="w-full">
          <HugeiconsIcon icon={ChevronLeft} className="size-4" />
          Back to Dashboard
        </LinkButton>
      </div>
    </div>
  );
}

export default function FeaturedSuccessPage() {
  return (
    <div className="relative overflow-hidden min-h-[60vh] max-h-screen flex items-center justify-center py-12">
      <div className="absolute -z-1 inset-0 bg-linear-to-br from-gold/5 via-transparent to-transparent animate-pulse" />

      <Suspense
        fallback={
          <div className="flex flex-col items-center text-center gap-6 max-w-md mx-auto p-6">
            <Skeleton className="size-20 rounded-full" />
            <div className="space-y-2 w-full">
              <Skeleton className="h-8 w-48 mx-auto" />
              <Skeleton className="h-4 w-64 mx-auto" />
            </div>
            <Skeleton className="h-20 w-full rounded-lg" />
          </div>
        }
      >
        <SuccessContent />
      </Suspense>
    </div>
  );
}
