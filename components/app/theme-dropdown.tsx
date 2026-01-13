"use client";

import { Monitor, Moon, Sun } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";

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

export function ThemeDropdown() {
  const { theme, setTheme } = useTheme();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const currentTheme =
    (theme as "system" | "light" | "dark" | undefined) ?? "system";

  return (
    <Select
      value={currentTheme}
      onValueChange={(value: string) => setTheme(value)}
    >
      <SelectTrigger id="theme-dropdown" className="w-fit">
        {config[currentTheme].icon}
        {config[currentTheme].name}
      </SelectTrigger>
      <SelectContent className="min-w-0 w-36">
        <SelectItem value="light">
          {config.light.icon}
          {config.light.name}
        </SelectItem>
        <SelectItem value="dark">
          {config.dark.icon}
          {config.dark.name}
        </SelectItem>
        <SelectItem value="system">
          {config.system.icon}
          {config.system.name}
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
