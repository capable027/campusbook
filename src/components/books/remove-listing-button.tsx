"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { removeBookAction } from "@/lib/actions/books";

export function RemoveListingButton({ bookId }: { bookId: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function onClick() {
    if (!confirm("确定要下架该教材吗？")) return;
    setPending(true);
    await removeBookAction(bookId);
    setPending(false);
    router.refresh();
  }

  return (
    <Button variant="destructive" size="sm" onClick={onClick} disabled={pending}>
      {pending ? "…" : "下架"}
    </Button>
  );
}
