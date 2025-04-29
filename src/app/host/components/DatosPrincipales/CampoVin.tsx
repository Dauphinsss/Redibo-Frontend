"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";

interface CampoVinProps {
  vin: string;
  onVinChange: (value: string) => void;
  vinError: string;
  setVinError: (value: string) => void;
}

/**
 * Valida que el VIN cumpla:
 * 1–3: WMI (país/fabricante)
 * 4–9: VDS (modelo, carrocería, motor…)
 *   9: dígito de verificación
 * 10–17: VIS (año + número de serie)
 */
function validateVin(vin: string): string {
  // 1) Obligatorio
  if (!vin) {
    return "El VIN es obligatorio.";
  }

  // 2) Longitud exacta
  if (vin.length !== 17) {
    return "El VIN debe tener exactamente 17 caracteres.";
  }

  // 3) Caracteres permitidos: A–Z y 0–9, excluyendo I, O y Q
  const vinRegex = /^[A-HJ-NPR-Z0-9]{17}$/;
  if (!vinRegex.test(vin)) {
    return "El VIN solo puede contener letras y números (sin I, O ni Q).";
  }

  // 4) Dígito de verificación (posición 9)
  /*
  const transliteration: Record<string, number> = {
    A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8,
    J: 1, K: 2, L: 3, M: 4, N: 5, P: 7, R: 9,
    S: 2, T: 3, U: 4, V: 5, W: 6, X: 7, Y: 8, Z: 9,
    "0": 0, "1": 1, "2": 2, "3": 3, "4": 4,
    "5": 5, "6": 6, "7": 7, "8": 8, "9": 9,
  };
  const weights = [8, 7, 6, 5, 4, 3, 2, 10, 0, 9, 8, 7, 6, 5, 4, 3, 2];

  const sum = vin
    .split("")
    .map((char, i) => transliteration[char] * weights[i])
    .reduce((a, b) => a + b, 0);

  const remainder = sum % 11;
  const expected = remainder === 10 ? "X" : remainder.toString();
  const actual = vin[8];

  if (actual !== expected) {
    return `El dígito de verificación (9° carácter) es incorrecto: ingresaste '${actual}'.`;
  }

  // Si todo pasa
  */
  return "";
}

export default function CampoVin({
  vin,
  onVinChange,
  vinError,
  setVinError,
}: CampoVinProps) {
  const [touched, setTouched] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    //onVinChange(value);

    // 2. Eliminar todos los espacios en blanco y convertir a mayúsculas
    const processedValue = value.replace(/\s/g, '').toUpperCase();
    // 3. Actualizar el estado en el componente padre con el valor procesado
    onVinChange(processedValue);

    // Si ya tocó o llegó a 17 caracteres, mostramos error de inmediato
    if (touched || value.length === 17) {
      setVinError(validateVin(processedValue));
    } else {
      setVinError("");
    }
  };

  const handleBlur = () => {
    setTouched(true);
    setVinError(validateVin(vin));
  };

  return (
    <div className="flex flex-col">
      <label className="text-base font-medium mb-1">
        Número de VIN: <span className="text-red-600">*</span>
      </label>
      <Input
        type="text"
        value={vin}
        onChange={handleChange}
        onBlur={handleBlur}
        maxLength={17}
        className="max-w-md"
        placeholder="Ej: 1HGCM82633A123456"
      />
      {vinError && (
        <p className="text-sm text-red-600 mt-1">{vinError}</p>
      )}
    </div>
  );
}
