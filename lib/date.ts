import { sql } from "drizzle-orm";
import { toolAnalyticsEventsTable } from "@/db/schema";

export function getDaysInMs(days: number) {
  return days * 24 * 60 * 60 * 1000;
}

export function getSinceISO(days: number) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString();
}

export function getToday() {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
}

export function getDaysAgo(number: number) {
  const date = new Date();
  return new Date(date.getTime() - getDaysInMs(number));
}

export const dateExpression = sql<string>`
  to_char(${toolAnalyticsEventsTable.createdAt}, 'YYYY-MM-DD')
`;
