"use client";

import { useState, useEffect, useRef } from "react";

export interface Book {
  id: string;
  title: string;
  description: string;
  color?: string | null;
  status?: string | null;
  size?: string | null;
  createdAt: string;
}

// Generates text color that contrasts with the background
function getContrastColor(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? "rgba(20,15,10,0.8)" : "rgba(240,230,210,0.7)";
}

function getContrastColorMuted(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? "rgba(20,15,10,0.45)" : "rgba(180,170,150,0.45)";
}

function lighten(hex: string, amount: number): string {
  const r = Math.min(255, parseInt(hex.slice(1, 3), 16) + amount);
  const g = Math.min(255, parseInt(hex.slice(3, 5), 16) + amount);
  const b = Math.min(255, parseInt(hex.slice(5, 7), 16) + amount);
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

const DEFAULT_COLOR = "#1a1614";

const STATUS_DOT: Record<string, { color: string; label: string }> = {
  reading: { color: "#4ade80", label: "Currently Reading" },
  completed: { color: "#facc15", label: "Completed" },
};

// Size determines spine width and height
const SIZE_DIMENSIONS: Record<string, { width: number; baseHeight: number }> = {
  small:  { width: 48, baseHeight: 130 },
  medium: { width: 64, baseHeight: 160 },
  large:  { width: 80, baseHeight: 200 },
};

interface Props {
  book: Book;
  index: number;
  onDelete?: (id: string) => void;
  removing?: boolean;
  selected?: boolean;
  onSelect?: (id: string | null) => void;
  readOnly?: boolean;
}

export default function BookCard({ book, index, onDelete, removing, selected, onSelect, readOnly }: Props) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const baseColor = book.color || DEFAULT_COLOR;
  const accentColor = lighten(baseColor, 20);
  const audioCtxRef = useRef<AudioContext | null>(null);

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

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirmDelete) {
      onDelete?.(book.id);
    } else {
      setConfirmDelete(true);
    }
  };

  useEffect(() => {
    if (!confirmDelete) return;
    const timer = setTimeout(() => setConfirmDelete(false), 3000);
    return () => clearTimeout(timer);
  }, [confirmDelete]);

  const handleClick = () => {
    if (onSelect) {
      onSelect(selected ? null : book.id);
    }
  };

  const sizeKey = book.size || "medium";
  const dims = SIZE_DIMENSIONS[sizeKey] || SIZE_DIMENSIONS.medium;
  const height = dims.baseHeight + (index % 4) * 12;
  const titleColor = selected ? getContrastColor(baseColor) : getContrastColorMuted(baseColor);
  const statusInfo = book.status ? STATUS_DOT[book.status] : null;

  return (
    <div
      className={`book-spine ${removing ? "removing" : ""} ${selected ? "selected" : ""}`}
      style={{
        width: `${dims.width}px`,
        minHeight: `${height}px`,
        cursor: "pointer",
        position: "relative",
        animationDelay: `${index * 60}ms`,
        animationFillMode: "both",
        flex: "0 0 auto",
        background: `linear-gradient(to right, ${baseColor} 0%, ${accentColor} 40%, ${baseColor} 100%)`,
        transform: selected ? "translateY(-24px)" : undefined,
      }}
      onMouseEnter={playHoverSound}
      onClick={handleClick}
    >
      {/* Status dot indicator — top of spine */}
      {statusInfo && (
        <div
          className="absolute top-2 left-1/2 -translate-x-1/2 z-10"
          title={statusInfo.label}
          style={{ writingMode: "horizontal-tb" }}
        >
          <div
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: statusInfo.color,
              boxShadow: `0 0 6px ${statusInfo.color}80`,
              animation: book.status === "reading" ? "pulse 2s ease-in-out infinite" : undefined,
            }}
          />
        </div>
      )}

      {/* Book content — vertical layout */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-between py-3 px-1"
        style={{
          writingMode: "vertical-rl",
          textOrientation: "mixed",
          paddingTop: statusInfo ? "14px" : "12px",
        }}
      >
        {/* Title */}
        <span
          className="font-mono text-center leading-tight block flex-1"
          style={{
            fontSize: sizeKey === "small" ? "7px" : sizeKey === "large" ? "10px" : "9px",
            color: titleColor,
            letterSpacing: "0.04em",
            transform: "rotate(180deg)",
            transition: "color 0.3s ease",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            maxHeight: "100%",
          }}
        >
          {book.title}
        </span>

        {/* Selection indicator */}
        <div
          style={{
            transform: "rotate(180deg)",
            marginTop: "6px",
            transition: "all 0.3s ease",
          }}
        >
          <svg
            width="8"
            height="8"
            viewBox="0 0 8 8"
            fill="none"
            style={{
              opacity: selected ? 0.6 : 0.2,
              transform: `rotate(${selected ? 90 : 0}deg)`,
              transition: "transform 0.3s ease, opacity 0.3s ease",
              color: getContrastColor(baseColor),
            }}
          >
            <path d="M2 1L6 4L2 7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      {/* Spine highlight */}
      <div
        className="absolute top-0 left-0 bottom-0 pointer-events-none"
        style={{
          width: "1px",
          background: `linear-gradient(to bottom, var(--spine-highlight) 0%, transparent 100%)`,
        }}
        aria-hidden
      />

      {/* Delete button — only in edit mode */}
      {!readOnly && onDelete && (
        <button
          onClick={handleDelete}
          title={confirmDelete ? "Click again to confirm" : "Remove book"}
          className={`delete-btn absolute bottom-1 left-1/2 -translate-x-1/2 ${confirmDelete ? "confirm" : ""}`}
          style={{
            writingMode: "horizontal-tb",
            zIndex: 10,
            padding: "4px",
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
          aria-label={`Delete book: ${book.title}`}
        >
          {confirmDelete ? (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : (
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="rgba(220,80,80,0.85)" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          )}
        </button>
      )}
    </div>
  );
}
