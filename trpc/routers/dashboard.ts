import { TRPCError } from "@trpc/server";
import { and, eq, gte, inArray, sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db/index";
import {
  toolAnalyticsEventsTable,
  toolsTable,
  upvotesTable,
} from "@/db/schema";
import {
  analyticsEvents,
  timePeriods,
  timePeriodToDays,
} from "@/lib/constants";
import { dateExpression } from "@/lib/date";
import type { AnalyticsEvent } from "@/lib/types";
import {
  createRateLimit,
  createTRPCRouter,
  privateProcedure,
} from "@/trpc/init";

export const dashboardRouter = createTRPCRouter({
  getOverview: privateProcedure
    .use(createRateLimit(50, 60, "dashboard.getOverview"))
    .input(
      z.object({
        period: z.enum(timePeriods).default("7d"),
      })
    )
    .query(async ({ ctx, input }) => {
      const tools = await db.query.tool.findMany({
        where: eq(toolsTable.userId, ctx.user.id),
        columns: { id: true, name: true, slug: true, logo: true },
      });

      const toolIds = tools.map((t) => t.id);

      if (toolIds.length === 0) {
        return {
          views: 0,
          visits: 0,
          upvotes: 0,
          impressions: 0,
          trendingTools: [],
          chartData: [],
        };
      }

      const days = timePeriodToDays[input.period];
      const fromDate = new Date();
      fromDate.setDate(fromDate.getDate() - days);

      const [analyticsTotals, upvotesTotal, trendingDataRaw, chartRows] =
        await Promise.all([
          db
            .select({
              views: sql<number>`sum(case when ${toolAnalyticsEventsTable.type} = 'view' then 1 else 0 end)`,
              visits: sql<number>`sum(case when ${toolAnalyticsEventsTable.type} = 'visit' then 1 else 0 end)`,
              impressions: sql<number>`sum(case when ${toolAnalyticsEventsTable.type} = 'impression' then 1 else 0 end)`,
            })
            .from(toolAnalyticsEventsTable)
            .where(
              and(
                inArray(toolAnalyticsEventsTable.toolId, toolIds),
                gte(toolAnalyticsEventsTable.createdAt, fromDate)
              )
            ),

          db
            .select({ count: sql<number>`count(*)` })
            .from(upvotesTable)
            .where(
              and(
                inArray(upvotesTable.toolId, toolIds),
                gte(upvotesTable.createdAt, fromDate)
              )
            ),
          db
            .select({
              id: toolsTable.id,
              name: toolsTable.name,
              slug: toolsTable.slug,
              logo: toolsTable.logo,
              views: sql<number>`coalesce(analytics.views, 0)`,
              visits: sql<number>`coalesce(analytics.visits, 0)`,
              impressions: sql<number>`coalesce(analytics.impressions, 0)`,
              upvotes: sql<number>`coalesce(upvotes.count, 0)`,
            })
            .from(toolsTable)
            .leftJoin(
              sql`(select ${toolAnalyticsEventsTable.toolId} as tool_id, sum(case when type = 'view' then 1 else 0 end) as views, sum(case when type = 'visit' then 1 else 0 end) as visits, sum(case when type = 'impression' then 1 else 0 end) as impressions from ${toolAnalyticsEventsTable} where ${inArray(toolAnalyticsEventsTable.toolId, toolIds)} and ${gte(toolAnalyticsEventsTable.createdAt, fromDate)} group by ${toolAnalyticsEventsTable.toolId}) as analytics`,
              eq(toolsTable.id, sql`analytics.tool_id`)
            )
            .leftJoin(
              sql`(select ${upvotesTable.toolId} as tool_id, count(*) as count from ${upvotesTable} where ${inArray(upvotesTable.toolId, toolIds)} and ${gte(upvotesTable.createdAt, fromDate)} group by ${upvotesTable.toolId}) as upvotes`,
              eq(toolsTable.id, sql`upvotes.tool_id`)
            )
            .where(eq(toolsTable.userId, ctx.user.id))
            .orderBy(
              sql`coalesce(analytics.views, 0) * 1 + coalesce(analytics.visits, 0) * 5 + coalesce(analytics.impressions, 0) * 0.1 + coalesce(upvotes.count, 0) * 10 desc`
            )
            .limit(5),

          db
            .select({
              date: dateExpression,
              type: toolAnalyticsEventsTable.type,
              count: sql<number>`count(*)`,
            })
            .from(toolAnalyticsEventsTable)
            .where(
              and(
                inArray(toolAnalyticsEventsTable.toolId, toolIds),
                gte(toolAnalyticsEventsTable.createdAt, fromDate)
              )
            )
            .groupBy(dateExpression, toolAnalyticsEventsTable.type)
            .orderBy(dateExpression),
        ]);

      const trendingData = trendingDataRaw.map((tool) => ({
        ...tool,
        engagement:
          Number(tool.views) * 1 +
          Number(tool.visits) * 5 +
          Number(tool.impressions) * 0.1 +
          Number(tool.upvotes) * 10,
      }));

      type ChartDataPoint = { date: string } & Record<AnalyticsEvent, number>;

      const chartDataMap = new Map<string, ChartDataPoint>();

      chartRows.forEach((row) => {
        const date = row.date;

        if (!chartDataMap.has(date)) {
          const zeros = Object.fromEntries(
            analyticsEvents.map((event) => [event, 0])
          ) as Record<AnalyticsEvent, number>;
          chartDataMap.set(date, { date, ...zeros });
        }

        const data = chartDataMap.get(date);

        if (!data) return;

        data[row.type] = Number(row.count);
      });

      return {
        views: Number(analyticsTotals[0]?.views ?? 0),
        visits: Number(analyticsTotals[0]?.visits ?? 0),
        impressions: Number(analyticsTotals[0]?.impressions ?? 0),
        upvotes: Number(upvotesTotal[0]?.count ?? 0),
        chartData: Array.from(chartDataMap.values()),
        trendingTools: trendingData.map((tool) => ({
          id: tool.id,
          name: tool.name,
          slug: tool.slug,
          logo: tool.logo,
          views: Number(tool.views),
          visits: Number(tool.visits),
          upvotes: Number(tool.upvotes),
          engagement: Number(tool.engagement),
          impressions: Number(tool.impressions),
        })),
      };
    }),

  getToolAnalytics: privateProcedure
    .use(createRateLimit(50, 60, "dashboard.getToolAnalytics"))
    .input(
      z.object({
        toolId: z.string(),
        period: z.enum(timePeriods),
        eventType: z.enum(analyticsEvents),
      })
    )
    .query(async ({ ctx, input }) => {
      const tool = await db.query.tool.findFirst({
        where: and(
          eq(toolsTable.id, input.toolId),
          eq(toolsTable.userId, ctx.user.id)
        ),
      });

      if (!tool) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Tool not found or unauthorized",
        });
      }

      const days = timePeriodToDays[input.period];

      const fromDate = new Date();
      fromDate.setDate(fromDate.getDate() - days);

      const rows = await db
        .select({
          date: dateExpression,
          count: sql<number>`count(*)`,
        })
        .from(toolAnalyticsEventsTable)
        .where(
          and(
            eq(toolAnalyticsEventsTable.toolId, input.toolId),
            eq(toolAnalyticsEventsTable.type, input.eventType),
            gte(toolAnalyticsEventsTable.createdAt, fromDate)
          )
        )
        .groupBy(dateExpression)
        .orderBy(dateExpression);

      return rows.map((row) => ({
        date: row.date,
        count: Number(row.count),
      }));
    }),
});
