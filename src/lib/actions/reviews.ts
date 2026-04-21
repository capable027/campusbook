"use server";

import { revalidatePath } from "next/cache";
import { OrderStatus } from "@prisma/client";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { reviewSchema } from "@/lib/validations";

export type ReviewActionState = { error?: string; success?: boolean };

export async function createReviewAction(
  _prev: ReviewActionState | undefined,
  formData: FormData,
): Promise<ReviewActionState> {
  const session = await auth();
  if (!session?.user?.id) return { error: "请先登录" };

  const parsed = reviewSchema.safeParse({
    orderId: formData.get("orderId"),
    rating: formData.get("rating"),
    comment: formData.get("comment") || undefined,
  });
  if (!parsed.success) {
    return { error: parsed.error.flatten().formErrors.join("；") || "校验失败" };
  }

  const order = await prisma.order.findUnique({
    where: { id: parsed.data.orderId },
    include: { book: true },
  });
  if (!order || order.buyerId !== session.user.id) return { error: "无权评价" };
  if (order.status !== OrderStatus.COMPLETED) return { error: "订单未完成" };

  const exists = await prisma.review.findUnique({ where: { orderId: order.id } });
  if (exists) return { error: "已评价过" };

  await prisma.review.create({
    data: {
      orderId: order.id,
      reviewerId: session.user.id,
      revieweeId: order.sellerId,
      rating: parsed.data.rating,
      comment: parsed.data.comment || null,
    },
  });

  revalidatePath(`/me/orders/${order.id}`);
  revalidatePath(`/books/${order.book.id}`);
  return { success: true };
}
