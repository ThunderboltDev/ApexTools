"use client";

import { useEffect } from "react";
import { trpc } from "@/trpc/provider";

export function ViewTracker({ toolId }: { toolId: string }) {
  const { mutate: trackView } = trpc.browse.trackView.useMutation();

  useEffect(() => {
    const visitorIdKey = "apex_visitor_id";
    let visitorId = localStorage.getItem(visitorIdKey);

    if (!visitorId) {
      visitorId = crypto.randomUUID();
      localStorage.setItem(visitorIdKey, visitorId);
    }

    const lastViewKey = `apex_view_${toolId}`;
    const lastView = localStorage.getItem(lastViewKey);
    const today = new Date().toDateString();

    if (lastView !== today) {
      trackView(
        { toolId, visitorId },
        {
          onSuccess: (data) => {
            if (data.tracked) {
              localStorage.setItem(lastViewKey, today);
            }
          },
        }
      );
    }
  }, [toolId, trackView]);

  return null;
}
