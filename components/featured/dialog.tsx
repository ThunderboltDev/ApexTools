"use client";

import {
  CreditCard,
  CrownIcon,
  ShieldKeyIcon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LinkButton } from "@/components/ui/link-button";
import { Spinner } from "@/components/ui/spinner";
import { products } from "@/config";
import { cn } from "@/lib/utils";
import { trpc } from "@/trpc/provider";

interface FeaturedPurchaseModalProps {
  toolSlug: string;
  toolName: string;
  isVerified: boolean;
  currentFeaturedUntil?: Date | null;
}

type Duration = "7" | "28";

export function FeaturedToolPurchaseDialog({
  toolSlug,
  toolName,
  isVerified,
  currentFeaturedUntil,
}: FeaturedPurchaseModalProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState<Duration>("28");

  const { mutateAsync: createCheckoutSession, isPending } =
    trpc.billing.createCheckoutSession.useMutation({
      onSuccess: (data) => {
        if (data.checkoutUrl) {
          router.push(data.checkoutUrl);
        } else {
          toast.error("Failed to create checkout session");
        }
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  const isAlreadyFeatured =
    currentFeaturedUntil && new Date(currentFeaturedUntil) > new Date();

  const handleCheckout = async () => {
    await createCheckoutSession({
      toolSlug,
      duration: selectedDuration,
    });
  };

  const getNewEndDate = () => {
    const startDate = isAlreadyFeatured
      ? new Date(currentFeaturedUntil)
      : new Date();
    const days = selectedDuration === "7" ? 7 : 28;
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + days);
    return endDate;
  };

  if (!isVerified) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger render={<Button theme="gold" variant="outline" />}>
          <HugeiconsIcon icon={CrownIcon} />
          Boost Visibility
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Domain Verification Required</DialogTitle>
            <DialogDescription>
              Only verified tools can be featured. Please verify your domain
              first to unlock this feature.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <LinkButton
              href={`/tools/${toolSlug}/edit#domain-verification`}
              theme="success"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              <HugeiconsIcon icon={ShieldKeyIcon} />
              Verify Domain
            </LinkButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button theme="gold" variant="outline" />}>
        <HugeiconsIcon icon={CrownIcon} />
        {isAlreadyFeatured ? "Extend Duration" : "Boost Visibility"}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <HugeiconsIcon icon={CrownIcon} className="size-5 text-gold" />
            {isAlreadyFeatured
              ? "Extend Featured Duration"
              : "Boost Visibility"}
          </DialogTitle>
          <DialogDescription>
            {isAlreadyFeatured ? (
              <>
                <span className="text-secondary-foreground font-semibold">
                  {toolName}
                </span>{" "}
                is currently featured until{" "}
                {format(new Date(currentFeaturedUntil), "MMMM d, yyyy")}. Extend
                to keep the benefits.
              </>
            ) : (
              <>
                <span className="text-secondary-foreground font-semibold">
                  {toolName}
                </span>{" "}
                is not featured. Boost its visibility to get more users.
              </>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm font-semibold">Benefits:</p>
            <ul className="text-sm text-secondary-foreground space-y-1.5">
              <li className="flex items-center gap-2">
                <HugeiconsIcon
                  icon={Tick02Icon}
                  className="size-4 text-success"
                />
                Appear first in all search results
              </li>
              <li className="flex items-center gap-2">
                <HugeiconsIcon
                  icon={Tick02Icon}
                  className="size-4 text-success"
                />
                Featured badge on your listing
              </li>
              <li className="flex items-center gap-2">
                <HugeiconsIcon
                  icon={Tick02Icon}
                  className="size-4 text-success"
                />
                Up to 10x more views
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-semibold">Select Duration:</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSelectedDuration("7")}
                className={cn(
                  "relative flex flex-col items-center p-4 rounded-md border-2 cursor-pointer transition-all duration-150 ease-in",
                  selectedDuration === "7"
                    ? "border-gold/75 hover:border-gold bg-gold/5 hover:bg-gold/10"
                    : "hover:border-muted-foreground/50 hover:bg-secondary/50"
                )}
              >
                <span className="text-lg font-bold">1 Week</span>
                <span className="text-2xl font-bold text-foreground">
                  ${products["7"].price}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedDuration("28")}
                className={cn(
                  "relative flex flex-col items-center p-4 rounded-md border-2 cursor-pointer transition-all duration-150 ease-in",
                  selectedDuration === "28"
                    ? "border-gold/75 hover:border-gold bg-gold/5 hover:bg-gold/10"
                    : "hover:border-muted-foreground/50 hover:bg-secondary/50"
                )}
              >
                <span className="absolute -top-2 right-2 px-2 py-0.5 text-xs font-semibold bg-success text-white rounded-full">
                  Save $67!
                </span>
                <span className="text-lg font-bold">4 Weeks</span>
                <span className="text-2xl font-bold text-foreground">
                  ${products["28"].price}
                </span>
              </button>
            </div>
          </div>

          <div className="text-sm text-center">
            {isAlreadyFeatured ? "New end date: " : "Featured until: "}
            <span className="font-medium">
              {format(getNewEndDate(), "MMMM d, yyyy")}
            </span>
          </div>
        </div>

        <DialogFooter>
          <Button
            theme="accent"
            className="w-full sm:w-auto"
            onClick={handleCheckout}
            disabled={isPending}
            aria-busy={isPending}
          >
            {isPending ? (
              <>
                <Spinner />
                Processing...
              </>
            ) : (
              <>
                <HugeiconsIcon icon={CreditCard} />
                Proceed to Checkout
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
