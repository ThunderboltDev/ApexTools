"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Mail } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormContent,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormSubmitError,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { config } from "@/config";
import { ANALYTICS_EVENTS, trackEvent } from "@/lib/analytics";
import { authClient } from "@/lib/auth/client";
import { normalizeCallbackUrl } from "@/lib/url";

const formSchema = z.object({
  email: z.email("Please enter a valid email!"),
});

type FormValues = z.infer<typeof formSchema>;

type LoadingState = "google" | "github" | "magic-link" | false;

export function AuthForm() {
  const [loadingState, setLoadingState] = useState<LoadingState>(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const params = useSearchParams();

  const callbackUrl = decodeURIComponent(
    normalizeCallbackUrl(params.get("callbackUrl"))
  );

  const email = params.get("email") ?? "";
  const errorCode = params.get("error");

  useEffect(() => {
    if (errorCode) {
      setError(`Something went horribly wrong! Error Code: ${errorCode}`);
    }
  }, [errorCode]);

  const form = useForm<FormValues>({
    mode: "onSubmit",
    resolver: zodResolver(formSchema),
    defaultValues: {
      email,
    },
  });

  const handleSubmit = async ({ email }: FormValues) => {
    setError(null);
    setLoadingState("magic-link");

    trackEvent(ANALYTICS_EVENTS.AUTH.LOGIN_ATTEMPT, { provider: "email" });

    try {
      const result = await authClient.signIn.magicLink({
        email,
        callbackURL: callbackUrl,
      });

      if (result?.error) {
        trackEvent(ANALYTICS_EVENTS.AUTH.FAILED, {
          provider: "email",
          error: result.error.message,
          reason: "email_signin_error",
        });

        setError(
          result.error.message ??
            "Unable to authenticate right now. Please try again later!"
        );
      } else {
        router.push(`/verify-email?email=${encodeURIComponent(email)}`);
      }
    } catch (error) {
      trackEvent(ANALYTICS_EVENTS.AUTH.FAILED, {
        provider: "email",
        error: "unknown",
        reason: "unexpected_error",
      });

      console.error("signIn error:", error);
      setError("Something went wrong! Please try again later.");
    } finally {
      setLoadingState(false);
    }
  };

  const handleOAuth = async (provider: "google" | "github") => {
    setError(null);
    setLoadingState(provider);

    trackEvent(ANALYTICS_EVENTS.AUTH.LOGIN_ATTEMPT, { provider });

    try {
      await authClient.signIn.social({ provider, callbackURL: callbackUrl });
    } catch (error) {
      trackEvent(ANALYTICS_EVENTS.AUTH.FAILED, {
        provider,
        error: String(error),
        reason: "oauth_failure",
      });

      console.error(error);
      setError("Something went wrong! Please try again later");
    } finally {
      setLoadingState(false);
    }
  };

  return (
    <main className="flex h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Sign In</CardTitle>
          <CardDescription>
            Sign in to your {config.name} account to continue
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <FormSubmitError>{error}</FormSubmitError>
          <div className="flex flex-col gap-3">
            <Button
              variant="outline"
              size="default"
              theme="default"
              className="w-full"
              onClick={() => handleOAuth("google")}
              disabled={!!loadingState}
              aria-busy={loadingState === "magic-link"}
            >
              {loadingState === "google" ? (
                <Spinner />
              ) : (
                <svg
                  role="img"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <title>Google</title>
                  <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
                </svg>
              )}
              <span>Continue with Google</span>
            </Button>

            <Button
              variant="outline"
              size="default"
              theme="default"
              className="w-full"
              onClick={() => handleOAuth("github")}
              disabled={!!loadingState}
              aria-busy={loadingState === "magic-link"}
            >
              {loadingState === "github" ? (
                <Spinner />
              ) : (
                <svg
                  role="img"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <title>GitHub</title>
                  <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                </svg>
              )}
              <span>Continue with GitHub</span>
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-secondary px-2 text-muted-foreground">
                Or continue with email
              </span>
            </div>
          </div>

          <Form {...form}>
            <form
              className="flex flex-col gap-4"
              onSubmit={(e) => {
                e.preventDefault();
                form.handleSubmit(handleSubmit)();
              }}
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormContent>
                      <Input
                        type="email"
                        autoComplete="email"
                        placeholder="you@example.com"
                        aria-invalid={fieldState.invalid}
                        disabled={!!loadingState}
                        required
                        {...field}
                      />
                      <FormDescription>
                        We'll send you a magic link to sign in
                      </FormDescription>
                    </FormContent>
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                size="default"
                theme="accent"
                className="w-full"
                disabled={!!loadingState}
                aria-busy={loadingState === "magic-link"}
              >
                {loadingState === "magic-link" ? (
                  <>
                    <Spinner />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <HugeiconsIcon icon={Mail} />
                    <span>Send Magic Link</span>
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </main>
  );
}
