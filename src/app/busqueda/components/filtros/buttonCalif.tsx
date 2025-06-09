"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState } from "react";

interface ButtonCalifProps {
  onFilterChange: (calificacion: number) => void;
  disabled?: boolean;
}

export function ButtonCalif({ onFilterChange, disabled }: ButtonCalifProps) {
  const [calificacion, setCalificacion] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [filtroActivo, setFiltroActivo] = useState(false); //renombre filterApplied to filtroActivo

  const handleApply = () => {
    if (calificacion) {  // Only apply the filter if a rating is selected
      onFilterChange(parseFloat(calificacion));
      setFiltroActivo(true); //set filtroActivo true
      setOpen(false);
    }
  };

  const handleClear = () => {
    setCalificacion("");
    onFilterChange(0);  // O null, o undefined según tu lógica
    setFiltroActivo(false); //set filtroActivo false
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={filtroActivo ? "secondary" : "outline"} //use filtroActivo state
          className={`w-[200px] justify-between ${open ? "bg-gray-100 hover:bg-gray-200 ring-2 ring-gray-300" : ""} ${filtroActivo ? "ring-1 ring-blue-400 bg-blue-50 hover:bg-blue-100" : ""}`}
          disabled={disabled}
        >
          Filtro por Calificación
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
          <div className="grid gap-2">
            <RadioGroup
              value={calificacion}
              onValueChange={setCalificacion}
              className="grid grid-cols-2 gap-4"
              disabled={disabled}
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
            <div className="flex justify-between">
              <Button onClick={handleApply} className="mt-2" disabled={disabled}>
                Aplicar Filtro
              </Button>
              {filtroActivo && (
                <Button variant="destructive" size="sm" onClick={handleClear}>
                  Limpiar
                </Button>
              )}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}