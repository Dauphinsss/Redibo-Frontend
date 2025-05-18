import React from "react";
import { Textarea } from "@/components/ui/textarea";

interface CampoDescripcionProps {
  descripcion: string;
  setDescripcion: (value: string) => void;
  error: string | null;
  setError: (error: string | null) => void;
}

const CampoDescripcion: React.FC<CampoDescripcionProps> = ({
  descripcion,
  setDescripcion,
  error,
  setError,
}) => {
  const handleDescripcionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    
    // Limitar a 150 caracteres
    if (value.length <= 150) {
      setDescripcion(value);
      setError(null); // Limpiar error si está dentro del límite
    } else {
      setError("La descripción no debe superar los 150 caracteres");
    }
  };

  return (
    <div className="flex flex-col mt-6">
      <label className="text-base font-medium mb-2">Descripción:</label>
      <Textarea
        placeholder="Describa las características de su vehículo..."
        className={`w-full resize-none h-24 ${error ? 'border-red-500' : ''}`}
        value={descripcion}
        onChange={handleDescripcionChange}
        maxLength={151}
      />
      {/* Solo muestra el error si se superan los 150 caracteres */}
      {error && (
        <div className="text-red-500 text-sm mt-1">
          {error}
        </div>
      )}
    </div>
  );
};

export default CampoDescripcion;