import "server-only";

import { and, arrayOverlaps, desc, ne, sql } from "drizzle-orm";
import { db } from "@/db/index";
import { toolsTable } from "@/db/schema";
import {
  ALTERNATIVES_LIMIT,
  CANDIDATE_POOL,
  type RankableTool,
  rankAlternatives,
} from "@/lib/alternatives";
import type { Tool } from "@/lib/types";

export async function queryAlternativeTools(
  source: RankableTool,
  limit = ALTERNATIVES_LIMIT
): Promise<Tool[]> {
  if (source.category.length === 0) return [];

  const categoryOverlap = sql`(
    SELECT COUNT(*)::int
    FROM UNNEST(${toolsTable.category}) AS c(cat)
    WHERE c.cat = ANY(${sql.param(source.category)})
  )`;

  const candidates = await db
    .select()
    .from(toolsTable)
    .where(
      and(
        arrayOverlaps(toolsTable.category, source.category),
        ne(toolsTable.slug, source.slug)
      )
    )
    .orderBy(desc(categoryOverlap), desc(toolsTable.upvotes))
    .limit(CANDIDATE_POOL);

  return rankAlternatives(source, candidates, limit);
}
