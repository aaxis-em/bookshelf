"use client";

import { useState, useOptimistic, useTransition } from "react";
import AddBookModal, { NewBook } from "./AddBookModal";
import BookDetails from "./BookDetails";
import ShelfRows from "./ShelfRows";
import { Book, STATUS_OPTIONS } from "@/lib/books";

interface Props {
  initialBooks: Book[];
  userId: string;
}

export default function BookShelf({ initialBooks, userId }: Props) {
  const [books, setBooks] = useState<Book[]>(initialBooks);
  const [removingIds, setRemovingIds] = useState<Set<string>>(new Set());
  const [showModal, setShowModal] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [, startTransition] = useTransition();

  // Optimistic add
  const [optimisticBooks, addOptimistic] = useOptimistic(
    books,
    (state, newBook: Book) => [newBook, ...state]
  );

  const handleAdd = async (data: NewBook) => {
    const tempId = `temp-${Date.now()}`;
    const tempBook: Book = {
      id: tempId,
      title: data.title,
      description: data.description,
      color: data.color || null,
      status: data.status || null,
      size: data.size || "medium",
      coverUrl: data.coverUrl ?? null,
      author: data.author || null,
      createdAt: new Date().toISOString(),
    };

    startTransition(() => {
      addOptimistic(tempBook);
    });

    const res = await fetch("/api/books", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error("Failed to add book");

    const created: Book = await res.json();
    setBooks((prev) => [created, ...prev.filter((b) => b.id !== tempId)]);
  };

  const handleDelete = async (id: string) => {
    if (selectedBookId === id) setSelectedBookId(null);
    setRemovingIds((prev) => new Set(prev).add(id));

    setTimeout(async () => {
      try {
        await fetch(`/api/books/${id}`, { method: "DELETE" });
        setBooks((prev) => prev.filter((b) => b.id !== id));
      } catch {
        setRemovingIds((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
      } finally {
        setRemovingIds((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
      }
    }, 450);
  };

  const handleUpdateStatus = async (bookId: string, status: string | null) => {
    setSaving(true);
    try {
      const res = await fetch(`/api/books/${bookId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: status || null }),
      });
      if (res.ok) {
        const updated: Book = await res.json();
        setBooks((prev) => prev.map((b) => (b.id === bookId ? { ...b, status: updated.status } : b)));
      }
    } catch {} finally {
      setSaving(false);
    }
  };

  const handleSaveDescription = async (bookId: string, description: string) => {
    setSaving(true);
    try {
      const res = await fetch(`/api/books/${bookId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description }),
      });
      if (res.ok) {
        const updated: Book = await res.json();
        setBooks((prev) =>
          prev.map((b) => (b.id === bookId ? { ...b, description: updated.description } : b))
        );
        return true;
      }
    } catch {} finally {
      setSaving(false);
    }
    return false;
  };

  const handleUpdateColor = async (bookId: string, color: string) => {
    setSaving(true);
    try {
      const res = await fetch(`/api/books/${bookId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ color }),
      });
      if (res.ok) {
        const updated: Book = await res.json();
        setBooks((prev) => prev.map((b) => (b.id === bookId ? { ...b, color: updated.color } : b)));
      }
    } catch {} finally {
      setSaving(false);
    }
  };

  const handleUpdateSize = async (bookId: string, size: string) => {
    setSaving(true);
    try {
      const res = await fetch(`/api/books/${bookId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ size }),
      });
      if (res.ok) {
        const updated: Book = await res.json();
        setBooks((prev) => prev.map((b) => (b.id === bookId ? { ...b, size: updated.size } : b)));
      }
    } catch {} finally {
      setSaving(false);
    }
  };

  const handleUpdateCover = async (bookId: string, coverUrl: string | null, author: string | null) => {
    setSaving(true);
    try {
      const res = await fetch(`/api/books/${bookId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ coverUrl, author }),
      });
      if (res.ok) {
        const updated: Book = await res.json();
        setBooks((prev) =>
          prev.map((b) => (b.id === bookId ? { ...b, coverUrl: updated.coverUrl, author: updated.author } : b))
        );
      }
    } catch {} finally {
      setSaving(false);
    }
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/shelf/${userId}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      const input = document.createElement("input");
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const displayBooks = optimisticBooks;
  const selectedBook = selectedBookId
    ? displayBooks.find((b) => b.id === selectedBookId) || null
    : null;

  return (
    <>
      <div className="flex flex-col gap-8">
        {/* Shelf header */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted">
            <span>
              {displayBooks.length} {displayBooks.length === 1 ? "book" : "books"}
            </span>
            {/* Status legend */}
            {STATUS_OPTIONS.filter((s) => s.value).map((s) => (
              <span key={s.value} className="flex items-center gap-1.5 text-xs text-subtle">
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: s.dot }} />
                {s.label}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button
              id="share-shelf-btn"
              onClick={handleShare}
              className="btn-outline"
              title="Copy public shelf link"
            >
              {copied ? (
                <>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Link copied
                </>
              ) : (
                <>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                    <polyline points="16 6 12 2 8 6" />
                    <line x1="12" y1="2" x2="12" y2="15" />
                  </svg>
                  Share
                </>
              )}
            </button>
            <button id="add-book-btn" onClick={() => setShowModal(true)} className="btn-outline">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                <line x1="6" y1="2" x2="6" y2="10" />
                <line x1="2" y1="6" x2="10" y2="6" />
              </svg>
              Add book
            </button>
          </div>
        </div>

        {/* The Shelf */}
        {displayBooks.length === 0 ? (
          <EmptyState onAdd={() => setShowModal(true)} />
        ) : (
          <ShelfRows
            books={displayBooks}
            selectedBookId={selectedBookId}
            onSelect={setSelectedBookId}
            removingIds={removingIds}
          />
        )}

        {/* Selected book details — below the shelf */}
        {selectedBook && (
          <BookDetails
            key={selectedBook.id}
            book={selectedBook}
            onClose={() => setSelectedBookId(null)}
            edit={{
              saving,
              onUpdateStatus: (status) => handleUpdateStatus(selectedBook.id, status),
              onUpdateColor: (color) => handleUpdateColor(selectedBook.id, color),
              onUpdateSize: (size) => handleUpdateSize(selectedBook.id, size),
              onUpdateCover: (coverUrl, author) => handleUpdateCover(selectedBook.id, coverUrl, author),
              onSaveDescription: (description) => handleSaveDescription(selectedBook.id, description),
              onDelete: () => handleDelete(selectedBook.id),
            }}
          />
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <AddBookModal onAdd={handleAdd} onClose={() => setShowModal(false)} />
      )}
    </>
  );
}

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex flex-col items-center gap-4 py-24 text-center">
      <div className="mb-2 h-px w-48 bg-border" aria-hidden />
      <p className="text-lg">Your shelf is empty.</p>
      <p className="text-sm text-muted">What stories inspire you?</p>
      <button onClick={onAdd} id="empty-add-book-btn" className="btn-outline mt-2">
        Add your first book
      </button>
    </div>
  );
}
