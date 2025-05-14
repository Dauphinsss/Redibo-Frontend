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
}

export function ButtonPrecio({ onFilterChange, disabled }: ButtonPrecioProps) {
  const [minPrecio, setMinPrecio] = useState<string>("");
  const [maxPrecio, setMaxPrecio] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [filtroActivo, setFiltroActivo] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [autosAntesFiltro, setAutosAntesFiltro] = useState<boolean>(false);
  
  // Referencia para rastrear la primera renderización
  const isInitialRender = useRef(true);
  
  // Resetear error cuando se cierran los campos
  useEffect(() => {
    if (!open) {
      setError(null);
    }
  }, [open]);

  // Formatear número para mostrar como precio
  const formatPrecio = (value: string) => {
    if (!value) return "";
    return parseInt(value).toLocaleString('es-ES');
  };

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    let value = e.target.value.replace(/[^0-9]/g, "");
    
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
    let value = e.target.value.replace(/[^0-9]/g, "");
    
    if (value) {
      let num = parseInt(value);
      if (num < 1) num = 1;
      if (num > 5000) num = 5000;
      setMaxPrecio(num.toString());
    } else {
      setMaxPrecio("");
    }
  };

  const handleApply = () => {
    // Validar que al menos hay un campo
    if (!minPrecio && !maxPrecio) {
      setError("Debes establecer al menos un valor");
      return;
    }

    // Validar que el rango es correcto
    if (minPrecio && maxPrecio && parseInt(minPrecio) > parseInt(maxPrecio)) {
      setError("El precio mínimo no puede ser mayor que el máximo");
      return;
    }

    const min = minPrecio ? parseInt(minPrecio) : 1;
    const max = maxPrecio ? parseInt(maxPrecio) : 5000;
    
    // Guardar el estado antes de aplicar el filtro si es la primera vez
    if (!autosAntesFiltro) {
      setAutosAntesFiltro(true);
    }
    
    // Aplicar el filtro
    onFilterChange(min, max);
    setFiltroActivo(true);
    setOpen(false);
  };

  const handleReset = () => {
    setMinPrecio("");
    setMaxPrecio("");
    
    // Restaurar al estado anterior
    onFilterChange(0, Infinity);
    
    setFiltroActivo(false);
    setAutosAntesFiltro(false);
    setOpen(false);
  };

  // Determinar el texto del botón según el estado del filtro
  const getButtonText = () => {
    if (!filtroActivo) return "Filtro por Precio";
    
    if (minPrecio && maxPrecio) {
      return `${formatPrecio(minPrecio)}€ - ${formatPrecio(maxPrecio)}€`;
    } else if (minPrecio) {
      return `Desde ${formatPrecio(minPrecio)}€`;
    } else if (maxPrecio) {
      return `Hasta ${formatPrecio(maxPrecio)}€`;
    }
    
    return "Filtro por Precio";
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={filtroActivo ? "secondary" : "outline"}
          className={`w-[200px] justify-between ${open ? "bg-gray-100 hover:bg-gray-200 ring-2 ring-gray-300" : ""} ${filtroActivo ? "ring-1 ring-blue-400 bg-blue-50 hover:bg-blue-100" : ""}`}
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
              Selecciona el rango de precio deseado (1€ - 5000€)
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
                    disabled={disabled}
                  />
                  {minPrecio && (
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      €
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
                    disabled={disabled}
                  />
                  {maxPrecio && (
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      €
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
                disabled={disabled || Boolean(minPrecio && maxPrecio && parseInt(minPrecio) > parseInt(maxPrecio))}
              >
                Aplicar
              </Button>
              
              {filtroActivo && (
                <Button 
                  onClick={handleReset} 
                  variant="destructive"
                  disabled={disabled}
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