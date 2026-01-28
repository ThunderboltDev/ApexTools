"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { z } from "zod";
import { ToolForm } from "@/components/tool/tool-form";
import type { toolSchema } from "@/lib/constants";
import type { Category, Platform, PricingModel, Tool } from "@/lib/types";
import { trpc } from "@/trpc/provider";

export function EditForm({ tool }: { tool: Tool }) {
  const router = useRouter();

  const { mutateAsync: updateTool } = trpc.tool.update.useMutation();

  const handleSubmit = async (values: z.infer<typeof toolSchema>) => {
    try {
      await updateTool(values);
      toast.success("Tool updated successfully.");
      router.push(`/tools/${values.slug}`);
      router.refresh();
    } catch (error) {
      console.error(error);
      const message =
        error instanceof Error ? error.message : "Something went wrong!";
      toast.error(message);
    }
  };

  return (
    <ToolForm
      mode="edit"
      tool={tool}
      onSubmit={handleSubmit}
      defaultValues={{
        name: tool.name,
        slug: tool.slug,
        tagline: tool.tagline,
        description: tool.description,
        logo: {
          type: "url",
          url: tool.logo,
        },
        banner: {
          type: "url",
          url: tool.banner,
        },
        pricing: tool.pricing as PricingModel,
        category: tool.category as Category[],
        platform: tool.platform as Platform[],
        tags: tool.tags,
        url: tool.url,
      }}
    />
  );
}
