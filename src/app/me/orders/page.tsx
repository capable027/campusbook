import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { SiteHeader } from "@/components/layout/site-header";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ORDER_STATUS_LABEL } from "@/lib/order-labels";

export default async function MyOrdersPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const orders = await prisma.order.findMany({
    where: {
      OR: [{ buyerId: session.user.id }, { sellerId: session.user.id }],
    },
    include: {
      book: { select: { id: true, title: true, price: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        <h1 className="mb-6 text-2xl font-bold tracking-tight">我的订单</h1>
        {orders.length === 0 ? (
          <p className="text-muted-foreground">暂无订单</p>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>教材</TableHead>
                  <TableHead>角色</TableHead>
                  <TableHead>金额</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead className="text-right">详情</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((o) => {
                  const role = o.buyerId === session.user!.id ? "买家" : "卖家";
                  return (
                    <TableRow key={o.id}>
                      <TableCell className="font-medium">{o.book.title}</TableCell>
                      <TableCell>{role}</TableCell>
                      <TableCell>¥{Number(o.book.price).toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{ORDER_STATUS_LABEL[o.status]}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Link href={`/me/orders/${o.id}`} className="text-primary text-sm underline">
                          查看
                        </Link>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </main>
    </div>
  );
}
