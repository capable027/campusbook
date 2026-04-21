"use server";

import { revalidatePath } from "next/cache";
import { BookStatus } from "@prisma/client";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { bookImagesAsStrings } from "@/lib/book-queries";
import { bookCreateSchema } from "@/lib/validations";
import { saveUploadedImages } from "@/lib/uploads";

export type BookActionState = { error?: string; success?: boolean };

export async function createBookAction(
  _prev: BookActionState | undefined,
  formData: FormData,
): Promise<BookActionState> {
  const session = await auth();
  if (!session?.user?.id) return { error: "请先登录" };

  const rawFiles = formData.getAll("images") as unknown as File[];
  const files = rawFiles.filter((f) => f instanceof File && f.size > 0) as File[];

  const parsed = bookCreateSchema.safeParse({
    title: formData.get("title"),
    author: formData.get("author"),
    isbn: formData.get("isbn") || undefined,
    price: formData.get("price"),
    condition: formData.get("condition"),
    description: formData.get("description"),
    major: formData.get("major") || undefined,
    course: formData.get("course") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.flatten().formErrors.join("；") || "校验失败" };
  }

  if (files.length === 0) {
    return { error: "请至少上传一张图片" };
  }

  let images: string[] = [];
  try {
    images = await saveUploadedImages(files.slice(0, 6));
  } catch (e) {
    const msg = e instanceof Error ? e.message : "图片上传失败";
    return { error: msg };
  }
  if (images.length === 0) {
    return { error: "请至少上传一张有效图片（单张不超过 5MB）" };
  }

  await prisma.book.create({
    data: {
      title: parsed.data.title,
      author: parsed.data.author,
      isbn: parsed.data.isbn || null,
      price: parsed.data.price,
      condition: parsed.data.condition,
      description: parsed.data.description,
      images,
      major: parsed.data.major || null,
      course: parsed.data.course || null,
      status: BookStatus.PENDING_REVIEW,
      sellerId: session.user.id,
    },
  });

  revalidatePath("/");
  revalidatePath("/me/listings");
  return { success: true };
}

export async function updateBookAction(
  bookId: string,
  _prev: BookActionState | undefined,
  formData: FormData,
): Promise<BookActionState> {
  const session = await auth();
  if (!session?.user?.id) return { error: "请先登录" };

  const book = await prisma.book.findUnique({ where: { id: bookId } });
  if (!book || book.sellerId !== session.user.id) return { error: "无权操作" };

  const parsed = bookCreateSchema.safeParse({
    title: formData.get("title"),
    author: formData.get("author"),
    isbn: formData.get("isbn") || undefined,
    price: formData.get("price"),
    condition: formData.get("condition"),
    description: formData.get("description"),
    major: formData.get("major") || undefined,
    course: formData.get("course") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.flatten().formErrors.join("；") || "校验失败" };
  }

  const rawFiles = formData.getAll("images") as unknown as File[];
  const files = rawFiles.filter((f) => f instanceof File && f.size > 0) as File[];
  let images = bookImagesAsStrings(book.images);
  if (files.length > 0) {
    let newUrls: string[] = [];
    try {
      newUrls = await saveUploadedImages(files.slice(0, 6));
    } catch (e) {
      const msg = e instanceof Error ? e.message : "图片上传失败";
      return { error: msg };
    }
    if (newUrls.length > 0) {
      images = [...images, ...newUrls].slice(-6);
    }
  }

  await prisma.book.update({
    where: { id: bookId },
    data: {
      title: parsed.data.title,
      author: parsed.data.author,
      isbn: parsed.data.isbn || null,
      price: parsed.data.price,
      condition: parsed.data.condition,
      description: parsed.data.description,
      images,
      major: parsed.data.major || null,
      course: parsed.data.course || null,
      status:
        book.status === BookStatus.REJECTED ? BookStatus.PENDING_REVIEW : book.status,
    },
  });

  revalidatePath("/");
  revalidatePath(`/books/${bookId}`);
  revalidatePath("/me/listings");
  return { success: true };
}

export async function removeBookAction(bookId: string): Promise<BookActionState> {
  const session = await auth();
  if (!session?.user?.id) return { error: "请先登录" };

  const book = await prisma.book.findUnique({ where: { id: bookId } });
  if (!book || book.sellerId !== session.user.id) return { error: "无权操作" };

  await prisma.book.update({
    where: { id: bookId },
    data: { status: BookStatus.REMOVED },
  });

  revalidatePath("/");
  revalidatePath("/me/listings");
  return { success: true };
}
