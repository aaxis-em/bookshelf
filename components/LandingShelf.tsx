"use client";

import { useState } from "react";
import BookCard from "./BookCard";
import type { Book } from "@/lib/books";

const cover = (id: number) => `https://covers.openlibrary.org/b/id/${id}-M.jpg`;

// Spine colors hand-picked from each cover's palette
const FEATURED_BOOKS: Book[] = [
  { title: "The Hobbit", author: "J.R.R. Tolkien", coverUrl: cover(15223072), color: "#d27a14", size: "medium" },
  { title: "The Great Gatsby", author: "F. Scott Fitzgerald", coverUrl: cover(14635758), color: "#035174", size: "small" },
  { title: "Sapiens", author: "Yuval Noah Harari", coverUrl: cover(15247651), color: "#f0e8dc", size: "large" },
  { title: "Neuromancer", author: "William Gibson", coverUrl: cover(13838027), color: "#603ca0", size: "small" },
  { title: "Dune", author: "Frank Herbert", coverUrl: cover(9705237), color: "#8a6541", size: "large" },
  { title: "1984", author: "George Orwell", coverUrl: cover(12628788), color: "#920006", size: "medium" },
  { title: "Kafka on the Shore", author: "Haruki Murakami", coverUrl: cover(11522102), color: "#2c313a", size: "large" },
  { title: "Brave New World", author: "Aldous Huxley", coverUrl: cover(12675058), color: "#69cdea", size: "small" },
  { title: "Meditations", author: "Marcus Aurelius", coverUrl: cover(15256763), color: "#1f2123", size: "small" },
  { title: "Thinking, Fast and Slow", author: "Daniel Kahneman", coverUrl: cover(15129456), color: "#cdbfb3", size: "large" },
  { title: "The Midnight Library", author: "Matt Haig", coverUrl: cover(15164860), color: "#19233c", size: "medium" },
  { title: "Project Hail Mary", author: "Andy Weir", coverUrl: cover(15208263), color: "#b08d57", size: "medium" },
].map((book, i) => ({ ...book, id: `demo-${i}`, description: "", createdAt: "2026-01-01T00:00:00.000Z" }));

export default function LandingShelf() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <div className="w-full">
      {/* w-max + mx-auto centers the row, yet lets it scroll once a book opens past the edge */}
      <div className="no-scrollbar overflow-x-auto">
        <div className="mx-auto flex w-max items-end gap-3 px-3 pt-6">
          {FEATURED_BOOKS.map((book) => (
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
