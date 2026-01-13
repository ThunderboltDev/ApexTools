"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { authClient } from "@/lib/auth/client";
import { normalizeCallbackUrl } from "@/lib/url";

export function LogoutForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [isLoggingOut, setIsLoggingOut] = useState(true);

  const callbackUrl = normalizeCallbackUrl(
    params.get("callbackUrl") ?? "/auth"
  );

  useEffect(() => {
    const handleLogout = async () => {
      try {
        await authClient.signOut();
        router.push(callbackUrl);
      } catch (error) {
        console.error("Logout error:", error);
        router.push(callbackUrl);
      } finally {
        setIsLoggingOut(false);
      }
    };

    handleLogout();
  }, [router, callbackUrl]);

  if (isLoggingOut) {
    return <LoadingScreen />;
  }

  return null;
}
