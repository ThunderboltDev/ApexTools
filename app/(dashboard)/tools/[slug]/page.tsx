"use client";

import {
  Calendar04Icon,
  CalendarSetting01Icon,
  ChevronLeft,
  Delete02Icon,
  Edit02Icon,
  GridIcon,
  GridViewIcon,
  LinkSquare02Icon,
  Tag01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { ToolAnalytics } from "@/components/dashboard/analytics";
import { FeaturedToolCTA } from "@/components/featured/cta";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DetailGrid, DetailRow } from "@/components/ui/detail";
import { LinkButton } from "@/components/ui/link-button";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { PageContent, PageHeader, PageTitle } from "@/components/ui/page";
import { Spinner } from "@/components/ui/spinner";
import { categoryLabels, pricingLabels } from "@/lib/constants";
import { trpc } from "@/trpc/provider";

export default function ToolOverviewPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();

  const slug = params.slug;

  const { data: tool, isLoading: isLoadingTool } = trpc.tool.getBySlug.useQuery(
    { slug },
    { enabled: !!slug },
  );

  const { mutate: deleteTool, isPending: isDeleting } =
    trpc.tool.delete.useMutation({
      onSuccess: () => {
        toast.success("Tool deleted successfully");
        router.replace("/tools");
      },
      onError: (error) => {
        toast.error(
          error instanceof Error ? error.message : "Failed to delete tool",
        );
      },
    });

  if (isLoadingTool) {
    return <LoadingScreen />;
  }

  if (!tool) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vw-6rem)]">
        <h1>Tool Not Found</h1>
        <p className="text-center text-muted-foreground">
          The tool that you are looking for does not exist or has been deleted.
        </p>
        <Button className="mt-4" onClick={() => router.back()}>
          <HugeiconsIcon icon={ChevronLeft} />
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <>
      <PageHeader className="flex flex-wrap gap-3 items-center justify-between w-full">
        <div className="flex items-center gap-4">
          <Image
            src={tool.logo}
            alt={`${tool.name} logo`}
            width={48}
            height={48}
            className="size-12 rounded-sm object-cover"
          />
          <PageTitle>{tool.name}</PageTitle>
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <LinkButton
            href={`/tools/${slug}/edit`}
            variant="outline"
            className="gap-2"
          >
            <HugeiconsIcon icon={Edit02Icon} className="size-4" />
            Edit Tool
          </LinkButton>
          <LinkButton href={`/tool/${slug}`} theme="accent" className="gap-2">
            <HugeiconsIcon icon={LinkSquare02Icon} className="size-4" />
            View Public Page
          </LinkButton>
        </div>
      </PageHeader>

      <PageContent className="grid gap-4 grid-cols-1 lg:grid-cols-3">
        <FeaturedToolCTA className="lg:col-span-3" tool={tool} />
        <ToolAnalytics toolId={tool.id} className="lg:col-span-3" />

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Tool Details</CardTitle>
          </CardHeader>
          <CardContent>
            <DetailGrid className="md:grid-cols-3">
              <DetailRow icon={GridIcon} label="Slug" value={slug} />
              <DetailRow
                icon={Calendar04Icon}
                label="Created At"
                value={tool.createdAt}
              />
              <DetailRow
                icon={CalendarSetting01Icon}
                label="Updated At"
                value={tool.updatedAt}
              />
              <DetailRow
                icon={Tag01Icon}
                label="Pricing Model"
                value={pricingLabels[tool.pricing]}
              />
              <DetailRow
                icon={GridViewIcon}
                label="Category"
                value={tool.category
                  .map((category) => categoryLabels[category])
                  .join(", ")}
              />
            </DetailGrid>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Danger Zone</CardTitle>
            <CardDescription>
              This action is permanent and cannot be undone.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AlertDialog>
              <AlertDialogTrigger
                render={<Button variant="outline" theme="danger" />}
              >
                <HugeiconsIcon icon={Delete02Icon} />
                Delete Tool
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Tool?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete <strong>{tool.name}</strong>
                    ? This action cannot be undone. This will permanently delete
                    your tool.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={isDeleting} />
                  <AlertDialogAction
                    theme="danger"
                    onClick={() => deleteTool({ slug })}
                    disabled={isDeleting}
                    aria-busy={isDeleting}
                  >
                    {isDeleting ?
                      <>
                        <Spinner />
                        Deleting...
                      </>
                    : <>
                        <HugeiconsIcon icon={Delete02Icon} />
                        Confirm Delete
                      </>
                    }
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>
      </PageContent>
    </>
  );
}
