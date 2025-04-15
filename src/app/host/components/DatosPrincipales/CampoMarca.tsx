"use client";
import { Input } from "@/components/ui/input";

interface CampoMarcaProps {
  marca: string;
  setMarca: (value: string) => void;
  marcaError: string;
  setMarcaError: (value: string) => void;
}

export default function CampoMarca({ marca, setMarca, marcaError, setMarcaError }: CampoMarcaProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    setMarca(value);

    if (value.length > 50) {
      setMarcaError("La marca no puede exceder los 50 caracteres.");
    } else if (!/^[A-Z\s]*$/.test(value)) {
      setMarcaError("Solo se permiten letras mayúsculas.");
    } else {
      setMarcaError("");
    }
  };

  return (
    <div className="flex flex-col">
      <label className="text-base font-medium mb-1">Marca:</label>
      <Input type="text" value={marca} onChange={handleChange}  className="max-w-md" />
      {marcaError && <p className="text-sm text-red-600 mt-1">{marcaError}</p>}
    </div>
  );
}
