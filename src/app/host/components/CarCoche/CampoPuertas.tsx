"use client";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface CampoPuertasProps {
  puertas: number;
  onPuertasChange: (value: number) => void;
  error: string;
  setError: (value: string) => void;
}

export default function CampoPuertas({
  puertas,
  onPuertasChange,
  error,
  setError,
}: CampoPuertasProps) {
  const handleValueChange = (value: string) => {
    const numValue = parseInt(value);
    onPuertasChange(numValue);
    setError(numValue > 0 ? "" : "Seleccione la cantidad de puertas");
  };

  return (
    <div className="flex flex-col">
      <label className="text-base font-medium mb-1">
        Puertas: <span className="text-red-600">*</span>
      </label>
      <Select 
        value={puertas.toString()} 
        onValueChange={handleValueChange}
      >
        <SelectTrigger className="w-full max-w-md">
          <SelectValue placeholder="Seleccione" />
        </SelectTrigger>
        <SelectContent>
          {[2, 3, 4, 5].map((num) => (
            <SelectItem key={num} value={num.toString()}>
              {num}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
    </div>
  );
}