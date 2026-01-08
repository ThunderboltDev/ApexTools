"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FloppyDiskIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormContent,
  FormError,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { ImageSelection } from "@/components/ui/image-selection";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import {
  categories,
  categoryLabels,
  pricingLabels,
  pricingModels,
  toolSubmitSchema,
} from "@/lib/constants";
import { supabase } from "@/lib/supabase";
import type { Category, PricingModel, Tool } from "@/lib/types";
import { trpc } from "@/trpc/provider";

type FormValues = z.infer<typeof toolSubmitSchema>;

const MAX_LOGO_SIZE = 4 * 1024 * 1024;

export function EditForm({ tool }: { tool: Tool }) {
  const router = useRouter();

  const form = useForm<FormValues>({
    mode: "onSubmit",
    resolver: zodResolver(toolSubmitSchema),
    defaultValues: {
      name: tool.name,
      slug: tool.slug,
      tagline: tool.tagline,
      description: tool.description,
      logo: {
        type: "url",
        url: tool.logo,
      },
      pricing: tool.pricing as PricingModel,
      category: tool.category as Category,
      url: tool.url,
    },
  });

  const categoryValue = form.watch("category");
  const pricingValue = form.watch("pricing");

  const { mutateAsync: updateTool } = trpc.tool.update.useMutation();

  const uploadLogo = async (file: File) => {
    if (file.size > MAX_LOGO_SIZE) {
      throw new Error("Logo exceeds 4MB limit.");
    }

    const ext = file.name.split(".").pop() ?? "png";
    const path = `logos/${crypto.randomUUID()}.${ext}`;

    const { data, error } = await supabase.storage
      .from("tool-logos")
      .upload(path, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      throw new Error(error.message);
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("tool-logos").getPublicUrl(data.path);

    if (!publicUrl) {
      throw new Error(
        "Something went while accessing the public URL of the uploaded file."
      );
    }

    return publicUrl;
  };

  const handleSubmit = async (values: FormValues) => {
    try {
      const logo = values.logo;
      const type = logo.type;

      const value = type === "url" ? logo.url : logo.file;

      if (!value) {
        form.setError("logo", { message: "Logo is required!" });
        return;
      }

      let logoUrl = "";

      if (values.logo.type === "url") {
        logoUrl = values.logo.url;
      } else {
        logoUrl = await uploadLogo(values.logo.file);
      }

      await updateTool({ ...values, logo: logoUrl });

      toast.success("Tool updated successfully.");
      router.push(`/tools/${values.slug}`);
      router.refresh();
    } catch (error) {
      console.error(error);
      const message =
        error instanceof Error ? error.message : "Something went wrong!";
      toast.error(message);
    }
  };

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="grid gap-4 md:grid-cols-2 items-start">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormContent>
                  <Input placeholder="e.g. Apex Assistant" {...field} />
                  <FormError />
                </FormContent>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Slug</FormLabel>
                <FormContent>
                  <Input
                    {...field}
                    disabled
                    className="bg-muted text-muted-foreground"
                  />
                  <div className="text-xs text-muted-foreground">
                    Slug cannot be changed.
                  </div>
                  <FormError />
                </FormContent>
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="tagline"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Tagline</FormLabel>
              <FormContent>
                <Input
                  placeholder="One line pitch"
                  {...field}
                  aria-invalid={fieldState.invalid}
                />
                <FormError />
              </FormContent>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormContent>
                <Textarea
                  rows={5}
                  placeholder="What problem does it solve?"
                  {...field}
                  aria-invalid={fieldState.invalid}
                />
                <FormError />
              </FormContent>
            </FormItem>
          )}
        />

        <div className="grid gap-4 xs:grid-cols-2">
          <FormField
            control={form.control}
            name="category"
            render={() => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormContent>
                  <Select
                    defaultValue="productivity"
                    onChange={(category) =>
                      form.setValue("category", category as Category)
                    }
                  >
                    <SelectTrigger>
                      {categoryLabels[categoryValue]}
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {categoryLabels[category]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormError />
                </FormContent>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="pricing"
            render={() => (
              <FormItem>
                <FormLabel>Pricing model</FormLabel>
                <FormContent>
                  <Select
                    defaultValue="free"
                    onChange={(pricing) =>
                      form.setValue("pricing", pricing as PricingModel)
                    }
                  >
                    <SelectTrigger>{pricingLabels[pricingValue]}</SelectTrigger>
                    <SelectContent>
                      {pricingModels.map((pricing) => (
                        <SelectItem key={pricing} value={pricing}>
                          {pricingLabels[pricing]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormError />
                </FormContent>
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="url"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>App URL</FormLabel>
              <FormContent>
                <Input
                  placeholder="https://yourapp.com"
                  type="url"
                  {...field}
                  aria-invalid={fieldState.invalid}
                />
                <FormError />
              </FormContent>
            </FormItem>
          )}
        />

        <ImageSelection
          invalid={!!form.formState.errors.logo}
          onChange={(value) =>
            form.setValue("logo", value, {
              shouldDirty: true,
            })
          }
          defaultValue={tool.logo}
        />
        <FormError>
          {
            (
              form.formState.errors.logo &&
              (form.formState.errors.logo as { logo: { message: string } })
            )?.logo.message
          }
        </FormError>

        <Button
          type="submit"
          className="w-full gap-2"
          size="default"
          theme="accent"
          disabled={form.formState.isSubmitting}
          aria-busy={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? (
            <>
              <Spinner />
              Saving...
            </>
          ) : (
            <>
              <HugeiconsIcon icon={FloppyDiskIcon} />
              Save changes
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
