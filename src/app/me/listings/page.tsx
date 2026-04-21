import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { SiteHeader } from "@/components/layout/site-header";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
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
import { RemoveListingButton } from "@/components/books/remove-listing-button";

export default async function MyListingsPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const books = await prisma.book.findMany({
    where: { sellerId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-2xl font-bold tracking-tight">我的发布</h1>
          <Link href="/books/new" className={cn(buttonVariants())}>
            发布新教材
          </Link>
        </div>
        {books.length === 0 ? (
          <p className="text-muted-foreground">暂无发布，去上架一本吧。</p>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>书名</TableHead>
                  <TableHead>价格</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {books.map((b) => (
                  <TableRow key={b.id}>
                    <TableCell className="font-medium">
                      <Link href={`/books/${b.id}`} className="hover:underline">
                        {b.title}
                      </Link>
                    </TableCell>
                    <TableCell>¥{Number(b.price).toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{BOOK_STATUS_LABEL[b.status] ?? b.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/books/${b.id}/edit`}
                          className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
                        >
                          编辑
                        </Link>
                        {b.status !== "REMOVED" && b.status !== "SOLD_OFF" ? (
                          <RemoveListingButton bookId={b.id} />
                        ) : null}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </main>
    </div>
  );
}
