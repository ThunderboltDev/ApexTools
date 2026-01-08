import { defineConfig } from "drizzle-kit";

if (!process.env.DATABASE_DIRECT_URL) {
  throw new Error("env variable DATABASE_URL is not defined");
}

export default defineConfig({
  out: "./db/drizzle",
  schema: "./db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_DIRECT_URL,
  },
});
