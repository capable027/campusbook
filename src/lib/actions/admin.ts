"use server";

import { revalidatePath } from "next/cache";
import { BookStatus } from "@prisma/client";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("无权操作");
  }
  return session.user;
}

export async function setUserBannedAction(userId: string, banned: boolean, reason?: string) {
  await requireAdmin();
  await prisma.user.update({
    where: { id: userId },
    data: {
      banned,
      bannedReason: banned ? reason ?? "违反平台规则" : null,
    },
  });
  revalidatePath("/admin/users");
}

export async function setBookStatusAdminAction(
  bookId: string,
  status: BookStatus,
  reviewNote?: string,
) {
  await requireAdmin();
  await prisma.book.update({
    where: { id: bookId },
    data: {
      status,
      reviewNote: status === BookStatus.REJECTED ? reviewNote ?? null : null,
    },
  });
  revalidatePath("/admin/books");
  revalidatePath("/");
}
