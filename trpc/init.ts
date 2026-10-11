import { initTRPC, TRPCError } from "@trpc/server";
import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { headers } from "next/headers";
import superjson from "superjson";
import { auth, type Session, type User } from "@/lib/auth";

const redis = Redis.fromEnv();

export interface Context {
  session: Session | null;
  user: User | null;
  isServerCaller?: boolean;
}

export async function createTRPCContext(
  opts?: FetchCreateContextFnOptions
): Promise<Context> {
  try {
    const headersList = opts?.req.headers ?? (await headers());
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
        isServerCaller: false,
      } satisfies Context;
    }
  } catch (error) {
    console.error("Error in createTRPCContext:", error);
  }

  return {
    session: null,
    user: null,
    isServerCaller: false,
  };
}

export async function createRSCContext(): Promise<Context> {
  return {
    session: null,
    user: null,
    isServerCaller: true,
  };
}

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
    if (ctx.isServerCaller) {
      return next();
    }

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
