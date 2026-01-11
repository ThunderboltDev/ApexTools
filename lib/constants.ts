import z from "zod";
import type {
  AnalyticsEventFilter,
  CategoryFilter,
  PricingModelFilter,
  StatusFilter,
  TimePeriod,
} from "@/lib/types";

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
] as const;

export const pricingModels = ["free", "freemium", "paid"] as const;

export const status = ["pending", "approved", "rejected"] as const;

export const analyticsEvents = [
  "view",
  "visit",
  "upvote",
  "impression",
] as const;

export const sortOptions = ["latest", "hot", "trending"] as const;

export const categoryLabels: Record<CategoryFilter, string> = {
  all: "All",
  productivity: "Productivity",
  marketing: "Marketing",
  llm: "LLM",
  image: "Image Generation",
  code: "Code Assistant",
  video: "Video",
  audio: "Audio",
  music: "Music",
  writing: "Writing",
  research: "Research",
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

export const analyticsEventLabels: Record<AnalyticsEventFilter, string> = {
  all: "All",
  view: "Views",
  visit: "Visits",
  upvote: "Upvotes",
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
    .max(200, "Name is too long"),
  pricing: z.enum(pricingModels, "Invalid pricing model"),
  logo: z.url(),
  category: z.enum(categories, "Invalid category"),
  description: z
    .string("Description is required")
    .min(1, "Description is too short")
    .max(1000, "Description is too long"),
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

export const toolSubmitSchema = toolSchema.omit({ logo: true }).extend({
  logo: logoSchema,
});

export const getToolsSchema = z.object({
  category: z.enum(categories).optional(),
  pricing: z.enum(pricingModels).optional(),
  sort: z.enum(sortOptions).optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
  search: z.string().optional(),
});
