import React from "react";
import { Input } from "@/components/ui/input";

interface CampoMantenimientosProps {
  mantenimientos: string;
  setMantenimientos: (value: string) => void;
  error: string | null;
  setError: (error: string | null) => void;
}

const CampoMantenimientos: React.FC<CampoMantenimientosProps> = ({
  mantenimientos,
  setMantenimientos,
  error,
  setError,
}) => {
  const handleMantenimientosChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Remove any non-digit characters
    const sanitizedValue = value.replace(/[^0-9]/g, ''); // Removes everything that isn't a number

    setMantenimientos(sanitizedValue);

    if (sanitizedValue === "") {
      setError("Este campo es obligatorio");
    } else {
      const numValue = parseInt(sanitizedValue);
      if (isNaN(numValue)) {
        setError("Debe ser un número válido");
      } else if (numValue < 0) {
        setError("No se permiten valores negativos");
      } else if (numValue > 1000) {
        setError("No puede ser mayor a 1000");
      } else {
        setError(null);
      }
    }
  };

  return (
    <div className="flex flex-col mt-6">
      <label className="text-base font-medium mb-2">Número de mantenimientos:<span className="text-red-600"> *</span></label>
      <Input
        type="text" // Change to type="text" to allow sanitization
        placeholder="0"
        className={`w-full max-w-md ${error ? 'border-red-500' : ''}`}
        value={mantenimientos}
        onChange={handleMantenimientosChange}
        min="0"
        max="1000"
        required
         onKeyDown={(e) => {
          // Prevenir entrada del signo negativo
          if (e.key === '-') {
            e.preventDefault();
          }
          if (isNaN(Number(e.key)) && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') {
            e.preventDefault();
          }
        }}
      />
      {error && (
        <div className="text-red-500 text-sm mt-1">
          {error}
        </div>
      )}
    </div>
  );
};

export default CampoMantenimientos;