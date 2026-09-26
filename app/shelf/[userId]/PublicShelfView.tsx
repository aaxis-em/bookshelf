"use client";

import { useState } from "react";
import BookDetails from "@/components/BookDetails";
import ShelfRows from "@/components/ShelfRows";
import SiteHeader from "@/components/SiteHeader";
import ThemeToggle from "@/components/ThemeToggle";
import { Book, getStatus } from "@/lib/books";
import Link from "next/link";
import Image from "next/image";

interface Props {
  userName: string;
  userImage: string | null;
  books: Book[];
}

export default function PublicShelfView({ userName, userImage, books }: Props) {
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
  const firstName = userName.split(" ")[0];

  const selectedBook = selectedBookId
    ? books.find((b) => b.id === selectedBookId) || null
    : null;

  const readingBooks = books.filter((b) => b.status === "reading");
  const completedBooks = books.filter((b) => b.status === "completed");

  return (
    <>
      <SiteHeader>
        <ThemeToggle />
      </SiteHeader>

      <main className="mx-auto max-w-3xl px-4 pb-40 pt-24">
        {/* Profile header */}
        <header className="mb-10 flex animate-fade-in items-center gap-4">
          {userImage && (
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border border-border">
              <Image src={userImage} alt={userName} fill className="object-cover" sizes="48px" />
            </div>
          )}
          <div>
            <h1 className="text-3xl font-bold">{firstName}&apos;s Shelf</h1>
            <p className="mt-1 text-sm text-muted">
              {books.length} {books.length === 1 ? "book" : "books"}
              {readingBooks.length > 0 && <> • {readingBooks.length} reading</>}
              {completedBooks.length > 0 && <> • {completedBooks.length} completed</>}
            </p>
          </div>
        </header>

        <div className="flex flex-col gap-12">
          {/* Currently reading */}
          {readingBooks.length > 0 && (
            <section className="animate-fade-in" style={{ animationDelay: "0.1s", animationFillMode: "both" }}>
              <h2 className="flex items-center gap-2 text-lg font-bold">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ background: getStatus("reading")?.dot, animation: "pulse 2s ease-in-out infinite" }}
                />
                Currently reading
              </h2>
              <ShelfRows books={readingBooks} selectedBookId={selectedBookId} onSelect={setSelectedBookId} />
            </section>
          )}

          {/* All books */}
          <section className="animate-fade-in" style={{ animationDelay: "0.2s", animationFillMode: "both" }}>
            <h2 className="text-lg font-bold">All books</h2>
            {books.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-16 text-center">
                <p className="text-lg">This shelf is empty.</p>
                <p className="text-sm text-muted">No books have been added yet.</p>
              </div>
            ) : (
              <ShelfRows books={books} selectedBookId={selectedBookId} onSelect={setSelectedBookId} />
            )}
          </section>

          {/* Selected book details */}
          {selectedBook && (
            <BookDetails key={selectedBook.id} book={selectedBook} onClose={() => setSelectedBookId(null)} />
          )}
        </div>

        {/* Footer */}
        <footer className="mt-24 flex flex-col items-center gap-2 border-t border-border pt-8 text-center text-sm">
          <p className="text-subtle">Built with The Shelf</p>
          <Link href="/" className="text-link hover:underline">
            Create your own shelf →
          </Link>
        </footer>
      </main>
    </>
  );
}
