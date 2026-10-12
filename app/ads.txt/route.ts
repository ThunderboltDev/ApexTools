import { adsenseClientId, getAdsensePublisherId } from "@/lib/adsense";

export function GET() {
  const publisherId = getAdsensePublisherId(adsenseClientId);

  if (!publisherId) {
    return new Response("Not found", {
      status: 404,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  const body = `google.com, ${publisherId}, DIRECT, f08c47fec0942fa0\n`;

  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
