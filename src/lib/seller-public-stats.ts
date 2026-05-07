import { OrderStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export type SellerPublicStats = {
  avgRating: number | null;
  reviewCount: number;
  completedSales: number;
};

/**
 * Batch-load seller trust signals for listing cards (avg rating, review count, completed orders as seller).
 */
export async function getSellerPublicStatsBatch(sellerIds: string[]): Promise<Map<string, SellerPublicStats>> {
  const unique = [...new Set(sellerIds.filter(Boolean))];
  const empty = new Map<string, SellerPublicStats>();
  if (unique.length === 0) return empty;

  const [reviewGroups, saleGroups] = await Promise.all([
    prisma.review.groupBy({
      by: ["revieweeId"],
      where: { revieweeId: { in: unique } },
      _avg: { rating: true },
      _count: { _all: true },
    }),
    prisma.order.groupBy({
      by: ["sellerId"],
      where: { sellerId: { in: unique }, status: OrderStatus.COMPLETED },
      _count: { _all: true },
    }),
  ]);

  const reviewMap = new Map(
    reviewGroups.map((g) => [
      g.revieweeId,
      {
        avgRating: g._avg.rating != null ? Number(g._avg.rating) : null,
        reviewCount: g._count._all,
      },
    ]),
  );
  const saleMap = new Map(saleGroups.map((g) => [g.sellerId, g._count._all]));

  const result = new Map<string, SellerPublicStats>();
  for (const id of unique) {
    const r = reviewMap.get(id);
    result.set(id, {
      avgRating: r?.avgRating ?? null,
      reviewCount: r?.reviewCount ?? 0,
      completedSales: saleMap.get(id) ?? 0,
    });
  }
  return result;
}
