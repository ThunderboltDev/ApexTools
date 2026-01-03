"use client";

import { MotionConfig } from "framer-motion";
import { ThemeProvider, useTheme } from "next-themes";
import { type ReactNode, useEffect } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { Toaster } from "@/components/ui/sonner";
import { captureUtms } from "@/lib/analytics";
import { TRPCProvider } from "@/trpc/trpc";

// if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
//   throw new Error("env variable NEXT_PUBLIC_CONVEX_URL is missing");
// }

type ProvidersProps = {
  children: ReactNode;
  // session: Session | null;
};

export function Providers({ children }: ProvidersProps) {
  useEffect(() => {
    captureUtms();
  }, []);

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      enableColorScheme
    >
      <MotionConfig reducedMotion="user">
        <ThemeHotkeys />
        <Toaster />
        <TRPCProvider>{children}</TRPCProvider>
      </MotionConfig>
    </ThemeProvider>
  );
}

function ThemeHotkeys() {
  const { theme, setTheme } = useTheme();

  useHotkeys("l", () => {
    setTheme(theme === "dark" ? "light" : "dark");
  });

  return null;
}
