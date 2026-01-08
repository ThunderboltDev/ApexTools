import { Plus } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { LinkButton } from "@/components/ui/link-button";

interface SubmitToolButtonProps {
  className?: string;
}

export function SubmitToolButton({ className }: SubmitToolButtonProps) {
  return (
    <LinkButton theme="accent" href="/submit" className={className}>
      <HugeiconsIcon icon={Plus} />
      Submit Tool
    </LinkButton>
  );
}
