"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { createOrderAction } from "@/lib/actions/orders";
import { ensureConversationAction } from "@/lib/actions/messages";

export function BookActions({
  bookId,
  canBuy,
}: {
  bookId: string;
  canBuy: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState<"order" | "chat" | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  async function onOrder() {
    setMsg(null);
    setLoading("order");
    const res = await createOrderAction(bookId);
    setLoading(null);
    if (res.error) {
      setMsg(res.error);
      return;
    }
    router.push("/me/orders");
    router.refresh();
  }

  async function onChat() {
    setMsg(null);
    setLoading("chat");
    const res = await ensureConversationAction(bookId);
    setLoading(null);
    if (res.error) {
      setMsg(res.error);
      return;
    }
    if (res.conversationId) {
      router.push(`/messages/${res.conversationId}`);
    }
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      {canBuy ? (
        <Button onClick={onOrder} disabled={loading !== null}>
          {loading === "order" ? "提交中…" : "立即下单"}
        </Button>
      ) : null}
      <Button variant="outline" onClick={onChat} disabled={loading !== null}>
        {loading === "chat" ? "打开中…" : "联系卖家"}
      </Button>
      {msg ? (
        <p className="text-destructive w-full text-sm sm:self-center" role="alert">
          {msg}
        </p>
      ) : null}
    </div>
  );
}
