import   { Badge }  from "@/components/ui/badge";


// src/components/ui/badge.tsx
import React from 'react';

export default function BadgeExample() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Componente Badge</h2>

      <div className="space-y-8">
        
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Variantes básicas</h3>
          <div className="flex flex-wrap gap-4">
            <Badge>Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="destructive">Destructive</Badge>
          </div>
        </div>

       
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Tamaños personalizados</h3>
          <div className="flex flex-wrap items-center gap-4">
            <Badge className="text-xs py-0 px-2">Pequeño</Badge>
            <Badge>Normal</Badge>
            <Badge className="text-base py-1 px-4">Grande</Badge>
          </div>
        </div>

        
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Con iconos</h3>
          <div className="flex flex-wrap gap-4">
            <Badge className="gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-check"
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              Completado
            </Badge>
            <Badge variant="secondary" className="gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-clock"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              Pendiente
            </Badge>
            <Badge variant="outline" className="gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-star"
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
              Favorito
            </Badge>
            <Badge variant="destructive" className="gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-alert-circle"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              Error
            </Badge>
          </div>
        </div>

       
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Ejemplos de uso</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           
            <div className="border rounded-lg p-4 relative">
              <Badge className="absolute top-2 right-2">Nuevo</Badge>
              <h4 className="font-medium mt-4">Destacados</h4>
              <p className="text-muted-foreground text-sm mt-2">Descripció</p>
            </div>


            <div className="border rounded-lg p-4">
              <h4 className="font-medium mb-4">Lista de tareas</h4>
              <ul className="space-y-2">
                <li className="flex justify-between items-center">
                  <span>Interfaz</span>
                  <Badge variant="outline">En progreso</Badge>
                </li>
                <li className="flex justify-between items-center">
                  <span>Desarrollar API</span>
                  <Badge>Completado</Badge>
                </li>
                <li className="flex justify-between items-center">
                  <span>Pruebas de integración</span>
                  <Badge variant="secondary">Pendiente</Badge>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
