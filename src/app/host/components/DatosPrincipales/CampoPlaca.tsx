"use client";
import { Input } from "@/components/ui/input";

interface CampoPlacaProps {
  placa: string;
  setPlaca: (value: string) => void;
  placaError: string;
  setPlacaError: (value: string) => void;
}

export default function CampoPlaca({ placa, setPlaca, placaError, setPlacaError }: CampoPlacaProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    setPlaca(value);

    if (!/^[A-Z0-9-]*$/.test(value) && value !== "") {
      setPlacaError("Solo se permiten letras mayúsculas, números y guiones.");
    } else {
      setPlacaError("");
    }
  };

  return (
    <div className="flex flex-col">
      <label className="text-base font-medium mb-1">Placa: <span className="text-red-600"> *</span></label>
      <Input type="text" value={placa} onChange={handleChange} className="max-w-md" />
      {placaError && <p className="text-sm text-red-600 mt-1">{placaError}</p>}
    </div>
  );
}
