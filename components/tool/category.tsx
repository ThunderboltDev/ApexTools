import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { categoryLabels } from "@/lib/constants";
import type { Category } from "@/lib/types";

interface CategoryBadgeProps {
  category: Category;
}

export function CategoryBadge({ category }: CategoryBadgeProps) {
  return (
    <Link href={`/${category}`}>
      <Badge variant="secondary">{categoryLabels[category]}</Badge>
    </Link>
  );
}
