import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { SiteHeader } from "@/components/layout/site-header";
import { Badge } from "@/components/ui/badge";
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
      buyer: { select: { id: true, name: true } },
      seller: { select: { id: true, name: true } },
    },
  });
  if (!conv || (conv.buyerId !== session.user.id && conv.sellerId !== session.user.id)) {
    notFound();
  }

  await prisma.conversationParticipant.upsert({
    where: {
      conversationId_userId: {
        conversationId: id,
        userId: session.user.id,
      },
    },
    create: {
      conversationId: id,
      userId: session.user.id,
      lastReadAt: new Date(),
    },
    update: {
      lastReadAt: new Date(),
    },
  });

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

  const isBuyer = conv.buyerId === session.user.id;
  const peer = isBuyer ? conv.seller : conv.buyer;
  const peerRole = isBuyer ? "卖家" : "买家";

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="bg-muted/15 mx-auto w-full max-w-2xl flex-1 px-4 py-10">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <Link
              href="/messages"
              className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
            >
              ← 会话列表
            </Link>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-semibold">{peer.name}</h1>
              <Badge variant="secondary" className="font-normal">
                {peerRole}
              </Badge>
            </div>
            <p className="text-muted-foreground mt-1 text-sm">
              《{conv.book.title}》 ·{" "}
              <Link href={`/books/${conv.book.id}`} className="text-primary hover:underline">
                教材详情
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
