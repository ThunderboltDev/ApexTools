"use client";

import { useEffect, useRef } from "react";
import { getVisitorId } from "@/lib/store/visitor-store";
import { trpc } from "@/trpc/provider";

export function ImpressionTracker({ toolId }: { toolId: string }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const { mutate: trackImpression } = trpc.browse.trackImpression.useMutation();

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          trackImpression({ toolId, visitorId: getVisitorId() });
          observer.disconnect();
        }
      },
      { threshold: 0.75 }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [toolId, trackImpression]);

  return <div ref={ref} />;
}
