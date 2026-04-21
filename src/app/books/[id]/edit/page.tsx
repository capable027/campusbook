import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { SiteHeader } from "@/components/layout/site-header";
import { BookForm } from "@/components/books/book-form";
import { updateBookAction } from "@/lib/actions/books";

export default async function EditBookPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  const book = await prisma.book.findUnique({ where: { id } });
  if (!book) notFound();
  if (!session?.user || book.sellerId !== session.user.id) notFound();

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        <h1 className="mb-6 text-2xl font-bold tracking-tight">编辑教材</h1>
        <BookForm
          action={updateBookAction.bind(null, book.id)}
          defaultValues={{
            title: book.title,
            author: book.author,
            isbn: book.isbn ?? "",
            price: String(book.price),
            condition: book.condition,
            description: book.description,
            major: book.major ?? "",
            course: book.course ?? "",
          }}
          submitLabel="保存"
        />
      </main>
    </div>
  );
}
