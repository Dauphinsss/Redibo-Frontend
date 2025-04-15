import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface CombustiblesSelectorProps {
  combustibles: string[];
  combustiblesError: string;
  handleCombustibleChange: (value: string) => void;
}

export const CombustiblesSelector: React.FC<CombustiblesSelectorProps> = ({ combustibles, combustiblesError, handleCombustibleChange }) => (
  <div className="flex flex-col">
    <label className="text-base font-medium mb-2">
      Tipo de combustible (seleccione máximo 2):
    </label>
    <div className="ml-4 space-y-2">
      {["gasolina", "gnv", "electrico", "diesel"].map((value) => (
        <div key={value} className="flex items-center space-x-2">
          <Checkbox
            id={value}
            checked={combustibles.includes(value)}
            onCheckedChange={() => handleCombustibleChange(value)}
          />
          <Label htmlFor={value}>{value.charAt(0).toUpperCase() + value.slice(1)}</Label>
        </div>
      ))}
    </div>
    {combustiblesError && (
      <p className="text-sm text-red-600 mt-1">{combustiblesError}</p>
    )}
    {combustibles.length === 0 && (
      <p className="text-sm text-red-600 mt-1">Debe seleccionar al menos un tipo de combustible</p>
    )}
  </div>
);
