import {
  and,
  desc,
  eq,
  getTableColumns,
  ilike,
  inArray,
  or,
  type SQL,
  sql,
} from "drizzle-orm";
import { db } from "@/db/index";
import {
  toolAnalyticsEventsTable,
  toolsTable,
  upvotesTable,
} from "@/db/schema";
import type {
  PaginationInput,
  PaginationOutput,
  ToolWithUpvoteStatus,
} from "@/lib/types";

export async function paginateTools(input: PaginationInput): Promise<{
  tools: ToolWithUpvoteStatus[];
  pagination: PaginationOutput;
}> {
  const page = input.page ?? 1;
  const limit = Math.min(input.limit ?? 10, 50);
  const offset = (page - 1) * limit;

  const conditions: SQL[] = [];

  if (input.ownerId) {
    conditions.push(eq(toolsTable.userId, input.ownerId));
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

  if (input.slugs?.length) {
    conditions.push(inArray(toolsTable.slug, input.slugs));
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

  let orderBy: SQL | SQL[];

  switch (input.sort) {
    case "hot": {
      orderBy = desc(toolsTable.score);
      break;
    }
    case "trending": {
      const sevenDaysAgo = sql`NOW() - INTERVAL '7 days'`;

      const recentViews = sql<number>`(
        SELECT COUNT(*)
        FROM ${toolAnalyticsEventsTable}
        WHERE ${toolAnalyticsEventsTable.toolId} = ${toolsTable.id}
        AND ${toolAnalyticsEventsTable.type} = 'view'
        AND ${toolAnalyticsEventsTable.createdAt} >= ${sevenDaysAgo}
      )`;

      orderBy = desc(recentViews);
      break;
    }
    case "latest": {
      orderBy = desc(toolsTable.createdAt);
      break;
    }
    case "upvotes": {
      orderBy = desc(toolsTable.upvotes);
      break;
    }
    case "views": {
      const views = sql<number>`(
        SELECT COUNT(*)
        FROM ${toolAnalyticsEventsTable}
        WHERE ${toolAnalyticsEventsTable.toolId} = ${toolsTable.id}
        AND ${toolAnalyticsEventsTable.type} = 'view'
      )`;

      orderBy = desc(views);
      break;
    }
    default: {
      orderBy = desc(toolsTable.createdAt);
    }
  }

  const isUpvotedSelect = input.viewerId
    ? sql<boolean>`(
      SELECT EXISTS (
        SELECT 1
        FROM ${upvotesTable}
        WHERE ${upvotesTable.toolId} = ${toolsTable.id}
          AND ${upvotesTable.userId} = ${input.viewerId}
      )
    )`
    : sql<boolean>`FALSE`;

  const tools = await db
    .select({
      ...getTableColumns(toolsTable),
      isUpvoted: isUpvotedSelect,
    })
    .from(toolsTable)
    .where(where)
    .orderBy(orderBy)
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
    },
  };
}
