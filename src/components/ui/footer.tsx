import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t py-6 md:py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <p className="text-sm text-muted-foreground">
            © Todos los derechos reservados, REDIBO 2025
          </p>
          <div className="flex items-center space-x-4">
            <Link
              href="/terminos-y-condiciones"
              className="text-xs text-muted-foreground hover:underline"
            >
              Términos y Condiciones
            </Link>
            <Link
              href="/privacidad"
              className="text-xs text-muted-foreground hover:underline"
            >
              Política de Privacidad
            </Link>
            <Link
              href="/contacto"
              className="text-xs text-muted-foreground hover:underline"
            >
              Contacto
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
