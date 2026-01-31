import type { MetadataRoute } from "next";
import { url } from "@/config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/auth/",
          "/logout/",
          "/verify-email/",
          "/overview/",
          "/profile/",
          "/submit/",
          "/tools/",
          "/featured/",
        ],
      },
    ],
    sitemap: [`${url}/sitemap.xml`, `${url}/tool/sitemap.xml`],
  };
}
