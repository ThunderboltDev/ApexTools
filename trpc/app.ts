// import { chatRouter } from "@/trpc/routers/chat";
import { createTRPCRouter } from "@/trpc/init";

export const appRouter = createTRPCRouter({
  // user: userRouter,
});

export type AppRouter = typeof appRouter;
