import { sql } from "drizzle-orm";
import { db } from "@/db";

export async function GET() {
  await db.execute(sql`
  UPDATE tool
  SET score = 10 / (
    1 + EXP(
      -0.8 * (
        (
          (upvotes * 10) +
          (views_7d * 1) +
          (clicks_7d * 5)
        ) / POWER(
          EXTRACT(DAY FROM NOW() - created_at) + 2,
          1.5
        ) - 3
      )
    )
  )
`);

  return new Response("OK");
}
