import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface StatCardProps {
  title: string;
  value: number | string | undefined;
  icon: IconSvgElement;
}

export function StatCard({ title, value, icon }: StatCardProps) {
  const displayValue =
    typeof value === "number" ? value.toLocaleString() : value;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground uppercase">
          {title}
        </CardTitle>
        <HugeiconsIcon icon={icon} className="size-6 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {value === undefined ? (
          <Skeleton className="h-8 w-16" />
        ) : (
          <div className="text-2xl font-bold">{displayValue ?? 0}</div>
        )}
      </CardContent>
    </Card>
  );
}
