import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { SiteHeader } from "@/components/layout/site-header";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ConversationChat } from "@/components/messages/conversation-chat";

export default async function ConversationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) notFound();

  const conv = await prisma.conversation.findUnique({
    where: { id },
    include: {
      book: { select: { id: true, title: true } },
    },
  });
  if (!conv || (conv.buyerId !== session.user.id && conv.sellerId !== session.user.id)) {
    notFound();
  }

  const rows = await prisma.message.findMany({
    where: { conversationId: id },
    orderBy: { createdAt: "asc" },
    take: 200,
    include: {
      sender: { select: { id: true, name: true } },
    },
  });

  const initialMessages = rows.map((m) => ({
    id: m.id,
    content: m.content,
    createdAt: m.createdAt.toISOString(),
    sender: m.sender,
  }));

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-8">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <Link
              href="/messages"
              className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
            >
              ← 会话列表
            </Link>
            <h1 className="mt-2 text-xl font-semibold">{conv.book.title}</h1>
            <p className="text-muted-foreground text-sm">
              <Link href={`/books/${conv.book.id}`} className="hover:underline">
                查看教材详情
              </Link>
            </p>
          </div>
        </div>
        <ConversationChat
          conversationId={id}
          currentUserId={session.user.id}
          initialMessages={initialMessages}
        />
      </main>
    </div>
  );
}
