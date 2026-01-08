import { TRPCError } from "@trpc/server";
import { and, eq, ne, sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db/index";
import {
  toolAnalyticsEventsTable,
  toolAnalyticsTable,
  toolsTable,
} from "@/db/schema";
import { getToolsSchema, slugSchema } from "@/lib/constants";
import {
  createRateLimit,
  createTRPCRouter,
  publicProcedure,
} from "@/trpc/init";
import { paginateTools } from "@/trpc/utils/paginate";

export const browseRouter = createTRPCRouter({
  getAll: publicProcedure
    .use(createRateLimit(80, 60, "browse.getAll"))
    .input(getToolsSchema)
    .query(async ({ input }) => {
      return paginateTools({
        ...input,
        status: "approved",
      });
    }),

  getBySlug: publicProcedure
    .use(createRateLimit(100, 60, "browse.getBySlug"))
    .input(z.object({ slug: slugSchema }))
    .query(async ({ input }) => {
      const tool = await db.query.tool.findFirst({
        where: and(
          eq(toolsTable.slug, input.slug),
          eq(toolsTable.status, "approved")
        ),
      });

      if (!tool) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Tool not found",
        });
      }

      return tool;
    }),

  getSimilarTools: publicProcedure
    .use(createRateLimit(100, 60, "browse.getSimilarTools"))
    .input(
      z.object({
        category: z.string(),
        excludeSlug: slugSchema,
        limit: z.number().min(1).max(10).default(4),
      })
    )
    .query(async ({ input }) => {
      const tools = await db
        .select()
        .from(toolsTable)
        .where(
          and(
            eq(
              toolsTable.category,
              input.category as (typeof toolsTable.category.enumValues)[number]
            ),
            eq(toolsTable.status, "approved"),
            ne(toolsTable.slug, input.excludeSlug)
          )
        )
        .limit(input.limit);

      return tools;
    }),

  trackView: publicProcedure
    .use(createRateLimit(200, 60, "browse.trackView"))
    .input(
      z.object({
        toolId: z.string().min(1),
        visitorId: z.string().min(1),
      })
    )
    .mutation(async ({ input }) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const existingViewToday = await db
        .select({ id: toolAnalyticsEventsTable.id })
        .from(toolAnalyticsEventsTable)
        .where(
          and(
            eq(toolAnalyticsEventsTable.toolId, input.toolId),
            eq(toolAnalyticsEventsTable.type, "view"),
            sql`${toolAnalyticsEventsTable.createdAt} >= ${today}`
          )
        )
        .limit(1);

      if (existingViewToday.length > 0) {
        return { tracked: false, reason: "already_viewed_today" };
      }

      await db.insert(toolAnalyticsEventsTable).values({
        toolId: input.toolId,
        type: "view",
      });

      await db
        .insert(toolAnalyticsTable)
        .values({
          toolId: input.toolId,
          views: 1,
        })
        .onConflictDoUpdate({
          target: toolAnalyticsTable.toolId,
          set: {
            views: sql`${toolAnalyticsTable.views} + 1`,
          },
        });

      return { tracked: true };
    }),
});
