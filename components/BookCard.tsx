"use client";

import { useEffect, useRef } from "react";
import BookCover from "./BookCover";
import { Book, DEFAULT_COLOR, getBookDimensions, getContrastColor, getStatus } from "@/lib/books";

// adammaj.com uses brightness(0.8) contrast(2) with grain at 0.4; softened here
// so the darker spine palette keeps its hue instead of crushing to black.
const FACE_FILTER = "brightness(0.95) contrast(1.25)";
const GRAIN_OPACITY = 0.3;
const TRANSITION = "500ms ease";

interface Props {
  book: Book;
  selected?: boolean;
  onSelect?: (id: string | null) => void;
  removing?: boolean;
}

// A book is two faces hinged at a shared edge: the spine faces the viewer, and
// the cover sits almost edge-on. Opening swings the spine away and the cover out.
export default function BookCard({ book, selected = false, onSelect, removing }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const color = book.color || DEFAULT_COLOR;
  const { spine, height, cover } = getBookDimensions(book.size);
  const status = getStatus(book.status);
  const label = book.author ? `${book.title} by ${book.author}` : book.title;

  useEffect(() => {
    if (!selected) return;
    // Wait for the book to finish widening before bringing it into view
    const timer = setTimeout(() => {
      ref.current?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
    }, 500);
    return () => clearTimeout(timer);
  }, [selected]);

  const playHoverSound = () => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      oscillator.frequency.setValueAtTime(400 + Math.random() * 200, ctx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.08);
      gainNode.gain.setValueAtTime(0.04, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
      oscillator.type = "sine";
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.12);
    } catch {}
  };

  const toggle = () => onSelect?.(selected ? null : book.id);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggle();
    }
  };

  return (
    <div
      ref={ref}
      role="button"
      tabIndex={0}
      aria-expanded={selected}
      aria-label={label}
      title={label}
      className={`flex shrink-0 cursor-pointer rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-subtle ${removing ? "book-removing" : ""}`}
      style={{
        width: selected ? spine + cover : spine,
        height,
        perspective: "1000px",
        transition: `width ${TRANSITION}`,
      }}
      onClick={toggle}
      onKeyDown={handleKeyDown}
      onMouseEnter={playHoverSound}
    >
      {/* Spine */}
      <div
        className="relative flex shrink-0 flex-col items-center justify-between overflow-hidden"
        style={{
          width: spine,
          height,
          backgroundColor: color,
          color: getContrastColor(color),
          filter: FACE_FILTER,
          transformOrigin: "right",
          transformStyle: "preserve-3d",
          transform: `rotateY(${selected ? -60 : 0}deg)`,
          transition: `transform ${TRANSITION}`,
        }}
      >
        <h2
          className="mt-3 select-none overflow-hidden text-ellipsis whitespace-nowrap font-sans text-xs font-bold"
          style={{ writingMode: "vertical-rl", maxHeight: height - (status ? 40 : 24) }}
        >
          {book.title}
        </h2>
        {status && (
          <span
            className="mb-3 h-1.5 w-1.5 shrink-0 rounded-full"
            style={{
              background: status.dot,
              animation: book.status === "reading" ? "pulse 2s ease-in-out infinite" : undefined,
            }}
            title={status.label}
          />
        )}
        <span className="paper" style={{ opacity: GRAIN_OPACITY }} aria-hidden />
      </div>

      {/* Cover */}
      <div
        className="relative shrink-0 overflow-hidden"
        style={{
          width: cover,
          height,
          filter: FACE_FILTER,
          transformOrigin: "left",
          transformStyle: "preserve-3d",
          transform: `rotateY(${selected ? 30 : 88.8}deg)`,
          transition: `transform ${TRANSITION}`,
        }}
      >
        <BookCover book={book} />
        <span className="cover-crease" aria-hidden />
        <span className="paper" style={{ opacity: GRAIN_OPACITY }} aria-hidden />
      </div>
    </div>
  );
}
