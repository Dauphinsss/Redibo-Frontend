"use client";

import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface CampoCombustibleProps {
  combustibles: string[];
  setCombustibles: React.Dispatch<React.SetStateAction<string[]>>;
  error: string;
  setError: React.Dispatch<React.SetStateAction<string>>;
}

export default function CampoCombustible({
  combustibles,
  setCombustibles,
  error,
  setError,
}: CampoCombustibleProps) {
  const opcionesCombustible = ["Gasolina", "Diesel", "Gas Natural", "Eléctrico"];

  const handleCheckboxChange = (checked: boolean, tipo: string) => {
    if (checked) {
      if (combustibles.length >= 2) {
        return; // No permite seleccionar más de 2 opciones
      }
      const nuevos = [...combustibles, tipo];
      setCombustibles(nuevos);
    } else {
      const nuevos = combustibles.filter((item) => item !== tipo);
      setCombustibles(nuevos);
    }
  };

  return (
    <div className="space-y-4">
      <Label className="text-lg font-medium text-gray-700">
        Combustible<span className="text-red-600">*</span>
      </Label>
      <div className="space-y-3">
        {opcionesCombustible.map((tipo) => (
          <div key={tipo} className="flex items-center space-x-2">
            <Checkbox
              id={tipo}
              checked={combustibles.includes(tipo)}
              onCheckedChange={(checked) => handleCheckboxChange(!!checked, tipo)}
              disabled={combustibles.length >= 2 && !combustibles.includes(tipo)} // Deshabilita si ya hay 2 seleccionados
            />
            <Label htmlFor={tipo} className="text-gray-800">
              {tipo}
            </Label>
          </div>
        ))}
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}
