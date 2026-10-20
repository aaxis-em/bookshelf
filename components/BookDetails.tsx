import { useEffect, useState } from "react";
import BookCover from "./BookCover";
import CoverPicker from "./CoverPicker";
import Segmented from "./Segmented";
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
    <article className="book-details-panel card relative p-5 sm:p-7">
      <button
        onClick={onClose}
        className="pressable absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-full bg-hover text-muted hover:text-fg"
        aria-label="Close details"
      >
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
          <path d="M1.5 1.5l7 7M8.5 1.5l-7 7" />
        </svg>
      </button>

      <div className="flex flex-col gap-6 sm:flex-row">
        <div className="h-[180px] w-[120px] shrink-0 overflow-hidden rounded-[6px] shadow-[0_4px_14px_rgba(0,0,0,0.18)]">
          <BookCover book={book} />
        </div>

        <div className="min-w-0 flex-1 sm:pr-8">
          <h2 className="type-title">{book.title}</h2>
          {book.author && <p className="mt-1 text-[1.0625rem] text-muted">{book.author}</p>}
          <p className="meta mt-2 flex items-center gap-1.5">
            {status && <span className="h-1.5 w-1.5 rounded-full" style={{ background: status.dot }} />}
            {status ? `${status.label} · ` : ""}Added {formatDate(book.createdAt)}
          </p>

          {editingDesc ? (
            <div className="mt-4 flex flex-col gap-2">
              <textarea
                value={editDesc}
                onChange={(e) => setEditDesc(e.target.value)}
                className="input min-h-[120px] w-full resize-none leading-[1.47]"
                maxLength={600}
                disabled={edit?.saving}
                autoFocus
              />
              <div className="flex items-center justify-between">
                <span className="meta">{editDesc.length}/600</span>
                <div className="flex items-center gap-2">
                  <button onClick={() => setEditingDesc(false)} className="btn-secondary py-1.5 text-[14px]">
                    Cancel
                  </button>
                  <button onClick={handleSave} disabled={edit?.saving} className="btn py-1.5 text-[14px]">
                    {edit?.saving ? "Saving…" : "Save"}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <p className="mt-4 whitespace-pre-line">{book.description}</p>
          )}

          {edit && !editingDesc && (
            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-[15px]">
              <button
                onClick={() => {
                  setEditDesc(book.description);
                  setEditingDesc(true);
                }}
                className="link"
              >
                Edit Notes
              </button>
              <button onClick={() => setChangingCover((v) => !v)} className="link" aria-expanded={changingCover}>
                Change Cover
              </button>
            </div>
          )}
        </div>
      </div>

      {edit && changingCover && (
        <div className="mt-6 flex flex-col gap-3">
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              value={coverTitle}
              onChange={(e) => setCoverTitle(e.target.value)}
              placeholder="Title"
              aria-label="Search title"
              maxLength={120}
              className="input min-w-0 flex-1 text-[15px]"
            />
            <input
              value={coverAuthor}
              onChange={(e) => setCoverAuthor(e.target.value)}
              placeholder="Author (optional)"
              aria-label="Search author"
              maxLength={120}
              className="input min-w-0 flex-1 text-[15px]"
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
          <button onClick={() => setChangingCover(false)} className="link self-start text-[15px]">
            Cancel
          </button>
        </div>
      )}

      {edit && (
        <div className="mt-6 flex flex-col gap-4">
          <div className="group-list text-[15px]">
            <div className="group-row">
              <span>Status</span>
              <Segmented
                label="Status"
                options={STATUS_OPTIONS}
                value={book.status || ""}
                onChange={(v) => edit.onUpdateStatus(v || null)}
                disabled={edit.saving}
              />
            </div>
            <div className="group-row">
              <span>Spine Color</span>
              <div className="flex flex-wrap gap-2">
                {COLOR_OPTIONS.map((c) => {
                  const active = (book.color || DEFAULT_COLOR) === c.hex;
                  return (
                    <button
                      key={c.hex}
                      title={c.name}
                      onClick={() => edit.onUpdateColor(c.hex)}
                      disabled={edit.saving}
                      className="pressable h-5 w-5 rounded-full disabled:opacity-50"
                      style={{
                        background: c.hex,
                        boxShadow: active ? "0 0 0 2px var(--hover), 0 0 0 4px var(--accent)" : "inset 0 0 0 0.5px rgba(0,0,0,0.15)",
                      }}
                      aria-label={`Change to ${c.name}`}
                      aria-pressed={active}
                    />
                  );
                })}
              </div>
            </div>
            <div className="group-row">
              <span>Size</span>
              <Segmented
                label="Size"
                options={SIZE_OPTIONS.map((o) => ({ value: o.value, label: o.desc }))}
                value={book.size || "medium"}
                onChange={(v) => edit.onUpdateSize(v)}
                disabled={edit.saving}
              />
            </div>
          </div>

          <div className="group-list text-[15px]">
            <button
              onClick={handleDelete}
              className="group-row w-full text-danger"
              aria-label={`Remove ${book.title}`}
            >
              {confirmDelete ? "Click Again to Remove" : "Remove from Shelf"}
            </button>
          </div>
        </div>
      )}
    </article>
  );
}
