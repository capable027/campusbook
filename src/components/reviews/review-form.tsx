"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createReviewAction, type ReviewActionState } from "@/lib/actions/reviews";

const initial: ReviewActionState = {};

export function ReviewForm({ orderId }: { orderId: string }) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(createReviewAction, initial);

  useEffect(() => {
    if (state.success) {
      router.refresh();
    }
  }, [state.success, router]);

  return (
    <form action={formAction} className="space-y-4 rounded-lg border bg-card p-4">
      <input type="hidden" name="orderId" value={orderId} />
      <h3 className="font-semibold">评价卖家</h3>
      {state.error ? (
        <p className="text-destructive text-sm" role="alert">
          {state.error}
        </p>
      ) : null}
      <div className="space-y-2">
        <Label htmlFor="rating">星级</Label>
        <select
          id="rating"
          name="rating"
          required
          defaultValue="5"
          className="border-input bg-background ring-offset-background focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          {[5, 4, 3, 2, 1].map((n) => (
            <option key={n} value={n}>
              {n} 星
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="comment">评语（可选）</Label>
        <Textarea id="comment" name="comment" rows={3} placeholder="交易体验如何？" />
      </div>
      <Button type="submit" disabled={pending}>
        {pending ? "提交中…" : "提交评价"}
      </Button>
    </form>
  );
}
