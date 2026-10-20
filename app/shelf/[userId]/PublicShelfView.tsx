"use client";

import { useState } from "react";
import BookDetails from "@/components/BookDetails";
import ShelfRows from "@/components/ShelfRows";
import SiteHeader from "@/components/SiteHeader";
import ThemeToggle from "@/components/ThemeToggle";
import ShelfSummary from "@/components/ShelfSummary";
import type { Book } from "@/lib/books";
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

  return (
    <>
      <SiteHeader>
        <ThemeToggle />
      </SiteHeader>

      <main className="mx-auto max-w-3xl px-5 pb-24 pt-10">
        {/* Profile header */}
        <header className="mb-8 animate-fade-in">
          <div className="flex items-center gap-4">
            {userImage && (
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full">
                <Image src={userImage} alt={userName} fill className="object-cover" sizes="48px" />
              </div>
            )}
            <h1 className="type-title">{firstName}&rsquo;s Shelf</h1>
          </div>
          <div className="mt-3">
            <ShelfSummary books={books} />
          </div>
        </header>

        <div className="flex flex-col gap-14">
          {/* Currently reading */}
          {readingBooks.length > 0 && (
            <section className="animate-fade-in" style={{ animationDelay: "0.1s", animationFillMode: "both" }}>
              <h2 className="type-headline">Reading Now</h2>
              <ShelfRows books={readingBooks} selectedBookId={selectedBookId} onSelect={setSelectedBookId} />
            </section>
          )}

          {/* All books */}
          <section className="animate-fade-in" style={{ animationDelay: "0.2s", animationFillMode: "both" }}>
            <h2 className="type-headline">All Books</h2>
            {books.length === 0 ? (
              <div className="py-16">
                <p className="type-headline">No Books Yet</p>
                <p className="mt-1 text-muted">Check back once {firstName} has added a book or two.</p>
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
        <footer className="meta mt-24 flex flex-wrap justify-between gap-2 border-t border-border pt-4">
          <span>Covers courtesy of Open Library.</span>
          <Link href="/" className="link">
            Make your own shelf ›
          </Link>
        </footer>
      </main>
    </>
  );
}
