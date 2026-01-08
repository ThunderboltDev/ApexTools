"use client";

import { FilterIcon, Search01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useMemo, useState } from "react";
import { ToolCard } from "@/components/tool/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  PageContent,
  PageDescription,
  PageHeader,
  PageTitle,
} from "@/components/ui/page";
import { Skeleton } from "@/components/ui/skeleton";
import { categories, pricingModels } from "@/lib/constants";
import type { CategoryFilter, PricingModelFilter } from "@/lib/types";
import { trpc } from "@/trpc/provider";

export default function BrowsePage() {
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");
  const [pricingFilter, setPricingFilter] = useState<
    PricingModelFilter | "all"
  >("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading, isFetching } = trpc.browse.getAll.useQuery({
    page,
    limit: 18,
    category: categoryFilter !== "all" ? categoryFilter : undefined,
    pricing: pricingFilter !== "all" ? pricingFilter : undefined,
    search: searchQuery || undefined,
  });

  const tools = data?.tools ?? [];
  const pagination = data?.pagination;

  const filtersLabel = useMemo(() => {
    const active: string[] = [];
    if (categoryFilter !== "all") active.push(categoryFilter);
    if (pricingFilter !== "all") active.push(pricingFilter);
    return active.join(" · ") || "Filters";
  }, [categoryFilter, pricingFilter]);

  return (
    <PageContent className="wrapper-xl py-8">
      <PageHeader className="mb-6 space-y-2">
        <PageTitle>Explore AI tools</PageTitle>
        <PageDescription>
          Discover the latest submissions from the community.
        </PageDescription>
      </PageHeader>

      <div className="mb-6 flex flex-col gap-3 rounded-lg border border-border bg-card px-4 py-3 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex w-full items-center gap-3 sm:max-w-lg">
          <HugeiconsIcon
            icon={Search01Icon}
            className="size-4 text-muted-foreground"
          />
          <Input
            placeholder="Search by name, description, or URL..."
            value={searchQuery}
            onChange={(e) => {
              setPage(1);
              setSearchQuery(e.target.value);
            }}
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="outline" size="default" className="gap-2" />
            }
          >
            <HugeiconsIcon icon={FilterIcon} className="size-4" />
            {filtersLabel}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Category</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => {
                setCategoryFilter("all");
                setPage(1);
              }}
            >
              All
            </DropdownMenuItem>
            {categories.map((category) => (
              <DropdownMenuItem
                key={category}
                onClick={() => {
                  setCategoryFilter(category);
                  setPage(1);
                }}
              >
                {category}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Pricing</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => {
                setPricingFilter("all");
                setPage(1);
              }}
            >
              All
            </DropdownMenuItem>
            {pricingModels.map((pricing) => (
              <DropdownMenuItem
                key={pricing}
                onClick={() => {
                  setPricingFilter(pricing);
                  setPage(1);
                }}
              >
                {pricing}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 9 }).map(() => (
            <Skeleton key={crypto.randomUUID()} className="h-48 w-full" />
          ))}
        </div>
      ) : tools.length === 0 ? (
        <div className="rounded-lg border border-border bg-muted/30 px-6 py-12 text-center text-muted-foreground">
          No tools match your filters yet.
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
          {pagination ? (
            <div className="mt-6 flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3">
              <span className="text-sm text-muted-foreground">
                Page {pagination.page} of{" "}
                {Math.max(1, Math.ceil(pagination.total / pagination.limit))}
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                  disabled={pagination.page === 1 || isFetching}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((prev) => prev + 1)}
                  disabled={!pagination.hasMore || isFetching}
                >
                  Next
                </Button>
              </div>
            </div>
          ) : null}
        </>
      )}
    </PageContent>
  );
}
