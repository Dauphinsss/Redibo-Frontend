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

  const handleApply = () => {
    onFilterChange(parseFloat(calificacion));
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-[200px] justify-between" disabled={disabled}>
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
            <Button onClick={handleApply} className="mt-2" disabled={disabled}>
              Aplicar Filtro
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
