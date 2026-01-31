"use client";

import { CrownIcon, RocketIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LinkButton } from "@/components/ui/link-button";

export function AdvertiseCTACard() {
  return (
    <Card className="border-2 border-dashed border-gold/40 bg-linear-to-br from-gold/5 to-gold/5 hover:border-gold/60 transition-colors">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-gold/10">
            <HugeiconsIcon icon={CrownIcon} className="size-5 text-gold" />
          </div>
          <CardTitle className="text-lg">Promote Your Tool</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <CardDescription className="text-sm">
          Get your AI tool in front of thousands of users. Featured tools appear
          first in search results with a badge.
        </CardDescription>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li className="flex items-center gap-2">
            <span className="text-gold">✓</span> Appear first in all listings
          </li>
          <li className="flex items-center gap-2">
            <span className="text-gold">✓</span> Featured badge on your tool
          </li>
          <li className="flex items-center gap-2">
            <span className="text-green-500">✓</span> Up to 10x more visibility
          </li>
        </ul>
        <LinkButton href="/submit" variant="outline" className="w-full">
          <HugeiconsIcon icon={RocketIcon} className="size-4" />
          Submit Your Tool
        </LinkButton>
      </CardContent>
    </Card>
  );
}
