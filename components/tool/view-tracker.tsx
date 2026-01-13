"use client";

import { useEffect } from "react";
import { getVisitorId } from "@/lib/store/visitor";
import { trpc } from "@/trpc/provider";

export function ViewTracker({ toolId }: { toolId: string }) {
  const { mutate: trackView } = trpc.browse.trackView.useMutation();

  useEffect(() => {
    trackView({ toolId, visitorId: getVisitorId() });
  }, [toolId, trackView]);

  return null;
}
