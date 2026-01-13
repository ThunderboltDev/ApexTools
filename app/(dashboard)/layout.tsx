"use client";

import { usePathname, useRouter } from "next/navigation";
import { type PropsWithChildren, useEffect } from "react";
import { Navbar } from "@/components/app/navbar";
import { LoadingScreen } from "@/components/ui/loading-screen";

import { useAuth } from "@/lib/auth/context";

export default function DashboardLayout({
  children,
}: Readonly<PropsWithChildren>) {
  const { user, isLoading } = useAuth();

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push(`/auth?callbackUrl=${encodeURIComponent(pathname)}`);
    }
  }, [user, isLoading, router, pathname]);

  if (isLoading || !user) {
    return <LoadingScreen />;
  }

  return <Navbar>{children}</Navbar>;
}
