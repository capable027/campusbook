import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { SiteHeader } from "@/components/layout/site-header";
import { Card } from "@/components/ui/card";

export default async function MessagesPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const conversations = await prisma.conversation.findMany({
    where: {
      OR: [{ buyerId: session.user.id }, { sellerId: session.user.id }],
    },
    include: {
      book: { select: { id: true, title: true, images: true } },
      buyer: { select: { id: true, name: true } },
      seller: { select: { id: true, name: true } },
    },
    orderBy: { lastMessageAt: "desc" },
  });

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="bg-muted/20 mx-auto w-full max-w-2xl flex-1 px-4 py-10">
        <header className="mb-8 space-y-1 border-b pb-6">
          <h1 className="text-2xl font-bold tracking-tight">消息</h1>
          <p className="text-muted-foreground text-sm">与买家或卖家就教材沟通；点击进入会话。</p>
        </header>
        {conversations.length === 0 ? (
          <p className="text-muted-foreground">暂无会话，在教材详情页联系卖家即可发起聊天。</p>
        ) : (
          <Card className="overflow-hidden py-0">
            <ul className="divide-y">
              {conversations.map((c) => {
                const isBuyer = c.buyerId === session.user!.id;
                const peer = isBuyer ? c.seller : c.buyer;
                const peerRole = isBuyer ? "卖家" : "买家";
                return (
                  <li key={c.id}>
                    <Link
                      href={`/messages/${c.id}`}
                      className="hover:bg-muted/60 flex flex-col gap-1 px-4 py-4 transition-colors"
                    >
                      <span className="font-medium">{peer.name}</span>
                      <span className="text-muted-foreground line-clamp-1 text-sm">{c.book.title}</span>
                      <span className="text-muted-foreground text-xs">
                        {peerRole} · {c.lastMessageAt.toLocaleString("zh-CN")}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </Card>
        )}
      </main>
    </div>
  );
}
