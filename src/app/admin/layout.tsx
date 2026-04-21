import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/layout/site-header";

export const dynamic = "force-dynamic";

const links = [
  { href: "/admin/stats", label: "数据统计" },
  { href: "/admin/users", label: "用户管理" },
  { href: "/admin/books", label: "教材审核" },
  { href: "/admin/orders", label: "订单管理" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <div className="mx-auto flex w-full max-w-6xl flex-1 gap-8 px-4 py-8">
        <aside className="hidden w-48 shrink-0 flex-col gap-1 md:flex">
          <p className="text-muted-foreground mb-2 text-xs font-medium uppercase">管理后台</p>
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="hover:bg-muted rounded-md px-3 py-2 text-sm font-medium"
            >
              {l.label}
            </Link>
          ))}
        </aside>
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
