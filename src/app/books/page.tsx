import { Suspense } from "react";
import { auth } from "@/auth";
import { HomeNavbar, type HomeNavbarUser } from "@/components/home/home-navbar";
import { HomeBooksFeed } from "@/components/home/home-books-feed";
import { HomeBooksSkeleton } from "@/components/home/home-books-skeleton";
import { getUnreadMessageCountForUser } from "@/lib/unread-messages";

export const dynamic = "force-dynamic";

export default async function BooksBrowsePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const session = await auth();
  const unread = session?.user?.id ? await getUnreadMessageCountForUser(session.user.id) : 0;

  const navUser: HomeNavbarUser | null = session?.user
    ? {
        name: session.user.name ?? "用户",
        email: session.user.email ?? "",
        role: session.user.role,
        image: session.user.image,
      }
    : null;

  return (
    <div className="flex min-h-screen flex-col bg-neutral-100 dark:bg-neutral-950">
      <HomeNavbar user={navUser} unreadMessages={unread} />
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 py-8">
        <header className="space-y-1 border-b border-neutral-200 pb-6 dark:border-neutral-800">
          <h1 className="text-2xl font-bold tracking-tight">教材广场</h1>
          <p className="text-muted-foreground text-sm">
            浏览在售教材；默认展示最新发布，支持关键词与专业筛选。
          </p>
        </header>
        <Suspense fallback={<HomeBooksSkeleton />}>
          <HomeBooksFeed searchParams={sp} listingBasePath="/books" showDiscoverySections={false} />
        </Suspense>
      </main>
    </div>
  );
}
