import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { schema } from "@/db/schema";

if (!process.env.DATABASE_URL) {
  throw new Error("env variable DATABASE_URL is not defined");
}

export const client = postgres(process.env.DATABASE_URL, { prepare: false });
export const db = drizzle(client, { schema });
