import Link from "next/link";
import { BookStatus, type Prisma } from "@prisma/client";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { bookCardSelect, serializeBookCardRow } from "@/lib/book-queries";
import { BookCard } from "@/components/books/book-card";
import { HomeFilters } from "@/components/books/home-filters";
import { BookRowCarousel } from "@/components/home/book-row-carousel";
import { BooksEmptyState } from "@/components/home/books-empty-state";
import { buttonVariants } from "@/components/ui/button";
import { HOME_MOCK_BOOKS } from "@/lib/home-mock-books";
import { cn } from "@/lib/utils";

export type BookCardRow = Prisma.BookGetPayload<{ select: typeof bookCardSelect }>;

export async function HomeBooksFeed({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
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

  const guessBooks = recommended.length > 0 ? recommended : HOME_MOCK_BOOKS;
  const guessDemo = recommended.length === 0;

  const latestBooks = latestRaw.length > 0 ? latestRaw : HOME_MOCK_BOOKS;
  const latestDemo = latestRaw.length === 0;

  const latestForCarousel = latestBooks.map(serializeBookCardRow);
  const guessForCarousel = guessBooks.map(serializeBookCardRow);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const hasFilters = Boolean(q || major || course || sort !== "new");

  return (
    <>
      <HomeFilters />

      <BookRowCarousel
        title="最新上架"
        description="刚发布的教材，手慢无"
        books={latestForCarousel}
        demo={latestDemo}
      />

      <BookRowCarousel
        title="猜你喜欢"
        description={
          session?.user && recommended.length > 0 ? "根据你的专业为你挑选" : "看看大家都在淘什么"
        }
        books={guessForCarousel}
        demo={guessDemo}
      />

      <section id="books" className="scroll-mt-24 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-lg font-semibold tracking-tight">全部好书</h2>
          <p className="text-muted-foreground text-sm">共 {total} 本在售</p>
        </div>
        {books.length === 0 ? (
          <BooksEmptyState hasFilters={hasFilters} />
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {books.map((b) => (
              <BookCard key={b.id} book={b} />
            ))}
          </div>
        )}
        <Pagination
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
  page,
  totalPages,
  q,
  major,
  course,
  sort,
}: {
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
    return `/?${params.toString()}`;
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
