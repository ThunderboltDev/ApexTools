"use client";

import {
  EyeIcon,
  MouseLeftClickIcon,
  SparklesIcon,
  ThumbsUpIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { PageContent, PageHeader, PageTitle } from "@/components/ui/page";
import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/trpc/provider";

const chartConfig = {
  views: {
    label: "Views",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

export default function AnalyticsPage() {
  const { data: stats, isLoading: isLoadingStats } =
    trpc.analytics.getAggregateStats.useQuery();
  const { data: viewsOverTime, isLoading: isLoadingViews } =
    trpc.analytics.getAggregateViewsOverTime.useQuery();

  return (
    <>
      <PageHeader>
        <PageTitle>Analytics</PageTitle>
        <p className="text-muted-foreground">
          Performance metrics across all your tools
        </p>
      </PageHeader>

      <PageContent className="space-y-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Views</CardTitle>
              <HugeiconsIcon
                icon={EyeIcon}
                className="size-4 text-muted-foreground"
              />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoadingStats ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  stats?.views.toLocaleString()
                )}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Visits
              </CardTitle>
              <HugeiconsIcon
                icon={MouseLeftClickIcon}
                className="size-4 text-muted-foreground"
              />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoadingStats ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  stats?.visits.toLocaleString()
                )}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Upvotes
              </CardTitle>
              <HugeiconsIcon
                icon={ThumbsUpIcon}
                className="size-4 text-muted-foreground"
              />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoadingStats ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  stats?.upvotes.toLocaleString()
                )}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Impressions
              </CardTitle>
              <HugeiconsIcon
                icon={SparklesIcon}
                className="size-4 text-muted-foreground"
              />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoadingStats ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  stats?.impressions.toLocaleString()
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Total Views Over Time</CardTitle>
            <CardDescription>
              Daily views across all your tools for the last 30 days
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            {isLoadingViews ? (
              <Skeleton className="h-[350px] w-full" />
            ) : (
              <ChartContainer config={chartConfig} className="h-[350px] w-full">
                <BarChart data={viewsOverTime}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) => {
                      const date = new Date(value);
                      return date.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      });
                    }}
                  />
                  <YAxis tickLine={false} axisLine={false} tickMargin={10} />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Bar
                    dataKey="count"
                    fill="var(--color-views)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>
      </PageContent>
    </>
  );
}
