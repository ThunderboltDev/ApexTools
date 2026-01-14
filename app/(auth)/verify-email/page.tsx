import { ArrowLeft01Icon, Mail } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { Metadata } from "next";
import { Suspense } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LinkButton } from "@/components/ui/link-button";
import { LoadingScreen } from "@/components/ui/loading-screen";

export const metadata: Metadata = {
  title: "Verify Email",
  description: "Check your email for the magic link to sign in to your account",
  robots: { index: false, follow: false },
};

interface VerifyEmailPageProps {
  searchParams: { email?: string };
}

export default async function VerifyEmailPage({
  searchParams,
}: VerifyEmailPageProps) {
  const email = searchParams.email ?? "your email";
  return (
    <Suspense fallback={<LoadingScreen />}>
      <main className="flex h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl">Check your email</CardTitle>
            <CardDescription>
              We've sent a magic link to your email address
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="flex size-16 items-center justify-center rounded-full bg-accent/10">
                <HugeiconsIcon icon={Mail} className="size-8 text-accent" />
              </div>
              {email && (
                <div className="flex flex-col gap-2">
                  <p className="text-sm text-muted-foreground">
                    We sent a sign-in link to
                  </p>
                  <p className="text-base font-medium">{email}</p>
                </div>
              )}
              <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                <p>Click the link in the email to sign in to your account.</p>
                <p>The link will expire in 15 minutes.</p>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <LinkButton
                href="/auth"
                variant="outline"
                size="default"
                theme="default"
                className="w-full"
              >
                <HugeiconsIcon icon={ArrowLeft01Icon} />
                <span>Back to sign in</span>
              </LinkButton>
            </div>
          </CardContent>
        </Card>
      </main>
    </Suspense>
  );
}
