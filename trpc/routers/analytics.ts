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
import {
  createRateLimit,
  createTRPCRouter,
  privateProcedure,
} from "@/trpc/init";

export const analyticsRouter = createTRPCRouter({
  getStats: privateProcedure.query(async ({ ctx }) => {
    const tools = await db.query.tool.findMany({
      where: eq(toolsTable.userId, ctx.user.id),
    });

    return {
      count: tools.length,
    };
  }),

  getAggregateStats: privateProcedure.query(async ({ ctx }) => {
    const tools = await db.query.tool.findMany({
      where: eq(toolsTable.userId, ctx.user.id),
    });

    const toolIds = tools.map((t) => t.id);

    if (toolIds.length === 0) {
      return {
        views: 0,
        upvotes: 0,
      };
    }

    const views = await db
      .select({ count: sql<number>`count(*)` })
      .from(toolAnalyticsEventsTable)
      .where(
        and(
          inArray(toolAnalyticsEventsTable.toolId, toolIds),
          eq(toolAnalyticsEventsTable.type, "view")
        )
      );

    const upvotes = await db
      .select({ count: sql<number>`count(*)` })
      .from(upvotesTable)
      .where(inArray(upvotesTable.toolId, toolIds));

    return {
      views: Number(views[0]?.count ?? 0),
      upvotes: Number(upvotes[0]?.count ?? 0),
    };
  }),

  getStatsOverTime: privateProcedure
    .use(createRateLimit(50, 60, "analytics.getStatsOverTime"))
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

  getAggregateStatsOverTime: privateProcedure
    .use(createRateLimit(50, 60, "analytics.getAggregateStatsOverTime"))
    .input(
      z.object({ type: z.enum(analyticsEvents), period: z.enum(timePeriods) })
    )
    .query(async ({ ctx, input }) => {
      const days = timePeriodToDays[input.period];

      const fromDate = new Date();
      fromDate.setDate(fromDate.getDate() - days);

      const rows = await db
        .select({
          date: dateExpression,
          count: sql<number>`count(*)`,
        })
        .from(toolAnalyticsEventsTable)
        .innerJoin(
          toolsTable,
          eq(toolAnalyticsEventsTable.toolId, toolsTable.id)
        )
        .where(
          and(
            eq(toolsTable.userId, ctx.user.id),
            eq(toolAnalyticsEventsTable.type, input.type),
            gte(toolAnalyticsEventsTable.createdAt, fromDate)
          )
        )
        .groupBy(dateExpression)
        .orderBy(dateExpression);

      return rows.map((r) => ({
        date: r.date,
        count: Number(r.count),
      }));
    }),
});
