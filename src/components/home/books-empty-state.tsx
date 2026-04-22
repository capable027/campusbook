import Link from "next/link";
import { BookOpen, Plus } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type BooksEmptyStateProps = {
  hasFilters: boolean;
  className?: string;
};

export function BooksEmptyState({ hasFilters, className }: BooksEmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-neutral-950 bg-white px-6 py-16 text-center dark:border-neutral-100 dark:bg-neutral-950",
        className,
      )}
    >
      <div className="mb-6 flex size-24 items-center justify-center rounded-2xl border-2 border-neutral-950 bg-white dark:border-neutral-100 dark:bg-neutral-900">
        <BookOpen className="text-muted-foreground size-12" strokeWidth={1.25} aria-hidden />
      </div>
      <h3 className="text-lg font-semibold tracking-tight">
        {hasFilters ? "没有找到匹配的书" : "广场上还没有书"}
      </h3>
      <p className="text-muted-foreground mt-2 max-w-sm text-sm leading-relaxed">
        {hasFilters
          ? "换个关键词或筛选条件试试，也可以先去分类里逛逛。"
          : "成为第一个发布的人，让教材流动起来。"}
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link href="/books/new" className={buttonVariants({ className: "rounded-xl gap-2" })}>
          <Plus className="size-4" aria-hidden />
          发布我的书
        </Link>
        {hasFilters ? (
          <Link href="/" className={buttonVariants({ variant: "ghost", className: "rounded-xl" })}>
            清除筛选
          </Link>
        ) : null}
      </div>
    </div>
  );
}
