export function normalizeCallbackUrl(url?: string) {
  if (!url) return "/dashboard";

  return url;
}
