import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { auth } from "@/lib/auth";
import { normalizeCallbackUrl } from "@/lib/url";
import { AuthForm } from "./client";

export const metadata: Metadata = {
  title: "Sign In",
  description:
    "Sign in to your account on ApexTools using Google, GitHub or Email.",
};

interface AuthPageProps {
  searchParams: Promise<{ callbackUrl?: string }>;
}

export default async function AuthPage({ searchParams }: AuthPageProps) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    const { callbackUrl } = await searchParams;
    redirect(`/auth?callbackUrl=${normalizeCallbackUrl(callbackUrl)}`);
  }

  return (
    <Suspense fallback={<LoadingScreen />}>
      <AuthForm />
    </Suspense>
  );
}
