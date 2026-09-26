"use client";

import { useEffect, useRef, useState } from "react";
import CoverPicker from "./CoverPicker";
import { COLOR_OPTIONS, SIZE_OPTIONS, STATUS_OPTIONS, getBookDimensions } from "@/lib/books";
import type { BookMatch } from "@/lib/openLibrary";

export interface NewBook {
  title: string;
  description: string;
  author?: string;
  color?: string;
  status?: string;
  size?: string;
  // undefined = let the server pick automatically, null = no cover
  coverUrl?: string | null;
}

interface Props {
  onAdd: (book: NewBook) => Promise<void>;
  onClose: () => void;
}

export default function AddBookModal({ onAdd, onClose }: Props) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [pickedCover, setPickedCover] = useState<{ match: BookMatch | null } | null>(null);
  const [description, setDescription] = useState("");
  const [selectedColor, setSelectedColor] = useState(COLOR_OPTIONS[0].hex);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedSize, setSelectedSize] = useState("medium");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const titleRef = useRef<HTMLInputElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    titleRef.current?.focus();
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setError("Both fields are required.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await onAdd({
        title,
        description,
        author: author.trim() || pickedCover?.match?.author || undefined,
        coverUrl: pickedCover ? pickedCover.match?.coverUrl ?? null : undefined,
        color: selectedColor,
        status: selectedStatus || undefined,
        size: selectedSize,
      });
      onClose();
    } catch {
      setError("Something went wrong. Try again.");
      setLoading(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === backdropRef.current) onClose();
  };

  return (
    <div
      ref={backdropRef}
      onClick={handleBackdropClick}
      className="modal-backdrop fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-label="Add a book"
    >
      <div className="relative mx-4 max-h-[90vh] w-full max-w-md animate-slide-up overflow-y-auto rounded-lg border border-border bg-bg p-6 shadow-lg sm:p-8">
        {/* Close button */}
        <button
          id="close-modal-btn"
          onClick={onClose}
          className="absolute right-4 top-4 text-nav transition-colors hover:text-fg"
          aria-label="Close modal"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <h2 className="mb-6 text-2xl font-bold">Add a book</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Title field */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="book-title-input" className="text-sm font-semibold">
              Title
            </label>
            <input
              id="book-title-input"
              ref={titleRef}
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setPickedCover(null);
              }}
              placeholder="The name of the book..."
              maxLength={120}
              className="input w-full px-3 py-2"
              disabled={loading}
            />
          </div>

          {/* Author field */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="book-author-input" className="text-sm font-semibold">
              Author <span className="font-normal text-subtle">(optional)</span>
            </label>
            <input
              id="book-author-input"
              type="text"
              value={author}
              onChange={(e) => {
                setAuthor(e.target.value);
                setPickedCover(null);
              }}
              placeholder="Helps find the right cover"
              maxLength={120}
              className="input w-full px-3 py-2"
              disabled={loading}
            />
          </div>

          {/* Cover picker */}
          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-semibold">Cover</span>
            <CoverPicker
              title={title}
              author={author}
              value={pickedCover ? pickedCover.match?.coverUrl ?? null : undefined}
              onChange={(match) => setPickedCover({ match })}
              color={selectedColor}
            />
          </div>

          {/* Description field */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="book-description-input" className="text-sm font-semibold">
              Your notes
            </label>
            <textarea
              id="book-description-input"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What does this book mean to you..."
              rows={3}
              maxLength={600}
              className="input w-full resize-none px-3 py-2 leading-relaxed"
              disabled={loading}
            />
            <span className="self-end text-xs text-subtle">{description.length}/600</span>
          </div>

          {/* Reading status */}
          <div className="flex flex-col gap-2">
            <span className="text-sm font-semibold">Reading status</span>
            <div className="flex flex-wrap items-center gap-2">
              {STATUS_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setSelectedStatus(opt.value)}
                  className={`btn-outline px-2.5 py-1 text-xs ${selectedStatus === opt.value ? "border-subtle bg-hover" : "text-muted"}`}
                >
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: opt.dot }} />
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Color picker */}
          <div className="flex flex-col gap-2">
            <span className="text-sm font-semibold">Spine color</span>
            <div className="flex flex-wrap gap-2">
              {COLOR_OPTIONS.map((color) => (
                <button
                  key={color.hex}
                  type="button"
                  title={color.name}
                  className="h-6 w-6 rounded-full transition-transform hover:scale-110"
                  style={{
                    background: color.hex,
                    outline: selectedColor === color.hex ? "2px solid var(--fg)" : "none",
                    outlineOffset: "2px",
                  }}
                  onClick={() => setSelectedColor(color.hex)}
                  aria-label={`Select ${color.name} color`}
                  aria-pressed={selectedColor === color.hex}
                />
              ))}
            </div>
          </div>

          {/* Book size — mini spines at 1/4 scale */}
          <div className="flex flex-col gap-2">
            <span className="text-sm font-semibold">Book size</span>
            <div className="flex items-end gap-4">
              {SIZE_OPTIONS.map((opt) => {
                const { spine, height } = getBookDimensions(opt.value);
                const active = selectedSize === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setSelectedSize(opt.value)}
                    className="flex flex-col items-center gap-1.5"
                    title={opt.desc}
                    aria-pressed={active}
                  >
                    <span
                      className="block transition-opacity"
                      style={{
                        width: spine / 2,
                        height: height / 4,
                        background: selectedColor,
                        opacity: active ? 1 : 0.4,
                        outline: active ? "2px solid var(--fg)" : "none",
                        outlineOffset: "2px",
                      }}
                    />
                    <span className={`text-xs ${active ? "font-semibold text-fg" : "text-muted"}`}>{opt.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Error */}
          {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

          {/* Submit */}
          <div className="flex items-center gap-2 pt-2">
            <button
              type="submit"
              id="submit-book-btn"
              disabled={loading}
              className="flex-1 rounded-md bg-fg px-4 py-2 text-sm font-semibold text-bg transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <svg className="animate-spin" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  </svg>
                  Adding...
                </span>
              ) : (
                "Add to shelf"
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-muted transition-colors hover:text-fg"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
