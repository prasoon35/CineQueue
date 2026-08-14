import Image from "next/image";
import { UserMenu } from "./user-menu";
import Link from "next/link";

export default function Header() {
  return (
    <header className="w-full bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-50">
      <div className="mx-auto px-4 py-3 sm:px-6 sm:py-4 grid grid-cols-[auto_1fr_auto] items-center gap-2 sm:gap-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 min-w-0 shrink">
          <Image
            src="https://img.icons8.com/doodle/48/film-reel--v1.png"
            alt="CineQueue logo"
            width={32}
            height={32}
            className="rounded-full bg-white"
            priority
          />
          <span className="text-gray-900 font-semibold text-lg sm:text-xl font-sans leading-none">
            CineQueue
          </span>
        </Link>

        {/* Spacer */}
        <div />

        {/* User Menu - Client Component */}
        <UserMenu />
      </div>
    </header>
  );
}
