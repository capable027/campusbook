import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ORDER_STATUS_LABEL } from "@/lib/order-labels";

export default async function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      book: true,
      buyer: { select: { id: true, name: true } },
      seller: { select: { id: true, name: true } },
      review: true,
    },
  });
  if (!order) notFound();

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/orders" className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "-ml-3")}>
          ← 返回订单列表
        </Link>
      </div>
      <div>
        <h1 className="text-2xl font-bold tracking-tight">订单详情</h1>
        <p className="text-muted-foreground mt-1 text-sm">订单号：{order.id}</p>
        <p className="text-muted-foreground text-sm">
          创建时间：{order.createdAt.toLocaleString("zh-CN")}
        </p>
      </div>

      <div className="space-y-6 rounded-lg border bg-card p-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-muted-foreground">状态</span>
          <Badge>{ORDER_STATUS_LABEL[order.status]}</Badge>
        </div>
        <div>
          <p className="text-muted-foreground text-sm">教材</p>
          <Link href={`/books/${order.book.id}`} className="text-lg font-medium hover:underline">
            {order.book.title}
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-muted-foreground text-sm">买家</p>
            <p>{order.buyer.name}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-sm">卖家</p>
            <p>{order.seller.name}</p>
          </div>
        </div>
        <div>
          <p className="text-muted-foreground text-sm">价格</p>
          <p className="text-xl font-semibold">¥{Number(order.book.price).toFixed(2)}</p>
        </div>
        {order.note ? (
          <div>
            <p className="text-muted-foreground text-sm">备注</p>
            <p className="whitespace-pre-wrap">{order.note}</p>
          </div>
        ) : null}
      </div>

      {order.review ? (
        <div className="rounded-lg border bg-muted/40 p-4">
          <p className="font-medium">买家评价</p>
          <p className="text-muted-foreground mt-1 text-sm">
            {order.review.rating} 星
            {order.review.comment ? ` · ${order.review.comment}` : ""}
          </p>
        </div>
      ) : null}
    </div>
  );
}
