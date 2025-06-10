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

interface ButtonViajesProps {
  onFilterChange: (minViajes: number) => void;
  disabled?: boolean;
  suscribirseAFiltros?: (callback: (evento: any) => void) => string;
  desuscribirseDeFiltros?: (id: string) => void;
}

export function ButtonViajes({ 
  onFilterChange, 
  disabled,
  suscribirseAFiltros,
  desuscribirseDeFiltros 
}: ButtonViajesProps) {
  const [minViajes, setMinViajes] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isApplying, setIsApplying] = useState(false);
  const isFirstRender = useRef(true);
  const suscripcionId = useRef<string | null>(null);

  // Estado para mostrar el valor aplicado
  const [viajesAplicado, setViajesAplicado] = useState<number | null>(null);

  // Suscribirse a eventos de filtros
  useEffect(() => {
    if (suscribirseAFiltros && desuscribirseDeFiltros) {
      suscripcionId.current = suscribirseAFiltros((evento) => {
        if (evento.tipo === 'viajes') {
          if (evento.valor === null) {
            // Si el valor es null, significa que se limpió el filtro
            setViajesAplicado(null);
            setMinViajes("");
          } else {
            // Actualizar con el nuevo valor
            setViajesAplicado(evento.valor);
            setMinViajes(evento.valor.toString());
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
      const viajes = minViajes ? parseInt(minViajes) : 0;
      await onFilterChange(viajes);
      setViajesAplicado(viajes > 0 ? viajes : null);
      setError(null);
      setOpen(false);
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
      setViajesAplicado(null);
      setMinViajes("");
      setOpen(false);
    } catch (error) {
      console.error('Error al resetear filtro:', error);
      setError('Error al resetear el filtro. Por favor, intente nuevamente.');
    } finally {
      setIsApplying(false);
    }
  };

  // Determinar si hay filtro activo
  const filtroActivo = viajesAplicado !== null && viajesAplicado > 0;

  // Determinar el texto del botón según el valor aplicado
  const getButtonText = () => {
    if (!filtroActivo) return "Filtro por Viajes";
    return `${viajesAplicado}+ viajes`;
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
            <h4 className="font-medium leading-none">Número Mínimo de Viajes</h4>
            <p className="text-sm text-muted-foreground">
              Selecciona el número mínimo de viajes realizados
            </p>
          </div>

          {error && (
            <div className="text-sm text-red-500 bg-red-50 p-2 rounded-md">
              {error}
            </div>
          )}

          <div className="grid gap-2">
            <RadioGroup
              value={minViajes}
              onValueChange={setMinViajes}
              className="grid grid-cols-2 gap-4"
              disabled={disabled || isApplying}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="" id="v0" />
                <Label htmlFor="v0">Todos</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="50" id="v50" />
                <Label htmlFor="v50">50+ viajes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="25" id="v25" />
                <Label htmlFor="v25">25+ viajes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="10" id="v10" />
                <Label htmlFor="v10">10+ viajes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="5" id="v5" />
                <Label htmlFor="v5">5+ viajes</Label>
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