export const isDev = process.env.NODE_ENV === "development";
export const url = isDev
  ? "http://localhost:3000"
  : "https://www.apextools.site";

export const config = {
  name: "ApexTools",
  description:
    "Discover the best AI tools for productivity, coding, marketing, writing, and more. Curated directory with real-time updates, reviews, and comparisons.",
  url,
  creator: "Thunderbolt",
  themeColor: "#020202",
  socials: {
    github: "https://github.com/ThunderboltDev",
    discord: "https://discord.com/users/855342398115414037",
    twitter: "https://x.com/Thunderbolt3141",
    email: "support@thunderboltdev.site",
  },
  favicon: "/favicon.ico",
  logo: {
    url: "/logo.webp",
    size: 512,
  },
  preview: {
    url: "/preview.webp",
    width: 1200,
    height: 600,
  },
  keywords: [
    "ai tools",
    "ai directory",
    "best ai tools",
    "ai tools directory",
    "ai productivity tools",
    "ai coding assistants",
    "ai marketing tools",
    "ai writing tools",
    "ai image generators",
    "ai video generators",
    "chatgpt alternatives",
    "llm comparison",
  ],
} as const;
