"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState, useEffect, useRef } from "react";

interface ButtonCalifProps {
  onFilterChange: (calificacion: number) => void;
  disabled?: boolean;
  suscribirseAFiltros?: (callback: (evento: any) => void) => string;
  desuscribirseDeFiltros?: (id: string) => void;
}

export function ButtonCalif({ 
  onFilterChange, 
  disabled,
  suscribirseAFiltros,
  desuscribirseDeFiltros 
}: ButtonCalifProps) {
  const [calificacion, setCalificacion] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isApplying, setIsApplying] = useState(false);
  const isFirstRender = useRef(true);
  const suscripcionId = useRef<string | null>(null);

  // Estado para mostrar el valor aplicado
  const [calificacionAplicada, setCalificacionAplicada] = useState<number | null>(null);

  // Suscribirse a eventos de filtros
  useEffect(() => {
    if (suscribirseAFiltros && desuscribirseDeFiltros) {
      suscripcionId.current = suscribirseAFiltros((evento) => {
        if (evento.tipo === 'calificacion') {
          if (evento.valor === null) {
            // Si el valor es null, significa que se limpió el filtro
            setCalificacionAplicada(null);
            setCalificacion("");
          } else {
            // Actualizar con el nuevo valor
            setCalificacionAplicada(evento.valor);
            setCalificacion(evento.valor.toString());
          }
        }
      });

      return () => {
        if (suscripcionId.current) {
          desuscribirseDeFiltros(suscripcionId.current);
        }
      };
    }
  }, [suscribirseAFiltros, desuscribirseDeFiltros]);

  // Resetear error cuando se cierran los campos
  useEffect(() => {
    if (!open) {
      setError(null);
    }
  }, [open]);

  const handleApply = async () => {
    if (isApplying) return;
    setIsApplying(true);
    
    try {
      if (calificacion) {
        const calif = parseFloat(calificacion);
        await onFilterChange(calif);
        setCalificacionAplicada(calif);
        setError(null);
        setOpen(false);
      }
    } catch (error) {
      console.error('Error al aplicar filtro:', error);
      setError('Error al aplicar el filtro. Por favor, intente nuevamente.');
    } finally {
      setIsApplying(false);
    }
  };

  const handleReset = async () => {
    if (isApplying) return;
    setIsApplying(true);

    try {
      await onFilterChange(0);
      setCalificacionAplicada(null);
      setCalificacion("");
      setOpen(false);
    } catch (error) {
      console.error('Error al resetear filtro:', error);
      setError('Error al resetear el filtro. Por favor, intente nuevamente.');
    } finally {
      setIsApplying(false);
    }
  };

  // Determinar si hay filtro activo
  const filtroActivo = calificacionAplicada !== null && calificacionAplicada > 0;

  // Determinar el texto del botón según el valor aplicado
  const getButtonText = () => {
    if (!filtroActivo) return "Filtro por Calificación";
    return `${calificacionAplicada}+ ⭐`;
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={filtroActivo ? "secondary" : "outline"}
          className={`w-[200px] justify-between ${open ? "bg-gray-100 hover:bg-gray-200 ring-2 ring-gray-300" : ""} ${filtroActivo ? "bg-zinc-900 text-white hover:bg-zinc-700" : ""}`}
          disabled={disabled}
        >
          {getButtonText()}
          <span className="ml-2">↓</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Calificación Mínima</h4>
            <p className="text-sm text-muted-foreground">
              Selecciona la calificación mínima deseada
            </p>
          </div>

          {error && (
            <div className="text-sm text-red-500 bg-red-50 p-2 rounded-md">
              {error}
            </div>
          )}

          <div className="grid gap-2">
            <RadioGroup
              value={calificacion}
              onValueChange={setCalificacion}
              className="grid grid-cols-2 gap-4"
              disabled={disabled || isApplying}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="4.5" id="r4.5" />
                <Label htmlFor="r4.5">4.5+ ⭐</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="4" id="r4" />
                <Label htmlFor="r4">4.0+ ⭐</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="3.5" id="r3.5" />
                <Label htmlFor="r3.5">3.5+ ⭐</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="3" id="r3" />
                <Label htmlFor="r3">3.0+ ⭐</Label>
              </div>
            </RadioGroup>

            <div className="flex gap-2 mt-2">
              <Button
                onClick={handleApply}
                className="flex-1"
                disabled={disabled || isApplying}
              >
                {isApplying ? "Aplicando..." : "Aplicar"}
              </Button>

              {filtroActivo && (
                <Button
                  onClick={handleReset}
                  variant="destructive"
                  disabled={disabled || isApplying}
                >
                  Borrar
                </Button>
              )}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}