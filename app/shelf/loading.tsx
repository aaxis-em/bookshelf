import Navbar from "@/components/Navbar";
import LoadingSkeleton from "@/components/LoadingSkeleton";

export default function ShelfLoading() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 pb-40 pt-24">
        {/* Header skeleton */}
        <div className="mb-10">
          <div className="skeleton mb-3 h-8 w-48 rounded" />
          <div className="skeleton h-4 w-40 rounded" />
        </div>
        {/* Shelf skeleton */}
        <LoadingSkeleton />
      </main>
    </>
  );
}
