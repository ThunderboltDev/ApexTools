"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { z } from "zod";
import { ToolForm } from "@/components/tool/tool-form";
import type { toolSchema } from "@/lib/constants";
import { trpc } from "@/trpc/provider";

export function SubmitForm() {
  const router = useRouter();
  const { mutateAsync: createTool } = trpc.tool.create.useMutation();

  const handleSubmit = async (values: z.infer<typeof toolSchema>) => {
    try {
      await createTool(values);
      toast.success("Tool created successfully.");
      router.push("/tools");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Something went wrong!";
      toast.error(message);
    }
  };

  return <ToolForm mode="create" onSubmit={handleSubmit} />;
}
