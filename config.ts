export const isDev = process.env.NODE_ENV === "development";

export const url = isDev
  ? "http://localhost:3000"
  : "https://www.apextools.site";

export const config = {
  name: "ApexTools",
  description:
    "Find the best AI tools for any task: productivity, coding, marketing, writing & more. Explore our curated directory with daily fresh additions.",
  url,
  creator: "Thunderbolt",
  themeColor: "#63a402",
} as const;

export const products = {
  "7": {
    productId: isDev
      ? "pdt_0NXOm96nQQIzkSQGqkAjN"
      : "pdt_0NXOn5POXSbEY6Ttjiz9L",
    duration: 7,
    price: 79,
  },
  "28": {
    productId: isDev
      ? "pdt_0NXOmHhFE6VwOtn3LhDw4"
      : "pdt_0NXOnFEuk7JAYcvygczLb",
    duration: 28,
    price: 249,
  },
} as const;

export const socials = {
  github: "https://github.com/ThunderboltDev",
  discord: "https://discord.com/users/855342398115414037",
  twitter: "https://x.com/Thunderbolt3141",
  email: "support@thunderboltdev.site",
} as const;
