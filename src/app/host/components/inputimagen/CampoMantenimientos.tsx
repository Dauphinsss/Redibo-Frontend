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
  // Validar número de mantenimientos
  const handleMantenimientosChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMantenimientos(value);
    
    if (value === "") {
      setError("Este campo es obligatorio");
    } else {
      const numValue = parseInt(value);
      if (isNaN(numValue) || numValue < 0) {
        setError("Debe ser un número igual o mayor a 0");
      } else {
        setError(null);
      }
    }
  };

  return (
    <div className="flex flex-col mt-6">
      <label className="text-base font-medium mb-2">Número de mantenimientos:<span className="text-red-600"> *</span></label>
      <Input
        type="number"
        placeholder="0"
        className={`w-full max-w-md ${error ? 'border-red-500' : ''}`}
        value={mantenimientos}
        onChange={handleMantenimientosChange}
        min="0"
        required
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