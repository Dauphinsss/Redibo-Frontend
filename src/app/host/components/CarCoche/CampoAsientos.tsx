import React from "react";
import { Input } from "@/components/ui/input";

interface AsientosInputProps {
  asientos: string;
  asientosError: string;
  handleAsientosChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const AsientosInput: React.FC<AsientosInputProps> = ({ asientos, asientosError, handleAsientosChange }) => (
  <div className="flex flex-col">
    <label className="text-base font-medium mb-1">
      Asientos: <span className="text-red-600">*</span>
    </label>
    <Input
      type="text"
      value={asientos}
      onChange={handleAsientosChange}
      placeholder="Introduzca la cant. de asientos en su vehículo"
      className="w-full max-w-md"
    />
    {asientosError && (
      <p className="text-sm text-red-600 mt-1">{asientosError}</p>
    )}
  </div>
);
