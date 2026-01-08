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
  pricingModels,
  status,
} from "@/lib/constants";

export type User = InferSelectModel<typeof usersTable>;
export type Session = InferSelectModel<typeof sessionsTable>;
export type Account = InferSelectModel<typeof accountsTable>;

export type Tool = InferSelectModel<typeof toolsTable>;
export type Upvote = InferSelectModel<typeof upvotesTable>;

export type Category = (typeof categories)[number];
export type CategoryFilter = Category | "all";

export type PricingModel = (typeof pricingModels)[number];
export type PricingModelFilter = PricingModel | "all";

export type Status = (typeof status)[number];
export type StatusFilter = Status | "all";

export type AnalyticsEvent = (typeof analyticsEvents)[number];
export type AnalyticsEventFilter = AnalyticsEvent | "all";

export interface PaginationInput {
  page?: number;
  limit?: number;
  category?: Category;
  pricing?: PricingModel;
  status?: Status;
  search?: string;
  userId?: string;
}

export interface PaginationOutput {
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}
