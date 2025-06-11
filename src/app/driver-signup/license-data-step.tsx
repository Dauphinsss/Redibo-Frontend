"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LicenseData } from "./types";

interface LicenseDataStepProps {
  licenseData: LicenseData;
  onDataChange: (field: keyof LicenseData, value: string) => void;
  errors: { [key: string]: string };
}

export default function LicenseDataStep({
  licenseData,
  onDataChange,
  errors, // RECIBIMOS LA PROP 'errors'
}: LicenseDataStepProps) {
 const [fechaError, setFechaError] = useState("");
 const today = new Date();
  const currentYear = today.getFullYear();

const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Meses son 0-index
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

// Fecha mínima para la emisión (ej: 1970-01-01)
  const minIssueDate = "1970-01-01";
  // Fecha máxima para la emisión (hoy)
  const maxIssueDate = formatDate(today);

  // Fecha mínima para el vencimiento (puede ser el día de hoy o un poco en el futuro)
  // Aquí la establecemos como el día de hoy para asegurarnos que no se venza antes de hoy
  const minExpiryDate = formatDate(today);
  // Fecha máxima para el vencimiento (ej: 20 años en el futuro)
  const maxExpiryDate = formatDate(new Date(currentYear + 20, 11, 31));
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="license-number">Número de Licencia *</Label>
        <Input
          id="license-number"
          placeholder="Ej: 123456789"
          maxLength={11}
          value={licenseData.numeroLicencia}
          onChange={(e) => {
            // Solo permite números
            const value = e.target.value.replace(/\D/g, "").slice(0, 11);
            onDataChange("numeroLicencia", value);
          }}
        />
        {errors.numeroLicencia && (
          <p className="text-red-500 text-sm mt-1">{errors.numeroLicencia}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="issue-date">Fecha de Emisión *</Label>
          <Input
            id="issue-date"
            type="date"
            min={minIssueDate} // USA LA FECHA MÍNIMA DINÁMICA
            max={maxIssueDate} // USA LA FECHA MÁXIMA DINÁMICA (HOY)
            value={licenseData.fechaEmision}
            onChange={(e) => {
              onDataChange("fechaEmision", e.target.value);
              // Ajuste la validación de fecha inmediata para considerar el valor vacío
              if (licenseData.fechaVencimiento && e.target.value && new Date(e.target.value).getTime() >= new Date(licenseData.fechaVencimiento).getTime()) {
                setFechaError("La fecha de emisión debe ser anterior a la fecha de vencimiento.");
              } else {
                setFechaError("");
              }
            }}
          />
          {errors.fechaEmision && (
            <p className="text-red-500 text-sm mt-1">{errors.fechaEmision}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="expiry-date">Fecha de Vencimiento *</Label>
          <Input
            id="expiry-date"
            type="date"
            min={minExpiryDate} // USA LA FECHA MÍNIMA DINÁMICA (HOY)
            max={maxExpiryDate} // USA LA FECHA MÁXIMA DINÁMICA (20 AÑOS EN EL FUTURO)
            value={licenseData.fechaVencimiento}
            onChange={(e) => {
              onDataChange("fechaVencimiento", e.target.value);
              // Ajuste la validación de fecha inmediata para considerar el valor vacío
              if (licenseData.fechaEmision && e.target.value && new Date(e.target.value).getTime() <= new Date(licenseData.fechaEmision).getTime()) {
                setFechaError("La fecha de vencimiento debe ser posterior a la fecha de emisión.");
              } else {
                setFechaError("");
              }
            }}
          />
          {errors.fechaVencimiento && (
            <p className="text-red-500 text-sm mt-1">{errors.fechaVencimiento}</p>
          )}
        </div>
      </div>
      {fechaError && (
        <div className="text-red-500 text-sm mt-1">{fechaError}</div>
      )}

      <div className="space-y-2">
        <Label>Categoría de Licencia *</Label>
        <Select
          value={licenseData.categoria}
          onValueChange={(value) => onDataChange("categoria", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecciona la categoría" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="M">Categoría M - Motocicletas</SelectItem>
            <SelectItem value="P">Categoría P - Particular </SelectItem>
            <SelectItem value="A">Categoría A - Profesional </SelectItem>
            <SelectItem value="B">Categoría D - Profesional</SelectItem>
            <SelectItem value="C">Categoría C - Profesional</SelectItem>
            <SelectItem value="T">Categoría T - Motorista</SelectItem>
          </SelectContent>
        </Select>
        {errors.categoria && (
          <p className="text-red-500 text-sm mt-1">{errors.categoria}</p>
        )}
      </div>

      <div className="bg-muted p-4 rounded-lg">
        <h4 className="font-medium mb-2">Requisitos:</h4>
        <ul className="text-sm space-y-1">
          <li>• La licencia de conducir debe estar vigente</li>
          <li>
            • Tu nombre de tu cuenta debe ser el mismo que el de tu licencia
          </li>
          <li>
            • Tu foto de perfil debe ser parecida a la de tu licencia de
            conducir
          </li>
          <li>• Si los datos no coinciden tu solicitud sera rechazada</li>
        </ul>
      </div>
    </div>
  );
}
