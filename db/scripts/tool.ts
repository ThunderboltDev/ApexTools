import { config } from "dotenv";

config({
  path: ".env.local",
});

import { faker } from "@faker-js/faker";
import crypto from "crypto";
import slugify from "slugify";
import { db } from "@/db";
import { toolsTable } from "@/db/schema";
import { categories } from "@/lib/constants";

const COUNT = 500;
const BATCH_SIZE = 100;

function makeSlug(name: string, attempt = 0) {
  const base = slugify(name, { lower: true, strict: true });
  return attempt === 0
    ? base
    : `${base}-${crypto.randomBytes(2).toString("hex")}`;
}

function randFrom<T>(arr: readonly T[]) {
  return arr[Math.floor(Math.random() * arr.length)];
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

function generateTool(i: number, userId: string) {
  const name = `${faker.company.name().split(" ")[0]}AI${i}`;
  const baseSlug = makeSlug(name);
  const category = randFrom(categories);
  const pricing = faker.helpers.arrayElement(["free", "freemium", "paid"]);
  const score = faker.number.int({ min: 60, max: 100 });
  const logo = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    name
  )}&background=random`;
  const url = faker.internet.url();

  return {
    id: crypto.randomUUID(),
    name,
    slug: baseSlug,
    userId,
    tagline: faker.hacker.phrase(),
    description: faker.lorem.sentences(5),
    category,
    pricing,
    upvotes: faker.number.int({ min: 0, max: 100 }),
    logo,
    url,
    tags: randomTags(category),
    score,
    createdAt: new Date(),
    updatedAt: new Date(),
    status: "approved" as const,
  };
}

async function main() {
  console.log(`Generating ${COUNT} dummy tools...`);

  const user = await db.query.user.findFirst();

  if (!user) throw new Error("User not found");

  const dummyTools = Array.from({ length: COUNT }, (_, i) =>
    generateTool(i + 1, user.id)
  );

  const seenSlugs = new Set<string>();

  for (let i = 0; i < dummyTools.length; i++) {
    let attempt = 0;

    while (seenSlugs.has(dummyTools[i].slug)) {
      dummyTools[i].slug = makeSlug(dummyTools[i].name, ++attempt);
    }

    seenSlugs.add(dummyTools[i].slug);
  }

  for (let i = 0; i < dummyTools.length; i += BATCH_SIZE) {
    const chunk = dummyTools.slice(i, i + BATCH_SIZE);

    await db.insert(toolsTable).values(chunk);

    console.log(`Inserted ${i + chunk.length} / ${dummyTools.length}`);
  }

  console.log("Seeding complete!");
  process.exit(0);
}

main().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
