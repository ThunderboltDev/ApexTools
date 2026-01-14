import { initTRPC, TRPCError } from "@trpc/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { headers } from "next/headers";
import { cache } from "react";
import superjson from "superjson";
import { auth } from "@/lib/auth";
import type { Session, User } from "@/lib/types";

const redis = Redis.fromEnv();

interface Context {
  session: Session | null;
  user: User | null;
}

export const createTRPCContext = cache(async () => {
  const headersList = await headers();
  try {
    const res = await auth.api.getSession({
      headers: headersList,
    });

    if (res) {
      const { session, user } = res;
      return {
        session: {
          ...session,
          ipAddress: session?.ipAddress ?? null,
          userAgent: session?.userAgent ?? null,
        },
        user: {
          ...user,
          image: user?.image ?? null,
        },
      } satisfies Context;
    }
  } catch (error) {
    console.error("Error in createTRPCContext:", error);
  }

  return {
    session: null,
    user: null,
  };
});

export function createRateLimit(
  max: number,
  durationSeconds: number,
  routeName?: string,
  message?: string
) {
  const limiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(max, `${durationSeconds} s`),
  });

  return t.middleware(async ({ ctx, next, path }) => {
    const identifier = ctx.user?.id ?? "anon";

    const key = `${routeName ?? path}:${identifier}`;

    try {
      const { success } = await limiter.limit(key);

      if (!success) {
        console.warn(`Rate limit exceeded for key: ${key}`);
        throw new TRPCError({
          code: "TOO_MANY_REQUESTS",
          message: message ?? "Rate limit exceeded. Please try again later.",
        });
      }
    } catch (error) {
      if (error instanceof TRPCError) throw error;
      console.error("Rate limit error:", error);
    }

    return next();
  });
}

const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

const isAuthenticated = t.middleware(async ({ ctx, next }) => {
  if (!ctx?.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You must be logged in to access this resource",
    });
  }

  return next({
    ctx: {
      ...ctx,
      user: ctx.user,
    },
  });
});

export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;

export const publicProcedure = t.procedure;
export const privateProcedure = t.procedure.use(isAuthenticated);
