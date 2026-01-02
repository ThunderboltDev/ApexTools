"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Monitor, Moon, Sun } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useTheme } from "next-themes";

const config = {
  light: {
    icon: <HugeiconsIcon icon={Sun} />,
    name: "Light",
  },
  dark: {
    icon: <HugeiconsIcon icon={Moon} />,
    name: "Dark",
  },
  system: {
    icon: <HugeiconsIcon icon={Monitor} />,
    name: "System",
  },
};

export function ThemeSelector() {
  const { theme, setTheme } = useTheme();

  return (
    <Select value={theme} onValueChange={(v) => v && setTheme(v)}>
      <SelectTrigger className="border border-border w-fit">
        <div className="flex items-center gap-2">
          <SelectValue />
        </div>
      </SelectTrigger>

      <SelectContent
        className="bg-secondary"
        // position="si"
        align="start"
        side="top"
      >
        <SelectItem className="focus:bg-muted" value="light">
          <div className="flex items-center gap-2">
            {config.light.icon}
            {config.light.name}
          </div>
        </SelectItem>

        <SelectItem className="focus:bg-muted" value="dark">
          <div className="flex items-center gap-2">
            {config.dark.icon}
            {config.dark.name}
          </div>
        </SelectItem>

        <SelectItem className="focus:bg-muted" value="system">
          <div className="flex items-center gap-2">
            {config.system.icon}
            {config.system.name}
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
