import type { Prisma } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import { bookCardSelect } from "@/lib/book-queries";

export type HomeBookCardRow = Prisma.BookGetPayload<{ select: typeof bookCardSelect }>;

/** Demo rows for “猜你喜欢” carousel when there is no personalized data. */
export const HOME_MOCK_BOOKS: HomeBookCardRow[] = [
  {
    id: "mock-1",
    title: "高等数学（第七版 上册）",
    author: "同济大学数学系",
    price: new Decimal("18.00"),
    condition: "9成新",
    images: ["https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=520&fit=crop"],
    major: "理工",
    seller: { name: "小陈", major: "计算机学院" },
  },
  {
    id: "mock-2",
    title: "线性代数与解析几何",
    author: "清华大学出版社",
    price: new Decimal("22.50"),
    condition: "95新",
    images: ["https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=520&fit=crop"],
    major: "数学",
    seller: { name: "阿树", major: "数学系" },
  },
  {
    id: "mock-3",
    title: "JavaScript 高级程序设计（第4版）",
    author: "Matt Frisbie",
    price: new Decimal("45.00"),
    condition: "8成新",
    images: ["https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&h=520&fit=crop"],
    major: "编程",
    seller: { name: "CodeLab", major: "软件学院" },
  },
  {
    id: "mock-4",
    title: "考研英语词汇红宝书",
    author: "考研英语研究组",
    price: new Decimal("28.00"),
    condition: "全新",
    images: ["https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&h=520&fit=crop"],
    major: "考研",
    seller: { name: "上岸预备", major: "外国语学院" },
  },
  {
    id: "mock-5",
    title: "百年孤独",
    author: "加西亚·马尔克斯",
    price: new Decimal("15.00"),
    condition: "9成新",
    images: ["https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=400&h=520&fit=crop"],
    major: "文学",
    seller: { name: "夜读", major: "文学院" },
  },
  {
    id: "mock-6",
    title: "C Primer Plus（第6版）",
    author: "Stephen Prata",
    price: new Decimal("38.00"),
    condition: "95新",
    images: ["https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=520&fit=crop"],
    major: "编程",
    seller: { name: "debug猫", major: "计算机学院" },
  },
];
