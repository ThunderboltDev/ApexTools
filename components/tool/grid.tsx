import {
  ArrowLeft01Icon,
  ArrowLeftDoubleIcon,
  ArrowRight01Icon,
  ArrowRightDoubleIcon,
  FilterResetIcon,
  SearchIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { UseQueryResult } from "@tanstack/react-query";
import type { TRPCClientErrorLike } from "@trpc/client";
import type { DefaultErrorShape } from "@trpc/server/unstable-core-do-not-import";
import type { ReactNode } from "react";
import { ToolCard } from "@/components/tool/card";
import { ToolCTACard } from "@/components/tool/cta-card";
import { SkeletonToolCard } from "@/components/tool/skeleton";
import { Button } from "@/components/ui/button";
import type {
  Category,
  PaginationOutput,
  PricingModel,
  SortOption,
  ToolWithUpvoteStatus,
} from "@/lib/types";

const getPageNumbers = (current: number, total: number) => {
  const range = 2;
  const start = Math.max(1, current - range);
  const end = Math.min(total, current + range);

  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
};

interface ToolGridProps {
  useQueryResults: UseQueryResult<
    {
      tools: ToolWithUpvoteStatus[];
      pagination: PaginationOutput;
    },
    TRPCClientErrorLike<{
      input: {
        category?: Category | undefined;
        pricing?: PricingModel | undefined;
        sort?: SortOption | undefined;
        page?: number | undefined;
        limit?: number | undefined;
        search?: string | undefined;
      };
      output: {
        tools: ToolWithUpvoteStatus[];
        pagination: PaginationOutput;
      };
      transformer: true;
      errorShape: DefaultErrorShape;
    }>
  >;
  pageParam: number;
  handlePageChange: (page: number) => void;
  handleClearFilters: () => void;
  children?: ReactNode;
}

export function ToolGrid({
  useQueryResults,
  pageParam,
  handlePageChange,
  handleClearFilters,
  children,
}: ToolGridProps) {
  const { isLoading, data } = useQueryResults;

  const totalPages = data
    ? Math.ceil(data.pagination.total / data.pagination.limit)
    : 1;

  const pages = getPageNumbers(pageParam, totalPages);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map(() => (
          <SkeletonToolCard key={crypto.randomUUID()} />
        ))}
      </div>
    );
  }

  const tools = data?.tools ?? [];

  const showCta = tools.length > 0 && tools.length % 3 !== 0;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
        {showCta && <ToolCTACard />}
      </div>

      {data?.tools.length === 0 &&
        (children || (
          <div className="text-center py-8 pb-20">
            <div className="inline-flex items-center size-12 justify-center rounded-full bg-muted mb-4">
              <HugeiconsIcon
                icon={SearchIcon}
                className="size-6 text-muted-foreground"
              />
            </div>
            <h3 className="text-lg font-semibold">No tools found</h3>
            <p className="text-muted-foreground mt-1">
              Try adjusting your search or filters
            </p>
            <div className="flex flex-row justify-center items-center gap-2 mt-3">
              <Button onClick={handleClearFilters}>
                <HugeiconsIcon icon={FilterResetIcon} />
                Clear all filters
              </Button>
            </div>
          </div>
        ))}

      {data?.pagination && data.pagination.total > data.pagination.limit && (
        <div className="flex items-center justify-center gap-1 mt-12">
          <Button
            size="icon"
            variant="outline"
            disabled={pageParam <= 1}
            onClick={() => handlePageChange(1)}
          >
            <HugeiconsIcon icon={ArrowLeftDoubleIcon} />
            <span className="sr-only">First Page</span>
          </Button>

          <Button
            size="icon"
            variant="outline"
            disabled={pageParam <= 1}
            onClick={() => handlePageChange(pageParam - 1)}
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} />
            <span className="sr-only">Previous Page</span>
          </Button>

          {pages.map((page) => (
            <Button
              key={page}
              size="icon"
              variant={page === pageParam ? "default" : "outline"}
              onClick={() => handlePageChange(page)}
            >
              {page}
              <span className="sr-only">Jump to page {page}</span>
            </Button>
          ))}

          <Button
            size="icon"
            variant="outline"
            disabled={!data.pagination.hasMore}
            onClick={() => handlePageChange(pageParam + 1)}
          >
            <HugeiconsIcon icon={ArrowRight01Icon} />
            <span className="sr-only">Next Page</span>
          </Button>

          <Button
            size="icon"
            variant="outline"
            disabled={!data.pagination.hasMore}
            onClick={() => handlePageChange(totalPages)}
          >
            <HugeiconsIcon icon={ArrowRightDoubleIcon} />
            <span className="sr-only">Last Page</span>
          </Button>
        </div>
      )}
    </>
  );
}
