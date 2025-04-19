"use client";
import { Input } from "@/components/ui/input";

interface CampoNumCasaProps {
  numCasa: string;
  onNumCasaChange: (value: string) => void;
  numCasaError: string;
  setNumCasaError: (value: string) => void;
}

export default function CampoNumCasa({ numCasa, onNumCasaChange, numCasaError, setNumCasaError }: CampoNumCasaProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onNumCasaChange(value);
    if (!value.trim()) {
      setNumCasaError("El número de casa es obligatorio");
    } else if (!/^[A-Za-z0-9\s-]*$/.test(value)) {
      setNumCasaError("Solo se permiten letras, números y guiones");
    } else if (value.length > 20) {
      setNumCasaError("El número no puede exceder los 20 caracteres");
    } else {
      setNumCasaError("");
    }
  };

  return (
    <div className="flex flex-col">
      <label className="text-base font-medium mb-1">Número de casa:<span className="text-red-600"> *</span></label>
      <Input 
        type="text" 
        value={numCasa} 
        onChange={handleChange}
        placeholder="Ej: 1234 o S/N"
        className="max-w-md" 
      />
      {numCasaError && <p className="text-sm text-red-600 mt-1">{numCasaError}</p>}
    </div>
  );
}