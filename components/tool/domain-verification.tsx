"use client";

import { ShieldKeyIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { CopyField } from "@/components/ui/copy-field";
import { FormSection } from "@/components/ui/form-section";
import { Spinner } from "@/components/ui/spinner";
import { getDomain } from "@/lib/domain-verification";
import type { Tool } from "@/lib/types";
import { trpc } from "@/trpc/provider";

export function DomainVerification({ tool }: { tool: Tool }) {
  const utils = trpc.useUtils();

  const { mutate: verify, isPending: isVerifying } =
    trpc.tool.verify.useMutation({
      onSuccess: ({ message }) => {
        utils.tool.getBySlug.invalidate({ slug: tool.slug });
        toast.success("Tool verified!", {
          description: message,
        });
      },
      onError: ({ message }) => {
        toast.error("Verification failed", {
          description: message,
        });
      },
    });

  if (tool.verifiedAt) {
    return (
      <FormSection
        title="Domain Verification"
        description="Verified domain builds more trust with visitors"
      >
        <div id="domain-verification" className="flex items-center gap-3 py-2">
          <div className="flex size-10 items-center justify-center rounded-full bg-success/10 text-success">
            <HugeiconsIcon icon={ShieldKeyIcon} className="size-6" />
          </div>

          <div className="space-y-0.5">
            <p className="font-medium leading-none">{getDomain(tool.url)}</p>
            <p className="text-sm text-muted-foreground">
              Verified on{" "}
              {new Date(tool.verifiedAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
        </div>
      </FormSection>
    );
  }

  return (
    <FormSection
      title="Domain Verification"
      description="Verified domain builds more trust with visitors"
    >
      <p className="text-sm text-muted-foreground">
        Add a new TXT record at your DNS provider.
      </p>

      <CopyField label="Host" value={`_apex-verify.${getDomain(tool.url)}`} />
      <CopyField label="Value" value={tool.verificationCode} />

      <Button
        theme="success"
        onClick={() => verify({ toolId: tool.id })}
        disabled={isVerifying}
        className="flex ml-auto"
      >
        {isVerifying ?
          <>
            <Spinner /> Verifying...
          </>
        : <>
            <HugeiconsIcon icon={ShieldKeyIcon} />
            Verify Domain
          </>
        }
      </Button>
    </FormSection>
  );
}
