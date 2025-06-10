"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect, useRef } from "react";

interface ButtonPrecioProps {
  onFilterChange: (min: number, max: number) => void;
  disabled?: boolean;
  suscribirseAFiltros?: (callback: (evento: any) => void) => string;
  desuscribirseDeFiltros?: (id: string) => void;
}

export function ButtonPrecio({ 
  onFilterChange, 
  disabled,
  suscribirseAFiltros,
  desuscribirseDeFiltros 
}: ButtonPrecioProps) {
  const [minPrecio, setMinPrecio] = useState<string>("");
  const [maxPrecio, setMaxPrecio] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isApplying, setIsApplying] = useState(false);
  const isFirstRender = useRef(true);
  const suscripcionId = useRef<string | null>(null);

  // Estados para mostrar los valores aplicados
  const [minAplicado, setMinAplicado] = useState<number | null>(null);
  const [maxAplicado, setMaxAplicado] = useState<number | null>(null);

  // Suscribirse a eventos de filtros
  useEffect(() => {
    if (suscribirseAFiltros && desuscribirseDeFiltros) {
      suscripcionId.current = suscribirseAFiltros((evento) => {
        if (evento.tipo === 'precio') {
          if (evento.valor === null) {
            // Si el valor es null, significa que se limpió el filtro
            setMinAplicado(null);
            setMaxAplicado(null);
            setMinPrecio("");
            setMaxPrecio("");
          } else {
            // Actualizar con los nuevos valores
            const { min, max } = evento.valor;
            setMinAplicado(min);
            setMaxAplicado(max);
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

  // Formatear número para mostrar como precio
  const formatPrecio = (value: number) => {
    return value.toLocaleString('es-ES');
  };

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const value = e.target.value.replace(/[^0-9]/g, "");

    if (value) {
      let num = parseInt(value);
      if (num < 1) num = 1;
      if (num > 5000) num = 5000;
      setMinPrecio(num.toString());
    } else {
      setMinPrecio("");
    }
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const value = e.target.value.replace(/[^0-9]/g, "");

    if (value) {
      let num = parseInt(value);
      if (num < 1) num = 1;
      if (num > 5000) num = 5000;
      setMaxPrecio(num.toString());
    } else {
      setMaxPrecio("");
    }
  };

  const handleApply = async () => {
    if (isApplying) return;
    setIsApplying(true);
    
    try {
      // Validar que el rango es correcto
      if (minPrecio && maxPrecio && parseInt(minPrecio) > parseInt(maxPrecio)) {
        setError("El precio mínimo no puede ser mayor que el máximo");
        return;
      }

      // Determinar los valores a aplicar
      const minValue = minPrecio ? parseInt(minPrecio) : 1;
      const maxValue = maxPrecio ? parseInt(maxPrecio) : 5000;

      // Aplicar el filtro
      await onFilterChange(minValue, maxValue);

      // Los estados se actualizarán a través del sistema de notificación
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
      // Restaurar filtro sin límites
      await onFilterChange(0, Infinity);
      setOpen(false);
    } catch (error) {
      console.error('Error al resetear filtro:', error);
      setError('Error al resetear el filtro. Por favor, intente nuevamente.');
    } finally {
      setIsApplying(false);
    }
  };

  // Determinar si hay filtro activo
  const filtroActivo = minAplicado !== null || maxAplicado !== null;

  // Determinar el texto del botón según los valores aplicados
  const getButtonText = () => {
    if (!filtroActivo) return "Filtro por Precio";

    const minMostrar = minAplicado || 1;
    const maxMostrar = maxAplicado || 5000;

    if (minAplicado && maxAplicado) {
      return `${formatPrecio(minMostrar)}BS - ${formatPrecio(maxMostrar)}BS`;
    } else if (minAplicado) {
      return `Desde ${formatPrecio(minMostrar)}BS`;
    } else if (maxAplicado) {
      return `Hasta ${formatPrecio(maxMostrar)}BS`;
    }

    return "Filtro por Precio";
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
            <h4 className="font-medium leading-none">Rango de Precio</h4>
            <p className="text-sm text-muted-foreground">
              Selecciona el rango de precio deseado (1BS - 5000BS)
            </p>
          </div>

          {error && (
            <div className="text-sm text-red-500 bg-red-50 p-2 rounded-md">
              {error}
            </div>
          )}

          <div className="grid gap-2">
            <div className="grid grid-cols-2 gap-2">
              <div className="grid gap-1.5">
                <Label htmlFor="min-precio">Mínimo</Label>
                <div className="relative">
                  <Input
                    id="min-precio"
                    type="text"
                    placeholder="1"
                    value={minPrecio}
                    onChange={handleMinChange}
                    disabled={disabled || isApplying}
                  />
                  {minPrecio && (
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      BS
                    </span>
                  )}
                </div>
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="max-precio">Máximo</Label>
                <div className="relative">
                  <Input
                    id="max-precio"
                    type="text"
                    placeholder="5000"
                    value={maxPrecio}
                    onChange={handleMaxChange}
                    disabled={disabled || isApplying}
                  />
                  {maxPrecio && (
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      BS
                    </span>
                  )}
                </div>
              </div>
            </div>

            {minPrecio && maxPrecio && parseInt(minPrecio) > parseInt(maxPrecio) && (
              <div className="text-sm text-red-500 bg-red-50 p-2 rounded-md">
                El precio mínimo no puede ser mayor que el máximo
              </div>
            )}

            <div className="flex gap-2 mt-2">
              <Button
                onClick={handleApply}
                className="flex-1"
                disabled={disabled || Boolean(minPrecio && maxPrecio && parseInt(minPrecio) > parseInt(maxPrecio)) || isApplying}
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