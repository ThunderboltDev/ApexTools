import { config } from "dotenv";

config({
  path: ".env.local",
});

import { faker } from "@faker-js/faker";
import crypto from "crypto";
import { eq } from "drizzle-orm";
import slugify from "slugify";
import { db } from "@/db";
import {
  toolAnalyticsEventsTable,
  toolsTable,
  upvotesTable,
} from "@/db/schema";
import { analyticsEvents, categories } from "@/lib/constants";

const TOOL_NAME = "TestAnalyticsTool";
const ANALYTICS_DAYS = 30;

function makeSlug(name: string) {
  return slugify(name, { lower: true, strict: true });
}

function randomTags(category: string) {
  const pool = [
    "api",
    "web",
    "open-source",
    "free",
    "paid",
    "freemium",
    "editor",
    "generator",
    "assistant",
    "automation",
    "integration",
  ];
  const tags = new Set<string>([category, faker.helpers.arrayElement(pool)]);
  while (tags.size < 3) tags.add(faker.helpers.arrayElement(pool));
  return Array.from(tags);
}

async function createTool() {
  const user = await db.query.user.findFirst();
  if (!user) throw new Error("No user found to assign tool to.");

  const category = faker.helpers.arrayElement(categories);
  const toolId = crypto.randomUUID();
  const slug = makeSlug(TOOL_NAME);

  await db.insert(toolsTable).values({
    id: toolId,
    slug,
    name: TOOL_NAME,
    tagline: "A tool to test analytics",
    description: faker.lorem.sentences(3),
    category,
    pricing: "free",
    score: faker.number.int({ min: 50, max: 100 }),
    upvotes: 0,
    logo: `https://ui-avatars.com/api/?name=${encodeURIComponent(
      TOOL_NAME
    )}&background=random`,
    url: faker.internet.url(),
    tags: randomTags(category),
    status: "approved",
    userId: user.id,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  return toolId;
}

async function createAnalytics(toolId: string) {
  const now = new Date();

  for (let dayOffset = 0; dayOffset < ANALYTICS_DAYS; dayOffset++) {
    const date = new Date(now);
    date.setDate(now.getDate() - dayOffset);

    // Random number of events per day
    const eventCount = faker.number.int({ min: 5, max: 20 });

    const eventBatch = Array.from({ length: eventCount }).map(() => ({
      toolId,
      visitorId: crypto.randomUUID(),
      type: faker.helpers.arrayElement(analyticsEvents),
      createdAt: faker.date.between({
        from: new Date(date.setHours(0, 0, 0)),
        to: new Date(date.setHours(23, 59, 59)),
      }),
    }));

    await db.insert(toolAnalyticsEventsTable).values(eventBatch);
  }
}

async function createUpvotes(toolId: string) {
  const users = await db.query.user.findMany();
  const upvoteCount = Math.min(users.length, 10);

  for (let i = 0; i < upvoteCount; i++) {
    await db.insert(upvotesTable).values({
      userId: users[i].id,
      toolId,
      createdAt: faker.date.recent({ days: ANALYTICS_DAYS }),
    });
  }

  await db
    .update(toolsTable)
    .set({ upvotes: upvoteCount })
    .where(eq(toolsTable.id, toolId));
}

async function main() {
  console.log("Creating test tool...");
  const toolId = await createTool();

  console.log("Seeding analytics data...");
  await createAnalytics(toolId);

  console.log("Seeding upvotes...");
  await createUpvotes(toolId);

  console.log("Done! Tool created with dummy analytics data.");
  process.exit(0);
}

main().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
