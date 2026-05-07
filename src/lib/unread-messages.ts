import { cache } from "react";
import { prisma } from "@/lib/prisma";

/** Dedupe within one request (layouts + pages calling messaging chrome). */
export const getUnreadMessageCountForUser = cache(async (userId: string): Promise<number> => {
  const convs = await prisma.conversation.findMany({
    where: { OR: [{ buyerId: userId }, { sellerId: userId }] },
    select: {
      id: true,
      participants: {
        where: { userId },
        select: { lastReadAt: true },
      },
    },
  });

  let total = 0;
  for (const c of convs) {
    const lastRead = c.participants[0]?.lastReadAt ?? new Date(0);
    const n = await prisma.message.count({
      where: {
        conversationId: c.id,
        senderId: { not: userId },
        createdAt: { gt: lastRead },
      },
    });
    total += n;
  }
  return total;
});
