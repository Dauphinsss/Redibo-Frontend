"use client";

import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface CampoCombustibleProps {
  combustibles: number[];
  onCombustiblesChange: (value: number[]) => void;
  error: string;
  setError: (value: string) => void;
}

export default function CampoCombustible({
  combustibles,
  onCombustiblesChange,
  error,
  setError,
}: CampoCombustibleProps) {
  const opcionesCombustible = [
    { id: 1, label: "Gasolina" },
    { id: 2, label: "Gas Natural" },
    { id: 3, label: "Electrico" },
    { id: 4, label: "Diesel" },
  ];

  const handleCheckboxChange = (checked: boolean, id: number) => {
    if (checked) {
      if (combustibles.length >= 2) {
        setError("Máximo 2 tipos de combustible");
        return;
      }
      onCombustiblesChange([...combustibles, id]);
      setError("");
    } else {
      const nuevos = combustibles.filter((c) => c !== id);
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
        {opcionesCombustible.map(({ id, label }) => (
          <div key={id} className="flex items-center space-x-2">
            <Checkbox
              id={String(id)}
              checked={combustibles.includes(id)}
              onCheckedChange={(checked) => handleCheckboxChange(!!checked, id)}
              disabled={combustibles.length >= 2 && !combustibles.includes(id)}
            />
            <Label htmlFor={String(id)}>{label}</Label>
          </div>
        ))}
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}