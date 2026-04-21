"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { BookStatus } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { setBookStatusAdminAction } from "@/lib/actions/admin";

export function BookReviewActions({ bookId }: { bookId: string }) {
  const router = useRouter();
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState<string | null>(null);

  async function approve() {
    setLoading("ok");
    await setBookStatusAdminAction(bookId, BookStatus.ON_SALE);
    setLoading(null);
    router.refresh();
  }

  async function reject() {
    const reason = note.trim() || "内容不符合规范";
    setLoading("rej");
    await setBookStatusAdminAction(bookId, BookStatus.REJECTED, reason);
    setLoading(null);
    router.refresh();
  }

  async function takedown() {
    if (!confirm("确定违规下架？")) return;
    setLoading("down");
    await setBookStatusAdminAction(bookId, BookStatus.REMOVED, "违规下架");
    setLoading(null);
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <Button size="sm" onClick={approve} disabled={loading !== null}>
        {loading === "ok" ? "…" : "通过"}
      </Button>
      <div className="flex max-w-xs flex-1 gap-2">
        <Input
          placeholder="驳回原因"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        <Button size="sm" variant="secondary" onClick={reject} disabled={loading !== null}>
          {loading === "rej" ? "…" : "驳回"}
        </Button>
      </div>
      <Button size="sm" variant="destructive" onClick={takedown} disabled={loading !== null}>
        {loading === "down" ? "…" : "下架"}
      </Button>
    </div>
  );
}
