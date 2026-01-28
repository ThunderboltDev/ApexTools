import Link from "next/link";
import type { ComponentProps } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ButtonLinkProps = ComponentProps<typeof Link> &
  ComponentProps<typeof Button> & {
    buttonClassName?: string;
  };

function LinkButton({
  buttonClassName,
  className,
  onClick,
  ...props
}: ButtonLinkProps) {
  return (
    <Button
      nativeButton={false}
      className={buttonClassName}
      render={<Link className={cn("no-underline", className)} {...props} />}
      onClick={onClick}
      {...props}
    />
  );
}

export { LinkButton };
