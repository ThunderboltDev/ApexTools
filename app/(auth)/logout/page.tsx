import type { Metadata } from "next";
import { Suspense } from "react";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { LogoutForm } from "./logout";

export const metadata: Metadata = {
  title: "Sign Out",
  description: "Sign out of your account",
};

export default function LogoutPage() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <main>
        <LogoutForm />
      </main>
    </Suspense>
  );
}
