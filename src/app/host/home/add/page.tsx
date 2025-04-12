"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

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
              <SelectItem value="Brasil">Brasil</SelectItem>
              <SelectItem value="Peru">Perú</SelectItem>
              <SelectItem value="Argentina">Argentina</SelectItem>
              <SelectItem value="Colombia">Colombia</SelectItem>
              <SelectItem value="Chile">Chile</SelectItem>
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
              <SelectItem value="Pando">Pando</SelectItem>
              <SelectItem value="Beni">Beni</SelectItem>
              <SelectItem value="Oruro">Oruro</SelectItem>
              <SelectItem value="Potosi">Potosí</SelectItem>
              <SelectItem value="Tarija">Tarija</SelectItem>
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

        <Link href="/host/home/editar/DatosPrincipales/pages"> 
          <Button
            variant="default"
            className="w-[180px] h-12 text-lg font-semibold text-white cursor-pointer "
            // onClick={() => router.push("/host/home/add/datosprincipales")}
          >```javascript
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

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
              <SelectItem value="Brasil">Brasil</SelectItem>
              <SelectItem value="Peru">Perú</SelectItem>
              <SelectItem value="Argentina">Argentina</SelectItem>
              <SelectItem value="Colombia">Colombia</SelectItem>
              <SelectItem value="Chile">Chile</SelectItem>
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
              <SelectItem value="Pando">Pando</SelectItem>
              <SelectItem value="Beni">Beni</SelectItem>
              <SelectItem value="Oruro">Oruro</SelectItem>
              <SelectItem value="Potosi">Potosí</SelectItem>
              <SelectItem value="Tarija">Tarija</SelectItem>
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

          <Link href="/host/home/editar/DatosPrincipales/pages">
            <Button
              variant="default"
              className="w-[180px] h-12 text-lg font-semibold text-white cursor-pointer"
            >
              SIGUIENTE
            </Button>
          </Link>
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
```
           SIGUIENTE
          </Button>
          </Link>
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
