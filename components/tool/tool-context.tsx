"use client";

import { createContext, type ReactNode, useContext } from "react";
import type { ToolWithUpvoteStatus } from "@/lib/types";

const ToolContext = createContext<ToolWithUpvoteStatus | null>(null);

export function ToolProvider({
  tool,
  children,
}: {
  tool: ToolWithUpvoteStatus;
  children: ReactNode;
}) {
  return <ToolContext.Provider value={tool}>{children}</ToolContext.Provider>;
}

export function useTool() {
  const tool = useContext(ToolContext);

  if (!tool) throw new Error("useTool must be used inside ToolProvider");

  return tool;
}
