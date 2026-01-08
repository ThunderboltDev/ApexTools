import type { PropsWithChildren } from "react";
import { cn } from "@/lib/utils";

interface PageProps extends PropsWithChildren {
  className?: string;
}

export function PageWrapper({ children, className }: PageProps) {
  return (
    <div className={cn(className, "wrapper-xl pt-4 pb-8")}>{children}</div>
  );
}

export function PageHeader({ children, className }: PageProps) {
  return <div className={cn(className, "my-4 space-y-2")}>{children}</div>;
}

export function PageTitle({ children, className }: PageProps) {
  return <h1 className={cn("mb-0", className)}>{children}</h1>;
}

export function PageDescription({ children, className }: PageProps) {
  return (
    <p className={cn(className, "text-muted-foreground md:text-sm")}>
      {children}
    </p>
  );
}

export function PageContent({ children, className }: PageProps) {
  return <div className={cn(className, "mt-6")}>{children}</div>;
}
