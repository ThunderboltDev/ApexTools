"use client";

import {
  GridViewIcon,
  Search01Icon,
  Tag01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { SubmitToolButton } from "@/components/tool/submit";
import { Badge } from "@/components/ui/badge";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  PageContent,
  PageDescription,
  PageHeader,
  PageTitle,
} from "@/components/ui/page";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  categories,
  categoryLabels,
  pricingLabels,
  pricingModels,
  statusLabels,
} from "@/lib/constants";
import type { CategoryFilter, PricingModelFilter } from "@/lib/types";
import { trpc } from "@/trpc/provider";

export default function ToolsPage() {
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");
  const [pricingFilter, setPricingFilter] = useState<PricingModelFilter>("all");

  const { data, isLoading } = trpc.tool.getAll.useQuery({
    page: 1,
    limit: 20,
    category: categoryFilter !== "all" ? categoryFilter : undefined,
    pricing: pricingFilter !== "all" ? pricingFilter : undefined,
    search: searchQuery || undefined,
  });

  const tools = data?.tools ?? [];

  return (
    <>
      <PageHeader>
        <PageTitle>My Tools</PageTitle>
        <PageDescription>Track and edit the tools you publish.</PageDescription>
      </PageHeader>
      <PageContent>
        <div className="flex flex-wrap flex-row gap-2 mb-6">
          <InputGroup className="sm:max-w-xs md:max-w-md">
            <InputGroupInput
              placeholder="Search by name or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <InputGroupAddon align="inline-end">
              <div className="bg-primary text-primary-foreground flex size-4 items-center justify-center rounded-full">
                <HugeiconsIcon
                  icon={Search01Icon}
                  className="size-4 text-muted-foreground"
                />
              </div>
            </InputGroupAddon>
          </InputGroup>
          <Select
            value="all"
            onValueChange={(value) =>
              setCategoryFilter(value as CategoryFilter)
            }
          >
            <SelectTrigger>
              <HugeiconsIcon icon={GridViewIcon} />
              Category: {categoryLabels[categoryFilter]}
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {categoryLabels[category]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value="all"
            onValueChange={(value) =>
              setPricingFilter(value as PricingModelFilter)
            }
          >
            <SelectTrigger>
              <HugeiconsIcon icon={Tag01Icon} />
              Pricing: {pricingLabels[pricingFilter]}
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {pricingModels.map((pricing) => (
                <SelectItem key={pricing} value={pricing}>
                  {pricingLabels[pricing]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2">
            {[1, 2, 3, 4].map((item) => (
              <Skeleton key={item} className="h-40 w-full" />
            ))}
          </div>
        ) : tools.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-14">
            <h4>No tools yet</h4>
            <p className="text-muted-foreground">
              Submit your first tool to get started.
            </p>
            <SubmitToolButton className="mt-4" />
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {tools.map((tool) => (
              <Link
                key={tool.id}
                href={`/tools/${tool.slug}`}
                className="rounded-lg border border-border bg-secondary p-4 shadow-md"
              >
                <div className="flex items-start gap-3">
                  <Image
                    src={tool.logo}
                    alt={`${tool.name}'s Logo`}
                    width={48}
                    height={48}
                    className="rounded-sm aspect-square object-cover"
                  />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-semibold">{tool.name}</h3>
                      <Badge variant="secondary">{categoryLabels[tool.category]}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {tool.tagline}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2 text-xs text-muted-foreground">
                  <Badge variant="outline">{pricingLabels[tool.pricing]}</Badge>
                  <Badge variant="outline">{statusLabels[tool.status]}</Badge>
                </div>
              </Link>
            ))}
          </div>
        )}
      </PageContent>
    </>
  );
}
