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
  // Validar descripción
  const handleDescripcionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    
    // Limitar a 150 caracteres
    if (value.length <= 150) {
      setDescripcion(value);
    }
    
    // La descripción ya no es obligatoria, solo validamos el límite de caracteres
    if (value.length > 150) {
      setError("La descripción no debe superar los 150 caracteres");
    } else {
      setError(null);
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
        maxLength={150}
      />
      <div className="flex justify-between items-center mt-1">
        {error && (
          <div className="text-red-500 text-sm">
            {error}
          </div>
        )}
        <div className={`text-sm ${descripcion.length > 149 ? 'text-red-500' : 'text-gray-500'}`}>
          {descripcion.length}/150 caracteres
        </div>
      </div>
    </div>
  );
};

export default CampoDescripcion;