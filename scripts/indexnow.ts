import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

interface IndexNowPayload {
  host: string;
  key: string;
  keyLocation: string;
  urlList: string[];
}

const PRODUCTION_HOST = "www.apextools.site";
const PRODUCTION_ORIGIN = `https://${PRODUCTION_HOST}`;
const DEFAULT_KEY = "d67821e0124641da89ef081cc56cdf01";

function findIndexNowKey(): string {
  try {
    const publicDir = join(process.cwd(), "public");
    const files = readdirSync(publicDir);
    for (const file of files) {
      if (/^[a-f0-9]{32}\.txt$/i.test(file)) {
        const content = readFileSync(join(publicDir, file), "utf-8").trim();
        if (content.length > 0) {
          return content;
        }
      }
    }
  } catch (error) {
    console.warn(
      "Could not read public directory for IndexNow key, using default key.",
      error
    );
  }
  return DEFAULT_KEY;
}

async function collectUrlsFromSitemaps(): Promise<string[]> {
  const sitemapEndpoints = [
    `${PRODUCTION_ORIGIN}/sitemap.xml`,
    `${PRODUCTION_ORIGIN}/tool/sitemap.xml`,
  ];
  const urls: string[] = [];

  for (const endpoint of sitemapEndpoints) {
    try {
      console.log(`Fetching sitemap from ${endpoint}...`);
      const response = await fetch(endpoint);
      if (!response.ok) {
        console.warn(`Failed to fetch ${endpoint} (HTTP ${response.status})`);
        continue;
      }
      const xml = await response.text();
      const locMatches = xml.match(/<loc>(.*?)<\/loc>/g);
      if (locMatches) {
        for (const locMatch of locMatches) {
          const cleaned = locMatch.replace(/<\/?loc>/g, "").trim();
          if (cleaned.length > 0) {
            urls.push(cleaned);
          }
        }
      }
    } catch (error) {
      console.warn(`Error fetching ${endpoint}:`, error);
    }
  }

  return urls;
}

async function submitBatch(key: string, chunk: string[]): Promise<boolean> {
  const payload: IndexNowPayload = {
    host: PRODUCTION_HOST,
    key,
    keyLocation: `${PRODUCTION_ORIGIN}/${key}.txt`,
    urlList: chunk,
  };

  try {
    const response = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(payload),
    });

    if (response.ok || response.status === 202) {
      console.log(
        `✓ Submitted ${chunk.length} URLs to IndexNow (HTTP ${response.status} ${response.statusText || "OK"})`
      );
      return true;
    }

    const errorBody = await response.text();
    console.error(
      `✗ IndexNow rejected submission (HTTP ${response.status}): ${errorBody}`
    );
    return false;
  } catch (error) {
    console.error("✗ Network error submitting to IndexNow:", error);
    return false;
  }
}

async function main(): Promise<void> {
  console.log("=== ApexTools IndexNow Submitter ===\n");

  const key = findIndexNowKey();
  console.log(`IndexNow Key: ${key}`);
  console.log(`Key Location: ${PRODUCTION_ORIGIN}/${key}.txt\n`);

  const urls = await collectUrlsFromSitemaps();
  const uniqueUrls = Array.from(new Set(urls));
  console.log(`Found ${uniqueUrls.length} unique URLs in sitemaps.\n`);

  if (uniqueUrls.length === 0) {
    console.error("No URLs found in sitemaps to submit. Exiting.");
    process.exit(1);
  }

  const CHUNK_SIZE = 1000;
  let successCount = 0;

  for (let i = 0; i < uniqueUrls.length; i += CHUNK_SIZE) {
    const chunk = uniqueUrls.slice(i, i + CHUNK_SIZE);
    const success = await submitBatch(key, chunk);
    if (success) {
      successCount += chunk.length;
    }
  }

  console.log(
    `\n=== Finished: ${successCount}/${uniqueUrls.length} URLs submitted to IndexNow ===`
  );

  process.exit(0);
}

void main();
