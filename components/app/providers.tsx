"use client";

import { MotionConfig } from "framer-motion";
import { ThemeProvider, useTheme } from "next-themes";
import { type ReactNode, useEffect } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { Toaster } from "@/components/ui/sonner";
import { captureUtms } from "@/lib/analytics";
import { AuthProvider } from "@/lib/auth/context";
import { TRPCProvider } from "@/trpc/provider";

type ProvidersProps = {
  children: ReactNode;
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
        <TRPCProvider>
          <AuthProvider>{children}</AuthProvider>
        </TRPCProvider>
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
