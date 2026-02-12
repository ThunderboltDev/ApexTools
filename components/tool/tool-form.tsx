"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Cancel01Icon,
  FloppyDiskIcon,
  InformationCircleIcon,
  SentIcon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { DomainVerification } from "@/components/tool/domain-verification";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormContent,
  FormError,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { FormSection } from "@/components/ui/form-section";
import { ImageSelection } from "@/components/ui/image-selection";
import { Input } from "@/components/ui/input";
import { MarkdownEditor } from "@/components/ui/markdown-editor";
import { MultiSelect } from "@/components/ui/multi-select";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { TagInput } from "@/components/ui/tag-input";
import { url as siteUrl } from "@/config";
import {
  categories,
  categoryLabels,
  platformLabels,
  platforms,
  pricingLabels,
  pricingModels,
  toolSubmitSchema,
} from "@/lib/constants";
import { categoryIcons, platformIcons, pricingModelIcons } from "@/lib/icons";
import { supabase } from "@/lib/supabase";
import type { Category, Platform, PricingModel, Tool } from "@/lib/types";
import { trpc } from "@/trpc/provider";

type FormValues = z.infer<typeof toolSubmitSchema>;

const MAX_FILE_SIZE = 4 * 1024 * 1024;

const toSlug = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/--+/g, "-");

const categoryOptions = categories.map((category) => ({
  value: category,
  label: categoryLabels[category],
  icon: categoryIcons[category],
}));

const platformOptions = platforms.map((platform) => ({
  value: platform,
  label: platformLabels[platform],
  icon: platformIcons[platform],
}));

interface ToolFormBase {
  defaultValues?: Partial<FormValues>;
  onSubmit: (
    values: Omit<FormValues, "logo" | "banner"> & {
      logo: string;
      banner: string;
    }
  ) => Promise<void>;
}

interface CreateToolFormProps extends ToolFormBase {
  mode: "create";
  tool: undefined;
}

interface EditToolFormProps extends ToolFormBase {
  mode: "edit";
  tool: Tool;
}

type ToolFormProps = CreateToolFormProps | EditToolFormProps;

export function ToolForm({
  defaultValues,
  onSubmit,
  mode,
  tool,
}: ToolFormProps) {
  const [hasEditedSlug, setHasEditedSlug] = useState(false);

  const form = useForm<FormValues>({
    mode: "onSubmit",
    resolver: zodResolver(toolSubmitSchema),
    defaultValues: {
      url: "",
      name: "",
      slug: "",
      tagline: "",
      description: "",
      logo: {
        type: "file",
        file: undefined,
      },
      banner: {
        type: "file",
        file: undefined,
      },
      pricing: pricingModels[0] as PricingModel,
      category: [],
      platform: [],
      tags: [] as string[],
      ...defaultValues,
    },
  });

  const nameValue = form.watch("name");
  const slugValue = form.watch("slug");
  const categoryValue = form.watch("category");
  const platformValue = form.watch("platform");
  const pricingValue = form.watch("pricing");
  const tagsValue = form.watch("tags");
  const descriptionValue = form.watch("description");

  useEffect(() => {
    if (mode === "edit" || hasEditedSlug) return;
    const nextSlug = toSlug(nameValue);
    if (nextSlug && nextSlug !== slugValue) {
      form.setValue("slug", nextSlug, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  }, [form, nameValue, hasEditedSlug, slugValue, mode]);

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
    if (mode === "edit") return;
    const handler = setTimeout(() => {
      if (slugValue) {
        void refetchSlug();
      }
    }, 500);
    return () => clearTimeout(handler);
  }, [refetchSlug, slugValue, mode]);

  const uploadFile = async (file: File, bucket: string, folder: string) => {
    if (file.size > MAX_FILE_SIZE) {
      throw new Error("File exceeds 4MB limit.");
    }

    const ext = file.name.split(".").pop() ?? "png";
    const path = `${folder}/${crypto.randomUUID()}.${ext}`;

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      throw new Error(error.message);
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(data.path);

    if (!publicUrl) {
      throw new Error("Failed to get public URL for uploaded file.");
    }

    return publicUrl;
  };

  const handleSubmit = async (values: FormValues) => {
    try {
      const logo = values.logo;
      const logoType = logo.type;
      const logoValue = logoType === "url" ? logo.url : logo.file;

      if (!logoValue) {
        form.setError("logo", { message: "Logo is required!" });
        return;
      }

      let logoUrl: string;

      if (values.logo.type === "url") {
        logoUrl = values.logo.url;
      } else {
        logoUrl = await uploadFile(values.logo.file, "tool-logos", "logos");
      }

      let bannerUrl: string;

      if (values.banner.type === "url") {
        bannerUrl = values.banner.url;
      } else {
        bannerUrl = await uploadFile(
          values.banner.file,
          "tool-banners",
          "banners"
        );
      }

      if (
        mode === "create" &&
        !slugCheck?.available &&
        slugCheck?.slug === values.slug
      ) {
        form.setError("slug", { message: "Slug is already taken" });
        return;
      }

      await onSubmit({
        ...values,
        logo: logoUrl,
        banner: bannerUrl,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Something went wrong!";
      toast.error(message);
    }
  };

  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(handleSubmit)}>
        <FormSection
          title="Main Details"
          description="Basic information about your tool"
        >
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
                      disabled={mode === "edit"}
                      className={
                        mode === "edit" ? "bg-muted text-muted-foreground" : ""
                      }
                      aria-invalid={fieldState.invalid}
                      onChange={(e) => {
                        setHasEditedSlug(true);
                        field.onChange(toSlug(e.target.value));
                      }}
                    />
                    {mode === "create" ? (
                      <div className="flex items-center gap-2 text-xs">
                        {checkingSlug ? (
                          <span className="text-warning flex items-center gap-1">
                            <Spinner className="size-4" /> Checking
                            availability...
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
                            <HugeiconsIcon
                              icon={Tick02Icon}
                              className="size-4"
                            />
                            Slug available: {siteUrl}/{slugValue}
                          </span>
                        ) : (
                          <span className="text-danger flex items-center gap-1">
                            <HugeiconsIcon
                              icon={Cancel01Icon}
                              className="size-4"
                            />
                            Slug is taken!
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className="text-xs text-muted-foreground">
                        Slug cannot be changed.
                      </div>
                    )}
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
                    placeholder="One line pitch for your tool"
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
        </FormSection>

        {mode === "edit" && <DomainVerification tool={tool} />}

        <FormSection
          title="Description"
          description="Describe your tool in detail. Markdown is supported."
        >
          <FormField
            control={form.control}
            name="description"
            render={({ fieldState }) => (
              <FormItem>
                <FormContent>
                  <MarkdownEditor
                    value={descriptionValue}
                    onChange={(value) =>
                      form.setValue("description", value, { shouldDirty: true })
                    }
                    placeholder="What problem does it solve? What makes it unique?"
                    rows={10}
                    maxLength={5000}
                    invalid={fieldState.invalid}
                  />
                  <FormError />
                </FormContent>
              </FormItem>
            )}
          />
        </FormSection>

        <FormSection
          title="Images"
          description="Upload a logo and optional banner image"
        >
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-2">
              <FormLabel>Logo</FormLabel>
              <ImageSelection
                invalid={!!form.formState.errors.logo}
                defaultValue={
                  defaultValues?.logo?.type === "url"
                    ? defaultValues.logo.url
                    : undefined
                }
                onChange={(value) =>
                  form.setValue("logo", value, { shouldDirty: true })
                }
              />
              <FormError>
                {
                  (
                    form.formState.errors.logo &&
                    (form.formState.errors.logo as {
                      logo: { message: string };
                    })
                  )?.logo?.message
                }
              </FormError>
            </div>

            <div className="space-y-2">
              <FormLabel>Banner</FormLabel>
              <ImageSelection
                mode="banner"
                maxSize={10 * 1024 * 1024}
                invalid={!!form.formState.errors.banner}
                defaultValue={
                  defaultValues?.banner?.type === "url"
                    ? defaultValues.banner.url
                    : undefined
                }
                onChange={(value) =>
                  form.setValue("banner", value, { shouldDirty: true })
                }
              />
            </div>
          </div>
        </FormSection>

        <FormSection
          title="Additional Details"
          description="Categorization and metadata"
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <FormField
              control={form.control}
              name="category"
              render={() => (
                <FormItem>
                  <FormLabel>Categories</FormLabel>
                  <FormContent>
                    <MultiSelect
                      options={categoryOptions}
                      selected={categoryValue}
                      onChange={(values) =>
                        form.setValue("category", values as Category[], {
                          shouldDirty: true,
                        })
                      }
                      placeholder="Select categories..."
                      searchPlaceholder="Search categories..."
                    />
                    <FormError />
                  </FormContent>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="platform"
              render={() => (
                <FormItem>
                  <FormLabel>Platforms</FormLabel>
                  <FormContent>
                    <MultiSelect
                      options={platformOptions}
                      selected={platformValue}
                      onChange={(values) =>
                        form.setValue("platform", values as Platform[], {
                          shouldDirty: true,
                        })
                      }
                      placeholder="Select platforms..."
                      searchPlaceholder="Search platforms..."
                    />
                  </FormContent>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="pricing"
              render={() => (
                <FormItem>
                  <FormLabel>Pricing Model</FormLabel>
                  <FormContent>
                    <Select
                      value={pricingValue}
                      onValueChange={(pricing) =>
                        form.setValue("pricing", pricing as PricingModel, {
                          shouldDirty: true,
                        })
                      }
                    >
                      <SelectTrigger>
                        {pricingLabels[pricingValue]}
                      </SelectTrigger>
                      <SelectContent>
                        {pricingModels.map((pricing) => (
                          <SelectItem key={pricing} value={pricing}>
                            <HugeiconsIcon icon={pricingModelIcons[pricing]} />
                            {pricingLabels[pricing]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormContent>
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="tags"
            render={() => (
              <FormItem>
                <FormContent>
                  <TagInput
                    label="Tags"
                    value={tagsValue}
                    onChange={(tags) =>
                      form.setValue("tags", tags, { shouldDirty: true })
                    }
                    placeholder="Add tags (press Enter)"
                    maxTags={10}
                  />
                </FormContent>
              </FormItem>
            )}
          />
        </FormSection>

        <Button
          type="submit"
          className="w-full gap-2"
          size="lg"
          theme="accent"
          disabled={checkingSlug || form.formState.isSubmitting}
          aria-busy={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? (
            <>
              <Spinner />
              {mode === "create" ? "Publishing..." : "Saving..."}
            </>
          ) : (
            <>
              <HugeiconsIcon
                icon={mode === "create" ? SentIcon : FloppyDiskIcon}
              />
              {mode === "create" ? "Publish Tool" : "Save Changes"}
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
