import Link from "next/link";

// Fixed top bar shared by the owner and public shelves
export default function SiteHeader({ children }: { children?: React.ReactNode }) {
  return (
    <header className="fixed inset-x-0 top-0 z-40 h-14 border-b border-border bg-bg">
      <div className="mx-auto flex h-full max-w-3xl items-center justify-between px-4">
        <Link href="/" id="nav-logo" className="text-lg font-bold">
          The Shelf
        </Link>
        <div className="flex items-center gap-4">{children}</div>
      </div>
    </header>
  );
}
