import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import Image from "next/image";
import NavActions from "./NavActions";

export default async function Navbar() {
  const session = await getServerSession(authOptions);

  return (
    <header
      className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-6 py-4"
      style={{
        background: "linear-gradient(to bottom, var(--void) 0%, transparent 100%)",
        backdropFilter: "blur(4px)",
        borderBottom: "1px solid var(--modal-border)",
      }}
    >
      {/* Logo */}
      <Link
        href="/"
        id="nav-logo"
        className="font-mono text-sm tracking-[0.2em] uppercase transition-colors duration-300"
        style={{ color: "var(--mist)" }}
      >
        The Shelf
      </Link>

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        {session?.user && (
          <>
            {/* User avatar */}
            <div className="flex items-center gap-2">
              {session.user.image && (
                <div
                  className="relative w-7 h-7 rounded-full overflow-hidden"
                  style={{ border: "1px solid var(--slate)" }}
                >
                  <Image
                    src={session.user.image}
                    alt={session.user.name ?? "Avatar"}
                    fill
                    className="object-cover grayscale opacity-80"
                    sizes="28px"
                  />
                </div>
              )}
              <span className="font-mono text-xs hidden sm:block" style={{ color: "var(--mist)" }}>
                {session.user.name?.split(" ")[0]}
              </span>
            </div>

            <NavActions />
          </>
        )}
      </div>
    </header>
  );
}
