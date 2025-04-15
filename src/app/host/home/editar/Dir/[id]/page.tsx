"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/components/ui/select";

const API_URL = "http://localhost:4000/api";

interface Location {
  id: string;
  nombre: string;
}

interface AddressFormData {
  pais: string;
  ciudad: string;
  provincia: string;
  direccion: string;
  numeroCasa: string;
}

const DireccionPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const vehiculoId = params?.id ? params.id.toString() : null;

  const [paises, setPaises] = useState<Location[]>([]);
  const [ciudades, setCiudades] = useState<Location[]>([]);
  const [provincias, setProvincias] = useState<Location[]>([]);
  const [formData, setFormData] = useState<AddressFormData>({
    pais: "",
    ciudad: "",
    provincia: "",
    direccion: "",
    numeroCasa: ""
  });

  const [isLoading, setIsLoading] = useState(true);
  const [loadingCiudades, setLoadingCiudades] = useState(false);
  const [loadingProvincias, setLoadingProvincias] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Cargar países
        const paisesResponse = await axios.get(`${API_URL}/paises`);
        setPaises(paisesResponse.data.map((p: any) => ({
          id: p.id.toString(),
          nombre: p.nombre
        })));

        // Cargar dirección existente si hay ID
        if (vehiculoId) {
          const direccionResponse = await axios.get(`${API_URL}/direccion/auto/${vehiculoId}`);
          const direccionData = direccionResponse.data;

          const newFormData = {
            pais: direccionData.pais?.toString() || "",
            ciudad: direccionData.ciudad?.toString() || "",
            provincia: direccionData.provincia?.toString() || "",
            direccion: direccionData.direccion || "",
            numeroCasa: direccionData.numeroCasa || ""
          };

          setFormData(newFormData);

          // Cargar ciudades si hay país
          if (newFormData.pais) {
            await fetchCiudades(newFormData.pais);
          }

          // Cargar provincias si hay ciudad
          if (newFormData.ciudad) {
            await fetchProvincias(newFormData.ciudad);
          }
        }
      } catch (error) {
        console.error("Error al cargar datos:", error);
        setError("Error al cargar los datos iniciales");
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, [vehiculoId]);

  const fetchCiudades = async (paisId: string) => {
    if (!paisId) return;
    
    setLoadingCiudades(true);
    try {
      const response = await axios.get(`${API_URL}/ciudades/${paisId}`);
      setCiudades(response.data.map((c: any) => ({
        id: c.id.toString(),
        nombre: c.nombre
      })));
    } catch (error) {
      console.error("Error al cargar ciudades:", error);
      setError("Error al cargar ciudades");
    } finally {
      setLoadingCiudades(false);
    }
  };

  const fetchProvincias = async (ciudadId: string) => {
    if (!ciudadId) return;
    
    setLoadingProvincias(true);
    try {
      const response = await axios.get(`${API_URL}/provincias/${ciudadId}`);
      setProvincias(response.data.map((p: any) => ({
        id: p.id.toString(),
        nombre: p.nombre
      })));
    } catch (error) {
      console.error("Error al cargar provincias:", error);
      setError("Error al cargar provincias");
    } finally {
      setLoadingProvincias(false);
    }
  };

  const handleChange = (field: keyof AddressFormData, value: string) => {
    const newFormData = {
      ...formData,
      [field]: value
    };

    setFormData(newFormData);

    if (field === "pais") {
      setCiudades([]);
      setProvincias([]);
      fetchCiudades(value);
    } else if (field === "ciudad") {
      setProvincias([]);
      fetchProvincias(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!vehiculoId) {
      setError("ID de vehículo no encontrado");
      return;
    }
    
    try {
      setIsSaving(true);
      setError(null);
      
      await axios.put(`${API_URL}/direccion/auto/${vehiculoId}`, formData);
      router.push("/host/cars");
    } catch (error) {
      console.error("Error al guardar:", error);
      setError("Error al guardar los cambios");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    router.push("/host/cars");
  };

  if (isLoading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-screen">
        <p>Cargando datos...</p>
      </div>
    );
  }

  return (
    <div className="p-6 flex flex-col items-start min-h-screen bg-gray-100">
      <div className="w-full max-w-5xl flex justify-start">
        <h1 className="text-4xl font-bold my-5 pl-7">Dirección</h1>
      </div>

      <span className="text-lg font-medium pl-9 mb-6">Ingrese una ubicación específica</span>

      {error && (
        <div className="w-full max-w-5xl mb-6 pl-9">
          <p className="text-red-500">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="w-full max-w-5xl pl-9">
        {/* País */}
        <div className="w-full flex flex-col mt-4">
          <label className="text-lg font-semibold mb-1">País</label>
          <Select
            value={formData.pais}
            onValueChange={(value) => handleChange("pais", value)}
          >
            <SelectTrigger className="w-[600px] mt-2 border-2 border-black rounded-md">
              <SelectValue>
                {paises.find(p => p.id === formData.pais)?.nombre || "Seleccione un país"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {paises.map((pais) => (
                  <SelectItem key={pais.id} value={pais.id}>
                    {pais.nombre}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* Ciudad */}
        <div className="w-full flex flex-col mt-6">
          <label className="text-lg font-semibold mb-1">Ciudad</label>
          <Select
            value={formData.ciudad}
            onValueChange={(value) => handleChange("ciudad", value)}
            disabled={!formData.pais || loadingCiudades}
          >
            <SelectTrigger className="w-[600px] mt-2 border-2 border-black rounded-md">
              <SelectValue>
                {loadingCiudades ? "Cargando..." : 
                 ciudades.find(c => c.id === formData.ciudad)?.nombre || "Seleccione una ciudad"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {ciudades.map((ciudad) => (
                  <SelectItem key={ciudad.id} value={ciudad.id}>
                    {ciudad.nombre}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* Provincia */}
        <div className="w-full flex flex-col mt-6">
          <label className="text-lg font-semibold mb-1">Provincia</label>
          <Select
            value={formData.provincia}
            onValueChange={(value) => handleChange("provincia", value)}
            disabled={!formData.ciudad || loadingProvincias}
          >
            <SelectTrigger className="w-[600px] mt-2 border-2 border-black rounded-md">
              <SelectValue>
                {loadingProvincias ? "Cargando..." : 
                 provincias.find(p => p.id === formData.provincia)?.nombre || "Seleccione una provincia"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {provincias.map((provincia) => (
                  <SelectItem key={provincia.id} value={provincia.id}>
                    {provincia.nombre}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* Dirección */}
        <div className="w-full flex flex-col mt-6">
          <label className="text-lg font-semibold mb-1">Dirección</label>
          <Input
            value={formData.direccion}
            onChange={(e) => handleChange("direccion", e.target.value)}
            className="w-[600px] mt-2 border-2 border-black rounded-md"
          />
        </div>

        {/* N° Casa */}
        <div className="w-full flex flex-col mt-6">
          <label className="text-lg font-semibold mb-1">N° Casa</label>
          <Input
            value={formData.numeroCasa}
            onChange={(e) => handleChange("numeroCasa", e.target.value)}
            className="w-[600px] mt-2 border-2 border-black rounded-md"
          />
        </div>

        {/* Botones */}
        <div className="w-full flex justify-between items-center mt-10">
          <Button 
            type="button"
            onClick={handleCancel}
            variant="secondary"
            className="w-[160px] h-12 text-lg font-semibold"
          >
            CANCELAR
          </Button>
          
          <Button 
            type="submit"
            className="h-12 text-lg font-semibold text-white px-6"
            disabled={isSaving}
          >
            {isSaving ? "GUARDANDO..." : "GUARDAR"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default DireccionPage;