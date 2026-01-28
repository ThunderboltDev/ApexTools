"use client";

import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useCallback, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  label?: string;
  placeholder?: string;
  maxTags?: number;
  disabled?: boolean;
  className?: string;
}

export function TagInput({
  value,
  onChange,
  label,
  placeholder = "Add a tag and press Enter...",
  maxTags = 10,
  disabled = false,
  className,
}: TagInputProps) {
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" || e.key === ",") {
        e.preventDefault();
        const tag = inputValue.trim().toLowerCase();

        if (tag && !value.includes(tag) && value.length < maxTags) {
          onChange([...value, tag]);
          setInputValue("");
        }
      } else if (e.key === "Backspace" && !inputValue && value.length > 0) {
        onChange(value.slice(0, -1));
      }
    },
    [inputValue, value, onChange, maxTags]
  );

  const handleRemove = useCallback(
    (tagToRemove: string) => {
      onChange(value.filter((tag) => tag !== tagToRemove));
    },
    [value, onChange]
  );

  return (
    <div className={cn("space-y-2", className)}>
      {label && <Label>{label}</Label>}
      <div className="space-y-2">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled || value.length >= maxTags}
        />
        <div className="flex flex-wrap gap-2">
          {value.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="gap-1 pl-2 pr-1 py-1"
            >
              {tag}
              <Button
                type="button"
                variant="transparent"
                size="icon"
                disabled={disabled}
                onClick={() => handleRemove(tag)}
                className="size-4 p-0 hover:bg-destructive/20"
              >
                <HugeiconsIcon
                  icon={Cancel01Icon}
                  className="size-3 text-muted-foreground"
                />
              </Button>
            </Badge>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          {value.length} / {maxTags} tags. Press Enter or comma to add.
        </p>
      </div>
    </div>
  );
}
