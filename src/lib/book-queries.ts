import { Prisma } from "@prisma/client";

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
} satisfies Prisma.BookSelect;
