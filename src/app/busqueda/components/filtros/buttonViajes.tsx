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

interface ButtonViajesProps {
  onFilterChange: (minViajes: number) => void;
  disabled?: boolean;
}

export function ButtonViajes({ onFilterChange, disabled }: ButtonViajesProps) {
  const [minViajes, setMinViajes] = useState<string>("");
  const [open, setOpen] = useState(false);

  const handleApply = () => {
    // Si minViajes es vacío, pasa 0 (sin filtro)
    onFilterChange(minViajes ? parseInt(minViajes) : 0);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={open ? "secondary" : "outline"}
          className={`w-[200px] justify-between ${open ? "bg-gray-100 hover:bg-gray-200 ring-2 ring-gray-300" : ""}`}
          disabled={disabled}
        >
          Filtro por Viajes
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
          <div className="grid gap-2">
            <RadioGroup
              value={minViajes}
              onValueChange={setMinViajes}
              className="grid grid-cols-2 gap-4"
              disabled={disabled}
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
            <Button onClick={handleApply} className="mt-2" disabled={disabled}>
              Aplicar Filtro
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
