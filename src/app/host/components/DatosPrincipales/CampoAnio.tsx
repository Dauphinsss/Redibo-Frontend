"use client";
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CampoAnioProps {
  anio: string;
  onAnioChange: (value: string) => void;
  anioError: string;
  setAnioError: (value: string) => void;
  currentYear: number;
}

export default function CampoAnio({
  anio,
  onAnioChange,
  anioError,
  setAnioError,
  currentYear,
}: CampoAnioProps) {
  const years = Array.from(
    { length: currentYear - 1980 + 1 },
    (_, i) => (1980 + i).toString()
  );

  const handleSelectChange = (value: string) => {
    onAnioChange(value);
    const numeric = parseInt(value, 10);
    if (numeric < 1980 || numeric > currentYear) {
      setAnioError(`El año debe estar entre 1980 y ${currentYear}.`);
    } else {
      setAnioError("");
    }
  };

  return (
    <div className="flex flex-col max-w-md">
      <label className="text-base font-medium mb-1">Año del coche:<span className="text-red-600"> *</span></label>
      <Select 
        value={anio} 
        onValueChange={handleSelectChange}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Selecciona un año" />
        </SelectTrigger>
        <SelectContent className="max-h-60 overflow-y-auto">
          {years.map((year) => (
            <SelectItem key={year} value={year}>
              {year}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {anioError && (
        <p className="text-sm text-red-600 mt-1">{anioError}</p>
      )}
    </div>
  );
}