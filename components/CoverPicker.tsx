import { useEffect, useState } from "react";
import { getContrastColor } from "@/lib/books";
import type { BookMatch } from "@/lib/openLibrary";

interface Props {
  title: string;
  author?: string;
  // undefined = automatic (first match), null = no cover, string = picked cover
  value: string | null | undefined;
  onChange: (match: BookMatch | null) => void;
  color: string;
}

export default function CoverPicker({ title, author = "", value, onChange, color }: Props) {
  const [matches, setMatches] = useState<BookMatch[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const q = title.trim();
    if (q.length < 2) {
      setMatches([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const params = new URLSearchParams({ q });
        if (author.trim()) params.set("author", author.trim());
        const res = await fetch(`/api/covers?${params}`, { signal: controller.signal });
        setMatches(res.ok ? await res.json() : []);
        setLoading(false);
      } catch {
        // Aborted by a newer search, which owns the loading state now
        if (!controller.signal.aborted) {
          setMatches([]);
          setLoading(false);
        }
      }
    }, 500);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [title, author]);

  const selectedUrl = value === undefined ? matches[0]?.coverUrl : value;
  const selectedMatch = matches.find((m) => m.coverUrl === selectedUrl);

  let status: string;
  if (title.trim().length < 2) status = "Type a title to search Open Library.";
  else if (loading) status = "Searching Open Library…";
  else if (matches.length === 0) status = "No matches — a generated cover will be used.";
  else if (selectedMatch)
    status = [selectedMatch.title, selectedMatch.author, selectedMatch.year].filter(Boolean).join(" · ");
  else if (selectedUrl === null) status = "No cover — a generated cover will be used.";
  else status = "Pick the right cover.";

  return (
    <div className="flex flex-col gap-2">
      <div className={`no-scrollbar flex gap-2 overflow-x-auto p-1 transition-opacity ${loading ? "opacity-50" : ""}`}>
        {matches.map((m) => {
          const active = m.coverUrl === selectedUrl;
          return (
            <button
              key={m.key}
              type="button"
              onClick={() => onChange(m)}
              title={[m.title, m.author, m.year].filter(Boolean).join(" · ")}
              aria-label={`Use cover of ${m.title}${m.author ? ` by ${m.author}` : ""}`}
              aria-pressed={active}
              className="pressable h-24 w-16 shrink-0 overflow-hidden rounded-[5px] bg-hover shadow-[0_2px_6px_rgba(0,0,0,0.15)]"
              style={{ outline: active ? "2.5px solid var(--accent)" : "none", outlineOffset: "2px" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={m.coverUrl} alt="" loading="lazy" className="h-full w-full object-cover" />
            </button>
          );
        })}
        {title.trim().length >= 2 && (
          <button
            type="button"
            onClick={() => onChange(null)}
            aria-label="Use no cover"
            aria-pressed={selectedUrl === null}
            className="pressable flex h-24 w-16 shrink-0 items-center justify-center rounded-[5px] px-1 text-center text-[11px] font-medium leading-tight"
            style={{
              backgroundColor: color,
              color: getContrastColor(color),
              outline: selectedUrl === null ? "2.5px solid var(--accent)" : "none",
              outlineOffset: "2px",
            }}
          >
            No Cover
          </button>
        )}
      </div>
      <p className="meta truncate px-1">{status}</p>
    </div>
  );
}
