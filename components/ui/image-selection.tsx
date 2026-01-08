"use client";

import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UploadDropzone } from "@/components/ui/upload-dropzone";

type ImageSelectionTab = "upload" | "url";

export type ImageSelectionValue =
  | {
      type: "file";
      file: File;
    }
  | {
      type: "url";
      url: string;
    };

interface ImageSelectionProps {
  defaultValue?: string;
  maxSize?: number;
  disabled?: boolean;
  className?: string;
  onChange?: (value: ImageSelectionValue) => void;
  invalid?: boolean;
}

export function ImageSelection({
  defaultValue = "",
  maxSize = 4 * 1024 * 1024,
  disabled = false,
  className,
  onChange,
  invalid = false,
}: ImageSelectionProps) {
  const [activeTab, setActiveTab] = useState<ImageSelectionTab>("upload");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>(defaultValue);

  const filePreview = useMemo(() => {
    if (!imageFile) return null;
    return URL.createObjectURL(imageFile);
  }, [imageFile]);

  const currentPreview = useMemo(() => {
    if (activeTab === "upload") {
      return filePreview;
    }

    return imageUrl || null;
  }, [activeTab, filePreview, imageUrl]);

  const handleTabChange = useCallback((value: null | ImageSelectionTab) => {
    if (value) {
      setActiveTab(value);
    }
  }, []);

  const handleFileChange = useCallback((file: File | null) => {
    setImageFile(file);
  }, []);

  const handleUrlChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setImageUrl(e.target.value);
    },
    []
  );

  const handleRemove = useCallback(() => {
    if (activeTab === "upload") {
      setImageFile(null);
    } else {
      setImageUrl("");
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === "upload" && imageFile) {
      onChange?.({ type: "file", file: imageFile });
    } else {
      onChange?.({ type: "url", url: imageUrl });
    }
  }, [activeTab, imageFile, imageUrl, onChange]);

  useEffect(() => {
    return () => {
      if (filePreview) {
        URL.revokeObjectURL(filePreview);
      }
    };
  }, [filePreview]);

  return (
    <div className={className}>
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        defaultValue="upload"
      >
        <TabsList>
          <TabsTrigger value="upload" disabled={disabled}>
            Upload
          </TabsTrigger>
          <TabsTrigger value="url" disabled={disabled}>
            URL
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="mt-3">
          <UploadDropzone
            file={imageFile}
            maxSize={maxSize}
            disabled={disabled}
            setFile={handleFileChange}
            invalid={invalid}
          />
        </TabsContent>

        <TabsContent value="url" className="mt-3 space-y-1">
          <Label htmlFor="image-url">Image URL</Label>
          <Input
            type="url"
            id="image-url"
            placeholder="https://example.com/image.png"
            value={imageUrl}
            disabled={disabled}
            onChange={handleUrlChange}
          />
        </TabsContent>
      </Tabs>

      {currentPreview && (
        <div className="mt-4 flex items-center gap-3">
          <div className="relative size-16 shrink-0 overflow-hidden rounded-md border border-border bg-background">
            <Image
              src={currentPreview}
              alt="Image Preview"
              className="size-full aspect-square object-cover"
              width={64}
              height={64}
              unoptimized
            />
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <p className="truncate text-sm font-medium text-foreground">
              {activeTab === "upload" && imageFile
                ? imageFile.name
                : "External Image"}
            </p>
            <p className="text-xs text-muted-foreground">
              {activeTab === "upload" && imageFile
                ? `${(imageFile.size / 1024).toFixed(1)} KB`
                : "URL Source"}
            </p>
          </div>
          <Button
            size="icon"
            theme="danger"
            variant="transparent"
            disabled={disabled}
            onClick={handleRemove}
            aria-label="Remove selected image"
          >
            <HugeiconsIcon icon={Cancel01Icon} />
            <span className="sr-only">Remove selected image</span>
          </Button>
        </div>
      )}
    </div>
  );
}
