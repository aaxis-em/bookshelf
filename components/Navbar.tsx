import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Image from "next/image";
import NavActions from "./NavActions";
import SiteHeader from "./SiteHeader";

export default async function Navbar() {
  const session = await getServerSession(authOptions);

  return (
    <SiteHeader>
      {session?.user && (
        <>
          <div className="flex items-center gap-2">
            {session.user.image && (
              <div className="relative h-7 w-7 overflow-hidden rounded-full border border-border">
                <Image
                  src={session.user.image}
                  alt={session.user.name ?? "Avatar"}
                  fill
                  className="object-cover"
                  sizes="28px"
                />
              </div>
            )}
            <span className="hidden text-sm text-muted sm:block">
              {session.user.name?.split(" ")[0]}
            </span>
          </div>

          <NavActions />
        </>
      )}
    </SiteHeader>
  );
}
