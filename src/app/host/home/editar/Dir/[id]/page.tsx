"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/components/ui/select";

const API_URL = "http://localhost:4000/api";

interface Option {
  id: number;
  nombre: string;
}

const EditarDireccionPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const carId = params?.id ? parseInt(params.id as string) : null;

  const [paises, setPaises] = useState<Option[]>([]);
  const [ciudades, setCiudades] = useState<Option[]>([]);
  const [provincias, setProvincias] = useState<Option[]>([]);

  const [selectedPais, setSelectedPais] = useState<number | null>(null);
  const [selectedCiudad, setSelectedCiudad] = useState<number | null>(null);
  const [selectedProvincia, setSelectedProvincia] = useState<number | null>(null);
  const [calle, setCalle] = useState<string>("");
  const [numCasa, setNumCasa] = useState<string>("");

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [nombrePais, setNombrePais] = useState<string>("");
  const [nombreCiudad, setNombreCiudad] = useState<string>("");
  const [nombreProvincia, setNombreProvincia] = useState<string>("");

  // 🔹 Cargar países al inicio
  useEffect(() => {
    const fetchPaises = async () => {
      try {
        const response = await axios.get(`${API_URL}/paises`);
        setPaises(response.data);
      } catch (err) {
        console.error("Error al cargar países:", err);
      }
    };
    fetchPaises();
  }, []);

  // 🔹 Cargar datos del carro
  useEffect(() => {
    const fetchCarroConDireccion = async () => {
      if (!carId) {
        setIsLoading(false);
        setError("ID del vehículo no encontrado");
        return;
      }

      try {
        const response = await axios.get(`${API_URL}/carro/direccion/${carId}`);
        const carro = response.data;

        setSelectedPais(carro.paisId);
        setSelectedCiudad(carro.ciudadId);
        setSelectedProvincia(carro.provinciaId);
        setCalle(carro.calle);
        setNumCasa(carro.num_casa);

        setNombrePais(carro.paisNombre);
        setNombreCiudad(carro.ciudadNombre);
        setNombreProvincia(carro.provinciaNombre);

        // 🔹 Cargar ciudades y provincias relacionadas
        if (carro.paisId) {
          const ciudadesResponse = await axios.get(`${API_URL}/ciudades/${carro.paisId}`);
          setCiudades(ciudadesResponse.data);
        }

        if (carro.ciudadId) {
          const provinciasResponse = await axios.get(`${API_URL}/provincias/${carro.ciudadId}`);
          setProvincias(provinciasResponse.data);
        }
      } catch (err) {
        console.error("Error al cargar datos del vehículo:", err);
        setError("Error al cargar los datos del vehículo");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCarroConDireccion();
  }, [carId]);

  // 🔹 Cargar ciudades cuando cambia el país
  useEffect(() => {
    if (selectedPais) {
      axios.get(`${API_URL}/ciudades/${selectedPais}`).then((res) => {
        setCiudades(res.data);
        setSelectedCiudad(null);
        setProvincias([]);
        setSelectedProvincia(null);
        setNombreCiudad("");
        setNombreProvincia("");
      });

      const paisEncontrado = paises.find((p) => p.id === selectedPais);
      setNombrePais(paisEncontrado?.nombre || "");
    }
  }, [selectedPais]);

  // 🔹 Cargar provincias cuando cambia la ciudad
  useEffect(() => {
    if (selectedCiudad) {
      axios.get(`${API_URL}/provincias/${selectedCiudad}`).then((res) => {
        setProvincias(res.data);
        setSelectedProvincia(null);
        setNombreProvincia("");
      });

      const ciudadEncontrada = ciudades.find((c) => c.id === selectedCiudad);
      setNombreCiudad(ciudadEncontrada?.nombre || "");
    }
  }, [selectedCiudad]);

  // 🔹 Cambiar nombre provincia cuando cambia
  useEffect(() => {
    const provinciaEncontrada = provincias.find((p) => p.id === selectedProvincia);
    setNombreProvincia(provinciaEncontrada?.nombre || "");
  }, [selectedProvincia]);

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <p className="text-lg">Cargando datos del vehículo...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  const handleGuardar = async () => {
    try {
      await axios.put(`${API_URL}/actualizar-direccion/${carId}`, {
        paisId: selectedPais,
        ciudadId: selectedCiudad,
        provinciaId: selectedProvincia,
        calle,
        num_casa: numCasa,
      });
      alert("Dirección actualizada correctamente");
      router.push("/vehiculos");
    } catch (error) {
      console.error("Error al guardar:", error);
      alert("Ocurrió un error al guardar los datos");
    }
  };

  return (
    <div className="p-6 flex flex-col items-start min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold my-5">Editar Dirección</h1>

      {/* País */}
      <div className="w-full max-w-5xl flex flex-col mt-4">
        <label className="text-lg font-semibold mb-1">País</label>
        <Select
          value={selectedPais?.toString()}
          onValueChange={(value) => setSelectedPais(Number(value))}
        >
          <SelectTrigger className="w-[600px] mt-2">
            <SelectValue placeholder="Seleccione un país">
              {nombrePais || "Seleccione un país"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {paises.map((pais) => (
                <SelectItem key={pais.id} value={pais.id.toString()}>
                  {pais.nombre}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* Ciudad */}
      <div className="w-full max-w-5xl flex flex-col mt-4">
        <label className="text-lg font-semibold mb-1">Ciudad</label>
        <Select
          value={selectedCiudad?.toString()}
          onValueChange={(value) => setSelectedCiudad(Number(value))}
        >
          <SelectTrigger className="w-[600px] mt-2">
            <SelectValue placeholder="Seleccione una ciudad">
              {nombreCiudad || "Seleccione una ciudad"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {ciudades.map((ciudad) => (
                <SelectItem key={ciudad.id} value={ciudad.id.toString()}>
                  {ciudad.nombre}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* Provincia */}
      <div className="w-full max-w-5xl flex flex-col mt-4">
        <label className="text-lg font-semibold mb-1">Provincia</label>
        <Select
          value={selectedProvincia?.toString()}
          onValueChange={(value) => setSelectedProvincia(Number(value))}
        >
          <SelectTrigger className="w-[600px] mt-2">
            <SelectValue placeholder="Seleccione una provincia">
              {nombreProvincia || "Seleccione una provincia"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {provincias.map((provincia) => (
                <SelectItem key={provincia.id} value={provincia.id.toString()}>
                  {provincia.nombre}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* Dirección calle */}
      <div className="w-full max-w-5xl flex flex-col mt-6">
        <label className="text-lg font-semibold mb-1">Dirección de la calle</label>
        <input
          type="text"
          value={calle}
          onChange={(e) => setCalle(e.target.value)}
          className="w-[600px] mt-2 p-2 border border-gray-300 rounded"
        />
      </div>

      {/* Número de casa */}
      <div className="w-full max-w-5xl flex flex-col mt-6">
        <label className="text-lg font-semibold mb-1">Número de casa</label>
        <input
          type="text"
          value={numCasa}
          onChange={(e) => setNumCasa(e.target.value)}
          className="w-[600px] mt-2 p-2 border border-gray-300 rounded"
        />
      </div>

      {/* Botón de guardar */}
      <Button onClick={handleGuardar} className="mt-6">
        Guardar
      </Button>
    </div>
  );
};

export default EditarDireccionPage;
