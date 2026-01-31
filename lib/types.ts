import type { InferSelectModel } from "drizzle-orm";
import type {
  accountsTable,
  sessionsTable,
  toolsTable,
  upvotesTable,
  usersTable,
} from "@/db/schema";
import type {
  analyticsEvents,
  categories,
  platforms,
  pricingModels,
  sortOptions,
  timePeriods,
} from "@/lib/constants";

export type User = InferSelectModel<typeof usersTable>;
export type Session = InferSelectModel<typeof sessionsTable>;
export type Account = InferSelectModel<typeof accountsTable>;

export type Tool = InferSelectModel<typeof toolsTable>;
export type Upvote = InferSelectModel<typeof upvotesTable>;

export type ToolWithUpvoteStatus = Tool & {
  isUpvoted: boolean;
};

export type Category = (typeof categories)[number];
export type CategoryFilter = Category | "all";

export type PricingModel = (typeof pricingModels)[number];
export type PricingModelFilter = PricingModel | "all";

export type Platform = (typeof platforms)[number];
export type PlatformFilter = Platform | "all";

export type AnalyticsEvent = (typeof analyticsEvents)[number];
export type AnalyticsEventFilter = AnalyticsEvent | "all";

export type SortOption = (typeof sortOptions)[number];
export type SortOptionFilter = (typeof sortOptions)[number] | "all";

export type TimePeriod = (typeof timePeriods)[number];

export interface PaginationInput {
  page?: number;
  limit?: number;
  sort?: SortOption;
  category?: Category;
  pricing?: PricingModel;
  slugs?: string[];
  search?: string;
  ownerId?: string;
  viewerId?: string;
}

export interface PaginationOutput {
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}
