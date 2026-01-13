import type { Metadata } from "next";
import { SubmitForm } from "@/app/(dashboard)/submit/form";
import {
  PageContent,
  PageDescription,
  PageHeader,
  PageTitle,
} from "@/components/ui/page";

export const metadata: Metadata = {
  title: "Submit Tool",
  description: "Submit your AI tool to the ApexTools directory.",
  robots: { index: false, follow: false },
};

export default function SubmitToolPage() {
  return (
    <>
      <PageHeader>
        <PageTitle>Create your tool</PageTitle>
        <PageDescription>
          Share your AI product with the community.
        </PageDescription>
      </PageHeader>
      <PageContent></PageContent>
      <SubmitForm />
    </>
  );
}
