export function normalizeCallbackUrl(url?: string | null) {
  if (!url) return "/overview";
  if (url.startsWith("/tools/")) return "/tools";
  if (url.startsWith("/logout")) return "/auth";
  return encodeURIComponent(url);
}
