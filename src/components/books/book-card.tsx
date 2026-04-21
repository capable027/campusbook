import Image from "next/image";
import Link from "next/link";
import type { Book } from "@prisma/client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { bookImagesAsStrings } from "@/lib/book-queries";
import { isLocallyServedBookImage } from "@/lib/uploads";

type BookCardProps = {
  book: Pick<Book, "id" | "title" | "author" | "price" | "condition" | "images" | "major">;
};

export function BookCard({ book }: BookCardProps) {
  const urls = bookImagesAsStrings(book.images);
  const img = urls[0] ?? "/file.svg";
  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-md">
      <Link href={`/books/${book.id}`} className="block">
        <div className="relative aspect-[4/3] w-full bg-muted">
          <Image
            src={img}
            alt=""
            fill
            className="object-cover"
            sizes="(max-width:768px) 100vw, 33vw"
            unoptimized={isLocallyServedBookImage(img)}
          />
        </div>
        <CardHeader className="space-y-1 p-4 pb-2">
          <h2 className="line-clamp-2 text-base font-semibold leading-snug">{book.title}</h2>
          <p className="text-sm text-muted-foreground">{book.author}</p>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-lg font-semibold text-primary">
              ¥{Number(book.price).toFixed(2)}
            </span>
            <Badge variant="secondary">{book.condition}</Badge>
            {book.major ? (
              <Badge variant="outline" className="font-normal">
                {book.major}
              </Badge>
            ) : null}
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
