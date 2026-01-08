import { SubmitForm } from "@/app/(dashboard)/submit/form";
import {
  PageContent,
  PageDescription,
  PageHeader,
  PageTitle,
} from "@/components/ui/page";

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
