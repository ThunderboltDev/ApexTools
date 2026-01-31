import DodoPayments from "dodopayments";
import { isDev } from "@/config";

if (!process.env.DODO_PAYMENTS_API_KEY) {
  throw new Error("env variable DODO_PAYMENTS_API_KEY is not set");
}

export const dodoPayments = new DodoPayments({
  bearerToken: process.env.DODO_PAYMENTS_API_KEY,
  environment: isDev ? "test_mode" : "live_mode",
  timeout: 15 * 1000,
  maxRetries: 2,
});
