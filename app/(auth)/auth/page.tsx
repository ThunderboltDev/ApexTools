import type { Metadata } from "next";
import { AuthForm } from "./auth-form";

export const metadata: Metadata = {
  title: "Sign In",
  description:
    "Sign in to your account on ApexAura using Google, GitHub or Email.",
};

export default function AuthPage() {
  return <AuthForm />;
}
