export const isDev = process.env.NODE_ENV === "development";
export const url = isDev ? "http:localhost:3000" : "https://solai.vercel.app";

export const config = {
  name: "SolAI",
  description: "SolAI",
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
  keywords: ["ai directory"],
} as const;
