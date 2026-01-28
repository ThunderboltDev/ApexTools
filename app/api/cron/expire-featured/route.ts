import { and, eq, lt } from "drizzle-orm";
import { db } from "@/db";
import { toolsTable } from "@/db/schema";

export async function GET(req: Request) {
  if (
    req.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return new Response("Unauthorized", { status: 401 });
  }

  const now = new Date();

  const expiredTools = await db.query.tool.findMany({
    where: and(
      eq(toolsTable.featured, true),
      lt(toolsTable.featuredUntil, now)
    ),
  });

  for (const tool of expiredTools) {
    await db
      .update(toolsTable)
      .set({ featured: false })
      .where(eq(toolsTable.id, tool.id));

    // await sendEmail({
    //   to: tool.user.email,
    //   subject: "Your featured listing has expired",
    //   template: "featured-expired",
    //   data: { toolName: tool.name, toolId: tool.id },
    // });
  }

  return new Response(`Expired ${expiredTools.length} featured listings`, {
    status: 200,
  });
}
