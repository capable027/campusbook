import Link from "next/link";
import { BookStatus, type Prisma } from "@prisma/client";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { bookCardSelect, serializeBookCardRow } from "@/lib/book-queries";
import { getSellerPublicStatsBatch } from "@/lib/seller-public-stats";
import { HomeFilters } from "@/components/books/home-filters";
import { BookRowCarousel } from "@/components/home/book-row-carousel";
import { BooksEmptyState } from "@/components/home/books-empty-state";
import { buttonVariants } from "@/components/ui/button";
import { BookCard } from "@/components/books/book-card";
import { cn } from "@/lib/utils";

export type BookCardRow = Prisma.BookGetPayload<{ select: typeof bookCardSelect }>;

export async function HomeBooksFeed({
  searchParams,
  listingBasePath = "/books",
  showDiscoverySections = true,
}: {
  searchParams: Record<string, string | string[] | undefined>;
  /** Base path for filter submit + pagination (e.g. `/books`). */
  listingBasePath?: string;
  /** When false (browse page), hide carousels to focus on the catalog grid. */
  showDiscoverySections?: boolean;
}) {
  const q = typeof searchParams.q === "string" ? searchParams.q.trim() : "";
  const major = typeof searchParams.major === "string" ? searchParams.major.trim() : "";
  const course = typeof searchParams.course === "string" ? searchParams.course.trim() : "";
  const sort = typeof searchParams.sort === "string" ? searchParams.sort : "new";
  const page = Math.max(1, parseInt(typeof searchParams.page === "string" ? searchParams.page : "1", 10) || 1);
  const pageSize = 12;

  const where: Prisma.BookWhereInput = {
    status: BookStatus.ON_SALE,
    AND: [
      ...(q
        ? [
            {
              OR: [
                { title: { contains: q } },
                { author: { contains: q } },
                { isbn: { contains: q } },
                { description: { contains: q } },
              ],
            },
          ]
        : []),
      ...(major ? [{ major: { contains: major } }] : []),
      ...(course ? [{ course: { contains: course } }] : []),
    ],
  };

  const orderBy =
    sort === "price_asc"
      ? { price: "asc" as const }
      : sort === "price_desc"
        ? { price: "desc" as const }
        : { createdAt: "desc" as const };

  const [total, books, session, latestRaw] = await Promise.all([
    prisma.book.count({ where }),
    prisma.book.findMany({
      where,
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: bookCardSelect,
    }),
    auth(),
    prisma.book.findMany({
      where: { status: BookStatus.ON_SALE },
      orderBy: { createdAt: "desc" },
      take: 10,
      select: bookCardSelect,
    }),
  ]);

  let recommended: BookCardRow[] = [];
  if (session?.user?.id) {
    const me = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { major: true, grade: true },
    });
    if (me?.major) {
      recommended = await prisma.book.findMany({
        where: {
          status: BookStatus.ON_SALE,
          sellerId: { not: session.user.id },
          major: { contains: me.major },
          ...(me.grade ? { seller: { grade: me.grade } } : {}),
        },
        orderBy: { createdAt: "desc" },
        take: 8,
        select: bookCardSelect,
      });
    }
  }

  const guessOnSale: Prisma.BookWhereInput = {
    status: BookStatus.ON_SALE,
    ...(session?.user?.id ? { sellerId: { not: session.user.id } } : {}),
  };

  let guessBooks: BookCardRow[] = recommended;
  if (recommended.length === 0) {
    const afterLatest = await prisma.book.findMany({
      where: guessOnSale,
      orderBy: { createdAt: "desc" },
      skip: 10,
      take: 8,
      select: bookCardSelect,
    });
    if (afterLatest.length > 0) {
      guessBooks = afterLatest;
    } else {
      // Small catalog: re-use newest listings (may overlap 最新上架)
      guessBooks = await prisma.book.findMany({
        where: guessOnSale,
        orderBy: { createdAt: "desc" },
        take: 8,
        select: bookCardSelect,
      });
    }
  }

  const statsMap = await getSellerPublicStatsBatch([
    ...books.map((b) => b.sellerId),
    ...latestRaw.map((b) => b.sellerId),
    ...guessBooks.map((b) => b.sellerId),
  ]);

  const latestForCarousel = latestRaw.map((r) => serializeBookCardRow(r, statsMap.get(r.sellerId)));
  const guessForCarousel = guessBooks.map((r) => serializeBookCardRow(r, statsMap.get(r.sellerId)));

  const guessDescription =
    recommended.length > 0 ? "根据你的专业为你挑选" : "更多在售教材";

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const hasFilters = Boolean(q || major || course || sort !== "new");

  return (
    <>
      <HomeFilters listingBasePath={listingBasePath} />

      {showDiscoverySections ? (
        <>
          <BookRowCarousel
            title="最新上架"
            description="展示最近发布的 10 本在售教材（不受下方分页影响）"
            books={latestForCarousel}
          />

          <BookRowCarousel
            title="猜你喜欢"
            description={guessDescription}
            books={guessForCarousel}
          />
        </>
      ) : null}

      <section id="books" className="scroll-mt-28 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">全部好书</h2>
            <p className="text-muted-foreground mt-1 text-xs">
              在售教材目录；默认按发布时间分页，每页 12 本（不含草稿、待审与已下架）。
            </p>
          </div>
          <p className="bg-muted text-muted-foreground rounded-full px-3 py-1 text-sm font-medium tabular-nums">
            共 {total} 本在售
          </p>
        </div>
        {books.length === 0 ? (
          <BooksEmptyState hasFilters={hasFilters} />
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {books.map((b) => (
              <BookCard
                key={b.id}
                compact
                book={serializeBookCardRow(b, statsMap.get(b.sellerId))}
              />
            ))}
          </div>
        )}
        <Pagination
          listingBasePath={listingBasePath}
          page={page}
          totalPages={totalPages}
          q={q}
          major={major}
          course={course}
          sort={sort}
        />
      </section>
    </>
  );
}

function Pagination({
  listingBasePath,
  page,
  totalPages,
  q,
  major,
  course,
  sort,
}: {
  listingBasePath: string;
  page: number;
  totalPages: number;
  q: string;
  major: string;
  course: string;
  sort: string;
}) {
  if (totalPages <= 1) return null;
  const mk = (p: number) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (major) params.set("major", major);
    if (course) params.set("course", course);
    if (sort && sort !== "new") params.set("sort", sort);
    params.set("page", String(p));
    const qs = params.toString();
    return qs ? `${listingBasePath}?${qs}` : listingBasePath;
  };
  return (
    <div className="flex items-center justify-center gap-2 pt-4">
      {page <= 1 ? (
        <span
          className={cn(
            buttonVariants({ variant: "outline", size: "sm", className: "rounded-xl" }),
            "pointer-events-none opacity-50",
          )}
        >
          上一页
        </span>
      ) : (
        <Link href={mk(page - 1)} className={buttonVariants({ variant: "outline", size: "sm", className: "rounded-xl" })}>
          上一页
        </Link>
      )}
      <span className="text-muted-foreground text-sm">
        {page} / {totalPages}
      </span>
      {page >= totalPages ? (
        <span
          className={cn(
            buttonVariants({ variant: "outline", size: "sm", className: "rounded-xl" }),
            "pointer-events-none opacity-50",
          )}
        >
          下一页
        </span>
      ) : (
        <Link href={mk(page + 1)} className={buttonVariants({ variant: "outline", size: "sm", className: "rounded-xl" })}>
          下一页
        </Link>
      )}
    </div>
  );
}
