import type { Metadata } from "next";
import { LogoutForm } from "./logout";

export const metadata: Metadata = {
  title: "Sign Out",
  description: "Sign out of your account",
};

export default function LogoutPage() {
  return <LogoutForm />;
}
