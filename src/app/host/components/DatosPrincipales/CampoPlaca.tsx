"use client";
import { Input } from "@/components/ui/input";

interface CampoPlacaProps {
  placa: string;
  onPlacaChange: (value: string) => void;
  placaError: string;
  setPlacaError: (value: string) => void;
}

export default function CampoPlaca({ placa, onPlacaChange, placaError, setPlacaError }: CampoPlacaProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();  // <-- Aquí corregido
    let newValue = "";
    let hasLetters = false;
    let letterCount = 0;
  
    for (let i = 0; i < value.length; i++) {
      const char = value[i];
  
      if (letterCount >= 3) break;
  
      if (i === 0 && !/[0-9]/.test(char)) continue;
  
      if (!hasLetters && /[0-9]/.test(char) && newValue.replace('-', '').length < 4) {
        newValue += char;
      } else if (/[A-Z]/.test(char)) {
        if (!hasLetters) {
          newValue += "-" + char;
          hasLetters = true;
          letterCount = 1;
        } else {
          newValue += char;
          letterCount++;
        }
      }
    }
  
    // Validaciones
    const parts = newValue.split("-");
    const numericPart = parts[0] || "";
    const letterPart = parts[1] || "";
  
    if (!newValue.trim()) {
      setPlacaError("La placa es obligatoria");
    } else if (newValue.length > 8) {
      setPlacaError("La placa no puede exceder los 8 caracteres (4 números + 3 letras).");
    } else if (!/^[0-9]{3,4}-[A-Z]{0,3}$/.test(newValue)) {
      setPlacaError("Formato inválido. Ejemplos: 123-ABC, 1234-XYZ");
    } else if (numericPart.length < 4 || letterPart.length < 3) {
      setPlacaError("Placa incompleta, por favor ingrese la placa completa.");
    } else {
      setPlacaError("");
    }
  
    onPlacaChange(newValue);
  };
  

  const handleBlur = () => {
    if (!placa.trim()) {
      setPlacaError("La placa es obligatoria");
    }
  };

  return (
    <div className="flex flex-col">
      <label className="text-base font-medium mb-1">Placa: <span className="text-red-600"> *</span></label>
      <Input
        type="text"
        value={placa}
        onChange={handleChange}
        onBlur={handleBlur}
        className="max-w-md"
        placeholder="Ej: 123-ABC o 1234-XYZ"
        maxLength={8} // 4 números + guión + 3 letras
      />
      {placaError && <p className="text-sm text-red-600 mt-1">{placaError}</p>}
    </div>
  );
}