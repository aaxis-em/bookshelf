"use client";

import { useEffect, useRef, useState } from "react";

const BOOK_COLORS = [
  "#8B2500", "#2F4F4F", "#4A3728", "#1B3A4B", "#6B3A5D",
  "#3E5641", "#5C3317", "#2C3E50", "#6B4226", "#4A4063",
  "#8B6914", "#3B5E3B",
];

const PLACEHOLDER_BOOKS = [
  { title: "The Black Lake", width: 36 },
  { title: "Rusty Mirrors", width: 28 },
  { title: "Fog & Iron", width: 44 },
  { title: "Still Water", width: 32 },
  { title: "The Last Room", width: 38 },
  { title: "Ash & Memory", width: 30 },
  { title: "Hollow Keys", width: 40 },
  { title: "The Crow", width: 26 },
  { title: "Undone", width: 34 },
  { title: "Silt", width: 22 },
  { title: "Candle No. 9", width: 42 },
  { title: "Glass Heart", width: 30 },
];

function darken(hex: string, amount: number): string {
  const r = Math.max(0, parseInt(hex.slice(1, 3), 16) - amount);
  const g = Math.max(0, parseInt(hex.slice(3, 5), 16) - amount);
  const b = Math.max(0, parseInt(hex.slice(5, 7), 16) - amount);
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

function lighten(hex: string, amount: number): string {
  const r = Math.min(255, parseInt(hex.slice(1, 3), 16) + amount);
  const g = Math.min(255, parseInt(hex.slice(3, 5), 16) + amount);
  const b = Math.min(255, parseInt(hex.slice(5, 7), 16) + amount);
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

export default function LandingShelf() {
  const shelfRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 12;
      const y = (e.clientY / window.innerHeight - 0.5) * 6;
      setOffset({ x, y });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      ref={shelfRef}
      className="relative flex flex-col items-center select-none"
      style={{
        transform: `translate(${offset.x * 0.5}px, ${offset.y * 0.3}px)`,
        transition: "transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      }}
    >
      {/* Ambient fog glow behind shelf */}
      <div
        className="absolute inset-x-0 bottom-0 pointer-events-none"
        style={{
          height: "60%",
          background: "radial-gradient(ellipse at 50% 100%, rgba(180,160,100,0.04) 0%, transparent 70%)",
          transform: `translate(${offset.x * -0.3}px, ${offset.y * -0.2}px)`,
          transition: "transform 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        }}
        aria-hidden
      />

      {/* Books */}
      <div
        className="flex items-end gap-0 px-4"
        style={{
          transform: `translate(${offset.x * 0.8}px, ${offset.y * 0.5}px)`,
          transition: "transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        }}
      >
        {PLACEHOLDER_BOOKS.map((book, i) => (
          <PlaceholderBook key={book.title} book={book} color={BOOK_COLORS[i]} delay={i * 80} mounted={mounted} />
        ))}
      </div>

      {/* Shelf plank */}
      <div
        className="relative w-full"
        style={{
          height: "10px",
          background: "var(--shelf-plank)",
          boxShadow: `0 4px 20px var(--shelf-shadow), 0 1px 0 rgba(255,255,255,0.04)`,
          transform: `translate(${offset.x * 0.2}px, ${offset.y * 0.1}px)`,
          transition: "transform 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        }}
      />

      {/* Shelf shadow */}
      <div
        className="w-4/5 mt-1 pointer-events-none"
        style={{
          height: "20px",
          background: "radial-gradient(ellipse at center, rgba(0,0,0,0.6) 0%, transparent 70%)",
        }}
        aria-hidden
      />
    </div>
  );
}

function PlaceholderBook({
  book,
  color,
  delay,
  mounted,
}: {
  book: (typeof PLACEHOLDER_BOOKS)[0];
  color: string;
  delay: number;
  mounted: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const height = 140 + Math.sin(delay) * 30;
  const accent = lighten(color, 20);

  // Determine text color based on background luminance
  const r = parseInt(color.slice(1, 3), 16);
  const g = parseInt(color.slice(3, 5), 16);
  const b = parseInt(color.slice(5, 7), 16);
  const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  const textColor = lum > 0.5 ? "rgba(20,15,10,0.6)" : "rgba(240,230,210,0.5)";
  const textColorHover = lum > 0.5 ? "rgba(20,15,10,0.85)" : "rgba(240,230,210,0.7)";

  return (
    <div
      className="relative cursor-default group"
      style={{
        width: `${book.width}px`,
        height: `${height}px`,
        opacity: mounted ? 1 : 0,
        transform: mounted
          ? hovered
            ? "translateY(-8px)"
            : "translateY(0)"
          : "translateY(20px)",
        transition: `opacity ${0.6 + delay / 1000}s ease ${delay}ms, transform 0.3s ease`,
        background: `linear-gradient(to right, ${color} 0%, ${accent} 40%, ${color} 100%)`,
        boxShadow: hovered
          ? "3px 0 16px rgba(0,0,0,0.9), inset -1px 0 3px rgba(200,180,100,0.06), 0 0 10px rgba(180,160,100,0.06)"
          : "2px 0 6px rgba(0,0,0,0.7), inset -1px 0 2px rgba(0,0,0,0.5)",
        borderRight: "1px solid rgba(255,255,255,0.04)",
        borderLeft: "1px solid rgba(0,0,0,0.5)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Book title — vertical */}
      <div
        className="absolute inset-0 flex items-center justify-center overflow-hidden"
        style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
      >
        <span
          className="font-mono text-center leading-tight"
          style={{
            fontSize: "8px",
            color: hovered ? textColorHover : textColor,
            letterSpacing: "0.05em",
            transform: "rotate(180deg)",
            transition: "color 0.3s ease",
            padding: "4px 0",
          }}
        >
          {book.title}
        </span>
      </div>

      {/* Spine highlight */}
      <div
        className="absolute top-0 left-0 bottom-0 pointer-events-none"
        style={{ width: "1px", background: `linear-gradient(to bottom, var(--spine-highlight) 0%, transparent 100%)` }}
        aria-hidden
      />
    </div>
  );
}
