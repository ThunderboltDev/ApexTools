import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { PropsWithChildren } from "react";
import { Navbar } from "@/components/app/navbar";
import { auth } from "@/lib/auth";
import { normalizeCallbackUrl } from "@/lib/url";

export default async function DashboardLayout({
  children,
}: Readonly<PropsWithChildren>) {
  const headersList = await headers();

  const session = await auth.api.getSession({
    headers: headersList,
  });

  if (!session) {
    redirect(
      `/auth?callbackUrl=${normalizeCallbackUrl(headersList.get("x-pathname"))}`
    );
  }

  return <Navbar>{children}</Navbar>;
}
