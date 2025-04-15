import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PuertasSelectorProps {
  puertas: string;
  handlePuertasChange: (value: string) => void;
}

export const PuertasSelector: React.FC<PuertasSelectorProps> = ({ puertas, handlePuertasChange }) => (
  <div className="flex flex-col">
    <label className="text-base font-medium mb-1">
      Puertas: <span className="text-red-600">*</span>
    </label>
    <Select value={puertas} onValueChange={handlePuertasChange}>
      <SelectTrigger className="w-full max-w-md">
        <SelectValue placeholder="Seleccione" />
      </SelectTrigger>
      <SelectContent>
        {[1, 2, 3, 4, 5].map((value) => (
          <SelectItem key={value} value={value.toString()}>
            {value}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
    {puertas === "" && (
      <p className="text-sm text-red-600 mt-1">Debe seleccionar la cantidad de puertas</p>
    )}
  </div>
);
