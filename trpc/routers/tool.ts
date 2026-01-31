import { TRPCError } from "@trpc/server";
import { and, eq, sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db/index";
import { toolsTable, upvotesTable } from "@/db/schema";
import { getToolsSchema, slugSchema, toolSchema } from "@/lib/constants";
import { generateVerificationCode, getDomain } from "@/lib/domain-verification";
import {
  createRateLimit,
  createTRPCRouter,
  privateProcedure,
} from "@/trpc/init";
import { paginateTools } from "@/trpc/utils/paginate";

export const toolRouter = createTRPCRouter({
  claim: privateProcedure
    .use(createRateLimit(3, 60, "tool.claim"))
    .input(z.object({ toolId: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const tool = await db.query.tool.findFirst({
        where: eq(toolsTable.id, input.toolId),
        columns: {
          id: true,
          url: true,
          userId: true,
          verifiedAt: true,
          verificationCode: true,
        },
      });

      if (!tool) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Tool not found",
        });
      }

      if (tool.userId === ctx.user.id) {
        return { success: true, message: "You already own this tool" };
      }

      if (tool.verifiedAt) {
        const domainAge = Date.now() - tool.verifiedAt.getTime();
        const threeDays = 3 * 24 * 60 * 60 * 1000;

        if (domainAge < threeDays) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message:
              "Tool must be verified for at least 3 days before claiming",
          });
        }
      }

      const expectedCode = tool.verificationCode;
      const txtRecordHost = `_apex-verify.${getDomain(tool.url)}`;

      try {
        const { Resolver } = await import("node:dns").then((m) => m.promises);
        const resolver = new Resolver();

        resolver.setServers(["8.8.8.8", "1.1.1.1"]);

        const txtRecords = await resolver.resolveTxt(txtRecordHost);
        const flatRecords = txtRecords.flat();

        const found = flatRecords.some((txt) => txt === expectedCode);

        if (!found) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: `DNS TXT record not found. Add "${expectedCode}" to ${txtRecordHost}`,
          });
        }

        await db
          .update(toolsTable)
          .set({
            userId: ctx.user.id,
            verifiedAt: new Date(),
            verificationCode: generateVerificationCode(),
          })
          .where(eq(toolsTable.id, input.toolId))
          .returning();

        return { success: true, message: "Tool claimed successfully!" };
      } catch (error) {
        if (error instanceof TRPCError) throw error;

        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Could not find DNS TXT record. Please ensure the record is set correctly.`,
        });
      }
    }),
  upvote: privateProcedure
    .use(createRateLimit(30, 60, "tool.upvote"))
    .input(z.object({ toolId: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      return db.transaction(async (tx) => {
        const existing = await tx
          .select()
          .from(upvotesTable)
          .where(
            and(
              eq(upvotesTable.userId, ctx.user.id),
              eq(upvotesTable.toolId, input.toolId),
            ),
          )
          .limit(1);

        const isRemoving = existing.length > 0;

        if (isRemoving) {
          await tx
            .delete(upvotesTable)
            .where(
              and(
                eq(upvotesTable.userId, ctx.user.id),
                eq(upvotesTable.toolId, input.toolId),
              ),
            );

          await tx
            .update(toolsTable)
            .set({ upvotes: sql`GREATEST(${toolsTable.upvotes} - 1, 0)` })
            .where(eq(toolsTable.id, input.toolId));
        } else {
          await tx.insert(upvotesTable).values({
            userId: ctx.user.id,
            toolId: input.toolId,
          });

          await tx
            .update(toolsTable)
            .set({ upvotes: sql`${toolsTable.upvotes} + 1` })
            .where(eq(toolsTable.id, input.toolId));
        }

        return { upvoted: !isRemoving };
      });
    }),

  getUpvoteStatus: privateProcedure
    .use(createRateLimit(10, 60, "tool.getUpvoteStatus"))
    .input(z.object({ toolId: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      const existing = await db
        .select()
        .from(upvotesTable)
        .where(
          and(
            eq(upvotesTable.userId, ctx.user.id),
            eq(upvotesTable.toolId, input.toolId),
          ),
        )
        .limit(1);

      return existing.length > 0;
    }),

  getAll: privateProcedure
    .use(createRateLimit(50, 60, "tool.getAll"))
    .input(getToolsSchema)
    .query(async ({ ctx, input }) => {
      return paginateTools({
        ...input,
        ownerId: ctx.user.id,
        viewerId: ctx.user.id,
      });
    }),

  getBySlug: privateProcedure
    .use(createRateLimit(100, 60, "tool.getBySlug"))
    .input(z.object({ slug: slugSchema }))
    .query(async ({ ctx, input }) => {
      const tool = await db.query.tool.findFirst({
        where: and(
          eq(toolsTable.slug, input.slug),
          eq(toolsTable.userId, ctx.user.id),
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

  getById: privateProcedure
    .use(createRateLimit(100, 60, "tool.getById"))
    .input(z.object({ id: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      const tool = await db.query.tool.findFirst({
        where: and(
          eq(toolsTable.id, input.id),
          eq(toolsTable.userId, ctx.user.id),
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
      }),
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
          platform: input.platform,
          tags: input.tags,
          banner: input.banner ?? "",
          description: input.description,
          url: input.url,
          userId: ctx.user.id,
          verificationCode: `apex-verify=${crypto.randomUUID()}`,
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

      const isDomainChanged =
        getDomain(input.url) !== getDomain(existingTool.url);

      console.log({ isDomainChanged });

      const [updateTool] = await db
        .update(toolsTable)
        .set({
          name: input.name,
          category: input.category,
          platform: input.platform,
          tags: input.tags,
          banner: input.banner ?? existingTool.banner,
          tagline: input.tagline,
          pricing: input.pricing,
          logo: input.logo,
          description: input.description,
          url: input.url,
          updatedAt: new Date(),
          verifiedAt: isDomainChanged ? null : existingTool.verifiedAt,
          verificationCode: generateVerificationCode(),
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

  verify: privateProcedure
    .use(createRateLimit(3, 60, "tool.verify"))
    .input(z.object({ toolId: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const tool = await db.query.tool.findFirst({
        where: and(
          eq(toolsTable.id, input.toolId),
          eq(toolsTable.userId, ctx.user.id),
        ),
        columns: {
          id: true,
          url: true,
          verificationCode: true,
          verifiedAt: true,
        },
      });

      if (!tool) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Tool not found or you don't have access",
        });
      }

      if (tool.verifiedAt) {
        return { success: true, message: "Domain already verified" };
      }

      const expectedCode = tool.verificationCode;
      const txtRecordHost = `_apex-verify.${getDomain(tool.url)}`;

      try {
        const { Resolver } = await import("node:dns").then((m) => m.promises);
        const resolver = new Resolver();

        resolver.setServers(["8.8.8.8", "1.1.1.1"]);

        const txtRecords = await resolver.resolveTxt(txtRecordHost);
        const flatRecords = txtRecords.flat();

        const found = flatRecords.some((txt) => txt === expectedCode);

        if (!found) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: `DNS TXT record not found. Add "${expectedCode}" to ${txtRecordHost}`,
          });
        }

        await db
          .update(toolsTable)
          .set({
            verifiedAt: new Date(),
            verificationCode: generateVerificationCode(),
          })
          .where(eq(toolsTable.id, input.toolId));

        return { success: true, message: "Domain verified successfully!" };
      } catch (error) {
        if (error instanceof TRPCError) throw error;

        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Could not find DNS TXT record. Please ensure the record is set correctly.`,
        });
      }
    }),
});
