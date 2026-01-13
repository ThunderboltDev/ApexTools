"use client";

import { GridViewIcon, SearchIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { keepPreviousData } from "@tanstack/react-query";
import {
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
  useQueryStates,
} from "nuqs";
import { useEffect, useRef } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { useDebounce } from "use-debounce";
import { ToolGrid } from "@/components/tool/grid";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { trackFilterApplied } from "@/lib/analytics";
import {
  categories,
  categoryIcons,
  categoryLabels,
  pricingLabels,
  pricingModelIcons,
  pricingModels,
  sortOptions,
  sortOptionsIcon,
  sortOptionsLabel,
} from "@/lib/constants";
import type {
  CategoryFilter,
  PricingModelFilter,
  SortOption,
} from "@/lib/types";
import { trpc } from "@/trpc/provider";

export function BrowseClient() {
  const inputRef = useRef<HTMLInputElement>(null);

  const [params, setParams] = useQueryStates({
    page: parseAsInteger.withDefault(1),
    search: parseAsString.withDefault(""),
    pricing: parseAsStringEnum([...pricingModels, "all"]).withDefault("all"),
    category: parseAsStringEnum([...categories, "all"]).withDefault("all"),
    sort: parseAsStringEnum([...sortOptions]).withDefault("trending"),
  });

  const { page, search, pricing, category, sort } = params;

  const [debouncedSearch] = useDebounce(search, 500);

  useHotkeys(
    "ctrl+k, command+k",
    () => {
      inputRef.current?.focus();
    },
    { preventDefault: true }
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: search
  useEffect(() => {
    setParams({ search: debouncedSearch || null, page: 1 });
  }, [debouncedSearch]);

  const useQueryResults = trpc.browse.getAll.useQuery(
    {
      page: page,
      limit: 24,
      search: debouncedSearch || undefined,
      category: category === "all" ? undefined : category,
      pricing: pricing === "all" ? undefined : pricing,
      sort: sort,
    },
    {
      placeholderData: keepPreviousData,
    }
  );

  const handleSortChange = (sort: string) => {
    setParams({ sort: sort as SortOption, page: 1 });
    trackFilterApplied("sort", sort);
  };

  const handleCategoryChange = (category: string) => {
    setParams({ category: category as CategoryFilter, page: 1 });
    trackFilterApplied("category", category);
  };

  const handlePricingChange = (pricing: string) => {
    setParams({ pricing: pricing as PricingModelFilter, page: 1 });
    trackFilterApplied("pricing", pricing);
  };

  const handlePageChange = (newPage: number) => {
    setParams({ page: newPage });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleClearFilters = () => {
    setParams({
      search: "",
      page: 1,
      pricing: "all",
      category: "all",
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 max-w-xl mx-auto">
        <div className="relative flex-1">
          <HugeiconsIcon
            icon={SearchIcon}
            className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground"
          />
          <Input
            ref={inputRef}
            value={search}
            onChange={(e) => setParams({ search: e.target.value })}
            placeholder="Search tools..."
            className="pl-9"
          />
        </div>
        <div className="flex flex-row flex-wrap gap-4">
          <Field className="max-w-[160]">
            <FieldLabel htmlFor="pricing-filter">Pricing:</FieldLabel>
            <Select
              value={pricing ?? "all"}
              onValueChange={handlePricingChange}
            >
              <SelectTrigger id="pricing-filter">
                <HugeiconsIcon icon={pricingModelIcons[pricing]} />
                {pricingLabels[pricing]}
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  <HugeiconsIcon icon={GridViewIcon} />
                  All
                </SelectItem>
                {pricingModels.map((price) => (
                  <SelectItem key={price} value={price}>
                    <HugeiconsIcon icon={pricingModelIcons[price]} />
                    {pricingLabels[price]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field className="max-w-[220px]">
            <FieldLabel htmlFor="category-filter">Category:</FieldLabel>
            <Select value={category} onValueChange={handleCategoryChange}>
              <SelectTrigger id="category-filter">
                <HugeiconsIcon icon={categoryIcons[category]} />
                {categoryLabels[category]}
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  <HugeiconsIcon icon={GridViewIcon} />
                  All
                </SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    <HugeiconsIcon icon={categoryIcons[category]} />
                    {categoryLabels[category]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field className="max-w-[160]">
            <FieldLabel htmlFor="sort-filter">Sort:</FieldLabel>
            <Select value={sort} onValueChange={handleSortChange}>
              <SelectTrigger id="sort-filter">
                <HugeiconsIcon icon={sortOptionsIcon[sort]} />
                {sortOptionsLabel[sort]}
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((sortOption) => (
                  <SelectItem key={sortOption} value={sortOption}>
                    <HugeiconsIcon icon={sortOptionsIcon[sortOption]} />
                    {sortOptionsLabel[sortOption]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </div>
      </div>

      <ToolGrid
        pageParam={page}
        useQueryResults={useQueryResults}
        handlePageChange={handlePageChange}
        handleClearFilters={handleClearFilters}
      />
    </div>
  );
}
