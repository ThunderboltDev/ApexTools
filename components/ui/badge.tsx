import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex w-fit border-0 shrink-0 items-center justify-center gap-1 overflow-hidden whitespace-nowrap rounded-full font-medium transition-[color,box-shadow] aria-invalid:border-danger [&>svg]:pointer-events-none",
  {
    variants: {
      variant: {
        default: "bg-secondary text-secondary-foreground",
        secondary: "bg-muted text-secondary-foreground",
        accent: "bg-accent text-white",
        success: "bg-success text-white",
        warning: "bg-warning text-white",
        danger: "bg-danger text-white",
        info: "bg-info text-white",
        outline: "border text-foreground",
      },
      size: {
        default: "px-2 py-0.5 text-[13px] [&>svg]:size-3.5",
      },
    },
    defaultVariants: {
      variant: "accent",
      size: "default",
    },
  }
);

function Badge({
  className,
  variant = "default",
  render,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ className, variant })),
      },
      props
    ),
    render,
    state: {
      slot: "badge",
      variant,
    },
  });
}

export { Badge, badgeVariants };
