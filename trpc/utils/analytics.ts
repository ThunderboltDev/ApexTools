import { and, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { toolAnalyticsEventsTable } from "@/db/schema";
import { getToday } from "@/lib/date";
import type { AnalyticsEvent } from "@/lib/types";

export async function insertEvent({
  toolId,
  visitorId,
  type,
  dedupePerDay,
}: {
  toolId: string;
  visitorId: string;
  type: AnalyticsEvent;
  dedupePerDay?: boolean;
}) {
  if (!dedupePerDay) {
    await db.insert(toolAnalyticsEventsTable).values({
      toolId,
      visitorId,
      type,
    });

    return { tracked: true };
  }

  const today = getToday();

  const existing = await db
    .select({ id: toolAnalyticsEventsTable.id })
    .from(toolAnalyticsEventsTable)
    .where(
      and(
        eq(toolAnalyticsEventsTable.toolId, toolId),
        eq(toolAnalyticsEventsTable.visitorId, visitorId),
        eq(toolAnalyticsEventsTable.type, type),
        sql`${toolAnalyticsEventsTable.createdAt} >= ${today}`
      )
    )
    .limit(1);

  if (existing.length > 0) {
    return { tracked: false };
  }

  await db.insert(toolAnalyticsEventsTable).values({
    toolId,
    visitorId,
    type,
  });

  return { tracked: true };
}
