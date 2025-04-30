import Link from "next/link";
import { Archive, BookOpen, Clock8, History } from "lucide-react";

export default function MobileFooter() {
  return (
    <footer className="fixed bottom-0 w-full bg-white shadow-md flex justify-around items-center p-2 md:hidden">
      <Link href="/explore/catalogs">
        <div className="flex flex-col items-center">
          <BookOpen className="h-6 w-6" />
          <span>Catalogs</span>
        </div>
      </Link>
      <Link href="/explore/archives">
        <div className="flex flex-col items-center">
          <Archive className="h-6 w-6" />
          <span>Archives</span>
        </div>
      </Link>
      <Link href="/explore/watch-later">
        <div className="flex flex-col items-center">
          <Clock8 className="h-6 w-6" />
          <span>Watch Later</span>
        </div>
      </Link>
      <Link href="/explore/history">
        <div className="flex flex-col items-center">
          <History className="h-6 w-6" />
          <span>History</span>
        </div>
      </Link>
    </footer>
  );
}
