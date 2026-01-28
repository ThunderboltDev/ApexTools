"use client";

import { ChevronDown } from "@hugeicons/core-free-icons";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";

interface MultiSelectOption {
  value: string;
  label: string;
  icon?: IconSvgElement;
}

interface MultiSelectProps {
  options: MultiSelectOption[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  disabled?: boolean;
  className?: string;
}

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = "Select items...",
  searchPlaceholder = "Search...",
  emptyMessage = "No items found.",
  disabled = false,
  className,
}: MultiSelectProps) {
  const [open, setOpen] = useState(false);

  const handleSelect = useCallback(
    (value: string) => {
      if (selected.includes(value)) {
        onChange(selected.filter((v) => v !== value));
      } else {
        onChange([...selected, value]);
      }
    },
    [selected, onChange]
  );

  const selectedLabels = selected
    .map((value) => options.find((opt) => opt.value === value)?.label)
    .filter(Boolean)
    .join(", ");

  return (
    <div className={cn("relative w-full min-w-0", className)}>
      <Button
        type="button"
        variant="outline"
        role="combobox"
        aria-expanded={open}
        disabled={disabled}
        onClick={() => setOpen(!open)}
        className={cn(
          "text-secondary-foreground text-responsive! w-full max-w-full grid grid-cols-[1fr_auto] gap-2 items-center px-6 overflow-hidden min-w-0 shrink",
          className
        )}
      >
        <span
          className={cn(
            "min-w-0 truncate text-left",
            selected.length > 0
              ? "text-secondary-foreground"
              : "text-muted-foreground"
          )}
        >
          {selected.length > 0 ? selectedLabels : placeholder}
        </span>
        <HugeiconsIcon
          className="text-muted-foreground shrink-0"
          icon={ChevronDown}
        />
      </Button>

      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-md border border-border bg-background shadow-lg">
          <Command>
            <CommandInput placeholder={searchPlaceholder} />
            <CommandList>
              <CommandEmpty>{emptyMessage}</CommandEmpty>
              <CommandGroup>
                {options.map((option) => {
                  const isSelected = selected.includes(option.value);
                  return (
                    <CommandItem
                      key={option.value}
                      value={option.value}
                      onSelect={() => handleSelect(option.value)}
                      aria-checked={isSelected}
                      data-checked={isSelected}
                    >
                      {option.icon && (
                        <HugeiconsIcon icon={option.icon} className="size-4" />
                      )}
                      {option.label}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </div>
      )}
      {open && (
        <button
          type="button"
          className="fixed inset-0 z-40 cursor-default"
          onClick={() => setOpen(false)}
          onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
          aria-label="Close dropdown"
        />
      )}
    </div>
  );
}
