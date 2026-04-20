"use client";

import { useState, useOptimistic, useTransition } from "react";
import BookCard, { Book } from "./BookCard";
import AddBookModal from "./AddBookModal";

interface Props {
  initialBooks: Book[];
  userId: string;
}

const STATUS_OPTIONS = [
  { value: "", label: "No Status", dot: "var(--slate)" },
  { value: "reading", label: "Currently Reading", dot: "#4ade80" },
  { value: "completed", label: "Completed", dot: "#facc15" },
];

export default function BookShelf({ initialBooks, userId }: Props) {
  const [books, setBooks] = useState<Book[]>(initialBooks);
  const [removingIds, setRemovingIds] = useState<Set<string>>(new Set());
  const [showModal, setShowModal] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
  const [editingDesc, setEditingDesc] = useState(false);
  const [editDesc, setEditDesc] = useState("");
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [, startTransition] = useTransition();

  // Optimistic add
  const [optimisticBooks, addOptimistic] = useOptimistic(
    books,
    (state, newBook: Book) => [newBook, ...state]
  );

  const handleAdd = async (data: { title: string; description: string; color?: string; status?: string }) => {
    const tempId = `temp-${Date.now()}`;
    const tempBook: Book = {
      id: tempId,
      title: data.title,
      description: data.description,
      color: data.color || null,
      status: data.status || null,
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

  const handleSaveDescription = async (bookId: string) => {
    setSaving(true);
    try {
      const res = await fetch(`/api/books/${bookId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: editDesc }),
      });
      if (res.ok) {
        const updated: Book = await res.json();
        setBooks((prev) =>
          prev.map((b) => (b.id === bookId ? { ...b, description: updated.description } : b))
        );
        setEditingDesc(false);
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
      <div className="flex flex-col gap-12 pb-12">
        {/* Shelf header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-4">
            <div className="h-px flex-1" style={{ width: "40px", background: "linear-gradient(to right, transparent, var(--slate))" }} />
            <span className="font-mono text-xs tracking-[0.2em] uppercase" style={{ color: "var(--mist)" }}>
              {displayBooks.length} {displayBooks.length === 1 ? "volume" : "volumes"}
            </span>
          </div>
          <div className="flex items-center gap-3">
            {/* Share button */}
            <button
              id="share-shelf-btn"
              onClick={handleShare}
              className="group flex items-center gap-2 font-mono text-xs tracking-widest uppercase transition-all duration-300"
              style={{ color: copied ? "#4ade80" : "var(--mist)" }}
              title="Copy public shelf link"
            >
              {copied ? (
                <>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                    <polyline points="16 6 12 2 8 6" />
                    <line x1="12" y1="2" x2="12" y2="15" />
                  </svg>
                  Share
                </>
              )}
            </button>

            <div className="w-px h-4" style={{ background: "var(--slate)" }} aria-hidden />

            {/* Add book button */}
            <button
              id="add-book-btn"
              onClick={() => setShowModal(true)}
              className="group flex items-center gap-2 font-mono text-xs tracking-widest uppercase transition-all duration-300"
              style={{ color: "var(--mist)" }}
            >
              <div
                className="w-5 h-5 flex items-center justify-center border transition-colors duration-300"
                style={{ borderColor: "var(--slate)", lineHeight: 1 }}
              >
                <svg width="9" height="9" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <line x1="6" y1="2" x2="6" y2="10" />
                  <line x1="2" y1="6" x2="10" y2="6" />
                </svg>
              </div>
              Add Book
            </button>
          </div>
        </div>

        {/* Status legend */}
        <div className="flex items-center gap-5">
          <span className="font-mono text-xs uppercase tracking-widest" style={{ color: "var(--slate)", fontSize: "9px" }}>Legend:</span>
          <div className="flex items-center gap-1.5">
            <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#4ade80" }} />
            <span className="font-mono" style={{ fontSize: "9px", color: "var(--mist)" }}>Reading</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#facc15" }} />
            <span className="font-mono" style={{ fontSize: "9px", color: "var(--mist)" }}>Completed</span>
          </div>
        </div>

        {/* The Shelf */}
        {displayBooks.length === 0 ? (
          <EmptyState onAdd={() => setShowModal(true)} />
        ) : (
          <div className="relative">
            <ShelfRow
              books={displayBooks}
              removingIds={removingIds}
              onDelete={handleDelete}
              selectedBookId={selectedBookId}
              onSelect={setSelectedBookId}
            />
          </div>
        )}

        {/* Selected book description panel — below the shelf */}
        {selectedBook && (
          <div className="book-description-panel" style={{ marginTop: "-16px" }}>
            <div
              style={{
                background: "var(--card-bg)",
                border: `1px solid var(--card-border)`,
                boxShadow: "var(--card-shadow)",
                padding: "20px 24px",
                maxWidth: "520px",
              }}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-mono text-sm tracking-widest uppercase" style={{ color: "var(--ghost)" }}>
                  {selectedBook.title}
                </h3>
                <button
                  onClick={() => { setSelectedBookId(null); setEditingDesc(false); }}
                  className="font-mono text-xs hover:opacity-80 transition-opacity"
                  style={{ color: "var(--mist)" }}
                  aria-label="Close description"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              <div className="h-px mb-3" style={{ background: "var(--slate)" }} />

              {/* Status selector */}
              <div className="flex items-center gap-2 mb-3">
                <span className="font-mono text-xs uppercase tracking-widest" style={{ color: "var(--mist)", fontSize: "9px" }}>Status:</span>
                <div className="flex items-center gap-1">
                  {STATUS_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => handleUpdateStatus(selectedBook.id, opt.value || null)}
                      disabled={saving}
                      className="font-mono px-2 py-1 transition-all duration-200"
                      style={{
                        fontSize: "9px",
                        border: `1px solid ${(selectedBook.status || "") === opt.value ? opt.dot : "var(--slate)"}`,
                        background: (selectedBook.status || "") === opt.value ? `${opt.dot}15` : "transparent",
                        color: (selectedBook.status || "") === opt.value ? opt.dot : "var(--mist)",
                        opacity: saving ? 0.5 : 1,
                      }}
                    >
                      <span className="flex items-center gap-1">
                        <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: opt.dot, display: "inline-block" }} />
                        {opt.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Description — editable */}
              {editingDesc ? (
                <div className="flex flex-col gap-2">
                  <textarea
                    value={editDesc}
                    onChange={(e) => setEditDesc(e.target.value)}
                    className="input-dark w-full px-3 py-2 font-serif italic text-sm resize-none"
                    style={{ borderRadius: 0, minHeight: "80px" }}
                    maxLength={600}
                    disabled={saving}
                  />
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs" style={{ color: "var(--mist)", fontSize: "9px" }}>{editDesc.length}/600</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingDesc(false)}
                        className="font-mono text-xs px-3 py-1"
                        style={{ color: "var(--mist)", fontSize: "10px" }}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleSaveDescription(selectedBook.id)}
                        disabled={saving}
                        className="font-mono text-xs px-3 py-1 border transition-all duration-200"
                        style={{
                          borderColor: "var(--slate)",
                          color: "var(--ghost)",
                          fontSize: "10px",
                          opacity: saving ? 0.5 : 1,
                        }}
                      >
                        {saving ? "Saving..." : "Save"}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="font-serif italic text-sm leading-relaxed" style={{ color: "var(--silver)" }}>
                    {selectedBook.description}
                  </p>
                  <button
                    onClick={() => { setEditingDesc(true); setEditDesc(selectedBook.description); }}
                    className="font-mono text-xs mt-2 transition-opacity hover:opacity-80"
                    style={{ color: "var(--mist)", fontSize: "10px" }}
                  >
                    ✎ Edit notes
                  </button>
                </div>
              )}

              {/* Footer */}
              <div className="mt-3 flex items-center gap-3">
                {selectedBook.color && (
                  <div
                    style={{
                      width: "10px",
                      height: "10px",
                      borderRadius: "50%",
                      background: selectedBook.color,
                      border: "1px solid var(--slate)",
                    }}
                  />
                )}
                <span className="font-mono text-xs" style={{ color: "var(--mist)", fontSize: "10px" }}>
                  {new Date(selectedBook.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <AddBookModal onAdd={handleAdd} onClose={() => setShowModal(false)} />
      )}
    </>
  );
}

function ShelfRow({
  books,
  removingIds,
  onDelete,
  selectedBookId,
  onSelect,
}: {
  books: Book[];
  removingIds: Set<string>;
  onDelete: (id: string) => void;
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
                onDelete={onDelete}
                removing={removingIds.has(book.id)}
                selected={selectedBookId === book.id}
                onSelect={onSelect}
              />
            ))}
          </div>

          <div
            style={{
              height: "10px",
              background: "var(--shelf-plank)",
              boxShadow: `0 4px 20px var(--shelf-shadow), 0 1px 0 rgba(255,255,255,0.04)`,
            }}
          />

          <div
            style={{
              height: "20px",
              background: "linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, transparent 100%)",
            }}
            aria-hidden
          />
        </div>
      ))}
    </div>
  );
}

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-6">
      <div className="relative w-64">
        <div
          style={{
            height: "8px",
            background: "var(--shelf-plank)",
            boxShadow: `0 4px 20px var(--shelf-shadow)`,
            opacity: 0.6,
          }}
        />
        <div
          style={{
            height: "16px",
            background: "linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, transparent 100%)",
          }}
          aria-hidden
        />
      </div>

      <div className="text-center flex flex-col items-center gap-3">
        <p className="font-serif italic text-lg" style={{ color: "var(--mist)" }}>Your shelf is empty.</p>
        <p className="font-mono text-xs tracking-widest" style={{ color: "var(--slate)" }}>
          What stories inspire you?
        </p>
      </div>

      <button
        onClick={onAdd}
        id="empty-add-book-btn"
        className="font-mono text-xs tracking-[0.2em] uppercase border px-6 py-2 transition-all duration-300"
        style={{ color: "var(--mist)", borderColor: "var(--slate)" }}
      >
        Add your first book
      </button>
    </div>
  );
}
