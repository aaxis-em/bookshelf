"use client";

import { useEffect, useRef, useState } from "react";
import CoverPicker from "./CoverPicker";
import Segmented from "./Segmented";
import { COLOR_OPTIONS, SIZE_OPTIONS, STATUS_OPTIONS } from "@/lib/books";
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
      setError("Add a title and a few notes first.");
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

  const canSubmit = title.trim() && description.trim() && !loading;

  return (
    <div
      ref={backdropRef}
      onClick={handleBackdropClick}
      className="modal-backdrop fixed inset-0 z-50 flex items-end justify-center sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-label="Add a book"
    >
      <form
        onSubmit={handleSubmit}
        className="sheet-enter relative flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-t-[22px] bg-card shadow-2xl sm:mx-4 sm:rounded-[22px]"
      >
        {/* Sheet nav bar: Cancel · title · Add */}
        <div className="grid shrink-0 grid-cols-[1fr_auto_1fr] items-center border-b border-border px-4 py-3">
          <button type="button" id="close-modal-btn" onClick={onClose} className="pressable justify-self-start text-[17px] text-accent">
            Cancel
          </button>
          <h2 className="text-[17px] font-semibold tracking-[-0.02em]">New Book</h2>
          <button
            type="submit"
            id="submit-book-btn"
            disabled={!canSubmit}
            className="pressable justify-self-end text-[17px] font-semibold text-accent disabled:text-subtle"
          >
            {loading ? "Adding…" : "Add"}
          </button>
        </div>

        <div className="flex flex-col gap-6 overflow-y-auto px-4 pb-6 pt-5 sm:px-6">
          {/* Title + author, grouped */}
          <div className="group-list">
            <div className="group-row py-0">
              <input
                id="book-title-input"
                ref={titleRef}
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  setPickedCover(null);
                }}
                placeholder="Title"
                aria-label="Title"
                maxLength={120}
                className="w-full bg-transparent py-3 outline-none placeholder:text-subtle"
                disabled={loading}
              />
            </div>
            <div className="group-row py-0">
              <input
                id="book-author-input"
                type="text"
                value={author}
                onChange={(e) => {
                  setAuthor(e.target.value);
                  setPickedCover(null);
                }}
                placeholder="Author (optional)"
                aria-label="Author"
                maxLength={120}
                className="w-full bg-transparent py-3 outline-none placeholder:text-subtle"
                disabled={loading}
              />
            </div>
          </div>

          {/* Cover */}
          <div>
            <p className="meta mb-2 px-1 uppercase">Cover</p>
            <CoverPicker
              title={title}
              author={author}
              value={pickedCover ? pickedCover.match?.coverUrl ?? null : undefined}
              onChange={(match) => setPickedCover({ match })}
              color={selectedColor}
            />
          </div>

          {/* Notes */}
          <div>
            <p className="meta mb-2 px-1 uppercase">Notes</p>
            <textarea
              id="book-description-input"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What do you want to remember about it?"
              rows={4}
              maxLength={600}
              className="input w-full resize-none leading-[1.47]"
              disabled={loading}
            />
            <p className="meta mt-1 px-1 text-right">{description.length}/600</p>
          </div>

          {/* Shelf appearance */}
          <div className="group-list text-[15px]">
            <div className="group-row">
              <span>Status</span>
              <Segmented label="Reading status" options={STATUS_OPTIONS} value={selectedStatus} onChange={setSelectedStatus} />
            </div>
            <div className="group-row">
              <span>Spine Color</span>
              <div className="flex flex-wrap gap-2">
                {COLOR_OPTIONS.map((color) => {
                  const active = selectedColor === color.hex;
                  return (
                    <button
                      key={color.hex}
                      type="button"
                      title={color.name}
                      className="pressable h-5 w-5 rounded-full"
                      style={{
                        background: color.hex,
                        boxShadow: active ? "0 0 0 2px var(--hover), 0 0 0 4px var(--accent)" : "inset 0 0 0 0.5px rgba(0,0,0,0.15)",
                      }}
                      onClick={() => setSelectedColor(color.hex)}
                      aria-label={`Select ${color.name} color`}
                      aria-pressed={active}
                    />
                  );
                })}
              </div>
            </div>
            <div className="group-row">
              <span>Size</span>
              <Segmented
                label="Book size"
                options={SIZE_OPTIONS.map((o) => ({ value: o.value, label: o.desc }))}
                value={selectedSize}
                onChange={setSelectedSize}
              />
            </div>
          </div>

          {error && <p className="px-1 text-[15px] text-danger">{error}</p>}
        </div>
      </form>
    </div>
  );
}
