"use client";
import { Input } from "@/components/ui/input";

interface CampoPlacaProps {
  placa: string;
  onPlacaChange: (value: string) => void;
  placaError: string;
  setPlacaError: (value: string) => void;
}

export default function CampoPlaca({ placa, onPlacaChange, placaError, setPlacaError }: CampoPlacaProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    onPlacaChange(value);

    if (!/^[A-Z0-9-]*$/.test(value) && value !== "") {
      setPlacaError("Solo se permiten letras mayúsculas, números y guiones.");
    } else if (value.length > 10) {
      setPlacaError("La placa no puede exceder los 10 caracteres.");
    } else {
      setPlacaError("");
    }
  };

  return (
    <div className="flex flex-col">
      <label className="text-base font-medium mb-1">Placa: <span className="text-red-600"> *</span></label>
      <Input
        type="text"
        value={placa}
        onChange={handleChange}
        className="max-w-md"
        placeholder="Ej: ABC123 o XYZ-456"
      />
      {placaError && <p className="text-sm text-red-600 mt-1">{placaError}</p>}
    </div>
  );
}