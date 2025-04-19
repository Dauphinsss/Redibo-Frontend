"use client";
import { Input } from "@/components/ui/input";

interface CampoCalleProps {
  calle: string;
  onCalleChange: (value: string) => void;
  calleError: string;
  setCalleError: (value: string) => void;
}

export default function CampoCalle({ calle, onCalleChange, calleError, setCalleError }: CampoCalleProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onCalleChange(value);
    if (!value.trim()) {
      setCalleError("La calle es obligatoria");
    } else if (value.length > 100) {
      setCalleError("La calle no puede exceder los 100 caracteres");
    } else {
      setCalleError("");
    }
  };

  return (
    <div className="flex flex-col">
      <label className="text-base font-medium mb-1">Calle:<span className="text-red-600"> *</span></label>
      <Input 
        type="text" 
        value={calle} 
        onChange={handleChange}
        placeholder="Ej: Av. América entre Ayacucho y Bolívar"
        className="max-w-md" 
      />
      {calleError && <p className="text-sm text-red-600 mt-1">{calleError}</p>}
    </div>
  );
}