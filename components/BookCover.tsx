"use client";

import { useState } from "react";
import { Book, DEFAULT_COLOR, getContrastColor } from "@/lib/books";

interface Props {
  book: Pick<Book, "title" | "color" | "coverUrl" | "author">;
}

// Fills its container with the Open Library cover, or a generated cover
// in the book's spine color when there is none (or it fails to load).
export default function BookCover({ book }: Props) {
  const [failed, setFailed] = useState(false);

  if (book.coverUrl && !failed) {
    return (
      // Open Library redirects to archive.org hosts, so skip next/image here
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={book.coverUrl}
        alt={`Cover of ${book.title}`}
        loading="lazy"
        draggable={false}
        onError={() => setFailed(true)}
        className="h-full w-full object-cover"
      />
    );
  }

  const color = book.color || DEFAULT_COLOR;
  const textColor = getContrastColor(color);

  return (
    <div
      className="relative flex h-full w-full items-center justify-center p-5"
      style={{ backgroundColor: color, color: textColor }}
    >
      <div className="absolute inset-2.5 border opacity-30" style={{ borderColor: textColor }} aria-hidden />
      <div className="relative flex select-none flex-col items-center gap-2 text-center">
        <span className="line-clamp-5 text-[15px] font-semibold leading-tight tracking-[-0.012em]">{book.title}</span>
        {book.author && <span className="text-[10px] font-medium tracking-[0.01em] opacity-75">{book.author}</span>}
      </div>
    </div>
  );
}
