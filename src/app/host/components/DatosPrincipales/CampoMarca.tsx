// CampoMarca.tsx
"use client";
import { Input } from "@/components/ui/input";

interface CampoMarcaProps {
  marca: string;
  onMarcaChange: (value: string) => void;
  marcaError: string;
  setMarcaError: (value: string) => void;
}

export default function CampoMarca({ marca, onMarcaChange, marcaError, setMarcaError }: CampoMarcaProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    onMarcaChange(value);

    // Validaciones
    if (!value.trim()) {
      setMarcaError("La marca es obligatoria");
    } else if (value.length > 50) {
      setMarcaError("La marca no puede exceder los 50 caracteres.");
    } else if (!/^[A-Z\s]*$/.test(value)) {
      setMarcaError("Solo se permiten letras mayúsculas.");
    } else {
      setMarcaError("");
    }
  };

  return (
    <div className="flex flex-col">
      <label className="text-base font-medium mb-1">Marca: <span className="text-red-600"> *</span></label>
      <Input
        type="text"
        value={marca}
        onChange={handleChange}
        onBlur={() => {
          if (!marca.trim()) {
            setMarcaError("La marca es obligatoria");
          }
        }}
        className="max-w-md"
        placeholder="Ej: TOYOTA, FORD, CHEVROLET"
        maxLength={51}
      />
      {marcaError && <p className="text-sm text-red-600 mt-1">{marcaError}</p>}
    </div>
  );
}