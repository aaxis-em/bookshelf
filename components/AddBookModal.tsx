"use client";

import { useEffect, useRef, useState } from "react";

const COLOR_OPTIONS = [
  { name: "Midnight", hex: "#1a1614" },
  { name: "Crimson", hex: "#8B2500" },
  { name: "Forest", hex: "#3E5641" },
  { name: "Ocean", hex: "#1B3A4B" },
  { name: "Plum", hex: "#6B3A5D" },
  { name: "Walnut", hex: "#5C3317" },
  { name: "Slate", hex: "#2C3E50" },
  { name: "Amber", hex: "#8B6914" },
  { name: "Sage", hex: "#3B5E3B" },
  { name: "Indigo", hex: "#4A4063" },
  { name: "Teal", hex: "#2F4F4F" },
  { name: "Rust", hex: "#6B4226" },
  { name: "Burgundy", hex: "#722F37" },
  { name: "Navy", hex: "#1C2541" },
  { name: "Olive", hex: "#556B2F" },
  { name: "Charcoal", hex: "#36454F" },
];

const STATUS_OPTIONS = [
  { value: "", label: "No Status", dot: "var(--slate)" },
  { value: "reading", label: "Currently Reading", dot: "#4ade80" },
  { value: "completed", label: "Completed", dot: "#facc15" },
];

const SIZE_OPTIONS = [
  { value: "small", label: "S", desc: "Small", width: 16, height: 40 },
  { value: "medium", label: "M", desc: "Medium", width: 22, height: 55 },
  { value: "large", label: "L", desc: "Large", width: 28, height: 70 },
];

interface Props {
  onAdd: (book: { title: string; description: string; color?: string; status?: string; size?: string }) => Promise<void>;
  onClose: () => void;
}

export default function AddBookModal({ onAdd, onClose }: Props) {
  const [title, setTitle] = useState("");
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
      className="fixed inset-0 z-50 flex items-center justify-center modal-backdrop"
      style={{ background: "rgba(0,0,0,0.75)" }}
      role="dialog"
      aria-modal="true"
      aria-label="Add a book"
    >
      <div
        className="relative w-full max-w-md mx-4 animate-slide-up overflow-y-auto"
        style={{
          background: "var(--modal-bg)",
          border: `1px solid var(--modal-border)`,
          boxShadow: "0 24px 80px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,255,255,0.04)",
          padding: "32px",
          maxHeight: "90vh",
        }}
      >
        {/* Close button */}
        <div className="absolute top-4 right-4">
          <button
            id="close-modal-btn"
            onClick={onClose}
            className="font-mono text-xs transition-colors duration-200"
            style={{ color: "var(--mist)" }}
            aria-label="Close modal"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-px flex-1" style={{ background: `linear-gradient(to right, transparent, var(--slate))` }} />
            <span className="font-mono text-xs tracking-[0.2em] uppercase" style={{ color: "var(--mist)" }}>New Volume</span>
            <div className="h-px flex-1" style={{ background: `linear-gradient(to left, transparent, var(--slate))` }} />
          </div>
          <h2 className="font-mono text-xl tracking-wider" style={{ color: "var(--ghost)" }}>Add a Book</h2>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Title field */}
          <div className="flex flex-col gap-2">
            <label htmlFor="book-title-input" className="font-mono text-xs tracking-widest uppercase" style={{ color: "var(--mist)" }}>
              Title
            </label>
            <input
              id="book-title-input"
              ref={titleRef}
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="The name of the book..."
              maxLength={120}
              className="input-dark w-full px-4 py-3 font-mono text-sm"
              style={{ borderRadius: 0 }}
              disabled={loading}
            />
          </div>

          {/* Description field */}
          <div className="flex flex-col gap-2">
            <label htmlFor="book-description-input" className="font-mono text-xs tracking-widest uppercase" style={{ color: "var(--mist)" }}>
              Your Notes
            </label>
            <textarea
              id="book-description-input"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What does this book mean to you..."
              rows={3}
              maxLength={600}
              className="input-dark w-full px-4 py-3 font-serif italic text-sm resize-none"
              style={{ borderRadius: 0 }}
              disabled={loading}
            />
            <span className="font-mono text-xs self-end" style={{ color: "var(--mist)" }}>{description.length}/600</span>
          </div>

          {/* Reading status */}
          <div className="flex flex-col gap-2">
            <label className="font-mono text-xs tracking-widest uppercase" style={{ color: "var(--mist)" }}>
              Reading Status
            </label>
            <div className="flex items-center gap-2">
              {STATUS_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setSelectedStatus(opt.value)}
                  className="font-mono px-3 py-1.5 transition-all duration-200"
                  style={{
                    fontSize: "10px",
                    border: `1px solid ${selectedStatus === opt.value ? opt.dot : "var(--slate)"}`,
                    background: selectedStatus === opt.value ? `${opt.dot}15` : "transparent",
                    color: selectedStatus === opt.value ? (opt.value ? opt.dot : "var(--chalk)") : "var(--mist)",
                  }}
                >
                  <span className="flex items-center gap-1.5">
                    <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: opt.dot, display: "inline-block" }} />
                    {opt.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Color picker */}
          <div className="flex flex-col gap-2">
            <label className="font-mono text-xs tracking-widest uppercase" style={{ color: "var(--mist)" }}>
              Spine Color
            </label>
            <div className="flex flex-wrap gap-2">
              {COLOR_OPTIONS.map((color) => (
                <button
                  key={color.hex}
                  type="button"
                  title={color.name}
                  className={`color-swatch ${selectedColor === color.hex ? "active" : ""}`}
                  style={{ background: color.hex }}
                  onClick={() => setSelectedColor(color.hex)}
                  aria-label={`Select ${color.name} color`}
                />
              ))}
            </div>
            {/* Book Size */}
            <div className="flex flex-col gap-2 mt-2">
              <label className="font-mono text-xs tracking-widest uppercase" style={{ color: "var(--mist)" }}>
                Book Size
              </label>
              <div className="flex items-end gap-3">
                {SIZE_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setSelectedSize(opt.value)}
                    className="flex flex-col items-center gap-1 transition-all duration-200"
                    title={opt.desc}
                  >
                    {/* Mini spine preview */}
                    <div
                      style={{
                        width: `${opt.width}px`,
                        height: `${opt.height}px`,
                        background: `linear-gradient(to right, ${selectedColor} 0%, ${selectedColor}cc 40%, ${selectedColor} 100%)`,
                        boxShadow: selectedSize === opt.value
                          ? `2px 0 8px rgba(0,0,0,0.5), 0 0 0 2px var(--chalk)`
                          : "2px 0 6px rgba(0,0,0,0.3)",
                        borderRight: "1px solid rgba(255,255,255,0.06)",
                        opacity: selectedSize === opt.value ? 1 : 0.5,
                        transition: "all 0.2s ease",
                        position: "relative",
                      }}
                    >
                      {selectedStatus && (
                        <div
                          style={{
                            position: "absolute",
                            top: "3px",
                            left: "50%",
                            transform: "translateX(-50%)",
                            width: "4px",
                            height: "4px",
                            borderRadius: "50%",
                            background: STATUS_OPTIONS.find((s) => s.value === selectedStatus)?.dot || "transparent",
                          }}
                        />
                      )}
                    </div>
                    <span
                      className="font-mono"
                      style={{
                        fontSize: "9px",
                        color: selectedSize === opt.value ? "var(--ghost)" : "var(--mist)",
                        fontWeight: selectedSize === opt.value ? 600 : 400,
                      }}
                    >
                      {opt.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <p className="font-mono text-xs text-red-400 tracking-wide">{error}</p>
          )}

          {/* Submit */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              id="submit-book-btn"
              disabled={loading}
              className="flex-1 font-mono text-sm tracking-[0.15em] uppercase py-3 border transition-all duration-300 disabled:opacity-40"
              style={{
                borderColor: "var(--slate)",
                background: loading ? "transparent" : "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)",
                color: "var(--ghost)",
              }}
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <svg className="animate-spin" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  </svg>
                  Placing...
                </span>
              ) : (
                "Place on Shelf"
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 font-mono text-xs transition-colors duration-200"
              style={{ color: "var(--mist)" }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
