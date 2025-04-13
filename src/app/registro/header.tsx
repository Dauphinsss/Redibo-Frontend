import Link from "next/link";

export function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="text-2xl font-bold">
          REDIBO
        </Link>
        <nav className="flex items-center gap-4">
          <Link href="/" className="text-sm font-medium hover:underline">
            Inicio
          </Link>
          <Link
            href="/registro"
            className="text-sm font-medium hover:underline"
          >
            Registro
          </Link>
          <Link
            href="/login"
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Iniciar Sesión
          </Link>
        </nav>
      </div>
    </header>
  );
}
