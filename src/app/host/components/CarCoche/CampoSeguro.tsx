"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface CampoSeguroProps {
  seguro: boolean;
  onSeguroChange: (value: boolean) => void;
  error: string;
  setError: (value: string) => void;
}

export default function CampoSeguro({
  seguro,
  onSeguroChange,
  error,
  setError,
}: CampoSeguroProps) {
  const handleChange = (checked: boolean) => {
    onSeguroChange(checked);
    setError(checked ? "" : "El seguro SOAT es obligatorio");
  };

  return (
    <div className="flex flex-col">
      <label className="text-base font-medium mb-1">
        Seguro: <span className="text-red-600">*</span>
      </label>
      <div className="flex items-center space-x-2 ml-4">
        <Checkbox
          id="soat"
          checked={seguro}
          onCheckedChange={(checked) => handleChange(checked === true)}
        />
        <Label htmlFor="soat">
          SOAT (Seguro Obligatorio de Accidentes de Tránsito)
        </Label>
      </div>
      {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
    </div>
  );
}