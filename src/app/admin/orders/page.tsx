import Link from "next/link";
import { prisma } from "@/lib/prisma";
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

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    include: {
      book: { select: { title: true } },
      buyer: { select: { name: true } },
      seller: { select: { name: true } },
    },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">订单管理</h1>
      <p className="text-muted-foreground text-sm">全站订单只读查看</p>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>教材</TableHead>
              <TableHead>买家</TableHead>
              <TableHead>卖家</TableHead>
              <TableHead>状态</TableHead>
              <TableHead className="text-right">详情</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((o) => (
              <TableRow key={o.id}>
                <TableCell className="font-medium">{o.book.title}</TableCell>
                <TableCell>{o.buyer.name}</TableCell>
                <TableCell>{o.seller.name}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{ORDER_STATUS_LABEL[o.status]}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Link href={`/me/orders/${o.id}`} className="text-primary text-sm underline">
                    查看
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
