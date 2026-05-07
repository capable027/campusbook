import Link from "next/link";
import { auth } from "@/auth";
import { BookOpen, LayoutDashboard, MessageCircle } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { UserNavClient } from "@/components/layout/user-nav-client";
import { getUnreadMessageCountForUser } from "@/lib/unread-messages";

export async function SiteHeader() {
  const session = await auth();
  const unread =
    session?.user?.id ? await getUnreadMessageCountForUser(session.user.id) : 0;

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4">
        <span className="flex items-center gap-2 font-semibold tracking-tight">
          <BookOpen className="h-5 w-5" aria-hidden />
          CampusBook
        </span>
        <nav className="flex flex-1 items-center justify-end gap-2 sm:gap-4">
          <Link
            href="/books"
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
              <Link
                href="/messages"
                className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "relative")}
              >
                <MessageCircle className="h-4 w-4 sm:mr-1" />
                <span className="hidden sm:inline">消息</span>
                {unread > 0 ? (
                  <span
                    className="absolute top-0 right-0 flex min-h-4 min-w-4 translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-semibold text-white sm:right-auto sm:left-3 sm:translate-x-0"
                    aria-label={`${unread} 条未读`}
                  >
                    {unread > 99 ? "99+" : unread}
                  </span>
                ) : null}
              </Link>
              {session.user.role === "ADMIN" ? (
                <Link href="/admin/stats" className={buttonVariants({ variant: "ghost", size: "sm" })}>
                  <LayoutDashboard className="h-4 w-4 sm:mr-1" />
                  <span className="hidden sm:inline">管理</span>
                </Link>
              ) : null}
              <UserNavClient
                name={session.user.name ?? "用户"}
                email={session.user.email ?? ""}
                imageUrl={session.user.image ?? undefined}
              />
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
