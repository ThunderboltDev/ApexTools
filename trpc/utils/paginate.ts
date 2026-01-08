import { and, desc, eq, ilike, or, type SQL, sql } from "drizzle-orm";
import { db } from "@/db/index";
import { toolsTable } from "@/db/schema";
import type { PaginationInput, PaginationOutput } from "@/lib/types";

export async function paginateTools(input: PaginationInput) {
  const page = input.page ?? 1;
  const limit = Math.min(input.limit ?? 10, 50);
  const offset = (page - 1) * limit;

  const conditions: SQL[] = [];

  if (input.userId) {
    conditions.push(eq(toolsTable.userId, input.userId));
  }

  if (input.category) {
    conditions.push(eq(toolsTable.category, input.category));
  }

  if (input.pricing) {
    conditions.push(eq(toolsTable.pricing, input.pricing));
  }

  if (input.status) {
    conditions.push(eq(toolsTable.status, input.status));
  }

  if (input.search) {
    const searchCondition = or(
      ilike(toolsTable.name, `%${input.search}%`),
      ilike(toolsTable.description, `%${input.search}%`),
      ilike(toolsTable.url, `%${input.search}%`)
    );

    if (searchCondition) {
      conditions.push(searchCondition);
    }
  }
  const where = conditions.length > 0 ? and(...conditions) : undefined;

  const tools = await db
    .select()
    .from(toolsTable)
    .where(where)
    .orderBy(desc(toolsTable.createdAt))
    .limit(limit)
    .offset(offset);

  const total = await db
    .select({ count: sql<number>`count(*)` })
    .from(toolsTable)
    .where(where)
    .then((r) => Number(r[0]?.count ?? 0));

  return {
    tools: tools,
    pagination: {
      total,
      page,
      limit,
      hasMore: offset + tools.length < total,
    } as PaginationOutput,
  };
}
