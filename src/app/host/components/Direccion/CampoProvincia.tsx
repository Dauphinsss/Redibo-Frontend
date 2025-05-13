"use client";
import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";

interface CampoProvinciaProps {
  provincia: string;
  onProvinciaChange: (value: string) => void;
  provinciaError: string;
  setProvinciaError: (value: string) => void;
  departamento: string;
  apiUrl: string;
}

interface Province {
  id: number;
  nombre: string;
}

export default function CampoProvincia({ 
  provincia, 
  onProvinciaChange,
  provinciaError, 
  setProvinciaError,
  departamento,
  apiUrl
}: CampoProvinciaProps) {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (departamento) {
      setLoading(true);
      async function fetchProvinces() {
        try {
          const response = await axios.get(`${apiUrl}/provincias/${departamento}`);
          setProvinces(response.data);
        } catch (err) {
          console.error("Error al cargar provincias:", err);
          setProvinciaError("Error al cargar la lista de provincias");
        } finally {
          setLoading(false);
        }
      }
      fetchProvinces();
    } else {
      setProvinces([]);
    }
  }, [departamento, apiUrl, setProvinciaError]);

  return (
    <div className="flex flex-col max-w-md">
      <label className="text-base font-medium mb-1">Provincia:<span className="text-red-600"> *</span></label>
      <Select 
        value={provincia} 
        onValueChange={onProvinciaChange}
        disabled={!departamento || loading}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder={!departamento ? "Seleccione un departamento primero" : loading ? "Cargando..." : "Seleccione una provincia"} />
        </SelectTrigger>
        <SelectContent>
          {provinces.map((prov) => (
            <SelectItem key={prov.id} value={prov.id.toString()}>
              {prov.nombre}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {provinciaError && <p className="text-sm text-red-600 mt-1">{provinciaError}</p>}
    </div>
  );
}