"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export type MessageActionState = { error?: string; success?: boolean };

export async function ensureConversationAction(bookId: string): Promise<{ conversationId?: string; error?: string }> {
  const session = await auth();
  if (!session?.user?.id) return { error: "请先登录" };

  const book = await prisma.book.findUnique({ where: { id: bookId } });
  if (!book) return { error: "教材不存在" };

  const buyerId = session.user.id;
  const sellerId = book.sellerId;
  if (buyerId === sellerId) return { error: "不能与自己聊天" };

  const existing = await prisma.conversation.findUnique({
    where: { bookId_buyerId: { bookId, buyerId } },
  });
  if (existing) return { conversationId: existing.id };

  const conv = await prisma.conversation.create({
    data: {
      bookId,
      buyerId,
      sellerId,
    },
  });

  revalidatePath("/messages");
  return { conversationId: conv.id };
}

export async function sendMessageAction(
  conversationId: string,
  content: string,
): Promise<MessageActionState> {
  const session = await auth();
  if (!session?.user?.id) return { error: "请先登录" };

  const text = content.trim();
  if (!text) return { error: "内容不能为空" };
  if (text.length > 4000) return { error: "内容过长" };

  const conv = await prisma.conversation.findUnique({ where: { id: conversationId } });
  if (!conv) return { error: "会话不存在" };
  if (conv.buyerId !== session.user.id && conv.sellerId !== session.user.id) {
    return { error: "无权发送" };
  }

  await prisma.$transaction([
    prisma.message.create({
      data: {
        conversationId,
        senderId: session.user.id,
        content: text,
      },
    }),
    prisma.conversation.update({
      where: { id: conversationId },
      data: { lastMessageAt: new Date() },
    }),
  ]);

  revalidatePath("/messages");
  revalidatePath(`/messages/${conversationId}`);
  return { success: true };
}
