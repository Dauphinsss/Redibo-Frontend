import { Separator } from "@/components/ui/separator"

export default function SeparatorExample() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Componente Separator</h2>

      <div className="space-y-8">
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Separador horizontal (default)</h3>
          <div className="space-y-4">
            <p>Este es un texto antes del separador horizontal.</p>
            <Separator />
            <p>Este es un texto después del separador horizontal.</p>
          </div>
        </div>

      
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Separador vertical</h3>
          <div className="flex h-20 items-center">
            <div>Contenido izquierdo</div>
            <Separator orientation="vertical" className="mx-4 h-full" />
            <div>Contenido derecho</div>
          </div>
        </div>

        
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Separadores con estilos personalizados</h3>
          <div className="space-y-4">
            <p>Separador con ancho personalizado</p>
            <Separator className="w-1/2" />

            <p className="mt-4">Separador con color personalizado</p>
            <Separator className="bg-primary" />

            <p className="mt-4">Separador con grosor personalizado</p>
            <Separator className="h-1" />
          </div>
        </div>

        
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Ejemplos de uso</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="border rounded-lg p-4">
              <h4 className="font-medium mb-4">Menú con separadores</h4>
              <nav className="space-y-2">
                <a href="#" className="block py-2 font-medium">
                  Inicio
                </a>
                <Separator />
                <a href="#" className="block py-2 font-medium">
                  Productos
                </a>
                <Separator />
                <a href="#" className="block py-2 font-medium">
                  Servicios
                </a>
                <Separator />
                <a href="#" className="block py-2 font-medium">
                  Contacto
                </a>
              </nav>
            </div>

            
            <div className="border rounded-lg p-4">
              <h4 className="font-medium">Detalles de producto</h4>
              <Separator className="my-4" />
              <div className="py-2">
                <p className="font-medium">Descripción</p>
                <p className="text-sm text-muted-foreground">Descripción detallada del producto.</p>
              </div>
              <Separator className="my-4" />
              <div className="py-2">
                <p className="font-medium">Especificaciones</p>
                <p className="text-sm text-muted-foreground">Especificaciones técnicas del producto.</p>
              </div>
              <Separator className="my-4" />
              <div className="py-2">
                <p className="font-medium">Reseñas</p>
                <p className="text-sm text-muted-foreground">Opiniones de los usuarios.</p>
              </div>
            </div>
          </div>
        </div>

        
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Separadores en formularios</h3>
          <div className="border rounded-lg p-6 max-w-md">
            <h4 className="text-lg font-medium">Formulario de registro</h4>

            <div className="mt-4 space-y-4">
              <div>
                <label className="text-sm font-medium">Nombre</label>
                <input
                  type="text"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Email</label>
                <input
                  type="email"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1"
                />
              </div>
            </div>

            <div className="relative my-6">
              <Separator />
              <span className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 bg-background px-2 text-xs text-muted-foreground">
                O continúa con
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center gap-2 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Google
              </button>
              <button className="flex items-center justify-center gap-2 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
                Facebook
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
