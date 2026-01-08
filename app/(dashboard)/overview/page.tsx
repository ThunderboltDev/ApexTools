"use client";

import { EyeIcon, ThumbsUpIcon, UserIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageDescription, PageHeader, PageTitle } from "@/components/ui/page";
import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/trpc/provider";

export default function OverviewPage() {
  const { data: stats, isLoading: isLoadingStats } =
    trpc.analytics.getStats.useQuery();

  const { data: aggregateStats, isLoading: isLoadingAggregate } =
    trpc.analytics.getAggregateStats.useQuery();

  return (
    <>
      <PageHeader>
        <PageTitle>Overview</PageTitle>
        <PageDescription>Welcome to your ApexAura dashboard</PageDescription>
      </PageHeader>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Tools</CardTitle>
            <HugeiconsIcon
              icon={UserIcon}
              className="size-4 text-muted-foreground"
            />
          </CardHeader>
          <CardContent>
            {isLoadingStats ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">{stats?.count ?? 0}</div>
            )}
            <p className="text-xs text-muted-foreground mt-1">Tools you own</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <HugeiconsIcon
              icon={EyeIcon}
              className="size-4 text-muted-foreground"
            />
          </CardHeader>
          <CardContent>
            {isLoadingAggregate ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">
                {aggregateStats?.views.toLocaleString() ?? 0}
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              Across all your tools
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Upvotes</CardTitle>
            <HugeiconsIcon
              icon={ThumbsUpIcon}
              className="size-4 text-muted-foreground"
            />
          </CardHeader>
          <CardContent>
            {isLoadingAggregate ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">
                {aggregateStats?.upvotes.toLocaleString() ?? 0}
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              Community engagement
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
