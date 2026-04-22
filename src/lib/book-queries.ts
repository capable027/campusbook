import type { Prisma } from "@prisma/client";

function priceToNumber(raw: unknown): number {
  if (typeof raw === "number" && !Number.isNaN(raw)) return raw;
  if (
    raw != null &&
    typeof raw === "object" &&
    "toNumber" in raw &&
    typeof (raw as { toNumber: unknown }).toNumber === "function"
  ) {
    return (raw as { toNumber: () => number }).toNumber();
  }
  return Number(raw);
}

/** MySQL stores book image URLs as JSON array; normalize for UI and updates. */
export function bookImagesAsStrings(value: Prisma.JsonValue | null | undefined): string[] {
  if (value == null) return [];
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === "string");
  }
  return [];
}

export const bookCardSelect = {
  id: true,
  title: true,
  author: true,
  price: true,
  condition: true,
  images: true,
  major: true,
  seller: {
    select: {
      name: true,
      major: true,
    },
  },
} satisfies Prisma.BookSelect;

export type BookCardRowPayload = Prisma.BookGetPayload<{ select: typeof bookCardSelect }>;

/** Plain `price` for Client Components (Prisma `Decimal` is not RSC-serializable). */
export type BookCardClientRow = Omit<BookCardRowPayload, "price"> & { price: number };

export function serializeBookCardRow(row: BookCardRowPayload): BookCardClientRow {
  return { ...row, price: priceToNumber(row.price) };
}
