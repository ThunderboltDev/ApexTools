"use client";

import { SearchIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { keepPreviousData } from "@tanstack/react-query";
import { motion } from "framer-motion";
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
import { Input } from "@/components/ui/input";
import { trackFilterApplied } from "@/lib/analytics";
import {
  sortOptions,
  sortOptionsIcon,
  sortOptionsLabel,
} from "@/lib/constants";
import type { Category, SortOption } from "@/lib/types";
import { cn } from "@/lib/utils";
import { trpc } from "@/trpc/provider";

const options = [
  {
    value: "hot",
    label: sortOptionsLabel.hot,
    icon: <HugeiconsIcon icon={sortOptionsIcon.hot} className="size-4" />,
  },
  {
    value: "trending",
    label: sortOptionsLabel.trending,
    icon: <HugeiconsIcon icon={sortOptionsIcon.trending} className="size-4" />,
  },
  {
    value: "latest",
    label: sortOptionsLabel.latest,
    icon: <HugeiconsIcon icon={sortOptionsIcon.latest} className="size-4" />,
  },
] as const;

interface DirectoryClientProps {
  category?: Category;
}

export function DirectoryClient({ category }: DirectoryClientProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [params, setParams] = useQueryStates({
    page: parseAsInteger.withDefault(1),
    search: parseAsString.withDefault(""),
    sort: parseAsStringEnum([...sortOptions]).withDefault("hot"),
  });

  const { page, search, sort } = params;

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
      category: category,
      sort: sort,
    },
    {
      placeholderData: keepPreviousData,
    }
  );

  const handleSort = (sort: SortOption) => {
    setParams({ sort, page: 1 });
    trackFilterApplied("sort", sort);
  };

  const handlePageChange = (newPage: number) => {
    setParams({ page: newPage });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleClearFilters = () => {
    setParams({
      search: "",
      page: 1,
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 max-w-lg mx-auto">
        <div className="flex flex-col md:flex-row gap-4">
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
              className="pl-9 rounded-full"
            />
          </div>
        </div>

        <div className="relative inline-flex w-fit mx-auto rounded-full border bg-secondary p-1">
          {options.map((option) => {
            const isActive = sort === option.value;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSort(option.value)}
                className={cn(
                  "relative z-10 flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition-colors cursor-pointer text-muted-foreground hover:text-secondary-foreground",
                  { "text-white hover:text-white": isActive }
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-sort-pill"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    className="absolute inset-0 z-[-1] rounded-full bg-accent"
                  />
                )}

                {option.icon}
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      <ToolGrid
        pageParam={page}
        handlePageChange={handlePageChange}
        useQueryResults={useQueryResults}
        handleClearFilters={handleClearFilters}
      />
    </div>
  );
}
