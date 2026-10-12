import { and, arrayOverlaps, desc, ne, sql } from "drizzle-orm";
import { db } from "@/db/index";
import { toolsTable } from "@/db/schema";
import {
  categoryLabels,
  platformLabels,
  pricingLabels,
} from "@/lib/constants";
import type { Category, PricingModel, Tool } from "@/lib/types";

export const MIN_INDEXABLE_ALTERNATIVES = 3;
export const ALTERNATIVES_LIMIT = 12;
const CANDIDATE_POOL = 40;

type RankableTool = Pick<
  Tool,
  "slug" | "category" | "tags" | "pricing" | "upvotes"
>;

function intersection<T>(a: T[], b: T[]): T[] {
  const set = new Set(b);
  return a.filter((item) => set.has(item));
}

function joinAnd(items: string[]): string {
  if (items.length === 0) return "";
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
}

export function scoreAlternative(source: RankableTool, candidate: RankableTool) {
  const categoryOverlap = intersection(source.category, candidate.category)
    .length;
  const tagOverlap = intersection(source.tags, candidate.tags).length;
  const primaryCategory = source.category[0];
  const primaryBoost =
    primaryCategory && candidate.category.includes(primaryCategory) ? 5 : 0;
  const pricingSpread = source.pricing === candidate.pricing ? 0 : 1.5;

  return (
    categoryOverlap * 10 +
    tagOverlap * 4 +
    primaryBoost +
    pricingSpread +
    Math.min(candidate.upvotes, 40) / 20
  );
}

export function rankAlternatives<T extends RankableTool>(
  source: RankableTool,
  candidates: T[],
  limit = ALTERNATIVES_LIMIT
): T[] {
  return candidates
    .filter((candidate) => candidate.slug !== source.slug)
    .map((tool) => ({ tool, score: scoreAlternative(source, tool) }))
    .sort(
      (a, b) => b.score - a.score || b.tool.upvotes - a.tool.upvotes
    )
    .slice(0, limit)
    .map(({ tool }) => tool);
}

export async function queryAlternativeTools(
  source: RankableTool,
  limit = ALTERNATIVES_LIMIT
): Promise<Tool[]> {
  if (source.category.length === 0) return [];

  const categoryOverlap = sql`(
    SELECT COUNT(*)::int
    FROM UNNEST(${toolsTable.category}) AS c(cat)
    WHERE c.cat = ANY(${sql.param(source.category)})
  )`;

  const candidates = await db
    .select()
    .from(toolsTable)
    .where(
      and(
        arrayOverlaps(toolsTable.category, source.category),
        ne(toolsTable.slug, source.slug)
      )
    )
    .orderBy(desc(categoryOverlap), desc(toolsTable.upvotes))
    .limit(CANDIDATE_POOL);

  return rankAlternatives(source, candidates, limit);
}

export function isIndexableAlternativesPage(count: number) {
  return count >= MIN_INDEXABLE_ALTERNATIVES;
}

export function getAlternativesIntro(tool: Tool, alternatives: Tool[]) {
  const year = new Date().getFullYear();
  const primary = categoryLabels[tool.category[0]];
  const extraCategories = tool.category
    .slice(1)
    .map((category) => categoryLabels[category]);
  const previewNames = alternatives.slice(0, 3).map((item) => item.name);

  const first = `${tool.name} is a ${pricingLabels[tool.pricing].toLowerCase()} ${primary.toLowerCase()} tool. ${tool.tagline} This page lists ${alternatives.length} ${tool.name} alternatives on ApexTools as of ${year}, ranked by shared categories, tags, and community upvotes.`;

  const scope =
    extraCategories.length > 0
      ? `${tool.name} is categorized under ${primary} as well as ${joinAnd(extraCategories)}.`
      : `${tool.name} is categorized under ${primary}.`;

  const second =
    alternatives.length > 0
      ? `${scope} Closest matches include ${joinAnd(previewNames)}. Use the comparison table to check pricing, platforms, and overlap before switching.`
      : `${scope} We do not have enough overlapping listings yet to recommend ${tool.name} alternatives. Browse the ${primary.toLowerCase()} category while the directory grows.`;

  return { first, second, year, primary };
}

export function getAlternativeReason(source: Tool, alt: Tool): string {
  const parts: string[] = [
    `${alt.name} is a ${pricingLabels[alt.pricing].toLowerCase()} ${categoryLabels[alt.category[0]].toLowerCase()} tool: ${alt.tagline}`,
  ];

  const sharedCats = intersection(source.category, alt.category).map(
    (category) => categoryLabels[category]
  );
  if (sharedCats.length > 0) {
    parts.push(`It overlaps with ${source.name} in ${joinAnd(sharedCats)}.`);
  }

  const extraCats = alt.category
    .filter((category) => !source.category.includes(category))
    .map((category) => categoryLabels[category]);
  if (extraCats.length > 0) {
    parts.push(
      `${alt.name} also covers ${joinAnd(extraCats)}, which ${source.name} does not list.`
    );
  }

  if (alt.pricing !== source.pricing) {
    parts.push(
      `Pricing differs: ${alt.name} is ${pricingLabels[alt.pricing].toLowerCase()}, while ${source.name} is ${pricingLabels[source.pricing].toLowerCase()}.`
    );
  }

  const sharedTags = intersection(source.tags, alt.tags).slice(0, 4);
  if (sharedTags.length > 0) {
    parts.push(`Shared tags include ${sharedTags.join(", ")}.`);
  }

  const extraPlatforms = alt.platform.filter(
    (platform) => !source.platform.includes(platform)
  );
  if (extraPlatforms.length > 0) {
    parts.push(
      `${alt.name} is also available on ${joinAnd(extraPlatforms.map((platform) => platformLabels[platform]))}.`
    );
  }

  return parts.join(" ");
}

export function getBestWhen(source: Tool, alt: Tool): string {
  if (alt.pricing === "free" && source.pricing !== "free") {
    return "You want a free option";
  }
  if (alt.pricing === "freemium" && source.pricing === "paid") {
    return "You want a free tier before paying";
  }

  const extraCats = alt.category.filter(
    (category) => !source.category.includes(category)
  );
  if (extraCats[0]) {
    return `You also need ${categoryLabels[extraCats[0]].toLowerCase()}`;
  }

  const extraPlatforms = alt.platform.filter(
    (platform) => !source.platform.includes(platform)
  );
  if (extraPlatforms[0]) {
    return `You need ${platformLabels[extraPlatforms[0]]}`;
  }

  if (alt.upvotes > source.upvotes) {
    return "You want a more upvoted option in this category";
  }

  return `You want another ${categoryLabels[alt.category[0]].toLowerCase()} tool`;
}

export function getAlternativesFaqs(tool: Tool, alternatives: Tool[]) {
  const primary = categoryLabels[tool.category[0]];
  const top = alternatives[0];
  const freeAlts = alternatives.filter((item) => item.pricing === "free");
  const mostUpvoted = alternatives.reduce<Tool | undefined>((lead, item) => {
    if (!lead || item.upvotes > lead.upvotes) return item;
    return lead;
  }, undefined);

  const faqs = [
    {
      question: `What are the best alternatives to ${tool.name}?`,
      answer:
        alternatives.length > 0
          ? `The closest ${tool.name} alternatives on ApexTools right now are ${joinAnd(alternatives.slice(0, 5).map((item) => item.name))}. They share ${primary.toLowerCase()} positioning with ${tool.name} and are ranked by category overlap, tags, and upvotes.`
          : `ApexTools does not have enough overlapping ${primary.toLowerCase()} listings yet to name ${tool.name} alternatives.`,
    },
    {
      question: `Is there a free alternative to ${tool.name}?`,
      answer:
        freeAlts.length > 0
          ? `Yes. Free ${tool.name} alternatives in this directory include ${joinAnd(freeAlts.slice(0, 4).map((item) => item.name))}. ${tool.name} itself is listed as ${pricingLabels[tool.pricing].toLowerCase()}.`
          : tool.pricing === "free"
            ? `${tool.name} is already listed as free. Paid or freemium tools in the same categories can still be useful if you need extra features.`
            : `No free ${tool.name} alternative is listed yet. Check the ${primary.toLowerCase()} category for new free tools, or consider a freemium option from the table above.`,
    },
  ];

  if (top) {
    faqs.push({
      question: `How does ${top.name} compare to ${tool.name}?`,
      answer: getAlternativeReason(tool, top),
    });
  }

  faqs.push({
    question: `What type of tool is ${tool.name}?`,
    answer: `${tool.name} is a ${pricingLabels[tool.pricing].toLowerCase()} ${primary.toLowerCase()} tool. ${tool.tagline} It is listed under ${joinAnd(tool.category.map((category) => categoryLabels[category]))}${tool.platform.length > 0 ? ` and runs on ${joinAnd(tool.platform.map((platform) => platformLabels[platform]))}` : ""}.`,
  });

  if (mostUpvoted) {
    faqs.push({
      question: `Which ${tool.name} alternative has the most upvotes?`,
      answer: `${mostUpvoted.name} currently has the most upvotes among these ${tool.name} alternatives (${mostUpvoted.upvotes}). Upvotes reflect directory users, not an independent benchmark.`,
    });
  }

  return faqs;
}

export function listCategoryLabels(categories: Category[]) {
  return categories.map((category) => categoryLabels[category]);
}

export function formatPricing(pricing: PricingModel) {
  return pricingLabels[pricing];
}
