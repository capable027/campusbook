import Link from "next/link";
import { BookStatus, type Prisma } from "@prisma/client";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { bookCardSelect } from "@/lib/book-queries";
import { BookCard } from "@/components/books/book-card";
import { HomeFilters } from "@/components/books/home-filters";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SiteHeader } from "@/components/layout/site-header";

type BookCardRow = Prisma.BookGetPayload<{ select: typeof bookCardSelect }>;

export const dynamic = "force-dynamic";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q.trim() : "";
  const major = typeof sp.major === "string" ? sp.major.trim() : "";
  const course = typeof sp.course === "string" ? sp.course.trim() : "";
  const sort = typeof sp.sort === "string" ? sp.sort : "new";
  const page = Math.max(1, parseInt(typeof sp.page === "string" ? sp.page : "1", 10) || 1);
  const pageSize = 12;

  const where: Prisma.BookWhereInput = {
    status: BookStatus.ON_SALE,
    AND: [
      ...(q
        ? [
            {
              OR: [
                { title: { contains: q, mode: "insensitive" as const } },
                { author: { contains: q, mode: "insensitive" as const } },
                { isbn: { contains: q, mode: "insensitive" as const } },
                { description: { contains: q, mode: "insensitive" as const } },
              ],
            },
          ]
        : []),
      ...(major ? [{ major: { contains: major, mode: "insensitive" as const } }] : []),
      ...(course ? [{ course: { contains: course, mode: "insensitive" as const } }] : []),
    ],
  };

  const orderBy =
    sort === "price_asc"
      ? { price: "asc" as const }
      : sort === "price_desc"
        ? { price: "desc" as const }
        : { createdAt: "desc" as const };

  const [total, books, session] = await Promise.all([
    prisma.book.count({ where }),
    prisma.book.findMany({
      where,
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: bookCardSelect,
    }),
    auth(),
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
          major: { contains: me.major, mode: "insensitive" },
          ...(me.grade ? { seller: { grade: me.grade } } : {}),
        },
        orderBy: { createdAt: "desc" },
        take: 4,
        select: bookCardSelect,
      });
    }
  }

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 py-8">
        <section className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">CampusBook</h1>
          <p className="text-muted-foreground max-w-2xl">
            校内二手教材交易平台：发布、搜索、沟通到线下成交，降低教材成本。
          </p>
        </section>

        <HomeFilters />

        {session?.user && recommended.length > 0 ? (
          <section className="space-y-3">
            <h2 className="text-lg font-semibold">为你推荐（同专业）</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {recommended.map((b) => (
                <BookCard key={b.id} book={b} />
              ))}
            </div>
          </section>
        ) : null}

        <section className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-lg font-semibold">在售教材</h2>
            <p className="text-muted-foreground text-sm">共 {total} 本</p>
          </div>
          {books.length === 0 ? (
            <p className="text-muted-foreground py-12 text-center">暂无符合条件的教材</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
      </main>
    </div>
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
    <div className="flex items-center justify-center gap-2">
      {page <= 1 ? (
        <span className={cn(buttonVariants({ variant: "outline", size: "sm" }), "pointer-events-none opacity-50")}>
          上一页
        </span>
      ) : (
        <Link href={mk(page - 1)} className={buttonVariants({ variant: "outline", size: "sm" })}>
          上一页
        </Link>
      )}
      <span className="text-muted-foreground text-sm">
        {page} / {totalPages}
      </span>
      {page >= totalPages ? (
        <span className={cn(buttonVariants({ variant: "outline", size: "sm" }), "pointer-events-none opacity-50")}>
          下一页
        </span>
      ) : (
        <Link href={mk(page + 1)} className={buttonVariants({ variant: "outline", size: "sm" })}>
          下一页
        </Link>
      )}
    </div>
  );
}
