"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { getCountries, Country, getCities, City, getProvinces, Province } from '@/app/host/services/direcService';
import { useState, useEffect } from 'react';
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

export default function AddDireccion() {
  const router = useRouter();
  const [countries, setCountries] = useState<Country[]>([]); // Estado para almacenar la lista de países
  const [selectedCountry, setSelectedCountry] = useState<string | undefined>(undefined); // Estado para el país seleccionado
  const [cities, setCities] = useState<City[]>([]); // Estado para almacenar la lista de ciudades
  const [selectedCity, setSelectedCity] = useState<string | undefined>(undefined); // Estado para la ciudad seleccionada
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [selectedProvinceId, setSelectedProvinceId] = useState<string | undefined>(undefined);
  

  useEffect(() => {
    // Carga los países al montar el componente (solo una vez)
    async function loadCountries() {
      try {
        const fetchedCountries = await getCountries();
        setCountries(fetchedCountries);
      } catch (error: any) {
        console.error("Error loading countries:", error.message);
        // Maneja el error (por ejemplo, muestra un mensaje al usuario)
      }
    }

    loadCountries();
  }, []); // El array vacío [] asegura que este efecto se ejecute solo una vez

  const handleCountryChange = (value: string) => {
    setSelectedCountry(value);
    console.log("País seleccionado:", value); // Aquí puedes hacer algo con el valor seleccionado
  };

  useEffect(() => {
    async function loadCities() {

      try {
        const fetchedCities = await getCities();
        setCities(fetchedCities);
      } catch (error: any) {
        console.error("Error loading cities:", error.message);
      }
    }

    loadCities();
  }, []);

  const handleCityChange = (value: string) => {
    setSelectedCity(value);
    console.log("Departamento seleccionado:", value); // Aquí puedes hacer algo con el valor seleccionado
  };
  useEffect(() => {
    async function loadProvinces() {
      console.log("useEffect loadProvinces ejecutándose");
      if (selectedCity) {
        console.log("selectedCity:", selectedCity);
        try {
          const fetchedProvinces = await getProvinces(selectedCity);
          console.log("fetchedProvinces:", fetchedProvinces);
          setProvinces(fetchedProvinces);
        } catch (error) {
          console.error("Error al cargar las provincias:", error);
        }
      } else {
        setProvinces([]);
      }
    }
    loadProvinces();
  }, [selectedCity]);
  
  // Función para manejar el cambio en la selección de la provincia
  const handleProvinceChange = (value: string) => {
    setSelectedProvinceId(value);
    console.log("Provincia seleccionada:", value);
    // Aquí puedes hacer algo con el ID de la provincia seleccionada
  };

  return (
    <div className="p-6 flex flex-col items-start min-h-screen bg-gray-100">
      {/* Botón Volver */}
      <Link href="/host/pages">
        <Button
          variant="secondary"
          className="flex items-center gap-1 self-start w-full justify-start cursor-pointer w-[120px] h-10 text-base font-medium transition-all duration-200 hover:bg-gray-100 hover:brightness-90"
        >
          <ChevronLeft className="h-3 w-3" />
          Volver
        </Button>
      </Link>

      {/* Título */}
      <div className="w-full max-w-5xl flex justify-start">
        <h1 className="text-4xl font-bold my-5 pl-7">Dirección</h1>
      </div>

      <span className="text-lg font-medium pl-9">Ingrese una ubicación específica</span>



      {/* Campo: País */}
      <div className="w-full max-w-5xl flex flex-col mt-4 pl-13">
        <label className="text-lg font-semibold mb-1">País</label>
        <Select>
          <SelectTrigger className="w-[600px] mt-2">
            <SelectValue placeholder="Seleccione un país (Bolivia)" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Paises</SelectLabel>
              {countries.map((country) => (
            <SelectItem key={country.id} value={country.name}>
              {country.name}
            </SelectItem>
          ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* Campo: Departamento */}
      <div className="w-full max-w-5xl flex flex-col mt-4 pl-13">
        <label className="text-lg font-semibold mb-1">Departamento</label>
        <Select>
          <SelectTrigger className="w-[600px] mt-2">
            <SelectValue placeholder="Seleccione un departamento (Cochabamba)" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Departamentos</SelectLabel>
              {cities.map((city) => (
            <SelectItem key={city.id} value={city.name}>
              {city.name}
            </SelectItem>
          ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* Campo: Provincia */}
      <div className="w-full max-w-5xl flex flex-col mt-4 pl-13">
        <label className="text-lg font-semibold mb-1">Provincia</label>
        <Select>
          <SelectTrigger className="w-[600px] mt-2">
            <SelectValue placeholder="Seleccione una provincia (Cercado)" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Provincias</SelectLabel>
              {provinces.map((province) => (
          <SelectItem key={province.id} value={province.id.toString()}>
            {province.name}
          </SelectItem>
           ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* Campo: Dirección de la calle */}
      <div className="w-full max-w-5xl flex flex-col mt-6 pl-13">
        <label className="text-lg font-semibold mb-1">Dirección de la calle</label>
        <Input
          type="text"
          placeholder="Ej. Av. América entre Ayacucho y Bolívar"
          className="w-[600px] mt-2"
        />
      </div>

      {/* Campo: N° Casa */}
      <div className="w-full max-w-5xl flex flex-col mt-6 pl-13">
        <label className="text-lg font-semibold mb-1">N° Casa</label>
        <Input
          type="text"
          placeholder="Ingrese el número de casa"
          className="w-[600px] mt-2"
        />
      </div>

      {/* Sección de Botones con AlertDialog para Cancelar */}
      <AlertDialog>
        <div className="w-full max-w-5xl flex justify-between items-center mt-10 px-10">
        <AlertDialogTrigger asChild>
          <Button
            variant="secondary"
            className="w-[160px] h-12 text-lg font-semibold transition-all duration-200 hover:bg-gray-100 hover:brightness-90"
          >
            CANCELAR
          </Button>
        </AlertDialogTrigger>

          <Button
            variant="default"
            className="w-[180px] h-12 text-lg font-semibold text-white cursor-pointer "
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
