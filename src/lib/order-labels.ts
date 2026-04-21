import { OrderStatus } from "@prisma/client";

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  PENDING: "待确认",
  CONFIRMED: "已确认",
  IN_PROGRESS: "交易中",
  COMPLETED: "已完成",
  CANCELLED: "已取消",
};

export const BOOK_STATUS_LABEL: Record<string, string> = {
  DRAFT: "草稿",
  PENDING_REVIEW: "待审核",
  ON_SALE: "在售",
  REJECTED: "已驳回",
  SOLD_OFF: "已售出",
  REMOVED: "已下架",
};
