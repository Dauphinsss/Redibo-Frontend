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
  // Validar precio
  const handlePrecioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPrecio(value);
    
    if (value === "") {
      setError("Este campo es obligatorio");
    } else {
      const numValue = parseFloat(value);
      if (isNaN(numValue) || numValue < 1) {
        setError("Debe ser un número mayor o igual a 1");
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
        min="1"
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

export default CampoPrecio;