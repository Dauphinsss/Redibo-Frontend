"use client";

import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface CampoCombustibleProps {
  combustibles: string[];
  onCombustiblesChange: (value: string[]) => void;
  error: string;
  setError: (value: string) => void;
}

export default function CampoCombustible({
  combustibles,
  onCombustiblesChange,
  error,
  setError,
}: CampoCombustibleProps) {
  const opcionesCombustible = ["Gasolina", "Diesel", "Gas Natural", "Eléctrico"];

  const handleCheckboxChange = (checked: boolean, tipo: string) => {
    if (checked) {
      if (combustibles.length >= 2) {
        setError("Máximo 2 tipos de combustible");
        return;
      }
      const nuevos = [...combustibles, tipo];
      onCombustiblesChange(nuevos);
      setError("");
    } else {
      const nuevos = combustibles.filter((item) => item !== tipo);
      onCombustiblesChange(nuevos);
      setError(nuevos.length === 0 ? "Seleccione al menos un tipo de combustible" : "");
    }
  };

  return (
    <div className="space-y-4">
      <Label className="text-lg font-medium">
        Combustible<span className="text-red-600">*</span>
      </Label>
      <div className="space-y-3">
        {opcionesCombustible.map((tipo) => (
          <div key={tipo} className="flex items-center space-x-2">
            <Checkbox
              id={tipo}
              checked={combustibles.includes(tipo)}
              onCheckedChange={(checked) => handleCheckboxChange(!!checked, tipo)}
              disabled={combustibles.length >= 2 && !combustibles.includes(tipo)}
            />
            <Label htmlFor={tipo}>{tipo}</Label>
          </div>
        ))}
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}