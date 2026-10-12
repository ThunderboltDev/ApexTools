import {
  and,
  arrayOverlaps,
  desc,
  eq,
  getTableColumns,
  ne,
  sql,
} from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db/index";
import { toolsTable, upvotesTable } from "@/db/schema";
import {
  categories,
  getToolsSchema,
  pricingModels,
  slugSchema,
} from "@/lib/constants";
import {
  createRateLimit,
  createTRPCRouter,
  publicProcedure,
} from "@/trpc/init";
import { rankAlternatives } from "@/lib/alternatives";
import { insertEvent } from "@/trpc/utils/analytics";
import { paginateTools } from "@/trpc/utils/paginate";

export const browseRouter = createTRPCRouter({
  getAll: publicProcedure
    .use(createRateLimit(60, 60, "browse.getAll"))
    .input(getToolsSchema)
    .query(async ({ input, ctx }) => {
      return paginateTools({
        ...input,
        viewerId: ctx.user?.id,
      });
    }),

  getBySlug: publicProcedure
    .use(createRateLimit(30, 60, "browse.getBySlug"))
    .input(z.object({ slug: slugSchema }))
    .query(async ({ input, ctx }) => {
      const isUpvotedSelect = ctx.user
        ? sql<boolean>`EXISTS (
          SELECT 1
          FROM ${upvotesTable}
          WHERE ${upvotesTable.toolId} = ${toolsTable.id}
            AND ${upvotesTable.userId} = ${ctx.user.id}
        )`
        : sql<boolean>`FALSE`;

      const [tool] = await db
        .select({
          ...getTableColumns(toolsTable),
          isUpvoted: isUpvotedSelect,
        })
        .from(toolsTable)
        .where(and(eq(toolsTable.slug, input.slug)))
        .limit(1);

      return tool;
    }),

  getBySlugs: publicProcedure
    .use(createRateLimit(30, 60, "browse.getBySlugs"))
    .input(
      getToolsSchema.extend({
        slugs: z.array(slugSchema),
      })
    )
    .query(async ({ input, ctx }) => {
      if (input.slugs.length === 0) {
        return {
          tools: [],
          pagination: {
            page: 1,
            limit: 24,
            total: 0,
            hasMore: false,
          },
        };
      }

      return paginateTools({
        ...input,
        viewerId: ctx.user?.id,
      });
    }),

  getSimilarTools: publicProcedure
    .use(createRateLimit(30, 60, "browse.getSimilarTools"))
    .input(
      z.object({
        categories: z.array(z.enum(categories)).min(1),
        tags: z.array(z.string()).optional(),
        pricing: z.enum(pricingModels).optional(),
        excludeSlug: slugSchema,
        limit: z.number().min(1).max(24).default(6),
      })
    )
    .query(async ({ input, ctx }) => {
      const isUpvotedSelect = ctx.user
        ? sql<boolean>`EXISTS (
          SELECT 1
          FROM ${upvotesTable}
          WHERE ${upvotesTable.toolId} = ${toolsTable.id}
            AND ${upvotesTable.userId} = ${ctx.user.id}
        )`
        : sql<boolean>`FALSE`;

      const categoryOverlap = sql`(
        SELECT COUNT(*)::int
        FROM UNNEST(${toolsTable.category}) AS c(cat)
        WHERE c.cat = ANY(${sql.param(input.categories)})
      )`;

      const tools = await db
        .select({
          ...getTableColumns(toolsTable),
          isUpvoted: isUpvotedSelect,
        })
        .from(toolsTable)
        .where(
          and(
            arrayOverlaps(toolsTable.category, input.categories),
            ne(toolsTable.slug, input.excludeSlug)
          )
        )
        .orderBy(desc(categoryOverlap), desc(toolsTable.upvotes))
        .limit(40);

      return rankAlternatives(
        {
          slug: input.excludeSlug,
          category: input.categories,
          tags: input.tags ?? [],
          pricing: input.pricing ?? "freemium",
          upvotes: 0,
        },
        tools,
        input.limit
      );
    }),

  search: publicProcedure
    .use(createRateLimit(30, 60, "browse.search"))
    .input(
      z.object({
        query: z.string().min(1),
        limit: z.number().min(1).max(20).default(10),
      })
    )
    .query(async ({ input, ctx }) => {
      const isUpvotedSelect = ctx.user
        ? sql<boolean>`EXISTS (
          SELECT 1
          FROM ${upvotesTable}
          WHERE ${upvotesTable.toolId} = ${toolsTable.id}
            AND ${upvotesTable.userId} = ${ctx.user.id}
        )`
        : sql<boolean>`FALSE`;

      return db
        .select({
          ...getTableColumns(toolsTable),
          isUpvoted: isUpvotedSelect,
        })
        .from(toolsTable)
        .where(
          and(
            sql`
            ${toolsTable.name} ILIKE ${`%${input.query}%`}
            OR ${toolsTable.tagline} ILIKE ${`%${input.query}%`}
          `
          )
        )
        .limit(input.limit);
    }),

  trackImpression: publicProcedure
    .use(createRateLimit(300, 60, "browse.trackImpression"))
    .input(
      z.object({
        toolId: z.string().min(1),
        visitorId: z.string().min(1),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return insertEvent({
        toolId: input.toolId,
        visitorId: ctx.user?.id ?? input.visitorId,
        type: "impression",
      });
    }),

  trackView: publicProcedure
    .use(createRateLimit(200, 60, "browse.trackView"))
    .input(
      z.object({
        toolId: z.string().min(1),
        visitorId: z.string().min(1),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return insertEvent({
        toolId: input.toolId,
        visitorId: ctx.user?.id ?? input.visitorId,
        type: "view",
      });
    }),

  incrementVisit: publicProcedure
    .use(createRateLimit(150, 60, "browse.incrementVisit"))
    .input(
      z.object({
        toolId: z.string().min(1),
        visitorId: z.string().min(1),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return insertEvent({
        toolId: input.toolId,
        visitorId: ctx.user?.id ?? input.visitorId,
        type: "visit",
      });
    }),
});
