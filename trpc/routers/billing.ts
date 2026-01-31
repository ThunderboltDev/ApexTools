import { and, eq } from "drizzle-orm";
import z from "zod";
import { products, url } from "@/config";
import { db } from "@/db";
import { featuredPurchasesTable } from "@/db/schema";
import { dodoPayments } from "@/lib/dodopayments";
import {
  createRateLimit,
  createTRPCRouter,
  privateProcedure,
} from "@/trpc/init";

export const billingRouter = createTRPCRouter({
  getPurchaseHistory: privateProcedure
    .use(createRateLimit(30, 60, "billing.getPurchaseHistory"))
    .input(
      z.object({
        toolId: z.string().optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      const conditions = [eq(featuredPurchasesTable.userId, ctx.user.id)];

      if (input.toolId) {
        conditions.push(eq(featuredPurchasesTable.toolId, input.toolId));
      }

      const purchases = await db
        .select()
        .from(featuredPurchasesTable)
        .where(and(...conditions))
        .orderBy(featuredPurchasesTable.createdAt);

      return purchases;
    }),

  createCheckoutSession: privateProcedure
    .use(createRateLimit(10, 60, "billing.createCheckoutSession"))
    .input(
      z.object({
        toolSlug: z.string(),
        duration: z.enum(["7", "28"]),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const response = await dodoPayments.checkoutSessions.create({
        ...(ctx.user.customerId && {
          customer: {
            customer_id: ctx.user.customerId,
          },
        }),
        product_cart: [
          {
            product_id: products[input.duration].productId,
            quantity: 1,
          },
        ],
        metadata: {
          userId: ctx.user.id,
          toolSlug: input.toolSlug,
          duration: input.duration,
        },
        return_url: `${url}/featured/success?toolSlug=${input.toolSlug}&duration=${input.duration}`,
      });

      return { checkoutUrl: response.checkout_url };
    }),

  getBillingPortalUrl: privateProcedure
    .use(createRateLimit(30, 60, "billing.getBillingPortalUrl"))
    .query(async ({ ctx }) => {
      if (!ctx.user.customerId) {
        throw new Error("No customer record found");
      }

      const response = await dodoPayments.customers.customerPortal.create(
        ctx.user.customerId
      );

      return { url: response.link };
    }),
});
