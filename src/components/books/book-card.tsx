import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { bookImagesAsStrings, type BookCardClientRow, type BookCardRowPayload } from "@/lib/book-queries";
import { isLocallyServedBookImage } from "@/lib/book-image-url";
import { cn } from "@/lib/utils";

type BookCardBook = BookCardRowPayload | BookCardClientRow;

type BookCardProps = {
  book: BookCardBook;
  /** Non-clickable preview (e.g. mock carousel items). */
  demo?: boolean;
  className?: string;
};

export function BookCard({ book, demo = false, className }: BookCardProps) {
  const urls = bookImagesAsStrings(book.images);
  const img = urls[0] ?? "/file.svg";
  const sellerLabel =
    book.seller.major != null && book.seller.major.length > 0
      ? `${book.seller.major} · ${book.seller.name}`
      : book.seller.name;

  const body = (
    <>
      <div className="relative aspect-[3/4] w-full shrink-0 overflow-hidden bg-neutral-100 dark:bg-neutral-900">
        <Image
          src={img}
          alt=""
          fill
          className="object-cover"
          sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 25vw"
          unoptimized={isLocallyServedBookImage(img) || img.includes("unsplash.com")}
        />
      </div>
      <CardHeader className="space-y-1 p-4 pb-2">
        <h2 className="line-clamp-2 text-base font-semibold leading-snug text-foreground">{book.title}</h2>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-3 p-4 pt-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xl font-bold tracking-tight text-foreground">
            ¥{Number(book.price).toFixed(2)}
          </span>
          <Badge variant="secondary" className="rounded-lg font-normal">
            {book.condition}
          </Badge>
        </div>
        <p className="text-muted-foreground mt-auto line-clamp-1 text-xs">{sellerLabel}</p>
      </CardContent>
    </>
  );

  return (
    <Card
      className={cn(
        "group/card flex h-full flex-col overflow-hidden rounded-xl p-0 transition-all duration-300 hover:scale-105",
        className,
      )}
    >
      {demo ? (
        <div className="flex h-full flex-col">{body}</div>
      ) : (
        <Link href={`/books/${book.id}`} className="flex h-full flex-col outline-none">
          {body}
        </Link>
      )}
    </Card>
  );
}
