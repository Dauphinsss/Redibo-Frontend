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

interface CampoPaisProps {
  pais: string;
  onPaisChange: (value: string) => void;
  paisError: string;
  setPaisError: (value: string) => void;
  setDepartamento: (value: string) => void;
  setProvincia: (value: string) => void;
  apiUrl: string;
}

interface Country {
  id: number;
  nombre: string;
}

export default function CampoPais({ 
  pais, 
  onPaisChange,
  paisError, 
  setPaisError,
  setDepartamento,
  setProvincia,
  apiUrl
}: CampoPaisProps) {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
  
    async function fetchCountries() {
      try {
        setLoading(true);
        setFetchError("");
        const response = await axios.get(`${apiUrl}/paises`, {
          signal: controller.signal
        });
  
        if (isMounted) {
          setCountries(response.data);
          setPaisError("");
  
          // Buscar "Bolivia" y seleccionarlo si no hay país seleccionado aún
          const bolivia = response.data.find((c: Country) => c.nombre === "Bolivia");
          if (bolivia && !pais) {
            onPaisChange(bolivia.id.toString());
          }
        }
      } catch (err) {
        if (isMounted) {
          if (axios.isCancel(err)) {
            console.log("Request canceled:", err.message);
          } else {
            console.error("Error al cargar países:", err);
            setFetchError("Error al cargar la lista de países");
            setPaisError("Error al cargar la lista de países");
          }
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }
  
    fetchCountries();
  
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [apiUrl, setPaisError, onPaisChange, pais]);
  
  const handleValueChange = (value: string) => {
    onPaisChange(value);
    setDepartamento("");
    setProvincia("");
  };

  return (
    <div className="flex flex-col max-w-md">
      <label className="text-base font-medium mb-1">País:<span className="text-red-600"> *</span></label>
      <Select 
        value={pais} 
        onValueChange={handleValueChange}
        disabled={loading || !!fetchError}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder={
            fetchError ? "Error al cargar países" : 
            loading ? "Cargando..." : "Seleccione un país"
          } />
        </SelectTrigger>
        <SelectContent>
          {countries.map((country) => (
            <SelectItem key={country.id} value={country.id.toString()}>
              {country.nombre}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {paisError && <p className="text-sm text-red-600 mt-1">{paisError}</p>}
      {fetchError && (
        <p className="text-sm text-yellow-600 mt-1">
          {fetchError} - Intente recargar la página
        </p>
      )}
    </div>
  );
}