"use client";

import { EyeIcon, ThumbsUpIcon, UserIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { PageDescription, PageHeader, PageTitle } from "@/components/ui/page";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { timePeriodLabels, timePeriods } from "@/lib/constants";
import type { TimePeriod } from "@/lib/types";
import { trpc } from "@/trpc/provider";

export default function OverviewPage() {
  const [period, setPeriod] = useState<TimePeriod>("7d");

  const { data: stats, isLoading: isLoadingStats } =
    trpc.analytics.getStats.useQuery();

  const { data: aggregateStats, isLoading: isLoadingAggregate } =
    trpc.analytics.getAggregateStats.useQuery();

  const { data: chartData, isLoading: isLoadingChart } =
    trpc.analytics.getAggregateStatsOverTime.useQuery({
      type: "view",
      period,
    });

  return (
    <>
      <PageHeader>
        <PageTitle>Overview</PageTitle>
        <PageDescription>Welcome to your ApexTools dashboard</PageDescription>
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

      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-7 mt-4">
        <Card className="col-span-4">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Overview</CardTitle>
              <CardDescription>
                View traffic across all your tools
              </CardDescription>
            </div>
            <Select
              value={period}
              onValueChange={(value) =>
                setPeriod(value as (typeof timePeriods)[number])
              }
            >
              <SelectTrigger className="w-[150px]">
                {timePeriodLabels[period]}
              </SelectTrigger>
              <SelectContent>
                {timePeriods.map((timePeriod) => (
                  <SelectItem key={timePeriod} value={timePeriod}>
                    {timePeriodLabels[timePeriod]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent className="mt-2">
            {isLoadingChart ? (
              <div className="flex h-[350px] items-center justify-center">
                <Skeleton className="h-[350px] w-full" />
              </div>
            ) : (
              <ChartContainer
                config={{
                  count: {
                    label: "Views",
                    color: "var(--accent)",
                  },
                }}
                className="h-[350px] w-full"
              >
                <AreaChart
                  data={chartData}
                  margin={{
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                  }}
                >
                  <defs>
                    <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="var(--accent)"
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="95%"
                        stopColor="var(--accent)"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="var(--border)"
                  />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => {
                      const date = new Date(value);
                      return date.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      });
                    }}
                    fontSize={12}
                    stroke="var(--muted-foreground)"
                  />
                  <YAxis
                    width={24}
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    fontSize={12}
                    stroke="var(--muted-foreground)"
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="rounded-lg border bg-background p-2 shadow-sm">
                            <div className="grid grid-cols-2 gap-2">
                              <div className="flex flex-col">
                                <span className="text-[0.70rem] uppercase text-muted-foreground">
                                  Views
                                </span>
                                <span className="font-bold text-muted-foreground">
                                  {payload[0].value}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="count"
                    stroke="var(--accent)"
                    fillOpacity={1}
                    fill="url(#colorViews)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
