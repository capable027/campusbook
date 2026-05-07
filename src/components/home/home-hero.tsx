import Link from "next/link";
import { Leaf, PiggyBank, UsersRound } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function HeroBooksDecoration({ className }: { className?: string }) {
  return (
    <div className={cn("mx-auto w-full max-w-[11rem]", className)} aria-hidden>
      <svg viewBox="0 0 176 100" className="h-auto w-full text-neutral-900 dark:text-neutral-100" fill="none">
        <title>书本插画</title>
        <path
          stroke="currentColor"
          strokeWidth={2}
          strokeLinejoin="round"
          d="M18 22h52c6 0 10 4 10 10v58H28c-5.5 0-10-4.5-10-10V22z"
          className="opacity-[0.85]"
        />
        <path
          stroke="currentColor"
          strokeWidth={2}
          strokeLinejoin="round"
          d="M70 32h48c6 0 10 4 10 10v48H82c-5.5 0-10-4.5-10-10V32z"
        />
        <path
          stroke="currentColor"
          strokeWidth={2}
          strokeLinejoin="round"
          d="M116 18h42c6 0 10 4 10 10v62h-42c-6 0-10-4-10-10V18z"
          className="opacity-[0.75]"
        />
        <path stroke="currentColor" strokeWidth={2} strokeLinecap="round" d="M32 40h28M94 48h24M130 36h22" />
        <path stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" d="M32 52h20M94 60h18M130 48h14" className="opacity-50" />
        <circle cx="44" cy="72" r="3" fill="currentColor" className="opacity-40" />
        <circle cx="100" cy="76" r="3" fill="currentColor" className="opacity-35" />
        <circle cx="144" cy="70" r="3" fill="currentColor" className="opacity-30" />
      </svg>
    </div>
  );
}

type HomeHeroProps = {
  loggedIn: boolean;
  className?: string;
};

export function HomeHero({ loggedIn, className }: HomeHeroProps) {
  const publishHref = loggedIn ? "/books/new" : "/login";

  return (
    <section
      className={cn(
        "relative flex min-h-0 flex-1 flex-col items-center justify-center overflow-hidden px-4 py-14 text-center sm:px-6 sm:py-20",
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
      <div
        className="pointer-events-none absolute inset-0 [mask-image:linear-gradient(180deg,black,transparent_90%)] [background-image:radial-gradient(circle_at_1px_1px,rgb(0_0_0/0.055)_1px,transparent_0)] [background-size:24px_24px] dark:[background-image:radial-gradient(circle_at_1px_1px,rgb(255_255_255/0.06)_1px,transparent_0)]"
        aria-hidden
      />

      <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-col items-center pb-8">
        <HeroBooksDecoration className="mb-8 opacity-90" />

        <p className="mb-6 text-sm font-medium tracking-wide text-muted-foreground">
          校园二手 · 可信交易
        </p>

        <h1 className="mb-7 text-5xl font-bold tracking-tight text-foreground sm:text-6xl sm:leading-[1.08]">
          让旧书流动起来
        </h1>

        <p className="mb-10 max-w-xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
          环保减碳、省钱购书、同校互助 — 把闲置教材交给下一届同学。
        </p>

        <ul
          className="mb-12 flex max-w-xl flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm font-normal text-muted-foreground"
          aria-label="平台亮点"
        >
          <li className="flex items-center gap-2">
            <Leaf className="size-4 shrink-0 text-muted-foreground/70" aria-hidden />
            <span>环保循环</span>
          </li>
          <li className="flex items-center gap-2">
            <PiggyBank className="size-4 shrink-0 text-muted-foreground/70" aria-hidden />
            <span>低价好书</span>
          </li>
          <li className="flex items-center gap-2">
            <UsersRound className="size-4 shrink-0 text-muted-foreground/70" aria-hidden />
            <span>校园互助</span>
          </li>
        </ul>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href={publishHref}
            className={cn(
              "inline-flex h-12 items-center justify-center gap-1.5 rounded-xl border-2 border-neutral-950",
              "bg-neutral-950 px-8 text-base font-semibold text-white shadow-sm",
              "transition-all duration-200 ease-out",
              "hover:-translate-y-0.5 hover:bg-neutral-800 hover:shadow-md",
              "active:translate-y-0 active:shadow-sm",
              "dark:border-neutral-100 dark:bg-white dark:text-neutral-950 dark:shadow-sm",
              "dark:hover:bg-neutral-200 dark:hover:shadow-md",
            )}
          >
            发布我的书
          </Link>
          <Link
            href="/books"
            className={buttonVariants({
              variant: "ghost",
              size: "lg",
              className: cn(
                "h-12 rounded-xl border-2 border-neutral-950 bg-white px-8 text-base font-semibold shadow-none focus-visible:bg-white",
                "text-neutral-900 transition-all duration-200 hover:-translate-y-0.5 hover:bg-neutral-50 hover:shadow-sm",
                "dark:border-neutral-100 dark:bg-neutral-950 dark:text-neutral-50 dark:focus-visible:bg-neutral-950",
                "dark:hover:bg-neutral-900",
              ),
            })}
          >
            逛逛广场
          </Link>
        </div>

        <div className="mt-16 w-full max-w-2xl border-t-2 border-neutral-950 pt-12 dark:border-neutral-100">
          <p className="mb-8 text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">
            使用流程
          </p>
          <ol className="grid gap-8 text-left sm:grid-cols-3 sm:gap-6 sm:text-center">
            <li className="flex flex-col items-start gap-3 sm:items-center">
              <span
                className={cn(
                  "flex size-9 shrink-0 items-center justify-center rounded-full border-2 border-neutral-950",
                  "text-sm font-semibold text-foreground dark:border-neutral-100",
                )}
              >
                1
              </span>
              <div>
                <p className="font-medium text-foreground">发布 / 浏览</p>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  上架闲置教材，或在广场按书名、院系筛选。
                </p>
              </div>
            </li>
            <li className="flex flex-col items-start gap-3 sm:items-center">
              <span
                className={cn(
                  "flex size-9 shrink-0 items-center justify-center rounded-full border-2 border-neutral-950",
                  "text-sm font-semibold text-foreground dark:border-neutral-100",
                )}
              >
                2
              </span>
              <div>
                <p className="font-medium text-foreground">站内沟通</p>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  用消息约定价格、成色与取书方式，留痕更安心。
                </p>
              </div>
            </li>
            <li className="flex flex-col items-start gap-3 sm:items-center">
              <span
                className={cn(
                  "flex size-9 shrink-0 items-center justify-center rounded-full border-2 border-neutral-950",
                  "text-sm font-semibold text-foreground dark:border-neutral-100",
                )}
              >
                3
              </span>
              <div>
                <p className="font-medium text-foreground">当面交割</p>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  校园内当面验书、付款，无物流、更低碳。
                </p>
              </div>
            </li>
          </ol>
        </div>

        <p className="mt-12 max-w-lg text-balance text-xs leading-relaxed text-muted-foreground">
          教材 · 通识 · 专业课 · 考研资料 — 同一校园，就近流转。
        </p>
      </div>
    </section>
  );
}
