import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { SiteHeader } from "@/components/layout/site-header";
export default async function MessagesPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const conversations = await prisma.conversation.findMany({
    where: {
      OR: [{ buyerId: session.user.id }, { sellerId: session.user.id }],
    },
    include: {
      book: { select: { id: true, title: true, images: true } },
    },
    orderBy: { lastMessageAt: "desc" },
  });

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-8">
        <h1 className="mb-6 text-2xl font-bold tracking-tight">消息</h1>
        {conversations.length === 0 ? (
          <p className="text-muted-foreground">暂无会话，在教材详情页联系卖家即可发起聊天。</p>
        ) : (
          <ul className="divide-y rounded-lg border">
            {conversations.map((c) => {
              const other =
                c.buyerId === session.user!.id ? "卖家" : "买家";
              return (
                <li key={c.id}>
                  <Link
                    href={`/messages/${c.id}`}
                    className="hover:bg-muted/60 flex flex-col gap-1 px-4 py-4 transition-colors"
                  >
                    <span className="font-medium">{c.book.title}</span>
                    <span className="text-muted-foreground text-xs">
                      与{other} · {c.lastMessageAt.toLocaleString("zh-CN")}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </main>
    </div>
  );
}
