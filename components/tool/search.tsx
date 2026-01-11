"use client";

import { Search01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  CommandDialog,
  CommandEmpty,
  CommandInput,
  CommandList,
} from "@/components/ui/command";

export function Search() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      <div className="relative w-full max-w-2xl mx-auto">
        <div
          className="relative flex items-center w-full h-14 rounded-full border border-white/10 bg-white/5 px-4 backdrop-blur-md transition-all hover:bg-white/10 hover:border-primary/50 group"
          // onClick={() => setOpen(true)}
        >
          <HugeiconsIcon
            icon={Search01Icon}
            className="mr-3 h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors"
          />
          <span className="text-muted-foreground text-lg group-hover:text-white transition-colors">
            Search tools...
          </span>
          <div className="absolute right-4 flex items-center gap-1">
            <kbd className="pointer-events-none inline-flex h-6 select-none items-center gap-1 rounded border border-white/10 bg-white/5 px-2 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
              <span className="text-xs">⌘</span>K
            </kbd>
          </div>
        </div>

        {/* Auto-suggest tags below */}
        <div className="flex flex-wrap justify-center gap-2 mt-4">
          {["Chat", "Image", "Video", "Code", "Marketing"].map((tag) => (
            <Badge
              key={tag}
              variant="outline"
              className="cursor-pointer border-white/10 bg-white/5 hover:bg-primary/20 hover:text-primary hover:border-primary/50 transition-all"
              onClick={() => {
                setOpen(true);
                // In a real app, this would pre-fill the search
              }}
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
        </CommandList>
      </CommandDialog>
    </>
  );
}
