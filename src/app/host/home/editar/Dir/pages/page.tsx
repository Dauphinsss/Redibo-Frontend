"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
} from "@/components/ui/select";

interface City {
  id: string; // Cambia el tipo si es necesario
  nombre: string; // Cambia el campo según tu base de datos
}

const SprinterosPage: React.FC = () => {
  const [departments, setDepartments] = useState<{ label: string; value: string }[]>([]);

  // Función para cargar los departamentos desde el backend
  const fetchDepartments = async () => {
    try {
      const response = await axios.get<City[]>("http://localhost:4000/api/ciudades"); // Cambia la URL si es necesario
      const data = response.data;

      // Mapea los datos para que coincidan con el formato esperado
      const formattedDepartments = data.map((city) => ({
        label: city.nombre,
        value: city.id,
      }));
      setDepartments(formattedDepartments);
    } catch (error) {
      console.error("Error al cargar los departamentos:", error);
    }
  };

  // Llama a la función al cargar el componente
  useEffect(() => {
    fetchDepartments();
  }, []);

  return (
    <div className="p-6 flex flex-col items-start min-h-screen bg-gray-100">
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
              <SelectItem value="Bolivia">Bolivia</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* Campo: Departamento */}
      <div className="w-full max-w-5xl flex flex-col mt-4 pl-13">
        <label className="text-lg font-semibold mb-1">Departamento</label>
        <Select>
          <SelectTrigger className="w-[600px] mt-2">
            <SelectValue placeholder="Seleccione un departamento" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Departamentos</SelectLabel>
              {departments.map((department) => (
                <SelectItem key={department.value} value={department.value}>
                  {department.label}
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
              <SelectItem value="Quillacollo">Quillacollo</SelectItem>
              <SelectItem value="Chapare">Chapare</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* Campo: Dirección de la calle */}
      <div className="w-full max-w-5xl flex flex-col mt-6 pl-13">
        <label className="text-lg font-semibold mb-1">Dirección de la calle</label>
        <input
          type="text"
          placeholder="Ej. Av. América entre Ayacucho y Bolívar"
          className="w-[600px] mt-2 p-2 border border-gray-300 rounded"
        />
      </div>

      {/* Campo: N° Casa */}
      <div className="w-full max-w-5xl flex flex-col mt-6 pl-13">
        <label className="text-lg font-semibold mb-1">N° Casa</label>
        <input
          type="text"
          placeholder="Ingrese el número de casa"
          className="w-[600px] mt-2 p-2 border border-gray-300 rounded"
        />
      </div>

      {/* Sección de Botones */}
      <div className="w-full max-w-5xl flex justify-between items-center mt-10 px-10">
        <Button
          variant="secondary"
          className="w-[160px] h-12 text-lg font-semibold transition-all duration-200 hover:bg-gray-100 hover:brightness-90"
        >
          CANCELAR
        </Button>
        <Button
          variant="default"
          className="h-12 text-lg font-semibold text-white px-6"
          onClick={() => console.log("Guardar dirección")}
        >
          FINALIZAR EDICIÓN Y GUARDAR
        </Button>
      </div>
    </div>
  );
};

export default SprinterosPage;