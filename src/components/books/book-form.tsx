"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { BOOK_CONDITIONS } from "@/lib/constants";
import type { BookActionState } from "@/lib/actions/books";

type Props = {
  action: (prev: BookActionState | undefined, formData: FormData) => Promise<BookActionState>;
  defaultValues?: {
    title: string;
    author: string;
    isbn: string;
    price: string;
    condition: string;
    description: string;
    major: string;
    course: string;
  };
  submitLabel?: string;
};

const initial: BookActionState = {};

export function BookForm({ action, defaultValues, submitLabel = "提交" }: Props) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(action, initial);

  useEffect(() => {
    if (state.success) {
      router.push("/me/listings");
      router.refresh();
    }
  }, [state.success, router]);

  const d = defaultValues;

  return (
    <form action={formAction} className="mx-auto max-w-xl space-y-6">
      {state.error ? (
        <p className="text-destructive text-sm" role="alert">
          {state.error}
        </p>
      ) : null}
      <div className="space-y-2">
        <Label htmlFor="title">书名</Label>
        <Input id="title" name="title" required defaultValue={d?.title} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="author">作者</Label>
        <Input id="author" name="author" required defaultValue={d?.author} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="isbn">ISBN（可选）</Label>
        <Input id="isbn" name="isbn" defaultValue={d?.isbn} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="price">价格（元）</Label>
          <Input
            id="price"
            name="price"
            type="number"
            step="0.01"
            min="0"
            required
            defaultValue={d?.price}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="condition">成色</Label>
          <select
            id="condition"
            name="condition"
            required
            defaultValue={d?.condition ?? BOOK_CONDITIONS[1]}
            className="border-input bg-background ring-offset-background focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            {BOOK_CONDITIONS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="major">专业（可选）</Label>
          <Input id="major" name="major" defaultValue={d?.major} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="course">课程（可选）</Label>
          <Input id="course" name="course" defaultValue={d?.course} />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">描述</Label>
        <Textarea id="description" name="description" required rows={6} defaultValue={d?.description} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="images">图片（{d ? "可追加新图" : "至少一张"}）</Label>
        <Input id="images" name="images" type="file" accept="image/*" multiple required={!d} />
        <p className="text-muted-foreground text-xs">单张不超过 5MB，最多 6 张</p>
      </div>
      <Button type="submit" disabled={pending}>
        {pending ? "提交中…" : submitLabel}
      </Button>
    </form>
  );
}
