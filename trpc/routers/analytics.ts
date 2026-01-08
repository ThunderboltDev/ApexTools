import { TRPCError } from "@trpc/server";
import { and, eq, sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db/index";
import {
  toolAnalyticsEventsTable,
  toolAnalyticsTable,
  toolsTable,
} from "@/db/schema";
import {
  createRateLimit,
  createTRPCRouter,
  privateProcedure,
} from "@/trpc/init";

export const analyticsRouter = createTRPCRouter({
  getStats: privateProcedure
    .use(createRateLimit(50, 60, "analytics.getStats"))
    .query(async ({ ctx }) => {
      const count = await db
        .select({ count: sql<number>`count(*)` })
        .from(toolsTable)
        .where(eq(toolsTable.userId, ctx.user.id));

      return {
        count: Number(count[0]?.count ?? 0),
      };
    }),

  getToolAnalytics: privateProcedure
    .use(createRateLimit(50, 60, "analytics.getToolAnalytics"))
    .input(z.object({ toolId: z.string().min(1) }))
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

      const analytics = await db.query.analytics.findFirst({
        where: eq(toolAnalyticsTable.toolId, input.toolId),
      });

      return {
        views: analytics?.views ?? 0,
        visits: analytics?.visits ?? 0,
        upvotes: analytics?.upvotes ?? 0,
        impressions: analytics?.impressions ?? 0,
      };
    }),

  getViewsOverTime: privateProcedure
    .use(createRateLimit(50, 60, "analytics.getViewsOverTime"))
    .input(z.object({ toolId: z.string().min(1) }))
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

      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      try {
        const since = thirtyDaysAgo.toISOString();

        const dateExpiration = sql<string>`to_char(${toolAnalyticsEventsTable.createdAt}, 'YYYY-MM-DD')`;

        const views = await db
          .select({
            date: dateExpiration,
            count: sql<number>`count(*)`,
          })
          .from(toolAnalyticsEventsTable)
          .where(
            and(
              eq(toolAnalyticsEventsTable.toolId, input.toolId),
              eq(toolAnalyticsEventsTable.type, "view"),
              sql`${toolAnalyticsEventsTable.createdAt} >= ${since}`
            )
          )
          .groupBy(dateExpiration)
          .orderBy(dateExpiration);

        return views.map((v) => ({
          date: v.date,
          count: Number(v.count),
        }));
      } catch (error) {
        console.error(error);
      }
    }),

  getAggregateStats: privateProcedure
    .use(createRateLimit(50, 60, "analytics.getAggregateStats"))
    .query(async ({ ctx }) => {
      const stats = await db
        .select({
          totalViews: sql<number>`sum(${toolAnalyticsTable.views})`,
          totalVisits: sql<number>`sum(${toolAnalyticsTable.visits})`,
          totalUpvotes: sql<number>`sum(${toolAnalyticsTable.upvotes})`,
          totalImpressions: sql<number>`sum(${toolAnalyticsTable.impressions})`,
        })
        .from(toolAnalyticsTable)
        .innerJoin(toolsTable, eq(toolAnalyticsTable.toolId, toolsTable.id))
        .where(eq(toolsTable.userId, ctx.user.id));

      return {
        views: Number(stats[0]?.totalViews ?? 0),
        visits: Number(stats[0]?.totalVisits ?? 0),
        upvotes: Number(stats[0]?.totalUpvotes ?? 0),
        impressions: Number(stats[0]?.totalImpressions ?? 0),
      };
    }),

  getAggregateViewsOverTime: privateProcedure
    .use(createRateLimit(50, 60, "analytics.getAggregateViewsOverTime"))
    .query(async ({ ctx }) => {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const since = thirtyDaysAgo.toISOString();

      const dateExpiration = sql<string>`to_char(${toolAnalyticsEventsTable.createdAt}, 'YYYY-MM-DD')`;

      const views = await db
        .select({
          date: dateExpiration,
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
            eq(toolAnalyticsEventsTable.type, "view"),
            sql`${toolAnalyticsEventsTable.createdAt} >= ${since}`
          )
        )
        .groupBy(dateExpiration)
        .orderBy(dateExpiration);

      return views.map((v) => ({
        date: v.date,
        count: Number(v.count),
      }));
    }),
});
