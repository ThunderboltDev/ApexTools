import { sql } from "drizzle-orm";
import { toolAnalyticsEventsTable } from "@/db/schema";

export function getSinceISO(days: number) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString();
}

export function getToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export const dateExpression = sql<string>`
  to_char(${toolAnalyticsEventsTable.createdAt}, 'YYYY-MM-DD')
`;
