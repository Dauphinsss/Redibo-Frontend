"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LicenseData } from "./types"

interface LicenseDataStepProps {
  licenseData: LicenseData
  onDataChange: (field: keyof LicenseData, value: string) => void
}

export default function LicenseDataStep({ licenseData, onDataChange }: LicenseDataStepProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="license-number">Número de Licencia *</Label>
        <Input
          id="license-number"
          placeholder="Ej: 123456789"
          value={licenseData.number}
          onChange={(e) => onDataChange("number", e.target.value)}
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
            value={licenseData.issueDate}
            onChange={(e) => onDataChange("issueDate", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="expiry-date">Fecha de Vencimiento *</Label>
          <Input
            id="expiry-date"
            type="date"
            min="2024-01-01"
            max="2050-12-31"
            value={licenseData.expiryDate}
            onChange={(e) => onDataChange("expiryDate", e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Categoría de Licencia *</Label>
        <Select value={licenseData.category} onValueChange={(value) => onDataChange("category", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Selecciona la categoría" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="A">Categoría A - Motocicletas</SelectItem>
            <SelectItem value="B">Categoría B - Automóviles</SelectItem>
            <SelectItem value="C">Categoría C - Camiones</SelectItem>
            <SelectItem value="D">Categoría D - Transporte Público</SelectItem>
            <SelectItem value="E">Categoría E - Vehículos Articulados</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="bg-muted p-4 rounded-lg">
        <h4 className="font-medium mb-2">Requisitos:</h4>
        <ul className="text-sm space-y-1">
          <li>• La licencia debe estar vigente</li>
          <li>• Tu nombre de tu licencia debe ser el mismo que el de tu cuenta</li>
          <li>• Si los datos no coinciden tu solicitud sera rechazada</li>
        </ul>
      </div>
    </div>
  )
}
