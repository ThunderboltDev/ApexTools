"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Calendar04Icon,
  Clock01Icon,
  FloppyDiskIcon,
  LogoutSquare01Icon,
  PencilEdit01Icon,
  Setting07Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { ThemeDropdown } from "@/components/main/theme-dropdown";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DetailGrid,
  DetailItem,
  DetailLabel,
  DetailValue,
} from "@/components/ui/detail";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
} from "@/components/ui/field";
import {
  Form,
  FormContent,
  FormError,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LinkButton } from "@/components/ui/link-button";
import { LoadingScreen } from "@/components/ui/loading-screen";
import {
  PageContent,
  PageDescription,
  PageHeader,
  PageTitle,
} from "@/components/ui/page";
import { Spinner } from "@/components/ui/spinner";
import { UserAvatar } from "@/components/user/avatar";
import { useAuth } from "@/lib/auth-context";
import { trpc } from "@/trpc/provider";

const updateProfileSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),
});

type UpdateProfileForm = z.infer<typeof updateProfileSchema>;

function EditUsername() {
  const { user, invalidate } = useAuth();

  const [isOpen, setIsOpen] = useState(false);

  const updateProfile = trpc.user.updateProfile.useMutation({
    onSuccess: () => {
      invalidate();
      setIsOpen(false);
      toast.success("Profile updated!");
    },
  });

  const form = useForm<UpdateProfileForm>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: user?.name ?? "",
    },
  });

  const onSubmit = async (data: UpdateProfileForm) => {
    await updateProfile.mutateAsync(data);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full size-7 [&_svg]:!size-4.5"
          />
        }
      >
        <HugeiconsIcon icon={PencilEdit01Icon} />
        <span className="sr-only">Edit Username</span>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Edit Username</AlertDialogTitle>
          <AlertDialogDescription>
            Update your display name. This will be visible to other users.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <Field>
                    <FormLabel>Name</FormLabel>
                    <FormContent>
                      <Input {...field} />
                      <FormError />
                    </FormContent>
                  </Field>
                </FormItem>
              )}
            />
            <AlertDialogFooter>
              <AlertDialogCancel
                type="button"
                disabled={form.formState.isSubmitting}
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                type="submit"
                disabled={updateProfile.isPending}
              >
                {updateProfile.isPending ? (
                  <>
                    <Spinner /> Saving...
                  </>
                ) : (
                  <>
                    <HugeiconsIcon icon={FloppyDiskIcon} /> Save{" "}
                  </>
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default function ProfilePage() {
  const { user } = useAuth();

  if (!user) {
    return <LoadingScreen />;
  }

  return (
    <>
      <PageHeader>
        <PageTitle>Profile</PageTitle>
        <PageDescription>Manage your profile information</PageDescription>
      </PageHeader>
      <PageContent className="flex flex-col gap-8">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <UserAvatar user={user} size={64} />
              <div className="flex flex-col">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  {user.name}
                  <EditUsername />
                </h2>
                <p className="text-muted-foreground">{user.email}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <DetailGrid>
              <DetailItem>
                <DetailLabel>
                  <HugeiconsIcon icon={Calendar04Icon} />
                  Member since
                </DetailLabel>
                <DetailValue value={user.createdAt} />
              </DetailItem>
              <DetailItem>
                <DetailLabel>
                  <HugeiconsIcon icon={Clock01Icon} />
                  Last Login
                </DetailLabel>
                <DetailValue dateFormat="long" value={user.createdAt} />
              </DetailItem>
            </DetailGrid>
            <LinkButton
              className="mt-6"
              variant="outline"
              theme="danger"
              href="/logout"
            >
              <HugeiconsIcon icon={LogoutSquare01Icon} />
              Sign Out
            </LinkButton>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex flex-row gap-2 items-center">
              <HugeiconsIcon icon={Setting07Icon} />
              <span>Manage Preferences</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Field orientation="responsive">
              <div>
                <FieldLabel htmlFor="theme-dropdown">Theme</FieldLabel>
                <FieldDescription>Set theme preference</FieldDescription>
              </div>
              <FieldContent className="mt-1">
                <ThemeDropdown />
              </FieldContent>
            </Field>
          </CardContent>
        </Card>
      </PageContent>
    </>
  );
}
