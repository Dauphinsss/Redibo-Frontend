
import Link from "next/link";

export function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="text-2xl font-bold" translate="no">
          REDIBO
        </Link>
        <nav className="flex items-center gap-2">
          <Link href="/" className="text-sm font-medium hover:underline">
            Inicio
          </Link>
        </nav>
      </div>
    </header>
  );
}
