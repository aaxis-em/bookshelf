"use client";

import { useState } from "react";
import BookCard, { Book } from "@/components/BookCard";
import ThemeToggle from "@/components/ThemeToggle";
import Link from "next/link";
import Image from "next/image";

interface Props {
  userName: string;
  userImage: string | null;
  books: Book[];
}

const STATUS_LABELS: Record<string, { color: string; label: string }> = {
  reading: { color: "#4ade80", label: "Currently Reading" },
  completed: { color: "#facc15", label: "Completed" },
};

export default function PublicShelfView({ userName, userImage, books }: Props) {
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
  const firstName = userName.split(" ")[0];

  const selectedBook = selectedBookId
    ? books.find((b) => b.id === selectedBookId) || null
    : null;

  const readingBooks = books.filter((b) => b.status === "reading");
  const completedBooks = books.filter((b) => b.status === "completed");

  return (
    <div className="min-h-screen" style={{ background: "var(--void)" }}>
      {/* Header bar */}
      <header
        className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-6 py-4"
        style={{
          background: "linear-gradient(to bottom, var(--void) 0%, transparent 100%)",
          backdropFilter: "blur(4px)",
          borderBottom: "1px solid var(--modal-border)",
        }}
      >
        <Link
          href="/"
          className="font-mono text-sm tracking-[0.2em] uppercase transition-colors duration-300"
          style={{ color: "var(--mist)" }}
        >
          The Shelf
        </Link>
        <ThemeToggle />
      </header>

      <main className="pt-24 pb-16 px-6 max-w-5xl mx-auto">
        {/* Profile header */}
        <div className="mb-12 animate-fade-in">
          <div className="flex items-center gap-4 mb-4">
            {userImage && (
              <div
                className="relative w-12 h-12 rounded-full overflow-hidden"
                style={{ border: "2px solid var(--slate)" }}
              >
                <Image
                  src={userImage}
                  alt={userName}
                  fill
                  className="object-cover"
                  sizes="48px"
                />
              </div>
            )}
            <div>
              <h1 className="font-mono text-2xl sm:text-3xl tracking-wide" style={{ color: "var(--ghost)" }}>
                {firstName}&apos;s Shelf
              </h1>
              <p className="font-serif italic text-sm mt-0.5" style={{ color: "var(--mist)" }}>
                {books.length} {books.length === 1 ? "book" : "books"} collected
              </p>
            </div>
          </div>

          {/* Stats bar */}
          <div className="flex items-center gap-6 mt-4">
            {readingBooks.length > 0 && (
              <div className="flex items-center gap-1.5">
                <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#4ade80", boxShadow: "0 0 6px #4ade8080" }} />
                <span className="font-mono text-xs" style={{ color: "var(--mist)" }}>
                  {readingBooks.length} reading
                </span>
              </div>
            )}
            {completedBooks.length > 0 && (
              <div className="flex items-center gap-1.5">
                <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#facc15" }} />
                <span className="font-mono text-xs" style={{ color: "var(--mist)" }}>
                  {completedBooks.length} completed
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Currently Reading highlight */}
        {readingBooks.length > 0 && (
          <div className="mb-10 animate-fade-in" style={{ animationDelay: "0.1s", animationFillMode: "both" }}>
            <div className="flex items-center gap-3 mb-4">
              <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#4ade80", boxShadow: "0 0 8px #4ade8080", animation: "pulse 2s ease-in-out infinite" }} />
              <span className="font-mono text-xs tracking-[0.2em] uppercase" style={{ color: "#4ade80" }}>
                Currently Reading
              </span>
            </div>
            <div className="relative">
              <div className="flex items-end gap-0 pb-0 overflow-x-auto" style={{ minHeight: "200px" }}>
                {readingBooks.map((book, idx) => (
                  <BookCard
                    key={book.id}
                    book={book}
                    index={idx}
                    readOnly
                    selected={selectedBookId === book.id}
                    onSelect={setSelectedBookId}
                  />
                ))}
              </div>
              <div style={{ height: "10px", background: "var(--shelf-plank)", boxShadow: `0 4px 20px var(--shelf-shadow), 0 1px 0 rgba(255,255,255,0.04)` }} />
              <div style={{ height: "20px", background: "linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, transparent 100%)" }} aria-hidden />
            </div>
          </div>
        )}

        {/* All books shelf */}
        <div className="animate-fade-in" style={{ animationDelay: "0.3s", animationFillMode: "both" }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px" style={{ width: "30px", background: "linear-gradient(to right, transparent, var(--slate))" }} />
            <span className="font-mono text-xs tracking-[0.2em] uppercase" style={{ color: "var(--mist)" }}>
              Full Collection
            </span>
          </div>

          {books.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-4">
              <p className="font-serif italic text-lg" style={{ color: "var(--mist)" }}>
                This shelf is empty.
              </p>
              <p className="font-mono text-xs" style={{ color: "var(--slate)" }}>
                No books have been added yet.
              </p>
            </div>
          ) : (
            <PublicShelfRows
              books={books}
              selectedBookId={selectedBookId}
              onSelect={setSelectedBookId}
            />
          )}
        </div>

        {/* Selected book detail */}
        {selectedBook && (
          <div className="book-description-panel mt-6">
            <div
              style={{
                background: "var(--card-bg)",
                border: `1px solid var(--card-border)`,
                boxShadow: "var(--card-shadow)",
                padding: "20px 24px",
                maxWidth: "480px",
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <h3 className="font-mono text-sm tracking-widest uppercase" style={{ color: "var(--ghost)" }}>
                    {selectedBook.title}
                  </h3>
                  {selectedBook.status && STATUS_LABELS[selectedBook.status] && (
                    <span
                      className="font-mono px-2 py-0.5"
                      style={{
                        fontSize: "8px",
                        border: `1px solid ${STATUS_LABELS[selectedBook.status].color}40`,
                        color: STATUS_LABELS[selectedBook.status].color,
                        letterSpacing: "0.1em",
                      }}
                    >
                      {STATUS_LABELS[selectedBook.status].label}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setSelectedBookId(null)}
                  className="hover:opacity-80 transition-opacity"
                  style={{ color: "var(--mist)" }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
              <div className="h-px mb-3" style={{ background: "var(--slate)" }} />
              <p className="font-serif italic text-sm leading-relaxed" style={{ color: "var(--silver)" }}>
                {selectedBook.description}
              </p>
              <div className="mt-3 flex items-center gap-3">
                {selectedBook.color && (
                  <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: selectedBook.color, border: "1px solid var(--slate)" }} />
                )}
                <span className="font-mono text-xs" style={{ color: "var(--mist)", fontSize: "10px" }}>
                  Added {new Date(selectedBook.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-16 text-center animate-fade-in" style={{ animationDelay: "0.6s", animationFillMode: "both" }}>
          <div className="h-px mx-auto mb-6" style={{ width: "60px", background: "var(--slate)" }} />
          <p className="font-serif italic text-xs" style={{ color: "var(--mist)", opacity: 0.6 }}>
            Built with The Shelf
          </p>
          <Link
            href="/"
            className="font-mono text-xs tracking-widest uppercase mt-2 inline-block transition-colors duration-300"
            style={{ color: "var(--slate)" }}
          >
            Create your own shelf →
          </Link>
        </div>
      </main>
    </div>
  );
}

function PublicShelfRows({
  books,
  selectedBookId,
  onSelect,
}: {
  books: Book[];
  selectedBookId: string | null;
  onSelect: (id: string | null) => void;
}) {
  const ROW_SIZE = 10;
  const rows: Book[][] = [];
  for (let i = 0; i < books.length; i += ROW_SIZE) {
    rows.push(books.slice(i, i + ROW_SIZE));
  }

  return (
    <div className="flex flex-col gap-8">
      {rows.map((row, rowIdx) => (
        <div key={rowIdx} className="relative">
          <div className="flex items-end gap-0 pb-0 overflow-x-auto" style={{ minHeight: "200px" }}>
            {row.map((book, idx) => (
              <BookCard
                key={book.id}
                book={book}
                index={rowIdx * ROW_SIZE + idx}
                readOnly
                selected={selectedBookId === book.id}
                onSelect={onSelect}
              />
            ))}
          </div>
          <div style={{ height: "10px", background: "var(--shelf-plank)", boxShadow: `0 4px 20px var(--shelf-shadow), 0 1px 0 rgba(255,255,255,0.04)` }} />
          <div style={{ height: "20px", background: "linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, transparent 100%)" }} aria-hidden />
        </div>
      ))}
    </div>
  );
}
