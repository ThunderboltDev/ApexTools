import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db/index";
import { toolsTable, upvotesTable } from "@/db/schema";
import { getToolsSchema, slugSchema, toolSchema } from "@/lib/constants";
import {
  createRateLimit,
  createTRPCRouter,
  privateProcedure,
} from "@/trpc/init";
import { paginateTools } from "@/trpc/utils/paginate";

export const toolRouter = createTRPCRouter({
  upvote: privateProcedure
    .use(createRateLimit(30, 60, "tool.upvote"))
    .input(z.object({ toolId: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const existing = await db
        .select()
        .from(upvotesTable)
        .where(
          and(
            eq(upvotesTable.userId, ctx.user.id),
            eq(upvotesTable.toolId, input.toolId)
          )
        )
        .limit(1);

      if (existing.length > 0) {
        await db
          .delete(upvotesTable)
          .where(
            and(
              eq(upvotesTable.userId, ctx.user.id),
              eq(upvotesTable.toolId, input.toolId)
            )
          );

        return { upvoted: false };
      }

      await db.insert(upvotesTable).values({
        userId: ctx.user.id,
        toolId: input.toolId,
      });

      return { upvoted: true };
    }),

  getAll: privateProcedure
    .use(createRateLimit(50, 60, "tool.getMine"))
    .input(getToolsSchema)
    .query(async ({ ctx, input }) => {
      return paginateTools({ ...input, userId: ctx.user.id });
    }),

  getBySlug: privateProcedure
    .use(createRateLimit(100, 60, "tool.getBySlug"))
    .input(z.object({ slug: slugSchema }))
    .query(async ({ ctx, input }) => {
      const tool = await db.query.tool.findFirst({
        where: and(
          eq(toolsTable.slug, input.slug),
          eq(toolsTable.userId, ctx.user.id)
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

  validateSlug: privateProcedure
    .use(createRateLimit(30, 60, "tool.validateSlug"))
    .input(
      z.object({
        slug: z.string().min(1),
      })
    )
    .query(async ({ input }) => {
      const slug = input.slug.toLowerCase().trim().replace(/\s+/g, "-");

      const existing = await db.query.tool.findFirst({
        where: eq(toolsTable.slug, slug),
        columns: { id: true },
      });

      return {
        available: !existing,
        slug,
      };
    }),

  create: privateProcedure
    .use(createRateLimit(20, 60, "tool.create"))
    .input(toolSchema)
    .mutation(async ({ ctx, input }) => {
      const [newTool] = await db
        .insert(toolsTable)
        .values({
          id: crypto.randomUUID(),
          name: input.name,
          slug: input.slug,
          logo: input.logo,
          tagline: input.tagline,
          pricing: input.pricing,
          category: input.category,
          description: input.description,
          url: input.url,
          userId: ctx.user.id,
        })
        .returning();

      if (!newTool) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create tool",
        });
      }

      return newTool;
    }),

  update: privateProcedure
    .use(createRateLimit(20, 60, "tool.update"))
    .input(toolSchema)
    .mutation(async ({ ctx, input }) => {
      const existingTool = await db.query.tool.findFirst({
        where: eq(toolsTable.slug, input.slug),
      });

      if (!existingTool) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Tool not found",
        });
      }

      if (existingTool.userId !== ctx.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You don't have permission to update this tool",
        });
      }

      const [updateTool] = await db
        .update(toolsTable)
        .set({
          name: input.name,
          category: input.category,
          tagline: input.tagline,
          pricing: input.pricing,
          logo: input.logo,
          description: input.description,
          url: input.url,
          updatedAt: new Date(),
        })
        .where(eq(toolsTable.slug, input.slug))
        .returning();

      if (!updateTool) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update tool",
        });
      }

      return updateTool;
    }),

  delete: privateProcedure
    .use(createRateLimit(20, 60, "tool.delete"))
    .input(z.object({ slug: slugSchema }))
    .mutation(async ({ ctx, input }) => {
      const existingTool = await db.query.tool.findFirst({
        where: eq(toolsTable.slug, input.slug),
      });

      if (!existingTool) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Tool not found",
        });
      }

      if (existingTool.userId !== ctx.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You don't have permission to delete this tool",
        });
      }

      await db.delete(toolsTable).where(eq(toolsTable.slug, input.slug));

      return { success: true };
    }),
});
