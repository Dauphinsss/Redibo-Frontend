"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface ButtonPrecioProps {
  onFilterChange: (min: number, max: number) => void;
}

export function ButtonPrecio({ onFilterChange }: ButtonPrecioProps) {
  const [minPrecio, setMinPrecio] = useState<string>("");
  const [maxPrecio, setMaxPrecio] = useState<string>("");

  const handleApply = () => {
    const min = minPrecio ? parseInt(minPrecio) : 0;
    const max = maxPrecio ? parseInt(maxPrecio) : Infinity;
    onFilterChange(min, max);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-[200px] justify-between">
          Filtro por Precio
          <span className="ml-2">↓</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Rango de Precio</h4>
            <p className="text-sm text-muted-foreground">
              Selecciona el rango de precio deseado
            </p>
          </div>
          <div className="grid gap-2">
            <div className="grid grid-cols-2 gap-2">
              <div className="grid gap-1.5">
                <Label htmlFor="min-precio">Mínimo</Label>
                <Input
                  id="min-precio"
                  type="number"
                  placeholder="0"
                  value={minPrecio}
                  onChange={(e) => setMinPrecio(e.target.value)}
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="max-precio">Máximo</Label>
                <Input
                  id="max-precio"
                  type="number"
                  placeholder="∞"
                  value={maxPrecio}
                  onChange={(e) => setMaxPrecio(e.target.value)}
                />
              </div>
            </div>
            <Button onClick={handleApply} className="mt-2">
              Aplicar Filtro
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
