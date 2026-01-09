import type { PropsWithChildren } from "react";
import { Navbar } from "@/components/app/navbar";

export default function PublicLayout({ children }: PropsWithChildren) {
  return <Navbar>{children}</Navbar>;
}
