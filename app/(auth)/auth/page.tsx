import type { Metadata } from "next";
import { Suspense } from "react";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { AuthForm } from "./auth-form";

export const metadata: Metadata = {
  title: "Sign In",
  description:
    "Sign in to your account on ApexTools using Google, GitHub or Email.",
};

export default function AuthPage() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <AuthForm />
    </Suspense>
  );
}
