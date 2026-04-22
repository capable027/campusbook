import Link from "next/link";
import { Leaf, PiggyBank, UsersRound } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type HomeHeroProps = {
  loggedIn: boolean;
  className?: string;
};

export function HomeHero({ loggedIn, className }: HomeHeroProps) {
  const publishHref = loggedIn ? "/books/new" : "/login";

  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-2xl border-2 border-neutral-950 bg-white px-6 py-14 text-neutral-900 shadow-none sm:px-10 sm:py-16 dark:border-neutral-100 dark:bg-neutral-950 dark:text-neutral-50",
        className,
      )}
    >
      <div
        className="pointer-events-none absolute -top-24 -right-24 size-72 rounded-full bg-neutral-100 blur-3xl dark:bg-neutral-800/50"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-20 -left-16 size-64 rounded-full bg-neutral-100/80 blur-2xl dark:bg-neutral-800/40"
        aria-hidden
      />
      <div className="relative mx-auto max-w-6xl">
        <div className="max-w-2xl space-y-6">
          <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">校园二手 · 可信交易</p>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">让旧书流动起来</h1>
          <p className="text-lg text-neutral-600 sm:text-xl dark:text-neutral-300">
            环保减碳、省钱购书、同校互助 — 把闲置教材交给下一届同学。
          </p>
          <ul className="flex flex-wrap gap-4 text-sm text-neutral-800 dark:text-neutral-200">
            <li className="flex items-center gap-2 rounded-xl border-2 border-neutral-950 bg-neutral-50 px-3 py-2 dark:border-neutral-100 dark:bg-neutral-900">
              <Leaf className="size-4 shrink-0" aria-hidden />
              环保循环
            </li>
            <li className="flex items-center gap-2 rounded-xl border-2 border-neutral-950 bg-neutral-50 px-3 py-2 dark:border-neutral-100 dark:bg-neutral-900">
              <PiggyBank className="size-4 shrink-0" aria-hidden />
              低价好书
            </li>
            <li className="flex items-center gap-2 rounded-xl border-2 border-neutral-950 bg-neutral-50 px-3 py-2 dark:border-neutral-100 dark:bg-neutral-900">
              <UsersRound className="size-4 shrink-0" aria-hidden />
              校园互助
            </li>
          </ul>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href={publishHref}
              className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl border-2 border-neutral-950 bg-neutral-950 px-6 text-base font-semibold text-white transition-all hover:scale-105 hover:bg-neutral-800 dark:border-neutral-100 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200"
            >
              发布我的书
            </Link>
            <Link
              href="/#books"
              className={buttonVariants({
                variant: "ghost",
                size: "lg",
                className:
                  "rounded-xl border-2 border-neutral-950 bg-white text-neutral-900 hover:bg-neutral-50 dark:border-neutral-100 dark:bg-neutral-950 dark:text-neutral-50 dark:hover:bg-neutral-900",
              })}
            >
              逛逛广场
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
