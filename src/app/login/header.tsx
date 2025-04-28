"use client";

import Link from "next/link";

export function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="text-2xl font-bold">REDIBO</Link>
        <nav className="flex items-center gap-4">
          <Link href="/" className="text-sm font-medium hover:underline">Inicio</Link>
          <Link href="/registro"className="bg-black text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition"> Registro </Link>
        </nav>
      </div>
    </header>
  );
}
