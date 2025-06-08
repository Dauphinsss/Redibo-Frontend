"use client";

import { useState } from "react";
//import { Button } from "@/components/ui/button";
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
}

export default function LicenseDataStep({
  licenseData,
  onDataChange,
}: LicenseDataStepProps) {
  const [fechaError, setFechaError] = useState("");
  const isFechaValida = () => {
    if (!licenseData.fechaEmision || !licenseData.fechaVencimiento) return true;
    return (
      new Date(licenseData.fechaEmision).getTime() <
      new Date(licenseData.fechaVencimiento).getTime()
    );
  };

  const handleNext = () => {
    if (!isFechaValida()) {
      setFechaError("La fecha de emisión debe ser anterior a la fecha de vencimiento.");
      return;
    }
    setFechaError("");
  };
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
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="issue-date">Fecha de Emisión *</Label>
          <Input
            id="issue-date"
            type="date"
            min="1970-01-01"
            max="2024-12-31"
            value={licenseData.fechaEmision}
            onChange={(e) => {
              onDataChange("fechaEmision", e.target.value);
              if (licenseData.fechaVencimiento && e.target.value >= licenseData.fechaVencimiento) {
                setFechaError("La fecha de emisión debe ser anterior a la fecha de vencimiento.");
              } else {
                setFechaError("");
              }
            }}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="expiry-date">Fecha de Vencimiento *</Label>
          <Input
            id="expiry-date"
            type="date"
            min="2024-01-01"
            max="2050-12-31"
            value={licenseData.fechaVencimiento}
            onChange={(e) => {
              onDataChange("fechaVencimiento", e.target.value);
              if (licenseData.fechaEmision && e.target.value <= licenseData.fechaEmision) {
                setFechaError("La fecha de vencimiento debe ser posterior a la fecha de emisión.");
              } else {
                setFechaError("");
              }
            }}
          />
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
