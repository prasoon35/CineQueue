import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="w-full bg-white border-t border-gray-200 text-gray-600">
      <div className="mx-auto px-4 py-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm">
        <Link href="/">
          <div className="flex items-center gap-2">
            <Image
              src="https://img.icons8.com/doodle/48/film-reel--v1.png"
              alt="CineQueue logo"
              width={28}
              height={28}
              className="h-7 w-7 rounded-full bg-white"
            />
            <span className="text-gray-900 font-semibold text-base font-sans">
              CineQueue
            </span>
          </div>
        </Link>

        <span className="text-sm text-gray-500 flex items-center gap-1">
          Made with <span className="text-emerald-700">💚</span>
        </span>
      </div>
    </footer>
  );
}
