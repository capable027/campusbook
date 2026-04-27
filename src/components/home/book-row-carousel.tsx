"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BookCard } from "@/components/books/book-card";
import type { BookCardClientRow } from "@/lib/book-queries";
import { cn } from "@/lib/utils";

type BookRowCarouselProps = {
  title: string;
  description?: string;
  books: BookCardClientRow[];
  className?: string;
};

export function BookRowCarousel({ title, description, books, className }: BookRowCarouselProps) {
  const scrollerRef = React.useRef<HTMLDivElement>(null);

  function scrollByDir(dir: -1 | 1) {
    const el = scrollerRef.current;
    if (!el) return;
    const delta = Math.min(320, el.clientWidth * 0.85) * dir;
    el.scrollBy({ left: delta, behavior: "smooth" });
  }

  if (books.length === 0) return null;

  return (
    <section className={cn("space-y-4", className)} aria-labelledby={`carousel-${title}`}>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 id={`carousel-${title}`} className="text-lg font-semibold tracking-tight">
            {title}
          </h2>
          {description ? <p className="text-muted-foreground mt-1 text-sm">{description}</p> : null}
        </div>
        <div className="hidden gap-1 sm:flex">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="rounded-xl"
            onClick={() => scrollByDir(-1)}
            aria-label="向左滚动"
          >
            <ChevronLeft className="size-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="rounded-xl"
            onClick={() => scrollByDir(1)}
            aria-label="向右滚动"
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>
      <div
        ref={scrollerRef}
        className={cn(
          "flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        )}
      >
        {books.map((book) => (
          <div key={book.id} className="w-[min(16rem,calc(100vw-3rem))] shrink-0 snap-start sm:w-60">
            <BookCard book={book} className="h-full" />
          </div>
        ))}
      </div>
    </section>
  );
}
