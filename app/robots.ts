import type { MetadataRoute } from "next";
import { url } from "@/config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/overview/", "/profile/", "/submit/", "/tools/"],
      },
    ],
    sitemap: `${url}/sitemap.xml`,
  };
}
