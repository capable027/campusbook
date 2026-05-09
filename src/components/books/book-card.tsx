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
  /** Denser card for multi-column catalog grids. */
  compact?: boolean;
  className?: string;
};

export function BookCard({ book, demo = false, compact = false, className }: BookCardProps) {
  const urls = bookImagesAsStrings(book.images);
  const img = urls[0] ?? "/file.svg";
  const multiCount = urls.length;
  const sellerLabel =
    book.seller.major != null && book.seller.major.length > 0
      ? `${book.seller.major} · ${book.seller.name}`
      : book.seller.name;

  const stats = "sellerStats" in book ? book.sellerStats : undefined;
  const showTrust =
    stats != null && (stats.reviewCount > 0 || stats.completedSales > 0 || stats.avgRating != null);

  const trustText =
    stats && showTrust
      ? [
          stats.avgRating != null ? `★ ${stats.avgRating.toFixed(1)}` : null,
          stats.reviewCount > 0 ? `${stats.reviewCount} 条评价` : null,
          stats.completedSales > 0 ? `${stats.completedSales} 次成交` : null,
        ]
          .filter(Boolean)
          .join(" · ")
      : "";

  const body = (
    <>
      <div
        className={cn(
          "relative w-full shrink-0 overflow-hidden bg-neutral-100 dark:bg-neutral-900",
          compact ? "aspect-[3/4]" : "aspect-[4/5] xl:aspect-[3/4]",
        )}
      >
        <Image
          src={img}
          alt=""
          fill
          className="object-cover"
          sizes={
            compact
              ? "(max-width:640px) 50vw, 18vw"
              : "(max-width:640px) 50vw, (max-width:1024px) 33vw, 25vw"
          }
          unoptimized={isLocallyServedBookImage(img) || img.includes("unsplash.com")}
        />
        {multiCount > 1 ? (
          <span className="bg-background/85 absolute bottom-2 right-2 rounded-md px-1.5 py-0.5 text-[10px] font-medium tabular-nums shadow-sm">
            {multiCount} 张
          </span>
        ) : null}
      </div>
      <CardHeader className={cn("space-y-1", compact ? "px-3 pb-1.5 pt-2" : "p-4 pb-2")}>
        <h2
          className={cn(
            "line-clamp-2 font-semibold leading-snug text-foreground",
            compact ? "text-sm" : "text-base",
          )}
        >
          {book.title}
        </h2>
      </CardHeader>
      <CardContent
        className={cn("flex flex-1 flex-col pt-0", compact ? "gap-2 px-3 pb-3" : "gap-3 p-4 pt-0")}
      >
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={cn(
              "font-bold tracking-tight text-foreground",
              compact ? "text-lg" : "text-xl",
            )}
          >
            ¥{Number(book.price).toFixed(2)}
          </span>
          <Badge variant="secondary" className="rounded-lg font-normal">
            {book.condition}
          </Badge>
        </div>
        {trustText ? (
          <p
            className={cn(
              "text-muted-foreground leading-snug break-words",
              compact ? "text-[10px]" : "text-[11px]",
            )}
          >
            {trustText}
          </p>
        ) : null}
        <p className="text-muted-foreground mt-auto line-clamp-1 text-xs">{sellerLabel}</p>
      </CardContent>
    </>
  );

  return (
    <Card
      size={compact ? "sm" : "default"}
      className={cn(
        "group/card flex h-full flex-col overflow-hidden rounded-xl p-0 transition-transform duration-300",
        compact ? "hover:scale-[1.02]" : "hover:scale-105",
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
