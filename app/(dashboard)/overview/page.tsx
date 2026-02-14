"use client";

import {
  ArrowUpBigIcon,
  CrownIcon,
  EyeIcon,
  LinkSquare02Icon,
  Radar01Icon,
  TrendingUp,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { StatCard } from "@/components/dashboard/stat-card";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
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
import { cn } from "@/lib/utils";
import { trpc } from "@/trpc/provider";

export default function OverviewPage() {
  const [period, setPeriod] = useState<TimePeriod>("30d");

  const { data: overview, isLoading } = trpc.dashboard.getOverview.useQuery({
    period,
  });

  return (
    <div className="space-y-6">
      <PageHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <PageTitle>Overview</PageTitle>
          <PageDescription>
            Monitor your tools' performance and engagement.
          </PageDescription>
        </div>
        <div>
          <Select
            value={period}
            onValueChange={(value) => setPeriod(value as TimePeriod)}
          >
            <SelectTrigger className="w-[160px]">
              {timePeriodLabels[period]}
            </SelectTrigger>
            <SelectContent>
              {timePeriods.map((p) => (
                <SelectItem key={p} value={p}>
                  {timePeriodLabels[p]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </PageHeader>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="Impressions"
          value={overview?.impressions}
          icon={Radar01Icon}
        />
        <StatCard title="Views" value={overview?.views} icon={EyeIcon} />
        <StatCard
          title="Upvotes"
          value={overview?.upvotes}
          icon={ArrowUpBigIcon}
        />
        <StatCard
          title="Visits"
          value={overview?.visits}
          icon={LinkSquare02Icon}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Performance Over Time</CardTitle>
              <CardDescription>
                See metrics for the selected period.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ?
              <Skeleton className="h-[350px] w-full" />
            : <ChartContainer
                config={{
                  view: {
                    label: "Views",
                    color: "var(--info)",
                  },
                  impression: {
                    label: "Impressions",
                    color: "var(--gold)",
                  },
                  visit: {
                    label: "Visits",
                    color: "var(--accent)",
                  },
                }}
                className="h-[350px] w-full"
              >
                <AreaChart
                  data={overview?.chartData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="var(--border)"
                  />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={10}
                    tickFormatter={(value) => {
                      const date = new Date(value);
                      return date.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      });
                    }}
                    fontSize={12}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickMargin={10}
                    width={40}
                    fontSize={12}
                    allowDecimals={false}
                  />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        labelFormatter={(label) => {
                          return new Date(label).toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          });
                        }}
                      />
                    }
                  />
                  <Area
                    name="view"
                    type="linear"
                    dataKey="view"
                    stroke="var(--info)"
                    fill="transparent"
                    strokeWidth={2}
                  />
                  <Area
                    name="impression"
                    type="linear"
                    dataKey="impression"
                    stroke="var(--gold)"
                    fill="transparent"
                    strokeWidth={2}
                  />
                  <Area
                    name="visit"
                    type="linear"
                    dataKey="visit"
                    stroke="var(--accent)"
                    fill="transparent"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ChartContainer>
            }
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Trending Tools</CardTitle>
                <CardDescription>
                  Top performing tools by engagement score.
                </CardDescription>
              </div>
              <HugeiconsIcon
                icon={TrendingUp}
                className="size-6 text-muted-foreground"
              />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ?
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-4 p-2">
                    <Skeleton className="size-8 rounded-full" />
                    <Skeleton className="size-10 rounded-lg" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-2/3" />
                      <Skeleton className="h-3 w-1/3" />
                    </div>
                    <Skeleton className="h-8 w-16" />
                  </div>
                ))}
              </div>
            : overview?.trendingTools.length === 0 ?
              <div className="flex flex-col items-center justify-center h-[150px] text-muted-foreground space-y-3">
                <div className="p-3 bg-muted rounded-full">
                  <HugeiconsIcon icon={TrendingUp} className="size-6" />
                </div>
                <div className="text-center">
                  <p className="font-medium">No trending data yet</p>
                  <p className="text-sm mt-1">
                    Share your tools to start seeing engagement.
                  </p>
                </div>
              </div>
            : <div className="space-y-2">
                {overview?.trendingTools.map((tool, index) => (
                  <Link
                    key={tool.id}
                    href={`/tools/${tool.slug}`}
                    className="group relative flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-muted/50 transition-all duration-250 ease-in overflow-hidden"
                  >
                    <div
                      className="absolute top-0 right-0 h-full bg-linear-to-l from-accent/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-250 ease-in"
                      style={{
                        width: `${Math.max(10, Math.floor((tool.engagement / (overview?.trendingTools[0]?.engagement || 1)) * 35))}%`,
                      }}
                    />

                    <div
                      className={cn(
                        "flex items-center justify-center size-7 rounded-full text-xs font-bold shrink-0",
                        index === 0 && "bg-amber-500/10 text-amber-500",
                        index === 1 && "bg-slate-600/10 text-slate-600",
                        index === 2 && "bg-amber-700/10 text-amber-700",
                        index > 2 && "bg-muted/50 text-muted-foreground",
                      )}
                    >
                      {index + 1}
                    </div>

                    <div className="relative shrink-0">
                      <Image
                        src={tool.logo}
                        alt={`${tool.name} Logo`}
                        width={40}
                        height={40}
                        className="rounded-md"
                        unoptimized
                      />
                      {index === 0 && (
                        <div className="absolute -top-1 -right-1">
                          <HugeiconsIcon
                            icon={CrownIcon}
                            className="size-4 text-amber-500 fill-amber-500 drop-shadow-xs drop-shadow-black/50"
                          />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-sm truncate">
                          {tool.name}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                        <span className="flex items-center gap-1">
                          <HugeiconsIcon
                            icon={Radar01Icon}
                            className="size-3"
                          />
                          {tool.impressions.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <HugeiconsIcon icon={EyeIcon} className="size-3" />
                          {tool.views.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <HugeiconsIcon
                            icon={ArrowUpBigIcon}
                            className="size-3"
                          />
                          {tool.upvotes.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <HugeiconsIcon
                            icon={LinkSquare02Icon}
                            className="size-3"
                          />
                          {tool.visits.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="text-right relative">
                      <div className="text-base font-bold text-primary">
                        {Math.round(tool.engagement ?? 0).toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground">score</div>
                    </div>
                  </Link>
                ))}
              </div>
            }
          </CardContent>
        </Card>
      </div>

      <Card className="border-2 border-dashed border-amber-500/40 bg-linear-to-r from-amber-500/5 to-orange-500/5">
        <CardContent className="flex flex-col md:flex-row items-center justify-between gap-4 py-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-amber-500/10">
              <HugeiconsIcon
                icon={CrownIcon}
                className="size-6 text-amber-500"
              />
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold">
                Want more visibility for your tools?
              </h3>
              <p className="text-sm text-muted-foreground">
                Featured tools appear first in all listings and get up to 10x
                more views.
              </p>
            </div>
          </div>
          <Link
            href="/tools"
            className="shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 font-medium text-sm hover:bg-amber-500/20 transition-colors"
          >
            <HugeiconsIcon icon={CrownIcon} className="size-4" />
            Feature Your Tool
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
