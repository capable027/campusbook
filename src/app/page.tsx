import { auth } from "@/auth";
import { HomeNavbar, type HomeNavbarUser } from "@/components/home/home-navbar";
import { HomeHero } from "@/components/home/home-hero";
import { getUnreadMessageCountForUser } from "@/lib/unread-messages";

export const dynamic = "force-dynamic";

export default async function HomePage() {
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
    <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-white dark:bg-neutral-950">
      <HomeNavbar user={navUser} unreadMessages={unread} />
      <main className="flex flex-1 flex-col">
        <HomeHero loggedIn={Boolean(session?.user)} />
      </main>
    </div>
  );
}
