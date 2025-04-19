"use client";
import { Input } from "@/components/ui/input";

interface CampoVinProps {
  vin: string;
  onVinChange: (value: string) => void;
  vinError: string;
  setVinError: (value: string) => void;
}

export default function CampoVin({ vin, onVinChange, vinError, setVinError }: CampoVinProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    onVinChange(value); // Usamos onVinChange en lugar de setVin

    const vinRegex = /^[A-HJ-NPR-Z0-9]{17}$/;
    if (!value) {
      setVinError("El VIN es obligatorio.");
    } else if (!vinRegex.test(value)) {
      setVinError("El VIN debe tener exactamente 17 caracteres alfanuméricos.");
    } else {
      setVinError("");
    }
  };

  return (
    <div className="flex flex-col">
      <label className="text-base font-medium mb-1">Número de VIN: <span className="text-red-600"> *</span></label>
      <Input 
        type="text" 
        value={vin} 
        onChange={handleChange} 
        maxLength={17} 
        className="max-w-md" 
        placeholder="Ej: 1HGCM82633A123456"
      />
      {vinError && <p className="text-sm text-red-600 mt-1">{vinError}</p>}
    </div>
  );
}