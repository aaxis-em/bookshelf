import { Book, STATUS_OPTIONS } from "@/lib/books";

// "18 books · 2 reading · 5 finished"
export default function ShelfSummary({ books }: { books: Book[] }) {
  const counts = STATUS_OPTIONS.filter((s) => s.value)
    .map((s) => ({ ...s, count: books.filter((b) => b.status === s.value).length }))
    .filter((s) => s.count > 0);

  return (
    <p className="type-callout flex flex-wrap items-center gap-x-3 gap-y-1 text-muted">
      <span>
        {books.length} {books.length === 1 ? "book" : "books"}
      </span>
      {counts.map((s) => (
        <span key={s.value} className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full" style={{ background: s.dot }} />
          {s.count} {s.label.toLowerCase()}
        </span>
      ))}
    </p>
  );
}
