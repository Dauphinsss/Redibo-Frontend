"use client";
import { Input } from "@/components/ui/input";

interface CampoAnioProps {
  anio: string;
  setAnio: (value: string) => void;
  anioError: string;
  setAnioError: (value: string) => void;
  currentYear: number;
}

export default function CampoAnio({ anio, setAnio, anioError, setAnioError, currentYear }: CampoAnioProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setAnio(value);
      const numeric = parseInt(value, 10);
      if (value && (numeric < 1980 || numeric > currentYear)) {
        setAnioError(`El año debe estar entre 1980 y ${currentYear}.`);
      } else {
        setAnioError("");
      }
    } else {
      setAnioError("Solo se permiten números.");
    }
  };

  return (
    <div className="flex flex-col">
      <label className="text-base font-medium mb-1">Año del coche:</label>
      <Input type="text" value={anio} onChange={handleChange} maxLength={4} className="max-w-md" />
      {anioError && <p className="text-sm text-red-600 mt-1">{anioError}</p>}
    </div>
  );
}
