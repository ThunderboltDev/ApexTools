import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import { format } from "date-fns";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

export function DetailGrid({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-4 text-base md:text-sm xs:grid-cols-2",
        className
      )}
      {...props}
    />
  );
}

type DetailRowProps = ComponentProps<"div"> &
  ComponentProps<typeof DetailValue> & {
    label: string;
    icon: IconSvgElement;
  };

export function DetailRow({
  icon,
  label,
  value,
  dateFormat,
  children,
}: DetailRowProps) {
  return (
    <DetailItem>
      <DetailLabel>
        <HugeiconsIcon icon={icon} />
        {label}
      </DetailLabel>
      <DetailValue dateFormat={dateFormat} value={children ?? value} />
    </DetailItem>
  );
}

export function DetailItem({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("space-y-1", className)} {...props} />;
}

export function DetailLabel({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "text-sm font-medium text-muted-foreground flex items-center gap-1 [&>svg]:size-4 [&>svg]:-translate-y-px",
        className
      )}
      {...props}
    />
  );
}

type DetailValueProps = ComponentProps<"span"> & {
  dateFormat?: "short" | "long";
  value: ReactNode | Date;
};

export function DetailValue({
  className,
  dateFormat,
  children,
  value,
  ...props
}: DetailValueProps) {
  if (value instanceof Date) {
    value = format(value, dateFormat === "long" ? "PPp" : "PP");
  }

  return (
    <span className={cn("font-medium text-base", className)} {...props}>
      {children ?? value}
    </span>
  );
}
