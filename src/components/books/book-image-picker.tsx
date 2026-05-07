"use client";

import * as React from "react";
import Image from "next/image";
import { ImagePlus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { isLocallyServedBookImage } from "@/lib/book-image-url";
import { cn } from "@/lib/utils";

const MAX_FILES = 6;
const MAX_BYTES = 5 * 1024 * 1024;

type BookImagePickerProps = {
  /** Form field name for multipart upload */
  name?: string;
  /** No files required when existing images already present (edit mode). */
  existingCount?: number;
  /** Show thumbnails already stored on the book */
  existingUrls?: string[];
  className?: string;
};

export function BookImagePicker({
  name = "images",
  existingCount = 0,
  existingUrls = [],
  className,
}: BookImagePickerProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [files, setFiles] = React.useState<File[]>([]);
  const [error, setError] = React.useState<string | null>(null);

  const urls = React.useMemo(() => files.map((f) => URL.createObjectURL(f)), [files]);

  React.useEffect(() => {
    return () => {
      urls.forEach((u) => URL.revokeObjectURL(u));
    };
  }, [urls]);

  const remainingSlots = Math.max(0, MAX_FILES - existingCount - files.length);

  function syncInput(next: File[]) {
    const input = inputRef.current;
    if (!input) return;
    const dt = new DataTransfer();
    next.forEach((f) => dt.items.add(f));
    input.files = dt.files;
  }

  function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    setError(null);
    const picked = Array.from(e.target.files ?? []).filter((f) => f.size > 0);
    const valid = picked.filter((f) => {
      if (f.size > MAX_BYTES) {
        setError(`「${f.name}」超过 5MB，已跳过`);
        return false;
      }
      return true;
    });
    const merged = [...files];
    for (const f of valid) {
      if (merged.length + existingCount >= MAX_FILES) break;
      merged.push(f);
    }
    setFiles(merged);
    syncInput(merged);
    e.target.value = "";
  }

  function removeAt(index: number) {
    const next = files.filter((_, i) => i !== index);
    setFiles(next);
    syncInput(next);
  }

  const needsNewFiles = existingCount === 0;

  return (
    <div className={cn("space-y-3", className)}>
      <input
        ref={inputRef}
        type="file"
        name={name}
        accept="image/*"
        multiple
        required={needsNewFiles && files.length === 0}
        className="sr-only"
        tabIndex={-1}
        aria-hidden
        onChange={onPick}
      />
      <div className="flex flex-wrap items-start gap-3">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-auto touch-manipulation flex-col gap-1 rounded-xl py-3"
          disabled={remainingSlots <= 0}
          onClick={() => inputRef.current?.click()}
        >
          <ImagePlus className="size-6" aria-hidden />
          <span className="text-xs font-medium">添加图片</span>
        </Button>
        {existingUrls.map((src) => (
          <div key={src} className="bg-muted relative size-20 overflow-hidden rounded-lg border">
            <Image
              src={src}
              alt=""
              fill
              className="object-cover"
              sizes="80px"
              unoptimized={isLocallyServedBookImage(src) || src.includes("unsplash.com")}
            />
          </div>
        ))}
        {files.map((f, i) => (
          <div key={`${f.name}-${i}`} className="relative size-20 overflow-hidden rounded-lg border">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={urls[i]} alt="" className="size-full object-cover" />
            <button
              type="button"
              onClick={() => removeAt(i)}
              className="bg-background/90 absolute top-0.5 right-0.5 inline-flex size-6 items-center justify-center rounded-md border shadow-sm"
              aria-label={`移除 ${f.name}`}
            >
              <X className="size-3.5" />
            </button>
          </div>
        ))}
      </div>
      <p className="text-muted-foreground text-xs">
        单张不超过 5MB，最多 {MAX_FILES} 张
        {existingCount > 0 ? `（已上传 ${existingCount} 张，还可追加 ${remainingSlots} 张）` : null}
      </p>
      {error ? (
        <p className="text-destructive text-sm" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
