"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { removeBookAction } from "@/lib/actions/books";

export function RemoveListingButton({ bookId }: { bookId: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function onClick() {
    if (!confirm("确定将该教材下架吗？下架后不会出现在广场，与「已售出」不同；记录仍可在「我的发布」中查看。")) return;
    setPending(true);
    await removeBookAction(bookId);
    setPending(false);
    router.refresh();
  }

  return (
    <Button variant="destructive" size="sm" onClick={onClick} disabled={pending}>
      {pending ? "…" : "下架（不出现在广场）"}
    </Button>
  );
}
