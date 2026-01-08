"use client";

import { useParams } from "next/navigation";
import { EditForm } from "@/app/(dashboard)/tools/[slug]/edit/form";
import { LinkButton } from "@/components/ui/link-button";
import {
  PageContent,
  PageDescription,
  PageHeader,
  PageTitle,
} from "@/components/ui/page";
import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/trpc/provider";

export default function EditToolPage() {
  const params = useParams<{ slug: string }>();

  const slug = params.slug;

  const { data: tool, isLoading } = trpc.tool.getBySlug.useQuery(
    { slug },
    { enabled: !!slug }
  );

  if (isLoading) {
    return (
      <PageContent>
        <Skeleton className="h-10 w-1/3 mb-2" />
        <Skeleton className="h-4 w-1/4 mb-8" />
        <Skeleton className="h-[500px] w-full" />
      </PageContent>
    );
  }

  if (!tool) {
    return (
      <PageContent>
        <div className="flex flex-col items-center justify-center py-20">
          <h2 className="text-xl font-semibold">Tool not found</h2>
          <LinkButton href="/tools">Back to tools</LinkButton>
        </div>
      </PageContent>
    );
  }

  return (
    <>
      <PageHeader>
        <PageTitle>Edit {tool.name}</PageTitle>
        <PageDescription>Update your tool details.</PageDescription>
      </PageHeader>
      <PageContent>
        <EditForm tool={tool} />
      </PageContent>
    </>
  );
}
