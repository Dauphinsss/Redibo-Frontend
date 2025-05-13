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

interface CampoDepartamentoProps {
  departamento: string;
  onDepartamentoChange: (value: string) => void;
  departamentoError: string;
  setDepartamentoError: (value: string) => void;
  pais: string;
  setProvincia: (value: string) => void;
  apiUrl: string;
}

interface Department {
  id: number;
  nombre: string;
}

export default function CampoDepartamento({ 
  departamento, 
  onDepartamentoChange,
  departamentoError, 
  setDepartamentoError,
  pais,
  setProvincia,
  apiUrl
}: CampoDepartamentoProps) {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState("");

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    async function fetchDepartments() {
      if (!pais) {
        setDepartments([]);
        return;
      }

      try {
        setLoading(true);
        setFetchError("");
        const response = await axios.get(`${apiUrl}/ciudades/${pais}`, {
          signal: controller.signal
        });
        
        if (isMounted) {
          setDepartments(response.data);
          setDepartamentoError("");
        }
      } catch (err) {
        if (isMounted) {
          if (axios.isCancel(err)) {
            console.log("Request canceled:", err.message);
          } else {
            console.error("Error al cargar departamentos:", err);
            setFetchError("Error al cargar la lista de departamentos");
            setDepartamentoError("Error al cargar la lista de departamentos");
          }
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchDepartments();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [pais, apiUrl, setDepartamentoError]);

  const handleValueChange = (value: string) => {
    onDepartamentoChange(value);
    setProvincia("");
  };

  return (
    <div className="flex flex-col max-w-md">
      <label className="text-base font-medium mb-1">Departamento:<span className="text-red-600"> *</span></label>
      <Select 
        value={departamento} 
        onValueChange={handleValueChange}
        disabled={!pais || loading || !!fetchError}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder={
            fetchError ? "Error al cargar departamentos" :
            !pais ? "Seleccione un país primero" : 
            loading ? "Cargando..." : "Seleccione un departamento"
          } />
        </SelectTrigger>
        <SelectContent>
          {departments.map((dept) => (
            <SelectItem key={dept.id} value={dept.id.toString()}>
              {dept.nombre}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {departamentoError && <p className="text-sm text-red-600 mt-1">{departamentoError}</p>}
      {fetchError && (
        <p className="text-sm text-yellow-600 mt-1">
          {fetchError} - Intente recargar la página
        </p>
      )}
    </div>
  );
}