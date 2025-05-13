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
  año?: string;
  onAnioChange: (value: string) => void;
  añoError: string;
  setAnioError: (value: string) => void;
  currentYear: number;
}

export default function CampoAnio({
  año,
  onAnioChange,
  añoError,
  setAnioError,
  currentYear,
}: CampoAnioProps) {
  const years = Array.from(
    { length: currentYear - 1980 + 1 },
    (_, i) => (1980 + i).toString()
  );

  const handleSelectChange = (value: string) => {
    onAnioChange(value);
    if (value) {
      const numeric = parseInt(value, 10);
      if (numeric < 1980 || numeric > currentYear) {
        setAnioError(`El año debe estar entre 1980 y ${currentYear}.`);
      } else {
        setAnioError("");
      }
    } else {
      setAnioError("");
    }
  };

  // Only use the año value if it's a valid year (not 0)
  const displayValue = año && parseInt(año) > 1900 ? año : undefined;

  return (
    <div className="flex flex-col max-w-md">
      <label className="text-base font-medium mb-1">
        Año del coche:<span className="text-red-600"> *</span>
      </label>
      <Select 
        value={displayValue}
        onValueChange={handleSelectChange}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Selecciona el año del coche" />
        </SelectTrigger>
        <SelectContent className="max-h-60 overflow-y-auto">
          {years.map((year) => (
            <SelectItem key={year} value={year}>
              {year}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {añoError && <p className="text-sm text-red-600 mt-1">{añoError}</p>}
    </div>
  );
}