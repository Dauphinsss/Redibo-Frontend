import React from "react";
import { Input } from "@/components/ui/input";

interface CampoPrecioProps {
  precio: string;
  setPrecio: (value: string) => void;
  error: string | null;
  setError: (error: string | null) => void;
}

const CampoPrecio: React.FC<CampoPrecioProps> = ({
  precio,
  setPrecio,
  error,
  setError,
}) => {
  const handlePrecioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Prevenir entrada de valores negativos
    if (value.startsWith('-')) {
      return;
    }
    
    setPrecio(value);
    
    if (value === "") {
      setError("Este campo es obligatorio");
    } else {
      const numValue = parseFloat(value);
      if (isNaN(numValue)) {
        setError("Debe ser un número válido");
      } else if (numValue <= 0) {
        setError("El precio debe ser mayor a 0");
      } else if (numValue > 5000) {
        setError("El precio no puede ser mayor a 5000 Bs");
      } else {
        setError(null);
      }
    }
  };

  return (
    <div className="flex flex-col mt-6">
      <label className="text-base font-medium mb-2">Precio de alquiler por día:<span className="text-red-600"> *</span></label>
      <Input
        type="number"
        placeholder="0"
        className={`w-full max-w-md ${error ? 'border-red-500' : ''}`}
        value={precio}
        onChange={handlePrecioChange}
        min="0.01"
        max="5000"
        step="0.01"
        required
        onKeyDown={(e) => {
          // Prevenir entrada del signo negativo
          if (e.key === '-') {
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

export default CampoPrecio;