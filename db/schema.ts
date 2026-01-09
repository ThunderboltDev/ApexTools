import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import {
  analyticsEvents,
  categories,
  pricingModels,
  status,
} from "@/lib/constants";

export const usersTable = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").default("You").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const sessionsTable = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
  },
  (table) => [index("session_userId_idx").on(table.userId)]
);

export const accountsTable = pgTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("account_userId_idx").on(table.userId)]
);

export const verificationsTable = pgTable(
  "verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)]
);

export const userRelations = relations(usersTable, ({ many }) => ({
  sessions: many(sessionsTable),
  accounts: many(accountsTable),
  tools: many(toolsTable),
}));

export const sessionRelations = relations(sessionsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [sessionsTable.userId],
    references: [usersTable.id],
  }),
}));

export const accountRelations = relations(accountsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [accountsTable.userId],
    references: [usersTable.id],
  }),
}));

export const toolCategoryEnum = pgEnum("tool_category", categories);
export const toolPricingEnum = pgEnum("tool_pricing", pricingModels);
export const statusEnum = pgEnum("tool_status", status);

export const toolAnalyticsEventTypeEnum = pgEnum(
  "tool_analytics_event_type",
  analyticsEvents
);

export const toolsTable = pgTable(
  "tool",
  {
    id: text("id").primaryKey(),
    slug: text("slug").unique().notNull(),
    name: text("name").notNull(),
    tagline: text("tagline").notNull(),
    category: toolCategoryEnum("category").notNull(),
    pricing: toolPricingEnum("pricing").notNull(),
    description: text("description").notNull(),
    logo: text("logo").notNull(),
    url: text("url").notNull(),
    upvotes: integer("upvotes").default(0).notNull(),
    status: statusEnum("status").default("approved").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    index("tool_userId_idx").on(table.userId),
    index("tool_category_idx").on(table.category),
  ]
);

export const toolAnalyticsEventsTable = pgTable(
  "tool_analytics_events",
  {
    id: serial("id").primaryKey(),
    toolId: text("tool_id")
      .notNull()
      .references(() => toolsTable.id, { onDelete: "cascade" }),

    visitorId: text("visitor_id").notNull(),
    type: toolAnalyticsEventTypeEnum("type").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("tool_events_tool_idx").on(table.toolId),
    index("tool_events_visitor_idx").on(table.visitorId),
    index("tool_events_type_idx").on(table.type),
    index("tool_events_created_idx").on(table.createdAt),
  ]
);

export const upvotesTable = pgTable(
  "upvote",
  {
    userId: text("user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    toolId: text("tool_id")
      .notNull()
      .references(() => toolsTable.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [primaryKey({ columns: [table.userId, table.toolId] })]
);

export const toolRelations = relations(toolsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [toolsTable.userId],
    references: [usersTable.id],
  }),
}));

export const schema = {
  user: usersTable,
  session: sessionsTable,
  account: accountsTable,
  verification: verificationsTable,

  tool: toolsTable,
  upvote: upvotesTable,
  analyticsEvents: toolAnalyticsEventsTable,
};
