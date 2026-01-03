import { createTRPCClient, httpLink } from "@trpc/client";
import superjson from "superjson";
import { url } from "@/config";
import type { AppRouter } from "@/trpc/app";

export const client = createTRPCClient<AppRouter>({
  links: [
    httpLink({
      url: url,
      transformer: superjson,
    }),
  ],
});
