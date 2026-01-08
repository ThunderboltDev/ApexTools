"use client";

import { CloudUploadIcon, Image02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import {
  type DropzoneOptions,
  type FileRejection,
  useDropzone,
} from "react-dropzone";
import { cn } from "@/lib/utils";

interface UploadDropzoneProps {
  file: File | null;
  setFile: (file: File | null) => void;
  accept?: DropzoneOptions["accept"];
  maxSize?: number;
  description?: string;
  disabled?: boolean;
  className?: string;
  invalid?: boolean;
}

const formatError = (rejections: FileRejection[]) => {
  const firstError = rejections[0]?.errors[0];

  if (!firstError) return null;
  if (firstError.code === "file-too-large") return "File is too large.";
  if (firstError.code === "file-invalid-type") return "Unsupported file type.";

  return firstError.message;
};

export function UploadDropzone({
  file,
  accept = {
    "image/png": [],
    "image/jpeg": [],
    "image/webp": [],
    "image/avif": [],
  },
  maxSize = 4 * 1024 * 1024,
  description,
  disabled,
  className,
  setFile,
  invalid = false,
}: UploadDropzoneProps) {
  const [error, setError] = useState<string | null>(null);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept,
    maxSize,
    multiple: false,
    disabled,
    onDropAccepted: (files) => {
      const selectedFile = files[0] ?? null;
      setError(null);
      setFile(selectedFile);
    },
    onDropRejected: (rejections) => {
      setError(formatError(rejections));
      setFile(null);
    },
  });

  return (
    <div className={cn("space-y-2", className)}>
      <div
        {...getRootProps()}
        className={cn(
          "flex min-h-40 cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border bg-secondary/50 px-4 py-6 text-center transition duration-200 hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          isDragActive && "border-accent bg-accent/10",
          disabled && "cursor-not-allowed opacity-60",
          invalid && "border-danger bg-danger/5"
        )}
      >
        <input {...getInputProps()} aria-invalid={invalid} />
        {file ? (
          <div className="flex items-center gap-2 text-base font-medium">
            <HugeiconsIcon icon={Image02Icon} className="size-6 text-success" />
            <span className="max-w-52 truncate">{file.name}</span>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2 text-base font-medium">
              <HugeiconsIcon
                icon={isDragActive ? Image02Icon : CloudUploadIcon}
                className="size-6 text-primary"
              />
              <span>
                {isDragActive ? "Drop the image here" : "Upload an image"}
              </span>
            </div>
            {description ? (
              <p className="text-xs text-muted-foreground">{description}</p>
            ) : (
              <p className="text-xs text-muted-foreground">
                PNG, JPEG, WEBP, AVIF up to{" "}
                {Math.floor(maxSize / (1024 * 1024))}
                MB
              </p>
            )}
          </>
        )}
      </div>
      {error ? <p className="text-sm text-danger">{error}</p> : null}
    </div>
  );
}
