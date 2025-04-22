// CampoModelo.tsx
"use client";
import { Input } from "@/components/ui/input";

interface CampoModeloProps {
  modelo: string;
  onModeloChange: (value: string) => void;
  modeloError: string;
  setModeloError: (value: string) => void;
}

export default function CampoModelo({ modelo, onModeloChange, modeloError, setModeloError }: CampoModeloProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    onModeloChange(value);

    // Validaciones
    if (!value.trim()) {
      setModeloError("El modelo es obligatorio");
    } else if (value.length > 50) {
      setModeloError("El modelo no puede exceder los 50 caracteres.");
    } else if (!/^[A-Z0-9\s.-]*$/.test(value)) {
      setModeloError("Solo se permiten letras mayúsculas, números y caracteres básicos.");
    } else {
      setModeloError("");
    }
  };

  return (
    <div className="flex flex-col">
      <label className="text-base font-medium mb-1">Modelo: <span className="text-red-600"> *</span></label>
      <Input
        type="text"
        value={modelo}
        onChange={handleChange}
        onBlur={() => {
          if (!modelo.trim()) {
            setModeloError("El modelo es obligatorio");
          }
        }}
        className="max-w-md"
        placeholder="Ej: COROLLA, F-150, ONIX"
        maxLength={51}
      />
      {modeloError && <p className="text-sm text-red-600 mt-1">{modeloError}</p>}
    </div>
  );
}