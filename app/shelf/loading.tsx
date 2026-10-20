import Navbar from "@/components/Navbar";
import LoadingSkeleton from "@/components/LoadingSkeleton";

export default function ShelfLoading() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-3xl px-5 pb-40 pt-10">
        {/* Header skeleton */}
        <div className="mb-6">
          <div className="skeleton mb-3 h-8 w-52 rounded-lg" />
          <div className="skeleton h-4 w-72 rounded-md" />
        </div>
        {/* Shelf skeleton */}
        <LoadingSkeleton />
      </main>
    </>
  );
}
