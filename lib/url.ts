export function normalizeCallbackUrl(url?: string | null) {
  if (!url) return "/overview";
  return url;
}
