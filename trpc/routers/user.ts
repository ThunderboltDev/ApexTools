import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db/index";
import { usersTable } from "@/db/schema";
import type { User } from "@/lib/types";
import {
  createRateLimit,
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "@/trpc/init";

const updateProfileSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),
});

export const userRouter = createTRPCRouter({
  getById: publicProcedure
    .use(createRateLimit(50, 60, "user.getById"))
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ input }) => {
      const user = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.id, input.id))
        .limit(1);

      if (!user.length) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      return user[0] as User;
    }),

  getSession: publicProcedure
    .use(createRateLimit(100, 60, "user.getSession"))
    .query(async ({ ctx }) => {
      return {
        user: ctx.user,
        session: ctx.session,
      };
    }),

  updateProfile: privateProcedure
    .use(createRateLimit(20, 60, "user.updateProfile"))
    .input(updateProfileSchema)
    .mutation(async ({ ctx, input }) => {
      const [updatedUser] = await db
        .update(usersTable)
        .set({
          name: input.name,
          updatedAt: new Date(),
        })
        .where(eq(usersTable.id, ctx.user.id))
        .returning();

      if (!updatedUser) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update profile",
        });
      }

      return updatedUser as User;
    }),

  delete: privateProcedure
    .use(createRateLimit(5, 60, "user.deleteAccount"))
    .mutation(async ({ ctx }) => {
      try {
        await db.delete(usersTable).where(eq(usersTable.id, ctx.user.id));
        return { success: true };
      } catch {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong!",
        });
      }
    }),
});
