"use client";

import { useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  analyticsEventLabels,
  analyticsEvents,
  timePeriodLabels,
  timePeriods,
} from "@/lib/constants";
import type { AnalyticsEvent, TimePeriod } from "@/lib/types";
import { trpc } from "@/trpc/provider";

interface ToolAnalyticsProps {
  toolId: string;
  className?: string;
}

export function ToolAnalytics({ toolId, className }: ToolAnalyticsProps) {
  const [period, setPeriod] = useState<TimePeriod>("30d");
  const [eventType, setEventType] = useState<AnalyticsEvent>("view");

  const { data, isLoading } = trpc.analytics.getStatsOverTime.useQuery({
    toolId,
    period,
    eventType,
  });

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-4">
        <div>
          <CardTitle>{analyticsEventLabels[eventType]} Over Time</CardTitle>
          <CardDescription>{timePeriodLabels[period]}</CardDescription>
        </div>
        <div className="flex gap-2">
          <Select
            value={eventType}
            onValueChange={(value) => setEventType(value as AnalyticsEvent)}
          >
            <SelectTrigger className="w-[140px]">
              {analyticsEventLabels[eventType]}
            </SelectTrigger>
            <SelectContent>
              {analyticsEvents.map((event) => (
                <SelectItem key={event} value={event}>
                  {analyticsEventLabels[event]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={period}
            onValueChange={(value) => setPeriod(value as TimePeriod)}
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
        </div>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <Skeleton className="h-[350px] w-full" />
        ) : (
          <ChartContainer
            config={{
              count: {
                label: analyticsEventLabels[eventType],
                color: "hsl(var(--primary))",
              },
            }}
            className="h-[350px] w-full"
          >
            <BarChart data={data ?? []}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) =>
                  new Date(value).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })
                }
              />
              <YAxis tickLine={false} axisLine={false} tickMargin={10} />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar
                dataKey="count"
                fill="var(--color-count)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
