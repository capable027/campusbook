import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BookStatus } from "@prisma/client";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { SiteHeader } from "@/components/layout/site-header";
import { BookActions } from "@/components/books/book-actions";
import { Badge } from "@/components/ui/badge";
import { BOOK_STATUS_LABEL } from "@/lib/order-labels";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getSellerReviewPublic } from "@/lib/seller-reviews";
import { isLocallyServedBookImage } from "@/lib/uploads";

export default async function BookDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  const book = await prisma.book.findUnique({
    where: { id },
    include: {
      seller: {
        select: { id: true, name: true, major: true, grade: true },
      },
    },
  });
  if (!book) notFound();

  const { agg: sellerReviewAgg, reviews: sellerReviews } = await getSellerReviewPublic(book.sellerId);
  const reviewCount = sellerReviewAgg._count._all;
  const avgRating =
    sellerReviewAgg._avg.rating != null ? Number(sellerReviewAgg._avg.rating) : null;

  const isOwner = session?.user?.id === book.sellerId;
  const canBuy =
    !!session?.user &&
    !isOwner &&
    book.status === BookStatus.ON_SALE;

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-3">
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg border bg-muted">
              {book.images[0] ? (
                <Image
                  src={book.images[0]}
                  alt=""
                  fill
                  className="object-cover"
                  priority
                  unoptimized={isLocallyServedBookImage(book.images[0])}
                />
              ) : null}
            </div>
            {book.images.length > 1 ? (
              <div className="grid grid-cols-4 gap-2">
                {book.images.slice(1, 5).map((src) => (
                  <div key={src} className="relative aspect-square overflow-hidden rounded-md border bg-muted">
                    <Image
                      src={src}
                      alt=""
                      fill
                      className="object-cover"
                      unoptimized={isLocallyServedBookImage(src)}
                    />
                  </div>
                ))}
              </div>
            ) : null}
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight">{book.title}</h1>
              <p className="text-muted-foreground">{book.author}</p>
              <div className="flex flex-wrap gap-2">
                <span className="text-primary text-3xl font-semibold">
                  ¥{Number(book.price).toFixed(2)}
                </span>
                <Badge>{book.condition}</Badge>
                <Badge variant="outline">{BOOK_STATUS_LABEL[book.status] ?? book.status}</Badge>
              </div>
            </div>
            <div className="rounded-lg border bg-card p-4 text-sm">
              <p className="font-medium">卖家</p>
              <p className="text-muted-foreground mt-1">
                {book.seller.name}
                {book.seller.major ? ` · ${book.seller.major}` : ""}
                {book.seller.grade ? ` · ${book.seller.grade}` : ""}
              </p>
              <p className="text-muted-foreground mt-2">
                {reviewCount === 0 ? (
                  <>暂无评价</>
                ) : (
                  <>
                    综合评分{" "}
                    <span className="font-medium text-foreground">{avgRating?.toFixed(1) ?? "—"}</span>
                    <span className="text-muted-foreground"> / 5</span>
                    <span className="text-muted-foreground"> · {reviewCount} 条评价</span>
                  </>
                )}
              </p>
            </div>
            {book.isbn ? (
              <p className="text-sm">
                <span className="text-muted-foreground">ISBN：</span>
                {book.isbn}
              </p>
            ) : null}
            {book.major || book.course ? (
              <p className="text-sm">
                <span className="text-muted-foreground">专业/课程：</span>
                {[book.major, book.course].filter(Boolean).join(" · ")}
              </p>
            ) : null}
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <p className="whitespace-pre-wrap">{book.description}</p>
            </div>

            {session?.user ? (
              isOwner ? (
                <div className="flex flex-wrap gap-2">
                  <Link
                    href={`/books/${book.id}/edit`}
                    className={cn(buttonVariants())}
                  >
                    编辑
                  </Link>
                </div>
              ) : (
                <BookActions bookId={book.id} canBuy={canBuy} />
              )
            ) : (
              <p className="text-muted-foreground text-sm">
                <Link href="/login" className="text-primary underline">
                  登录
                </Link>{" "}
                后可下单或与卖家沟通
              </p>
            )}
          </div>
        </div>

        {sellerReviews.length > 0 ? (
          <section className="space-y-4 border-t pt-8">
            <h2 className="text-lg font-semibold">卖家评价</h2>
            <p className="text-muted-foreground text-sm">
              以下为该卖家历史成交收到的评价（不展示买家姓名）。
            </p>
            <ul className="space-y-3">
              {sellerReviews.map((r) => (
                <li key={r.id} className="rounded-lg border bg-card p-4 text-sm">
                  <div className="flex flex-wrap items-baseline gap-2">
                    <span className="font-medium">{r.rating} 星</span>
                    <span className="text-muted-foreground text-xs">
                      {new Date(r.createdAt).toLocaleString("zh-CN")}
                    </span>
                  </div>
                  {r.order.book.title ? (
                    <p className="text-muted-foreground mt-1 text-xs">教材：{r.order.book.title}</p>
                  ) : null}
                  {r.comment ? (
                    <p className="text-muted-foreground mt-2 whitespace-pre-wrap">{r.comment}</p>
                  ) : null}
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </main>
    </div>
  );
}
