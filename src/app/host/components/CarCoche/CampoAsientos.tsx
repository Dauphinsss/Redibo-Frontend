"use client";

import { Input } from "@/components/ui/input";

interface CampoAsientosProps {
  asientos: number;
  onAsientosChange: (value: number) => void;
  error: string;
  setError: (value: string) => void;
}

export default function CampoAsientos({
  asientos,
  onAsientosChange,
  error,
  setError,
}: CampoAsientosProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    if (value === "" || /^\d+$/.test(value)) {
      const numValue = value === "" ? 0 : parseInt(value);
      onAsientosChange(numValue);
      
      if (numValue <= 0) {
        setError("Debe ser mayor a 0");
      } else if (numValue > 240) {
        setError("Máximo 240 asientos");
      } else {
        setError("");
      }
    } else {
      setError("Solo se permiten números positivos");
    }
  };

  return (
    <div className="flex flex-col">
      <label className="text-base font-medium mb-1">
        Asientos: <span className="text-red-600">*</span>
      </label>
      <Input
        type="number"
        value={asientos || ""}
        onChange={handleChange}
        placeholder="Número de asientos"
        className="w-full max-w-md"
        min="1"
        max="240"
      />
      {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
    </div>
  );
}