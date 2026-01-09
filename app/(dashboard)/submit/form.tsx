"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Cancel01Icon,
  InformationCircleIcon,
  SentIcon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
import { url } from "@/config";
import {
  categories,
  categoryLabels,
  pricingLabels,
  pricingModels,
  toolSubmitSchema,
} from "@/lib/constants";
import { supabase } from "@/lib/supabase";
import type { Category, PricingModel } from "@/lib/types";
import { trpc } from "@/trpc/provider";

type FormValues = z.infer<typeof toolSubmitSchema>;

const MAX_LOGO_SIZE = 4 * 1024 * 1024;

const toSlug = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/--+/g, "-");

export function SubmitForm() {
  const router = useRouter();

  const [hasEditedSlug, setHasEditedSlug] = useState(false);

  const form = useForm<FormValues>({
    mode: "onSubmit",
    resolver: zodResolver(toolSubmitSchema),
    defaultValues: {
      name: "",
      slug: "",
      tagline: "",
      description: "",
      logo: {
        type: "file",
      },
      pricing: pricingModels[0] as PricingModel,
      category: categories[0] as Category,
      url: "",
    },
  });

  const nameValue = form.watch("name");
  const slugValue = form.watch("slug");
  const categoryValue = form.watch("category");
  const pricingValue = form.watch("pricing");

  useEffect(() => {
    if (hasEditedSlug) return;
    const nextSlug = toSlug(nameValue);
    if (nextSlug && nextSlug !== slugValue) {
      form.setValue("slug", nextSlug, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  }, [form, nameValue, hasEditedSlug, slugValue]);

  const {
    data: slugCheck,
    refetch: refetchSlug,
    isFetching: checkingSlug,
  } = trpc.tool.validateSlug.useQuery(
    { slug: slugValue },
    {
      enabled: false,
    }
  );

  useEffect(() => {
    const handler = setTimeout(() => {
      if (slugValue) {
        void refetchSlug();
      }
    }, 500);
    return () => clearTimeout(handler);
  }, [refetchSlug, slugValue]);

  const { mutateAsync: createTool } = trpc.tool.create.useMutation();

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

      if (!slugCheck?.available && slugCheck?.slug === values.slug) {
        form.setError("slug", { message: "Slug is already taken" });
        return;
      }

      await createTool({ ...values, logo: logoUrl });

      toast.success("Tool created successfully.");
      router.push("/tools");
    } catch (error) {
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
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Slug</FormLabel>
                <FormContent>
                  <Input
                    placeholder="apex-assistant"
                    {...field}
                    aria-invalid={fieldState.invalid}
                    onChange={(e) => {
                      setHasEditedSlug(true);
                      field.onChange(toSlug(e.target.value));
                    }}
                  />
                  <div className="flex items-center gap-2 text-xs">
                    {checkingSlug ? (
                      <span className="text-warning flex items-center gap-1">
                        <Spinner className="size-4" /> Checking availability...
                      </span>
                    ) : !slugCheck ? (
                      <span className="text-muted-foreground flex items-center gap-1">
                        <HugeiconsIcon
                          icon={InformationCircleIcon}
                          className="size-4"
                        />
                        Pick a slug
                      </span>
                    ) : slugCheck?.available ? (
                      <span className="text-success flex items-center gap-1">
                        <HugeiconsIcon icon={Tick02Icon} className="size-4" />
                        Slug available: {url}/{slugValue}
                      </span>
                    ) : (
                      <span className="text-danger flex items-center gap-1">
                        <HugeiconsIcon icon={Cancel01Icon} className="size-4" />
                        Slug is taken!
                      </span>
                    )}
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
                    value="productivity"
                    onValueChange={(category) =>
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
                    value="free"
                    onValueChange={(pricing) =>
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
          disabled={checkingSlug || form.formState.isSubmitting}
          aria-busy={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? (
            <>
              <Spinner />
              Publishing...
            </>
          ) : (
            <>
              <HugeiconsIcon icon={SentIcon} />
              Publish tool
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
