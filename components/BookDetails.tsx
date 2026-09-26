import { useEffect, useState } from "react";
import BookCover from "./BookCover";
import CoverPicker from "./CoverPicker";
import {
  Book,
  COLOR_OPTIONS,
  DEFAULT_COLOR,
  SIZE_OPTIONS,
  STATUS_OPTIONS,
  formatDate,
  getStatus,
} from "@/lib/books";

export interface BookEditActions {
  saving: boolean;
  onUpdateStatus: (status: string | null) => void;
  onUpdateColor: (color: string) => void;
  onUpdateSize: (size: string) => void;
  onUpdateCover: (coverUrl: string | null, author: string | null) => void;
  onSaveDescription: (description: string) => Promise<boolean>;
  onDelete: () => void;
}

interface Props {
  book: Book;
  onClose: () => void;
  // Omit for a read-only view (public shelves)
  edit?: BookEditActions;
}

export default function BookDetails({ book, onClose, edit }: Props) {
  const [editingDesc, setEditingDesc] = useState(false);
  const [editDesc, setEditDesc] = useState(book.description);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [changingCover, setChangingCover] = useState(false);
  const [coverTitle, setCoverTitle] = useState(book.title);
  const [coverAuthor, setCoverAuthor] = useState(book.author ?? "");
  const status = getStatus(book.status);

  useEffect(() => {
    if (!confirmDelete) return;
    const timer = setTimeout(() => setConfirmDelete(false), 3000);
    return () => clearTimeout(timer);
  }, [confirmDelete]);

  const handleSave = async () => {
    if (await edit?.onSaveDescription(editDesc)) setEditingDesc(false);
  };

  const handleDelete = () => {
    if (confirmDelete) edit?.onDelete();
    else setConfirmDelete(true);
  };

  return (
    <article className="book-details-panel flex flex-col gap-5 sm:flex-row sm:gap-6">
      <div className="h-[160px] w-[120px] shrink-0 overflow-hidden border border-border">
        <BookCover book={book} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-xl font-bold leading-snug">{book.title}</h2>
          <button
            onClick={onClose}
            className="mt-1 text-nav transition-colors hover:text-fg"
            aria-label="Close details"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <p className="mt-1 text-sm text-muted">
          {book.author && <>By {book.author} • </>}
          Added {formatDate(book.createdAt)}
          {status && <> • {status.label}</>}
        </p>

        {editingDesc ? (
          <div className="mt-3 flex flex-col gap-2">
            <textarea
              value={editDesc}
              onChange={(e) => setEditDesc(e.target.value)}
              className="input min-h-[96px] w-full resize-none px-3 py-2 text-sm leading-relaxed"
              maxLength={600}
              disabled={edit?.saving}
              autoFocus
            />
            <div className="flex items-center justify-between">
              <span className="text-xs text-subtle">{editDesc.length}/600</span>
              <div className="flex gap-2">
                <button onClick={() => setEditingDesc(false)} className="px-3 py-1.5 text-sm text-muted hover:text-fg">
                  Cancel
                </button>
                <button onClick={handleSave} disabled={edit?.saving} className="btn-outline">
                  {edit?.saving ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            <p className="mt-3 whitespace-pre-line leading-relaxed">{book.description}</p>
            {edit && (
              <div className="mt-2 flex gap-4 text-sm">
                <button
                  onClick={() => {
                    setEditDesc(book.description);
                    setEditingDesc(true);
                  }}
                  className="text-link hover:underline"
                >
                  Edit notes
                </button>
                <button
                  onClick={() => setChangingCover((v) => !v)}
                  className="text-link hover:underline"
                  aria-expanded={changingCover}
                >
                  Change cover
                </button>
              </div>
            )}
          </>
        )}

        {edit && changingCover && (
          <div className="mt-4 flex flex-col gap-3 rounded-md border border-border p-4">
            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                value={coverTitle}
                onChange={(e) => setCoverTitle(e.target.value)}
                placeholder="Title"
                aria-label="Search title"
                maxLength={120}
                className="input min-w-0 flex-1 px-3 py-1.5 text-sm"
              />
              <input
                value={coverAuthor}
                onChange={(e) => setCoverAuthor(e.target.value)}
                placeholder="Author (helps narrow it down)"
                aria-label="Search author"
                maxLength={120}
                className="input min-w-0 flex-1 px-3 py-1.5 text-sm"
              />
            </div>
            <CoverPicker
              title={coverTitle}
              author={coverAuthor}
              value={book.coverUrl ?? null}
              onChange={(match) => {
                edit.onUpdateCover(
                  match?.coverUrl ?? null,
                  coverAuthor.trim() || match?.author || book.author || null
                );
                setChangingCover(false);
              }}
              color={book.color || DEFAULT_COLOR}
            />
            <button
              onClick={() => setChangingCover(false)}
              className="self-start text-sm text-muted hover:text-fg"
            >
              Cancel
            </button>
          </div>
        )}

        {edit && (
          <div className="mt-5 flex flex-col gap-4 border-t border-border pt-5 text-sm">
            <Field label="Status">
              {STATUS_OPTIONS.map((opt) => {
                const active = (book.status || "") === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => edit.onUpdateStatus(opt.value || null)}
                    disabled={edit.saving}
                    className={`btn-outline px-2.5 py-1 text-xs ${active ? "border-subtle bg-hover" : "text-muted"}`}
                  >
                    <span className="h-1.5 w-1.5 rounded-full" style={{ background: opt.dot }} />
                    {opt.label}
                  </button>
                );
              })}
            </Field>

            <Field label="Color">
              {COLOR_OPTIONS.map((c) => {
                const active = (book.color || DEFAULT_COLOR) === c.hex;
                return (
                  <button
                    key={c.hex}
                    title={c.name}
                    onClick={() => edit.onUpdateColor(c.hex)}
                    disabled={edit.saving}
                    className="h-5 w-5 rounded-full transition-transform hover:scale-110 disabled:opacity-50"
                    style={{
                      background: c.hex,
                      outline: active ? "2px solid var(--fg)" : "none",
                      outlineOffset: "2px",
                    }}
                    aria-label={`Change to ${c.name}`}
                    aria-pressed={active}
                  />
                );
              })}
            </Field>

            <Field label="Size">
              {SIZE_OPTIONS.map((opt) => {
                const active = (book.size || "medium") === opt.value;
                return (
                  <button
                    key={opt.value}
                    title={opt.desc}
                    onClick={() => edit.onUpdateSize(opt.value)}
                    disabled={edit.saving}
                    className={`btn-outline px-2.5 py-1 text-xs ${active ? "border-subtle bg-hover" : "text-muted"}`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </Field>

            <div>
              <button
                onClick={handleDelete}
                className="text-sm text-red-600 hover:underline dark:text-red-400"
                aria-label={`Remove ${book.title}`}
              >
                {confirmDelete ? "Click again to remove" : "Remove from shelf"}
              </button>
            </div>
          </div>
        )}
      </div>
    </article>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="w-14 shrink-0 text-subtle">{label}</span>
      {children}
    </div>
  );
}
