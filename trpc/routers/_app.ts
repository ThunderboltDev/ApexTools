import { createTRPCRouter } from "@/trpc/init";
import { analyticsRouter } from "@/trpc/routers/analytics";
import { browseRouter } from "@/trpc/routers/browse";
import { toolRouter } from "@/trpc/routers/tool";
import { userRouter } from "@/trpc/routers/user";

export const appRouter = createTRPCRouter({
  user: userRouter,
  tool: toolRouter,
  browse: browseRouter,
  analytics: analyticsRouter,
});

export type AppRouter = typeof appRouter;
