import Link from "next/link";
import { auth } from "@/auth";
import { BookOpen, LayoutDashboard, MessageCircle } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { UserNavClient } from "@/components/layout/user-nav-client";

export async function SiteHeader() {
  const session = await auth();

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <BookOpen className="h-5 w-5" aria-hidden />
          CampusBook
        </Link>
        <nav className="flex flex-1 items-center justify-end gap-2 sm:gap-4">
          <Link
            href="/"
            className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "hidden sm:inline-flex")}
          >
            教材广场
          </Link>
          {session?.user ? (
            <>
              <Link href="/books/new" className={buttonVariants({ variant: "ghost", size: "sm" })}>
                <span className="hidden sm:inline">发布教材</span>
                <span className="sm:hidden">发布</span>
              </Link>
              <Link href="/messages" className={buttonVariants({ variant: "ghost", size: "sm" })}>
                <MessageCircle className="h-4 w-4 sm:mr-1" />
                <span className="hidden sm:inline">消息</span>
              </Link>
              {session.user.role === "ADMIN" ? (
                <Link href="/admin/stats" className={buttonVariants({ variant: "ghost", size: "sm" })}>
                  <LayoutDashboard className="h-4 w-4 sm:mr-1" />
                  <span className="hidden sm:inline">管理</span>
                </Link>
              ) : null}
              <UserNavClient name={session.user.name ?? "用户"} email={session.user.email ?? ""} />
            </>
          ) : (
            <>
              <Link href="/login" className={buttonVariants({ variant: "ghost", size: "sm" })}>
                登录
              </Link>
              <Link href="/register" className={buttonVariants({ size: "sm" })}>
                注册
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
