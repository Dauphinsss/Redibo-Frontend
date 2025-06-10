"use client";

import { Button } from "@/components/ui/button";
import { Check, Grid3X3 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ButtonTodosProps {
  onMostrarTodos: () => void;
  disabled?: boolean;
  isActive?: boolean;
}

export function ButtonTodos({ onMostrarTodos, disabled, isActive }: ButtonTodosProps) {
  return (
    <Button
      variant="outline"
      className={cn(
        // Estilos base
        "relative h-10 px-4 min-w-[90px] rounded-full font-medium text-sm",
        "border-2 transition-all duration-300 ease-in-out",
        "hover:scale-105 active:scale-95",
        "focus:outline-none focus:ring-2 focus:ring-offset-2",

        // Estado inactivo (outline style)
        !isActive && [
          "bg-white border-gray-200 text-gray-700",
          "hover:bg-gray-50 hover:border-gray-300 hover:text-gray-900",
          "hover:shadow-md",
          "focus:ring-zinc-900" // Cambiar focus ring a negro
        ],

        // Estado activo (filled style) - Modificado para estilo negro
        isActive && [
          "bg-zinc-900 border-zinc-900 text-white shadow-lg",
          "hover:bg-zinc-700 hover:border-zinc-700 text-white",  // texto blanco
          "hover:shadow-xl",
          "focus:ring-zinc-500"
        ],

        // Estado deshabilitado
        disabled && [
          "opacity-50 cursor-not-allowed",
          "hover:scale-100 active:scale-100",
          "hover:shadow-none"
        ]
      )}
      onClick={onMostrarTodos}
      disabled={disabled}
    >
      <div className="flex items-center gap-2">
        {/* Icono dinámico basado en el estado */}
        {isActive ? (
          <Check className="h-4 w-4 text-white" /> // Icono blanco cuando está activo
        ) : (
          <Grid3X3 className="h-4 w-4" />
        )}

        {/* Texto con animación sutil */}
        <span className="relative">
          Todos
          {isActive && (
            <div className="absolute -bottom-0.5 left-0 right-0 h-0.5 bg-white/30 rounded-full" />
          )}
        </span>
      </div>

      {/* Efecto de brillo sutil cuando está activo */}
      {isActive && (
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse" />
      )}
    </Button>
  );
}