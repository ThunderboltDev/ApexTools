"use client";

import { Copy01Icon, Tick02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useCopyToClipboard } from "react-use";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface CopyFieldProps {
  label: string;
  value: string;
  helperText?: string;
  className?: string;
}

export function CopyField({
  label,
  value,
  helperText,
  className,
}: CopyFieldProps) {
  const [copyState, copy] = useCopyToClipboard();

  const handleCopy = () => {
    copy(value);
    toast.success(`Copied ${label} to clipboard`);
  };

  return (
    <div className={cn("space-y-1", className)}>
      <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </Label>

      <div className="relative group flex items-center rounded-md border bg-background px-3 py-1 font-mono text-sm">
        <span className="flex-1 truncate">{value}</span>
        <Button
          size="icon"
          variant="transparent"
          className="size-7 group-hover:opacity-100 opacity-0"
          onClick={handleCopy}
        >
          <HugeiconsIcon
            icon={copyState.value ? Tick02Icon : Copy01Icon}
            className={cn(
              "size-4",
              copyState.value ? "text-success-foreground" : ""
            )}
          />
          <span className="sr-only">{copyState.value ? "Copied" : "Copy"}</span>
        </Button>
      </div>

      {helperText && (
        <p className="text-xs text-muted-foreground">{helperText}</p>
      )}
    </div>
  );
}
