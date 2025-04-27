import { Button } from "@/components/ui/button";
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
          <Link
            href="/registro"
            className="text-sm font-medium hover:underline"
          >
            <Button variant={"outline"}>Registro</Button>
          </Link>
          <Button variant={"default"} disabled>
            <Link href="/login">Iniciar Sesión</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
