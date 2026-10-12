"use client";

import { useEffect, useRef } from "react";
import { getVisitorId } from "@/lib/store/visitor";
import { trpc } from "@/trpc/provider";

type ImpressionCallback = () => void;

let sharedObserver: IntersectionObserver | null = null;
const callbackMap = new WeakMap<Element, ImpressionCallback>();

function getSharedObserver(): IntersectionObserver | null {
  if (typeof window === "undefined") {
    return null;
  }

  if (!sharedObserver) {
    sharedObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const callback = callbackMap.get(entry.target);
            if (callback) {
              callback();
              callbackMap.delete(entry.target);
              sharedObserver?.unobserve(entry.target);
            }
          }
        }
      },
      { threshold: 0.75 }
    );
  }

  return sharedObserver;
}

export function ImpressionTracker({ toolId }: { toolId: string }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const { mutate: trackImpression } = trpc.browse.trackImpression.useMutation();

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = getSharedObserver();
    if (!observer) return;

    callbackMap.set(element, () => {
      trackImpression({ toolId, visitorId: getVisitorId() });
    });

    observer.observe(element);

    return () => {
      callbackMap.delete(element);
      observer.unobserve(element);
    };
  }, [toolId, trackImpression]);

  return <div ref={ref} />;
}
