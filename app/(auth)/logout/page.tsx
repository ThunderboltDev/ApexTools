import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { normalizeCallbackUrl } from "@/lib/url";

export const metadata: Metadata = {
  title: "Sign Out",
  description: "Sign out of your account",
  robots: { index: false, follow: false },
};

interface LogoutPageProps {
  searchParams: { callbackUrl?: string };
}
export default async function LogoutPage({ searchParams }: LogoutPageProps) {
  await auth.api.signOut({
    headers: await headers(),
  });

  redirect(
    `/auth?callbackUrl=${normalizeCallbackUrl(searchParams.callbackUrl)}`
  );
}
