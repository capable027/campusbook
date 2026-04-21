import { SiteHeader } from "@/components/layout/site-header";
import { BookForm } from "@/components/books/book-form";
import { createBookAction } from "@/lib/actions/books";

export default function NewBookPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        <h1 className="mb-6 text-2xl font-bold tracking-tight">发布教材</h1>
        <p className="text-muted-foreground mb-8 max-w-xl text-sm">
          提交后需管理员审核通过方可上架展示。
        </p>
        <BookForm action={createBookAction} submitLabel="提交审核" />
      </main>
    </div>
  );
}
