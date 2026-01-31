import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db/index";
import { toolsTable } from "@/db/schema";
import {
  createRateLimit,
  createTRPCRouter,
  publicProcedure,
} from "@/trpc/init";

export const featuredRouter = createTRPCRouter({
  getStatus: publicProcedure
    .use(createRateLimit(60, 60, "featured.getStatus"))
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const tool = await db.query.tool.findFirst({
        where: eq(toolsTable.slug, input.slug),
        columns: {
          id: true,
          featuredUntil: true,
          verifiedAt: true,
          userId: true,
        },
      });

      if (!tool) {
        return { isFeatured: false, featuredUntil: null, isVerified: false };
      }

      const now = new Date();
      const isFeatured = tool.featuredUntil ? tool.featuredUntil > now : false;

      return {
        isFeatured,
        featuredUntil: tool.featuredUntil,
        isVerified: !!tool.verifiedAt,
        ownerId: tool.userId,
      };
    }),
});
