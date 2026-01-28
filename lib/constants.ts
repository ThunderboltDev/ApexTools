import z from "zod";
import type {
  AnalyticsEventFilter,
  CategoryFilter,
  Platform,
  PricingModelFilter,
  SortOptionFilter,
  StatusFilter,
  TimePeriod,
} from "@/lib/types";

export const HOT_THRESHOLD = 0.75;

export const categories = [
  "productivity",
  "marketing",
  "llm",
  "image",
  "code",
  "video",
  "audio",
  "music",
  "writing",
  "research",
  "design",
  "data",
  "seo",
  "education",
  "copywriting",
  "translation",
  "gaming",
  "legal",
  "finance",
] as const;

export const platforms = [
  "web",
  "android",
  "ios",
  "chrome_extension",
  "api",
] as const;

export const pricingModels = ["free", "freemium", "paid"] as const;

export const status = ["pending", "approved", "rejected"] as const;

export const analyticsEvents = ["view", "visit", "impression"] as const;

export const sortOptions = [
  "latest",
  "hot",
  "trending",
  "upvotes",
  "views",
] as const;

export const categoryLabels: Record<CategoryFilter, string> = {
  all: "All Categories",
  productivity: "Productivity",
  marketing: "Marketing",
  llm: "LLM",
  image: "Image Generation",
  code: "Code Assistant",
  video: "Video Generation",
  audio: "Audio",
  music: "Music",
  writing: "Writing",
  research: "Research",
  design: "Design",
  data: "Data",
  seo: "SEO",
  education: "Education",
  copywriting: "Copywriting",
  translation: "Translation",
  gaming: "Gaming",
  legal: "Legal",
  finance: "Finance",
} as const;

export const pricingLabels: Record<PricingModelFilter, string> = {
  all: "All",
  free: "Free",
  freemium: "Freemium",
  paid: "Paid",
} as const;

export const statusLabels: Record<StatusFilter, string> = {
  all: "All",
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
} as const;

export const platformLabels: Record<Platform | "all", string> = {
  all: "All Platforms",
  web: "Web",
  android: "Android",
  ios: "iOS",
  chrome_extension: "Chrome Extension",
  api: "API",
} as const;

export const analyticsEventLabels: Record<AnalyticsEventFilter, string> = {
  all: "All",
  view: "Views",
  visit: "Visits",
  impression: "Impressions",
} as const;

export const timePeriods = ["7d", "30d", "90d"] as const;

export const timePeriodLabels: Record<TimePeriod, string> = {
  "7d": "Last 7 days",
  "30d": "Last 30 days",
  "90d": "Last 90 days",
} as const;

export const timePeriodToDays: Record<TimePeriod, number> = {
  "7d": 7,
  "30d": 30,
  "90d": 90,
} as const;

export const sortOptionsLabel: Record<SortOptionFilter, string> = {
  all: "All",
  latest: "Latest",
  hot: "Hot",
  trending: "Trending",
  upvotes: "Upvotes",
  views: "Views",
} as const;

export const slugSchema = z
  .string()
  .min(1, "Slug is required")
  .max(100, "Slug is too long")
  .refine(
    (val) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(val),
    "Slug must be lowercase, URL-safe, and use hyphens only"
  );

export const toolSchema = z.object({
  slug: slugSchema,
  tagline: z
    .string("Tagline is required")
    .min(10, "Tagline is too short")
    .max(100, "Tagline is too long"),
  name: z
    .string("Name is required")
    .min(1, "Name is too short")
    .max(50, "Name is too long"),
  pricing: z.enum(pricingModels, "Invalid pricing model"),
  logo: z.url(),
  category: z.array(z.enum(categories)).min(1, "Select at least one category"),
  platform: z.array(z.enum(platforms)).min(1, "Select at least one platform"),
  tags: z
    .array(z.string())
    .max(10, "Maximum 10 tags allowed")
    .default([])
    .nonoptional(),
  banner: z.url().optional(),
  description: z
    .string("Description is required")
    .min(250, "Description is too short")
    .max(5000, "Description is too long"),
  url: z.url("Invalid URL"),
});

export const logoSchema = z
  .discriminatedUnion("type", [
    z.object({
      type: z.literal("url"),
      url: z.url("Invalid logo URL"),
    }),
    z.object({
      type: z.literal("file"),
      file: z.instanceof(File),
    }),
  ])
  .refine(
    (val) =>
      (val.type === "url" && !!val.url) || (val.type === "file" && !!val.file),
    {
      message: "Logo is required",
      path: ["logo"],
    }
  );

export const bannerSchema = z
  .discriminatedUnion("type", [
    z.object({
      type: z.literal("url"),
      url: z.url("Invalid banner URL"),
    }),
    z.object({
      type: z.literal("file"),
      file: z.instanceof(File),
    }),
  ])
  .refine(
    (val) =>
      (val.type === "url" && !!val.url) || (val.type === "file" && !!val.file),
    {
      message: "Banner is required",
      path: ["banner"],
    }
  );

export const toolSubmitSchema = toolSchema
  .omit({ logo: true, banner: true })
  .extend({
    logo: logoSchema,
    banner: bannerSchema,
  });

export const getToolsSchema = z.object({
  category: z.enum(categories).optional(),
  pricing: z.enum(pricingModels).optional(),
  sort: z.enum(sortOptions).optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(99).default(24),
  search: z.string().optional(),
});
