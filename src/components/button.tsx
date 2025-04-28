import { Button } from "@/components/ui/button"

export default function ButtonExample() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Componente Button</h2>

      <div className="space-y-8">
        {/* Variantes básicas */}
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Variantes</h3>
          <div className="flex flex-wrap gap-4">
            <Button>Default</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
          </div>
        </div>

        {/* Tamaños */}
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Tamaños</h3>
          <div className="flex flex-wrap items-center gap-4">
            <Button size="sm">Small</Button>
            <Button>Default</Button>
            <Button size="lg">Large</Button>
            <Button size="icon" className="h-8 w-8 rounded-full p-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-plus"
              >
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              <span className="sr-only">Añadir</span>
            </Button>
          </div>
        </div>

        {/* Estados */}
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Estados</h3>
          <div className="flex flex-wrap gap-4">
            <Button disabled>Disabled</Button>
            <Button variant="secondary" disabled>
              Disabled
            </Button>
            <Button variant="outline" disabled>
              Disabled
            </Button>

            <Button className="relative">
              Con loading
              <div className="absolute inset-0 flex items-center justify-center bg-primary rounded-md">
                <svg
                  className="animate-spin h-5 w-5 text-primary-foreground"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              </div>
            </Button>
          </div>
        </div>

        {/* Con iconos */}
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Con iconos</h3>
          <div className="flex flex-wrap gap-4">
            <Button className="gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-download"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              Descargar
            </Button>

            <Button variant="outline" className="gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-save"
              >
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                <polyline points="17 21 17 13 7 13 7 21"></polyline>
                <polyline points="7 3 7 8 15 8"></polyline>
              </svg>
              Guardar
            </Button>

            <Button variant="secondary">
              Siguiente
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-arrow-right ml-2"
              >
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </Button>
          </div>
        </div>

        {/* Ejemplos de uso */}
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Ejemplos de uso</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Grupo de botones */}
            <div className="border rounded-lg p-4">
              <h4 className="font-medium mb-4">Grupo de botones</h4>
              <div className="inline-flex rounded-md shadow-sm" role="group">
                <Button className="rounded-r-none">Izquierda</Button>
                <Button className="rounded-none border-x-0">Centro</Button>
                <Button className="rounded-l-none">Derecha</Button>
              </div>
            </div>

            {/* Formulario con botones */}
            <div className="border rounded-lg p-4">
              <h4 className="font-medium mb-4">Formulario</h4>
              <div className="space-y-4">
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    placeholder="ejemplo@correo.com"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline">Cancelar</Button>
                  <Button>Enviar</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
