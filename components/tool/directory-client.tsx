"use client";

import {
  Clock02Icon,
  Fire03Icon,
  SearchIcon,
  TrendingUp,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { keepPreviousData } from "@tanstack/react-query";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import { ToolCard } from "@/components/tool/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import {
  categories,
  categoryLabels,
  pricingLabels,
  pricingModels,
} from "@/lib/constants";
import type {
  CategoryFilter,
  PricingModelFilter,
  SortOptions,
} from "@/lib/types";
import { trpc } from "@/trpc/provider";

interface DirectoryClientProps {
  category?: CategoryFilter;
}

export function DirectoryClient({
  category: initialCategory,
}: DirectoryClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const pageParam = Number(searchParams.get("page") ?? 1);
  const searchParam = searchParams.get("search") ?? "";
  const categoryParam =
    (searchParams.get("category") as CategoryFilter) ?? "all";
  const pricingParam =
    (searchParams.get("pricing") as PricingModelFilter) ?? "all";
  const sortParam = (searchParams.get("sort") as SortOptions) ?? "latest";

  const [search, setSearch] = useState(searchParam);
  const [debouncedSearch] = useDebounce(search, 500);

  // biome-ignore lint/correctness/useExhaustiveDependencies: search
  useEffect(() => {
    if (debouncedSearch === searchParam) return;
    updateParams({ search: debouncedSearch || undefined, page: "1" });
  }, [debouncedSearch]);

  const activeCategory = categoryParam === "all" ? undefined : categoryParam;
  const activePricing = pricingParam === "all" ? undefined : pricingParam;

  const { data, isLoading } = trpc.browse.getAll.useQuery(
    {
      page: pageParam,
      limit: 24,
      search: debouncedSearch || undefined,
      category: activeCategory,
      pricing: activePricing,
      sort: sortParam,
    },
    {
      placeholderData: keepPreviousData,
    }
  );

  useEffect(() => {
    console.log({
      pageParam,
      search,
      searchParam,
      debouncedSearch,
      activeCategory,
      activePricing,
      sortParam,
      data,
    });
  }, [
    pageParam,
    search,
    searchParam,
    debouncedSearch,
    activeCategory,
    activePricing,
    sortParam,
    data,
  ]);
  const updateParams = (updates: Record<string, string | undefined>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value === undefined) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleSort = (sort: SortOptions) => {
    updateParams({ sort, page: "1" });
  };

  const handlePricingChange = (val: string) => {
    updateParams({ pricing: val === "all" ? undefined : val, page: "1" });
  };

  const handleCategoryChange = (val: string) => {
    updateParams({ category: val === "all" ? undefined : val, page: "1" });
  };

  const handlePageChange = (newPage: number) => {
    updateParams({ page: String(newPage) });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <HugeiconsIcon
              icon={SearchIcon}
              className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
            />
            <Input
              placeholder="Search tools..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
            {!initialCategory && (
              <Select
                value={categoryParam}
                onValueChange={handleCategoryChange}
              >
                <SelectTrigger className="w-[160px]">
                  {categoryLabels[categoryParam]}
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {categoryLabels[category]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            <Select value={pricingParam} onValueChange={handlePricingChange}>
              <SelectTrigger className="w-[140px]">
                {pricingLabels[pricingParam]}
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Prices</SelectItem>
                {pricingModels.map((price) => (
                  <SelectItem key={price} value={price}>
                    {pricingLabels[price]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant={sortParam === "hot" ? "default" : "outline"}
            size="sm"
            onClick={() => handleSort("hot")}
            className="gap-2"
          >
            <HugeiconsIcon icon={Fire03Icon} className="h-4 w-4" />
            Hot
          </Button>
          <Button
            variant={sortParam === "trending" ? "default" : "outline"}
            size="sm"
            onClick={() => handleSort("trending")}
            className="gap-2"
          >
            <HugeiconsIcon icon={TrendingUp} className="h-4 w-4" />
            Trending
          </Button>
          <Button
            variant={sortParam === "latest" ? "default" : "outline"}
            size="sm"
            onClick={() => handleSort("latest")}
            className="gap-2"
          >
            <HugeiconsIcon icon={Clock02Icon} className="h-4 w-4" />
            Latest
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map(() => (
            <div
              key={crypto.randomUUID()}
              className="h-[300px] rounded-xl bg-muted/50 animate-pulse"
            />
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data?.tools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>

          {data?.tools.length === 0 && (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-4">
                <HugeiconsIcon
                  icon={SearchIcon}
                  className="h-6 w-6 text-muted-foreground"
                />
              </div>
              <h3 className="text-lg font-semibold">No tools found</h3>
              <p className="text-muted-foreground mt-1">
                Try adjusting your search or filters
              </p>
              <Button
                onClick={() => {
                  setSearch("");
                  updateParams({
                    search: undefined,
                    category: undefined,
                    pricing: undefined,
                    page: "1",
                  });
                }}
                className="mt-2"
              >
                Clear all filters
              </Button>
            </div>
          )}

          {data?.pagination &&
            data.pagination.total > data.pagination.limit && (
              <div className="flex justify-center gap-2 mt-8">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pageParam <= 1}
                  onClick={() => handlePageChange(pageParam - 1)}
                >
                  Previous
                </Button>
                <div className="flex items-center px-4 text-sm font-medium">
                  Page {pageParam} of{" "}
                  {Math.ceil(data.pagination.total / data.pagination.limit)}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!data.pagination.hasMore}
                  onClick={() => handlePageChange(pageParam + 1)}
                >
                  Next
                </Button>
              </div>
            )}
        </>
      )}
    </div>
  );
}
