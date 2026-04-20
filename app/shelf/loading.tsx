import Navbar from "@/components/Navbar";
import LoadingSkeleton from "@/components/LoadingSkeleton";

export default function ShelfLoading() {
  return (
    <div className="min-h-screen" style={{ background: "var(--void)" }}>
      <Navbar />
      <main className="pt-24 pb-16 px-6 max-w-5xl mx-auto">
        {/* Header skeleton */}
        <div className="mb-12">
          <div className="skeleton h-3 w-32 mb-3" style={{ opacity: 0.4 }} />
          <div className="skeleton h-8 w-48 mb-2" style={{ opacity: 0.3 }} />
          <div className="skeleton h-4 w-36" style={{ opacity: 0.25 }} />
        </div>
        {/* Shelf skeleton */}
        <LoadingSkeleton />
      </main>
    </div>
  );
}
