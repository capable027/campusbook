import Link from "next/link";
import { BookStatus } from "@prisma/client";
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
import { BOOK_STATUS_LABEL } from "@/lib/order-labels";
import { BookReviewActions } from "@/components/admin/book-review-actions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function AdminBooksPage() {
  const pending = await prisma.book.findMany({
    where: { status: BookStatus.PENDING_REVIEW },
    orderBy: { createdAt: "asc" },
    include: { seller: { select: { name: true, email: true } } },
  });

  const all = await prisma.book.findMany({
    orderBy: { updatedAt: "desc" },
    take: 80,
    include: { seller: { select: { name: true } } },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">教材审核</h1>
      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending">待审核 ({pending.length})</TabsTrigger>
          <TabsTrigger value="all">全部</TabsTrigger>
        </TabsList>
        <TabsContent value="pending" className="mt-4">
          {pending.length === 0 ? (
            <p className="text-muted-foreground">暂无待审核</p>
          ) : (
            <div className="space-y-6">
              {pending.map((b) => (
                <div key={b.id} className="rounded-lg border p-4">
                  <div className="mb-3 flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <Link href={`/books/${b.id}`} className="text-lg font-semibold hover:underline">
                        {b.title}
                      </Link>
                      <p className="text-muted-foreground text-sm">
                        {b.author} · 卖家 {b.seller.name}
                      </p>
                    </div>
                    <Badge>待审核</Badge>
                  </div>
                  <p className="text-muted-foreground mb-3 line-clamp-3 text-sm">{b.description}</p>
                  <BookReviewActions bookId={b.id} />
                </div>
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="all" className="mt-4">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>书名</TableHead>
                  <TableHead>卖家</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {all.map((b) => (
                  <TableRow key={b.id}>
                    <TableCell>
                      <Link href={`/books/${b.id}`} className="font-medium hover:underline">
                        {b.title}
                      </Link>
                    </TableCell>
                    <TableCell>{b.seller.name}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{BOOK_STATUS_LABEL[b.status] ?? b.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {b.status !== BookStatus.REMOVED && b.status !== BookStatus.SOLD_OFF ? (
                        <BookReviewActions bookId={b.id} />
                      ) : (
                        "—"
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
