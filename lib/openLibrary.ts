import { SITE_NAME, SITE_URL } from "./site";

const COVER_PREFIX = "https://covers.openlibrary.org/b/id/";

export interface BookMatch {
  key: string;
  title: string;
  author: string | null;
  year: number | null;
  coverUrl: string;
}

interface SearchDoc {
  key: string;
  title: string;
  author_name?: string[];
  first_publish_year?: number;
  cover_i?: number;
  editions?: { docs?: { title?: string; cover_i?: number }[] };
}

async function search(title: string, author: string | null, limit: number): Promise<BookMatch[]> {
  const params = new URLSearchParams({
    q: title,
    lang: "en",
    // Over-fetch since coverless works are dropped below
    limit: String(limit * 2),
    fields: "key,title,author_name,first_publish_year,cover_i,editions,editions.title,editions.cover_i",
  });
  if (author) params.set("author", author);

  const res = await fetch(`https://openlibrary.org/search.json?${params}`, {
    headers: { "User-Agent": `${SITE_NAME} (${SITE_URL})` },
    signal: AbortSignal.timeout(5000),
    cache: "no-store",
  });
  if (!res.ok) return [];

  const data: { docs?: SearchDoc[] } = await res.json();
  const matches: BookMatch[] = [];
  for (const doc of data.docs ?? []) {
    // Prefer the best-matching (English) edition over the work, whose
    // title and cover may be from the original-language release
    const edition = doc.editions?.docs?.[0];
    const coverId = edition?.cover_i ?? doc.cover_i;
    if (!coverId) continue;
    matches.push({
      key: doc.key,
      title: edition?.title ?? doc.title,
      author: doc.author_name?.[0] ?? null,
      year: doc.first_publish_year ?? null,
      coverUrl: `${COVER_PREFIX}${coverId}-M.jpg`,
    });
  }
  return matches.slice(0, limit);
}

// Never throws — a miss, timeout, or network error resolves to [] so adding
// a book is never blocked on Open Library.
export async function searchBooks(title: string, author?: string | null, limit = 6): Promise<BookMatch[]> {
  try {
    const matches = await search(title, author || null, limit);
    // A misspelled author filters everything out; fall back to the title alone
    if (matches.length === 0 && author) return await search(title, null, limit);
    return matches;
  } catch {
    return [];
  }
}

export async function findCoverUrl(title: string, author?: string | null): Promise<string | null> {
  const [match] = await searchBooks(title, author, 1);
  return match?.coverUrl ?? null;
}

// Only Open Library cover URLs are accepted from clients
export function isOpenLibraryCover(url: unknown): url is string {
  return typeof url === "string" && url.startsWith(COVER_PREFIX) && url.length < 200;
}
