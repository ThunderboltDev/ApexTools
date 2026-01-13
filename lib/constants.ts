import {
  AnalyticsUpIcon,
  ArrowUpBigIcon,
  BrainIcon,
  Cancel01Icon,
  CheckListIcon,
  Clock02Icon,
  CodeSimpleIcon,
  CreditCardIcon,
  EyeIcon,
  Fire03Icon,
  GiftIcon,
  GridViewIcon,
  Image02Icon,
  Layers01Icon,
  LinkSquare02Icon,
  Megaphone01Icon,
  MusicNote01Icon,
  PenTool01Icon,
  Radar01Icon,
  Search02Icon,
  Tick02Icon,
  Video01Icon,
  VolumeHighIcon,
} from "@hugeicons/core-free-icons";
import type { IconSvgElement } from "@hugeicons/react";
import z from "zod";
import type {
  AnalyticsEventFilter,
  CategoryFilter,
  PricingModelFilter,
  SortOptionFilter,
  StatusFilter,
  TimePeriod,
} from "@/lib/types";

export const HOT_THRESHOLD = 80;

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
} as const;

export const categoryIcons: Record<CategoryFilter, IconSvgElement> = {
  all: GridViewIcon,
  productivity: CheckListIcon,
  marketing: Megaphone01Icon,
  llm: BrainIcon,
  image: Image02Icon,
  code: CodeSimpleIcon,
  video: Video01Icon,
  audio: VolumeHighIcon,
  music: MusicNote01Icon,
  writing: PenTool01Icon,
  research: Search02Icon,
};

export const pricingLabels: Record<PricingModelFilter, string> = {
  all: "All",
  free: "Free",
  freemium: "Freemium",
  paid: "Paid",
} as const;

export const pricingModelIcons: Record<PricingModelFilter, IconSvgElement> = {
  all: GridViewIcon,
  free: GiftIcon,
  freemium: Layers01Icon,
  paid: CreditCardIcon,
};

export const statusLabels: Record<StatusFilter, string> = {
  all: "All",
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
} as const;

export const statusIcons: Record<StatusFilter, IconSvgElement> = {
  all: GridViewIcon,
  pending: Clock02Icon,
  approved: Tick02Icon,
  rejected: Cancel01Icon,
};

export const analyticsEventLabels: Record<AnalyticsEventFilter, string> = {
  all: "All",
  view: "Views",
  visit: "Visits",
  upvote: "Upvotes",
  impression: "Impressions",
} as const;

export const analyticsEventIcons: Record<AnalyticsEventFilter, IconSvgElement> =
  {
    all: GridViewIcon,
    view: EyeIcon,
    visit: LinkSquare02Icon,
    upvote: ArrowUpBigIcon,
    impression: Radar01Icon,
  };

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

export const sortOptionsIcon: Record<SortOptionFilter, IconSvgElement> = {
  all: GridViewIcon,
  latest: Clock02Icon,
  hot: Fire03Icon,
  trending: AnalyticsUpIcon,
  upvotes: ArrowUpBigIcon,
  views: EyeIcon,
};

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
  limit: z.number().min(1).max(99).default(24),
  search: z.string().optional(),
});
