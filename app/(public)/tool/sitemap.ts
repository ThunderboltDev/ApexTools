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

  const toolEntries: MetadataRoute.Sitemap = tools.map((tool) => ({
    url: `${url}/tool/${tool.slug}`,
    lastModified: tool.updatedAt,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const alternativeEntries: MetadataRoute.Sitemap = tools.map((tool) => ({
    url: `${url}/tool/${tool.slug}/alternatives`,
    lastModified: tool.updatedAt,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...toolEntries, ...alternativeEntries];
}
