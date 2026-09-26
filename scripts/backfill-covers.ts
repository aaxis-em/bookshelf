// Fetch Open Library covers for books that don't have one yet.
// Run with: npx tsx --env-file=.env.local scripts/backfill-covers.ts
// Pass --refresh to re-check every book — this overwrites covers picked by hand.
import { PrismaClient } from "@prisma/client";
import { findCoverUrl } from "../lib/openLibrary";

const prisma = new PrismaClient();
const refresh = process.argv.includes("--refresh");

async function main() {
  const books = await prisma.book.findMany({
    where: refresh ? {} : { coverUrl: null },
    select: { id: true, title: true, author: true, coverUrl: true },
  });
  console.log(`Looking up covers for ${books.length} books...`);

  let found = 0;
  for (const book of books) {
    const coverUrl = await findCoverUrl(book.title, book.author);
    // Keep an existing cover rather than wiping it when a lookup fails
    if (coverUrl && coverUrl !== book.coverUrl) {
      await prisma.book.update({ where: { id: book.id }, data: { coverUrl } });
    }
    if (coverUrl) found++;
    const changed = refresh && coverUrl && book.coverUrl && coverUrl !== book.coverUrl;
    console.log(`${coverUrl ? "✓" : "–"} ${book.title}${changed ? "  (changed)" : ""}`);
  }
  console.log(`Done: ${found}/${books.length} covers found.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
