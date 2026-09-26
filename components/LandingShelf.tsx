"use client";

import { useState } from "react";
import BookCard from "./BookCard";
import type { Book } from "@/lib/books";

const PLACEHOLDER_BOOKS: Book[] = [
  { title: "The Black Lake", color: "#8B2500", size: "medium" },
  { title: "Rusty Mirrors", color: "#2F4F4F", size: "small" },
  { title: "Fog & Iron", color: "#4A3728", size: "large" },
  { title: "Still Water", color: "#1B3A4B", size: "medium" },
  { title: "The Last Room", color: "#6B3A5D", size: "medium" },
  { title: "Ash & Memory", color: "#3E5641", size: "small" },
  { title: "Hollow Keys", color: "#5C3317", size: "large" },
  { title: "The Crow", color: "#2C3E50", size: "small" },
  { title: "Undone", color: "#6B4226", size: "medium" },
  { title: "Candle No. 9", color: "#8B6914", size: "large" },
  { title: "Glass Heart", color: "#4A4063", size: "medium" },
].map((book, i) => ({ ...book, id: `demo-${i}`, description: "", createdAt: "2026-01-01T00:00:00.000Z" }));

export default function LandingShelf() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <div className="w-full">
      {/* w-max + mx-auto centers the row, yet lets it scroll once a book opens past the edge */}
      <div className="no-scrollbar overflow-x-auto">
        <div className="mx-auto flex w-max items-end gap-3 px-3 pt-6">
          {PLACEHOLDER_BOOKS.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              selected={selectedId === book.id}
              onSelect={setSelectedId}
            />
          ))}
        </div>
      </div>
      <div className="h-px bg-border" aria-hidden />
      <p className="mt-3 text-center text-xs text-subtle">Click a spine to open it</p>
    </div>
  );
}
