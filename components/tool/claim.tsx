"use client";

import {
  Key01Icon,
  ShieldKeyIcon,
  UserAdd01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { CopyField } from "@/components/ui/copy-field";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LinkButton } from "@/components/ui/link-button";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth/client";
import { getDomain } from "@/lib/domain-verification";
import type { Tool } from "@/lib/types";
import { trpc } from "@/trpc/provider";

export function ClaimTool({ tool }: { tool: Tool }) {
  const [open, setOpen] = useState(false);

  const utils = trpc.useUtils();
  const { data: session } = authClient.useSession();

  const { mutate: claimTool, isPending: isClaiming } =
    trpc.tool.claim.useMutation({
      onSuccess: ({ message }) => {
        utils.tool.getBySlug.invalidate({ slug: tool.slug });
        toast.success(message);
        setOpen(false);
      },
      onError: ({ message }) => {
        toast.error(message);
      },
    });

  if (session?.user?.id === tool.userId) {
    return null;
  }

  const domain = getDomain(tool.url);
  const isAuthenticated = !!session?.user;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="outline" />}>
        <HugeiconsIcon icon={Key01Icon} />
        Claim Tool
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {!isAuthenticated ? "Sign in Required" : "Claim Tool"}
          </DialogTitle>
          <DialogDescription>
            {!isAuthenticated ?
              <>
                ou need to be signed in to claim a tool. Create an account or
                log in to an existing account.
              </>
            : <>
                Verify domain ownership of{" "}
                <span className="text-secondary-foreground font-semibold">
                  {domain}
                </span>{" "}
                to claim this tool.
              </>
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {!isAuthenticated ?
            <>
              <p className="text-sm text-muted-foreground">
                Please sign in to your account to verify domain ownership and
                manage this tool listing.
              </p>
              <LinkButton theme="info" href="/auth">
                <HugeiconsIcon icon={UserAdd01Icon} />
                Sign In
              </LinkButton>
            </>
          : <>
              <p className="text-sm text-muted-foreground">
                Add a new TXT record at your DNS provider.
              </p>

              <CopyField
                label="Host"
                value={`_apex-verify.${getDomain(tool.url)}`}
              />
              <CopyField label="Value" value={tool.verificationCode} />

              <Button
                theme="success"
                onClick={() => claimTool({ toolId: tool.id })}
                disabled={isClaiming}
                aria-disabled={isClaiming}
                className="flex ml-auto"
              >
                {isClaiming ?
                  <>
                    <Spinner /> Verifying...
                  </>
                : <>
                    <HugeiconsIcon icon={ShieldKeyIcon} />
                    Verify Domain
                  </>
                }
              </Button>
            </>
          }
        </div>
      </DialogContent>
    </Dialog>
  );
}
