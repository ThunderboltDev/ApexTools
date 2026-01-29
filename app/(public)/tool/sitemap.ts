import type { MetadataRoute } from "next";
import { url } from "@/config";
import { db } from "@/db/index";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const tools = await db.query.tool.findMany({
    columns: {
      slug: true,
      updatedAt: true,
    },
  });

  return tools.map((tool) => ({
    url: `${url}/tool/${tool.slug}`,
    lastModified: tool.updatedAt,
    changeFrequency: "monthly",
    priority: 0.8,
  }));
}
