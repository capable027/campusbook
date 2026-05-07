import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function AdminStatsPage() {
  const [userCount, bookCount, orderCount, completedCount] = await Promise.all([
    prisma.user.count(),
    prisma.book.count(),
    prisma.order.count(),
    prisma.order.count({ where: { status: "COMPLETED" } }),
  ]);

  const top = await prisma.order.groupBy({
    by: ["bookId"],
    where: { status: "COMPLETED" },
    _count: { bookId: true },
    orderBy: { _count: { bookId: "desc" } },
    take: 8,
  });

  const bookIds = top.map((t) => t.bookId);
  const books = await prisma.book.findMany({
    where: { id: { in: bookIds } },
    select: { id: true, title: true, author: true },
  });
  const bookMap = new Map(books.map((b) => [b.id, b]));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">数据统计</h1>
        <p className="text-muted-foreground mt-1 text-sm">以下为实时汇总；点击下方卡片可跳转到对应管理列表。</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Link href="/admin/users" className="block rounded-xl transition-opacity hover:opacity-90">
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">用户数</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">{userCount}</p>
              <p className="text-muted-foreground mt-2 text-xs">管理用户 →</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/admin/books" className="block rounded-xl transition-opacity hover:opacity-90">
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">教材数</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">{bookCount}</p>
              <p className="text-muted-foreground mt-2 text-xs">管理教材 →</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/admin/orders" className="block rounded-xl transition-opacity hover:opacity-90">
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">订单数</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">{orderCount}</p>
              <p className="text-muted-foreground mt-2 text-xs">管理订单 →</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/admin/orders" className="block rounded-xl transition-opacity hover:opacity-90">
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">成交订单</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">{completedCount}</p>
              <p className="text-muted-foreground mt-2 text-xs">在订单列表筛选「已完成」→</p>
            </CardContent>
          </Card>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>热门教材（按成交订单数）</CardTitle>
        </CardHeader>
        <CardContent>
          {top.length === 0 ? (
            <p className="text-muted-foreground text-sm">暂无成交数据</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>书名</TableHead>
                  <TableHead>作者</TableHead>
                  <TableHead className="text-right">成交次数</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {top.map((row) => {
                  const b = bookMap.get(row.bookId);
                  return (
                    <TableRow key={row.bookId}>
                      <TableCell>
                        {b ? (
                          <Link href={`/books/${b.id}`} className="text-primary font-medium hover:underline">
                            {b.title}
                          </Link>
                        ) : (
                          row.bookId
                        )}
                      </TableCell>
                      <TableCell>{b?.author ?? "—"}</TableCell>
                      <TableCell className="text-right">{row._count.bookId}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
