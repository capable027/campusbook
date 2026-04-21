import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const conv = await prisma.conversation.findUnique({ where: { id } });
  if (!conv || (conv.buyerId !== session.user.id && conv.sellerId !== session.user.id)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const url = new URL(req.url);
  const after = url.searchParams.get("after");

  const messages = await prisma.message.findMany({
    where: {
      conversationId: id,
      ...(after
        ? {
            createdAt: { gt: new Date(after) },
          }
        : {}),
    },
    orderBy: { createdAt: "asc" },
    take: 100,
    include: {
      sender: { select: { id: true, name: true } },
    },
  });

  return NextResponse.json({ messages });
}
