import { notFound } from "next/navigation";
import { ViewTracker } from "@/components/tool/view-tracker";
import type { Tool } from "@/lib/types";
import { trpc } from "@/trpc/server";

export default async function ToolLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let tool: Tool;

  try {
    tool = await trpc.browse.getBySlug({ slug });
  } catch {
    notFound();
  }

  return (
    <>
      <ViewTracker toolId={tool.id} />
      {children}
    </>
  );
}
