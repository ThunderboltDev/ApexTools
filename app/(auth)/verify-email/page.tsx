import type { Metadata } from "next";
import { VerifyEmailForm } from "./verify-email";

export const metadata: Metadata = {
  title: "Verify Email",
  description: "Check your email for the magic link to sign in to your account",
};

export default function VerifyEmailPage() {
  return <VerifyEmailForm />;
}
