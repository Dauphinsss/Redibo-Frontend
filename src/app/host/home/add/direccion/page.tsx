"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
  SelectLabel,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
// URL base para la API (modificar según corresponda)
const API_URL = "http://localhost:4000/api";

interface Country {
  id: number;
  nombre: string;
}

interface Department {
  id: number;
  nombre: string;
}

interface Province {
  id: number;
  nombre: string;
}

export default function AddDireccion() {
  const router = useRouter();

  // Estados para los datos de la dirección
  const [countries, setCountries] = useState<Country[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [provinces, setProvinces] = useState<Province[]>([]);

  const [selectedCountry, setSelectedCountry] = useState<number | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<number | null>(null);
  const [selectedProvince, setSelectedProvince] = useState<number | null>(null);

  const [calle, setCalle] = useState<string>("");
  const [numCasa, setNumCasa] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar países al inicio
  useEffect(() => {
    async function fetchCountries() {
      try {
        const response = await axios.get(`${API_URL}/paises`);
        setCountries(response.data);
      } catch (err) {
        console.error("Error al cargar países:", err);
        setError("Error al cargar la lista de países.");
      }
    }
    fetchCountries();
  }, []);

  // Cargar departamentos (ciudades) cuando cambia el país seleccionado
  useEffect(() => {
    if (selectedCountry) {
      async function fetchDepartments() {
        try {
          const response = await axios.get(`${API_URL}/ciudades/${selectedCountry}`);
          setDepartments(response.data);
          // Reiniciar departamentos dependientes
          setSelectedDepartment(null);
          setProvinces([]);
          setSelectedProvince(null);
        } catch (err) {
          console.error("Error al cargar departamentos:", err);
          setError("Error al cargar la lista de departamentos.");
        }
      }
      fetchDepartments();
    } else {
      setDepartments([]);
      setSelectedDepartment(null);
      setProvinces([]);
      setSelectedProvince(null);
    }
  }, [selectedCountry]);

  // Cargar provincias cuando cambia el departamento seleccionado
  useEffect(() => {
    if (selectedDepartment) {
      async function fetchProvinces() {
        try {
          const response = await axios.get(`${API_URL}/provincias/${selectedDepartment}`);
          setProvinces(response.data);
          setSelectedProvince(null);
        } catch (err) {
          console.error("Error al cargar provincias:", err);
          setError("Error al cargar la lista de provincias.");
        }
      }
      fetchProvinces();
    } else {
      setProvinces([]);
      setSelectedProvince(null);
    }
  }, [selectedDepartment]);

  // Función para guardar la dirección
  const handleGuardar = async () => {
    // Validar que se hayan seleccionado todos los campos necesarios
    if (!selectedCountry || !selectedDepartment || !selectedProvince || !calle || !numCasa) {
      alert("Por favor, complete todos los campos de la dirección.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await axios.post(`${API_URL}/direccion`, {
        paisId: selectedCountry,
        ciudadId: selectedDepartment,
        provinciaId: selectedProvince,
        calle,
        num_casa: numCasa,
      });
      alert("Dirección agregada correctamente");
      router.push("/host/home"); // Redirige a la página deseada
    } catch (err) {
      console.error("Error al guardar la dirección:", err);
      setError("Error al guardar la dirección");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 flex flex-col items-start min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold my-5">Añadir Dirección</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Campo: País */}
      <div className="w-full max-w-5xl flex flex-col mt-4">
        <label className="text-lg font-semibold mb-1">País</label>
        <Select value={selectedCountry?.toString() || ""}
                onValueChange={(value) => setSelectedCountry(Number(value))}>
          <SelectTrigger className="w-[600px] mt-2">
            <SelectValue placeholder="Seleccione un país" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Países</SelectLabel>
              {countries.map((pais) => (
                <SelectItem key={pais.id} value={pais.id.toString()}>
                  {pais.nombre}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* Campo: Departamento (Ciudad) */}
      <div className="w-full max-w-5xl flex flex-col mt-4">
        <label className="text-lg font-semibold mb-1">Departamento</label>
        <Select value={selectedDepartment?.toString() || ""}
                onValueChange={(value) => setSelectedDepartment(Number(value))}>
          <SelectTrigger className="w-[600px] mt-2">
            <SelectValue placeholder="Seleccione un departamento" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Departamentos</SelectLabel>
              {departments.map((dept) => (
                <SelectItem key={dept.id} value={dept.id.toString()}>
                  {dept.nombre}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* Campo: Provincia */}
      <div className="w-full max-w-5xl flex flex-col mt-4">
        <label className="text-lg font-semibold mb-1">Provincia</label>
        <Select value={selectedProvince?.toString() || ""}
                onValueChange={(value) => setSelectedProvince(Number(value))}>
          <SelectTrigger className="w-[600px] mt-2">
            <SelectValue placeholder="Seleccione una provincia" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Provincias</SelectLabel>
              {provinces.map((prov) => (
                <SelectItem key={prov.id} value={prov.id.toString()}>
                  {prov.nombre}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* Campo: Dirección de la calle */}
      <div className="w-full max-w-5xl flex flex-col mt-6">
        <label className="text-lg font-semibold mb-1">Dirección de la calle</label>
        <Input
          type="text"
          placeholder="Ej. Av. América entre Ayacucho y Bolívar"
          value={calle}
          onChange={(e) => setCalle(e.target.value)}
          className="w-[600px] mt-2"
        />
      </div>

      {/* Campo: Número de casa */}
      <div className="w-full max-w-5xl flex flex-col mt-6">
        <label className="text-lg font-semibold mb-1">Número de casa</label>
        <Input
          type="text"
          placeholder="Ingrese el número de casa"
          value={numCasa}
          onChange={(e) => setNumCasa(e.target.value)}
          className="w-[600px] mt-2"
        />
      </div>
      

      {/* Sección de Botones con AlertDialog para Cancelar */}
      <AlertDialog>
        <div className="w-full max-w-5xl flex justify-between items-center mt-10 px-10">
          <AlertDialogTrigger asChild>
            <Button
              variant="secondary"
              className="w-[180px] h-12 text-lg font-semibold transition-all duration-200 hover:bg-gray-100 hover:brightness-100"
            >
              CANCELAR
            </Button>
          </AlertDialogTrigger>

          <Button
            variant="default"
            className="w-[180px] h-12 text-lg font-semibold text-white cursor-pointer"
            onClick={() => router.push("/host/home/add/datosprincipales")}
          >
            SIGUIENTE
          </Button>
        </div>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              ¿Está seguro que desea salir del proceso de añadir un carro?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Toda la información no guardada se perderá si abandona esta sección.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => router.push("/host/pages")}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
