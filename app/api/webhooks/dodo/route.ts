import type { Payment } from "dodopayments/resources/payments";
import type { Refund } from "dodopayments/resources/refunds";
import { eq } from "drizzle-orm";
import { db } from "@/db/index";
import { featuredPurchasesTable, toolsTable, usersTable } from "@/db/schema";
import FeaturedActivatedEmail from "@/emails/featured/activated";
import { dodoPayments } from "@/lib/dodopayments";
import { sendEmail } from "@/lib/email";

interface PaymentMetadata {
  userId: string;
  toolSlug: string;
  duration: string;
}

interface PaymentSucceededEvent {
  type: "payment.succeeded";
  data: Payment & { metadata?: PaymentMetadata };
}

interface RefundSucceededEvent {
  type: "refund.succeeded";
  data: Refund;
}

type WebhookEvent = PaymentSucceededEvent | RefundSucceededEvent;

function validatePaymentMetadata(
  metadata: unknown
): metadata is PaymentMetadata {
  if (typeof metadata !== "object" || metadata === null) return false;

  const m = metadata as Record<string, unknown>;

  return (
    typeof m.toolSlug === "string" &&
    typeof m.userId === "string" &&
    typeof m.duration === "string" &&
    m.toolSlug.length > 0 &&
    m.userId.length > 0 &&
    !Number.isNaN(Number.parseInt(m.duration, 10))
  );
}

async function handlePaymentSucceeded(event: PaymentSucceededEvent) {
  const { data } = event;
  const metadata = data.metadata;

  if (!metadata || !validatePaymentMetadata(metadata)) {
    console.error("Invalid or missing metadata in payment webhook:", metadata);
    return;
  }

  const userId = metadata.userId;
  const toolSlug = metadata.toolSlug;
  const duration = Number.parseInt(metadata.duration, 10);
  const paymentId = data.payment_id;
  const amount = data.total_amount;
  const currency = data.currency;

  if (!paymentId) {
    console.error("Missing payment_id in payment webhook");
    return;
  }

  const tool = await db.query.tool.findFirst({
    where: eq(toolsTable.slug, toolSlug),
  });

  if (!tool) {
    console.error("Tool not found for featured purchase:", toolSlug);
    return;
  }

  const now = new Date();
  let startDate = now;
  let endDate: Date;

  if (tool.featuredUntil && tool.featuredUntil > now) {
    startDate = tool.featuredUntil;
  }

  endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + duration);

  const purchaseId = `fp_${crypto.randomUUID().replace(/-/g, "")}`;

  await db.insert(featuredPurchasesTable).values({
    id: purchaseId,
    toolId: tool.id,
    userId,
    dodoPurchaseId: paymentId,
    amount,
    currency: currency.toLowerCase(),
    status: "completed",
    duration,
    startDate,
    endDate,
  });

  await db
    .update(toolsTable)
    .set({ featuredUntil: endDate })
    .where(eq(toolsTable.slug, toolSlug));

  const user = await db.query.user.findFirst({
    where: eq(usersTable.id, userId),
  });

  if (user?.email) {
    try {
      await sendEmail({
        to: user.email,
        subject: "🎉 Your tool is now featured!",
        template: FeaturedActivatedEmail({
          toolName: tool.name,
          featuredUntil: endDate,
          duration,
        }),
      });
    } catch (error) {
      console.error("Failed to send featured activation email:", error);
    }
  }
}

async function handleRefundSucceeded(event: RefundSucceededEvent) {
  const { data } = event;
  const paymentId = data.payment_id;

  if (!paymentId) {
    console.error("Missing payment_id in refund webhook");
    return;
  }

  const purchase = await db.query.featuredPurchase?.findFirst({
    where: eq(featuredPurchasesTable.dodoPurchaseId, paymentId),
  });

  if (!purchase) {
    console.error("Featured purchase not found for refund:", paymentId);
    return;
  }

  await db
    .update(featuredPurchasesTable)
    .set({ status: "refunded" })
    .where(eq(featuredPurchasesTable.id, purchase.id));

  await db
    .update(toolsTable)
    .set({ featuredUntil: null })
    .where(eq(toolsTable.id, purchase.toolId));
}

export async function POST(req: Request) {
  const body = await req.text();

  const headers = {
    "webhook-id": req.headers.get("webhook-id") ?? "",
    "webhook-signature": req.headers.get("webhook-signature") ?? "",
    "webhook-timestamp": req.headers.get("webhook-timestamp") ?? "",
  };

  try {
    const event = dodoPayments.webhooks.unwrap(body, {
      headers,
    }) as WebhookEvent;

    if (event.type === "payment.succeeded") {
      await handlePaymentSucceeded(event);
    } else if (event.type === "refund.succeeded") {
      await handleRefundSucceeded(event);
    } else {
      console.log(
        `Unhandled webhook event type: ${(event as { type?: string }).type ?? "unknown"}`
      );
    }

    return Response.json({ received: true });
  } catch (error) {
    console.error("Webhook processing failed:", error);
    return Response.json({ error: "Invalid signature" }, { status: 401 });
  }
}
