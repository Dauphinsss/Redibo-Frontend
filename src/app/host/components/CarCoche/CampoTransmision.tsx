"use client";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface CampoTransmisionProps {
  transmision: string;
  onTransmisionChange: (value: string) => void;
  error: string;
  setError: (value: string) => void;
}

export default function CampoTransmision({
  transmision,
  onTransmisionChange,
  error,
  setError,
}: CampoTransmisionProps) {
  const handleValueChange = (value: string) => {
    onTransmisionChange(value);
    setError(value ? "" : "Seleccione el tipo de transmisión");
  };

  return (
    <div className="flex flex-col">
      <label className="text-base font-medium mb-1">
        Transmisión: <span className="text-red-600">*</span>
      </label>
      <Select 
        value={transmision} 
        onValueChange={handleValueChange}
      >
        <SelectTrigger className="w-full max-w-md">
          <SelectValue placeholder="Seleccione" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="manual">Manual</SelectItem>
          <SelectItem value="automatico">Automático</SelectItem>
          <SelectItem value="semiautomatico">Semi-automático</SelectItem>
        </SelectContent>
      </Select>
      {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
    </div>
  );
}