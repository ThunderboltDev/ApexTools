import { isDev } from "@/config";

/**
 * Set NEXT_PUBLIC_ADSENSE_CLIENT_ID to your AdSense client, e.g. ca-pub-1234567890123456.
 * The same value is used for the site-wide script and for ads.txt (ca- is stripped).
 */
export const adsenseClientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID?.trim();

export const adsenseEnabled = Boolean(adsenseClientId) && !isDev;

export function getAdsensePublisherId(clientId = adsenseClientId) {
  if (!clientId) return undefined;
  return clientId.replace(/^ca-/, "");
}
