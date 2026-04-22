import { Suspense } from "react";
import { auth } from "@/auth";
import { HomeNavbar, type HomeNavbarUser } from "@/components/home/home-navbar";
import { HomeHero } from "@/components/home/home-hero";
import { CategoryGrid } from "@/components/home/category-grid";
import { HomeBooksFeed } from "@/components/home/home-books-feed";
import { HomeBooksSkeleton } from "@/components/home/home-books-skeleton";

export const dynamic = "force-dynamic";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const session = await auth();

  const navUser: HomeNavbarUser | null = session?.user
    ? {
        name: session.user.name ?? "用户",
        email: session.user.email ?? "",
        role: session.user.role,
      }
    : null;

  return (
    <div className="flex min-h-screen flex-col bg-neutral-100 dark:bg-neutral-950">
      <HomeNavbar user={navUser} />
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-10 px-4 py-8">
        <HomeHero loggedIn={Boolean(session?.user)} />
        <CategoryGrid />
        <Suspense fallback={<HomeBooksSkeleton />}>
          <HomeBooksFeed searchParams={sp} />
        </Suspense>
      </main>
    </div>
  );
}
