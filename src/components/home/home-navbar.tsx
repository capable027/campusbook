"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  BookOpen,
  LayoutDashboard,
  Menu,
  MessageCircle,
  Search,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { UserNavClient } from "@/components/layout/user-nav-client";
import { cn } from "@/lib/utils";

export type HomeNavbarUser = {
  name: string;
  email: string;
  role: "USER" | "ADMIN";
  image?: string | null;
};

type HomeNavbarProps = {
  user: HomeNavbarUser | null;
  /** Unread DM count for signed-in users */
  unreadMessages?: number;
  className?: string;
};

export function HomeNavbar({ user, unreadMessages = 0, className }: HomeNavbarProps) {
  const sp = useSearchParams();
  const qFromUrl = sp.get("q") ?? "";
  const [searchQuery, setSearchQuery] = React.useState(qFromUrl);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  React.useEffect(() => {
    setSearchQuery(qFromUrl);
  }, [qFromUrl]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b-2 border-neutral-950 bg-white shadow-sm backdrop-blur-md supports-[backdrop-filter]:bg-white/90 dark:border-neutral-100 dark:bg-neutral-950 dark:supports-[backdrop-filter]:bg-neutral-950/90",
        className,
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4 sm:gap-4">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 rounded-xl py-1 pr-2 font-semibold tracking-tight text-foreground transition-opacity hover:opacity-90"
        >
          <span className="flex size-9 items-center justify-center rounded-xl bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100">
            <BookOpen className="size-5" aria-hidden />
          </span>
          <span className="hidden sm:inline">CampusBook</span>
        </Link>

        <form
          action="/books"
          method="get"
          className="mx-auto hidden min-w-0 max-w-xl flex-1 items-center gap-2 md:flex"
        >
          <div className="relative min-w-0 flex-1">
            <Input
              name="q"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="书名、ISBN…"
              className="h-10 rounded-xl border-2 border-neutral-950 bg-white pr-3 pl-3 shadow-none focus-visible:bg-white dark:border-neutral-100 dark:bg-neutral-950"
              aria-label="搜索书名或 ISBN"
            />
          </div>
          <Button type="submit" size="icon" className="shrink-0 rounded-xl" aria-label="搜索">
            <Search className="size-4" />
          </Button>
        </form>

        <div className="ml-auto flex shrink-0 items-center gap-1 sm:gap-2">
          <form action="/books" method="get" className="flex items-center gap-1 md:hidden">
            <Input
              name="q"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="书名 / ISBN"
              className="h-9 w-[min(42vw,11rem)] rounded-xl border-2 border-neutral-950 bg-white py-0 pr-2 pl-3 text-sm dark:border-neutral-100 dark:bg-neutral-950"
              aria-label="搜索"
            />
            <Button type="submit" size="icon" variant="secondary" className="h-9 shrink-0 rounded-xl" aria-label="搜索">
              <Search className="size-4" />
            </Button>
          </form>

          <div className="hidden items-center gap-1 sm:flex sm:gap-2">
            {user ? (
              <>
                <Link
                  href="/books/new"
                  className={buttonVariants({ variant: "ghost", size: "sm", className: "rounded-xl" })}
                >
                  发布
                </Link>
                <Link
                  href="/messages"
                  className={buttonVariants({
                    variant: "ghost",
                    size: "sm",
                    className: "relative rounded-xl gap-1.5",
                  })}
                >
                  <MessageCircle className="size-4" />
                  <span className="sr-only sm:not-sr-only">消息</span>
                  {unreadMessages > 0 ? (
                    <span
                      className="absolute top-1 right-1 flex min-h-4 min-w-4 translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-semibold text-white"
                      aria-label={`${unreadMessages} 条未读`}
                    >
                      {unreadMessages > 99 ? "99+" : unreadMessages}
                    </span>
                  ) : null}
                </Link>
                {user.role === "ADMIN" ? (
                  <Link
                    href="/admin/stats"
                    className={buttonVariants({ variant: "ghost", size: "sm", className: "rounded-xl gap-1.5" })}
                  >
                    <LayoutDashboard className="size-4" />
                    <span className="sr-only sm:not-sr-only">管理</span>
                  </Link>
                ) : null}
                <UserNavClient name={user.name} email={user.email} imageUrl={user.image ?? undefined} />
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className={buttonVariants({ variant: "ghost", size: "sm", className: "rounded-xl" })}
                >
                  登录
                </Link>
                <Link href="/register" className={buttonVariants({ size: "sm", className: "rounded-xl" })}>
                  注册
                </Link>
              </>
            )}
          </div>

          <Dialog open={mobileOpen} onOpenChange={setMobileOpen}>
            <DialogTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="shrink-0 rounded-xl sm:hidden"
                  aria-label="打开菜单"
                >
                  <Menu className="size-5" />
                </Button>
              }
            />
            <DialogContent className="max-h-[85vh] overflow-y-auto rounded-xl sm:max-w-sm">
              <DialogHeader>
                <DialogTitle>菜单</DialogTitle>
              </DialogHeader>
              <nav className="flex flex-col gap-2 pt-2">
                <Link
                  href="/"
                  className={buttonVariants({ variant: "ghost", className: "justify-start rounded-xl" })}
                  onClick={() => setMobileOpen(false)}
                >
                  首页
                </Link>
                <Link
                  href="/books"
                  className={buttonVariants({ variant: "ghost", className: "justify-start rounded-xl" })}
                  onClick={() => setMobileOpen(false)}
                >
                  教材广场
                </Link>
                {user ? (
                  <>
                    <Link
                      href="/books/new"
                      className={buttonVariants({ variant: "ghost", className: "justify-start rounded-xl" })}
                      onClick={() => setMobileOpen(false)}
                    >
                      发布教材
                    </Link>
                    <Link
                      href="/messages"
                      className={buttonVariants({ variant: "ghost", className: "justify-start rounded-xl" })}
                      onClick={() => setMobileOpen(false)}
                    >
                      消息
                    </Link>
                    {user.role === "ADMIN" ? (
                      <Link
                        href="/admin/stats"
                        className={buttonVariants({ variant: "ghost", className: "justify-start rounded-xl" })}
                        onClick={() => setMobileOpen(false)}
                      >
                        管理后台
                      </Link>
                    ) : null}
                    <div className="border-t pt-2">
                      <UserNavClient name={user.name} email={user.email} imageUrl={user.image ?? undefined} />
                    </div>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className={buttonVariants({ variant: "ghost", className: "justify-start rounded-xl" })}
                      onClick={() => setMobileOpen(false)}
                    >
                      登录
                    </Link>
                    <Link
                      href="/register"
                      className={buttonVariants({ className: "rounded-xl" })}
                      onClick={() => setMobileOpen(false)}
                    >
                      注册
                    </Link>
                  </>
                )}
              </nav>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </header>
  );
}
