import type { Metadata } from "next";
import { Suspense } from "react";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { VerifyEmailForm } from "./verify-email";

export const metadata: Metadata = {
  title: "Verify Email",
  description: "Check your email for the magic link to sign in to your account",
  robots: { index: false, follow: false },
};

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <VerifyEmailForm />
    </Suspense>
  );
}
