"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { OrderStatus } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { updateOrderStatusAction } from "@/lib/actions/orders";

export function OrderStatusActions({
  orderId,
  status,
  role,
}: {
  orderId: string;
  status: OrderStatus;
  role: "buyer" | "seller";
}) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  async function go(next: OrderStatus, key: string) {
    setMsg(null);
    setLoading(key);
    const res = await updateOrderStatusAction(orderId, next);
    setLoading(null);
    if (res.error) {
      setMsg(res.error);
      return;
    }
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        {status === OrderStatus.PENDING && role === "seller" ? (
          <Button onClick={() => go(OrderStatus.CONFIRMED, "confirm")} disabled={loading !== null}>
            {loading === "confirm" ? "处理中…" : "确认订单"}
          </Button>
        ) : null}
        {status === OrderStatus.CONFIRMED ? (
          <Button
            variant="secondary"
            onClick={() => go(OrderStatus.IN_PROGRESS, "prog")}
            disabled={loading !== null}
          >
            {loading === "prog" ? "处理中…" : "开始线下交易"}
          </Button>
        ) : null}
        {(status === OrderStatus.IN_PROGRESS || status === OrderStatus.CONFIRMED) ? (
          <Button onClick={() => go(OrderStatus.COMPLETED, "done")} disabled={loading !== null}>
            {loading === "done" ? "处理中…" : "标记完成"}
          </Button>
        ) : null}
        {status !== OrderStatus.COMPLETED && status !== OrderStatus.CANCELLED ? (
          <Button
            variant="outline"
            onClick={() => go(OrderStatus.CANCELLED, "cancel")}
            disabled={loading !== null}
          >
            {loading === "cancel" ? "处理中…" : "取消订单"}
          </Button>
        ) : null}
      </div>
      {msg ? (
        <p className="text-destructive text-sm" role="alert">
          {msg}
        </p>
      ) : null}
    </div>
  );
}
