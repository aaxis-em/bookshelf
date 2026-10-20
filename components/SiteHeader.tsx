import Link from "next/link";
import Logo from "./Logo";

// Translucent sticky bar: content scrolls underneath it
export default function SiteHeader({ children }: { children?: React.ReactNode }) {
  return (
    <header className="material sticky top-0 z-40">
      <div className="mx-auto flex h-12 max-w-3xl items-center justify-between px-5">
        <Link href="/" id="nav-logo" className="flex items-center gap-2 text-[17px] font-semibold tracking-[-0.02em]">
          <Logo size={20} />
          The Shelf
        </Link>
        <div className="flex items-center gap-5 text-[14px]">{children}</div>
      </div>
    </header>
  );
}
