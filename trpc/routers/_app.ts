import { createTRPCRouter } from "@/trpc/init";
import { browseRouter } from "@/trpc/routers/browse";
import { dashboardRouter } from "@/trpc/routers/dashboard";
import { toolRouter } from "@/trpc/routers/tool";
import { userRouter } from "@/trpc/routers/user";

export const appRouter = createTRPCRouter({
  user: userRouter,
  tool: toolRouter,
  browse: browseRouter,
  dashboard: dashboardRouter,
});

export type AppRouter = typeof appRouter;
