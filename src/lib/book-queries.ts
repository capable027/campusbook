import { Prisma } from "@prisma/client";

export const bookCardSelect = {
  id: true,
  title: true,
  author: true,
  price: true,
  condition: true,
  images: true,
  major: true,
} satisfies Prisma.BookSelect;
