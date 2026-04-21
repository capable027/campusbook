"use server";

import { revalidatePath } from "next/cache";
import { OrderStatus, BookStatus } from "@prisma/client";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export type OrderActionState = { error?: string; success?: boolean };

export async function createOrderAction(bookId: string): Promise<OrderActionState> {
  const session = await auth();
  if (!session?.user?.id) return { error: "请先登录" };

  const book = await prisma.book.findUnique({ where: { id: bookId } });
  if (!book || book.status !== BookStatus.ON_SALE) {
    return { error: "该教材不可下单" };
  }
  if (book.sellerId === session.user.id) {
    return { error: "不能购买自己发布的教材" };
  }

  const active = await prisma.order.findFirst({
    where: {
      bookId,
      status: { in: [OrderStatus.PENDING, OrderStatus.CONFIRMED, OrderStatus.IN_PROGRESS] },
    },
  });
  if (active) {
    return { error: "该教材已有进行中的订单" };
  }

  await prisma.order.create({
    data: {
      bookId,
      buyerId: session.user.id,
      sellerId: book.sellerId,
      status: OrderStatus.PENDING,
    },
  });

  revalidatePath("/me/orders");
  revalidatePath(`/books/${bookId}`);
  return { success: true };
}

export async function updateOrderStatusAction(
  orderId: string,
  next: OrderStatus,
): Promise<OrderActionState> {
  const session = await auth();
  if (!session?.user?.id) return { error: "请先登录" };

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { book: true },
  });
  if (!order) return { error: "订单不存在" };

  const uid = session.user.id;
  const isBuyer = order.buyerId === uid;
  const isSeller = order.sellerId === uid;

  let allowed = false;
  switch (next) {
    case OrderStatus.CONFIRMED:
      allowed = isSeller && order.status === OrderStatus.PENDING;
      break;
    case OrderStatus.IN_PROGRESS:
      allowed = (isBuyer || isSeller) && order.status === OrderStatus.CONFIRMED;
      break;
    case OrderStatus.COMPLETED:
      allowed =
        (isBuyer || isSeller) &&
        (order.status === OrderStatus.IN_PROGRESS || order.status === OrderStatus.CONFIRMED);
      break;
    case OrderStatus.CANCELLED:
      allowed =
        (isBuyer || isSeller) &&
        order.status !== OrderStatus.COMPLETED &&
        order.status !== OrderStatus.CANCELLED;
      break;
    default:
      allowed = false;
  }

  if (!allowed) return { error: "当前状态不允许此操作" };

  await prisma.$transaction(async (tx) => {
    await tx.order.update({
      where: { id: orderId },
      data: { status: next },
    });
    if (next === OrderStatus.COMPLETED) {
      await tx.book.update({
        where: { id: order.bookId },
        data: { status: BookStatus.SOLD_OFF },
      });
    }
    if (next === OrderStatus.CANCELLED && order.status !== OrderStatus.COMPLETED) {
      const other = await tx.order.findFirst({
        where: {
          bookId: order.bookId,
          id: { not: orderId },
          status: { in: [OrderStatus.PENDING, OrderStatus.CONFIRMED, OrderStatus.IN_PROGRESS] },
        },
      });
      if (!other) {
        await tx.book.update({
          where: { id: order.bookId },
          data: { status: BookStatus.ON_SALE },
        });
      }
    }
  });

  revalidatePath("/me/orders");
  revalidatePath(`/me/orders/${orderId}`);
  revalidatePath(`/books/${order.bookId}`);
  return { success: true };
}
