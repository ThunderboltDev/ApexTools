import { eq } from "drizzle-orm";
import type { MetadataRoute } from "next";
import { url } from "@/config";
import { db } from "@/db/index";
import { toolsTable } from "@/db/schema";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const tools = await db.query.tool.findMany({
    where: eq(toolsTable.status, "approved"),
    columns: {
      slug: true,
      updatedAt: true,
    },
  });

  return tools.map((tool) => ({
    url: `${url}/tool/${tool.slug}`,
    lastModified: tool.updatedAt,
    changeFrequency: "weekly",
    priority: 0.8,
  }));
}
