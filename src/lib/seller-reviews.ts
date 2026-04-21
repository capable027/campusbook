import { prisma } from "@/lib/prisma";

export async function getSellerReviewPublic(sellerId: string) {
  const [agg, reviews] = await Promise.all([
    prisma.review.aggregate({
      where: { revieweeId: sellerId },
      _avg: { rating: true },
      _count: { _all: true },
    }),
    prisma.review.findMany({
      where: { revieweeId: sellerId },
      orderBy: { createdAt: "desc" },
      take: 10,
      select: {
        id: true,
        rating: true,
        comment: true,
        createdAt: true,
        order: { select: { book: { select: { title: true } } } },
      },
    }),
  ]);

  return { agg, reviews };
}
