import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TransmisionSelectorProps {
  transmision: string;
  handleTransmisionChange: (value: string) => void;
}

export const TransmisionSelector: React.FC<TransmisionSelectorProps> = ({ transmision, handleTransmisionChange }) => (
  <div className="flex flex-col">
    <label className="text-base font-medium mb-1">
      Transmisión: <span className="text-red-600">*</span>
    </label>
    <Select value={transmision} onValueChange={handleTransmisionChange}>
      <SelectTrigger className="w-full max-w-md">
        <SelectValue placeholder="Seleccione" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="manual">Manual</SelectItem>
        <SelectItem value="automatico">Automático</SelectItem>
        <SelectItem value="semiautomatico">Semi-automático</SelectItem>
      </SelectContent>
    </Select>
    {transmision === "" && (
      <p className="text-sm text-red-600 mt-1">Debe seleccionar el tipo de transmisión</p>
    )}
  </div>
);
