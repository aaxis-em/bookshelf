import BookCard from "./BookCard";
import type { Book } from "@/lib/books";

const ROW_SIZE = 10;

interface Props {
  books: Book[];
  selectedBookId: string | null;
  onSelect: (id: string | null) => void;
  removingIds?: Set<string>;
}

export default function ShelfRows({ books, selectedBookId, onSelect, removingIds }: Props) {
  const rows: Book[][] = [];
  for (let i = 0; i < books.length; i += ROW_SIZE) {
    rows.push(books.slice(i, i + ROW_SIZE));
  }

  return (
    <div className="flex flex-col gap-10">
      {rows.map((row, rowIdx) => (
        <div key={rowIdx}>
          {rows.length > 1 && <p className="meta">Shelf {rowIdx + 1}</p>}
          <div className="no-scrollbar flex items-end gap-3 overflow-x-auto pr-3 pt-6">
            {row.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                selected={selectedBookId === book.id}
                onSelect={onSelect}
                removing={removingIds?.has(book.id)}
              />
            ))}
          </div>
          <div className="h-[2px] rounded-full bg-shelf" aria-hidden />
        </div>
      ))}
    </div>
  );
}
