"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
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

export default function CaracteristicasCoche() {
  const router = useRouter();
  const [cancelOpen, setCancelOpen] = useState(false);

  return (
    <div className="p-6 flex flex-col items-start min-h-screen bg-gray-100">
      {/* Botón Volver */}
      <Link href="/host/home/add/datosprincipales">
        <Button
          variant="secondary"
          className="flex items-center gap-1 self-start justify-start cursor-pointer w-32 h-10 text-base font-medium transition-all duration-200 hover:bg-gray-100 hover:brightness-90"
        >
          <ChevronLeft className="h-3 w-3" />
          Volver
        </Button>
      </Link>

      {/* Título */}
      <div className="w-full max-w-5xl flex justify-start">
        <h1 className="text-4xl font-bold my-5 pl-7">Características del Coche</h1>
      </div>

      {/* Formulario de Características */}
      <div className="w-full max-w-5xl pl-9 space-y-6">
        {/* Tipo de combustible */}
        <div className="flex flex-col">
          <label className="text-base font-medium mb-2">Tipo de combustible</label>
          <RadioGroup defaultValue="gasolina" className="ml-4 space-y-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="gasolina" id="gasolina" />
              <Label htmlFor="gasolina">Gasolina</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="gnv" id="gnv" />
              <Label htmlFor="gnv">GNV</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="electrico" id="electrico" />
              <Label htmlFor="electrico">Eléctrico</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="diesel" id="diesel" />
              <Label htmlFor="diesel">Diesel</Label>
            </div>
          </RadioGroup>
        </div>

        {/* Asientos */}
        <div className="flex flex-col">
          <label className="text-base font-medium mb-1">Asientos</label>
          <Input
            type="number"
            placeholder="8"
            className="w-full max-w-md"
          />
        </div>

        {/* Puertas */}
        <div className="flex flex-col">
          <label className="text-base font-medium mb-1">Puertas</label>
          <Select>
            <SelectTrigger className="w-full max-w-md">
              <SelectValue placeholder="Seleccione" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2">2</SelectItem>
              <SelectItem value="4">4</SelectItem>
              <SelectItem value="5">5</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Transmisión */}
        <div className="flex flex-col">
          <label className="text-base font-medium mb-1">Transmisión</label>
          <Select>
            <SelectTrigger className="w-full max-w-md">
              <SelectValue placeholder="Seleccione" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="manual">Manual</SelectItem>
              <SelectItem value="automatico">Automático</SelectItem>
              <SelectItem value="semiautomatico">Semi-automático</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Seguro */}
        <div className="flex flex-col">
          <label className="text-base font-medium mb-1">Seguro</label>
          <div className="flex items-center space-x-2 ml-4">
            <Checkbox id="soat" defaultChecked />
            <Label htmlFor="soat">SOAT</Label>
          </div>
        </div>
      </div>

      {/* Botones de Cancelar y Siguiente */}
      <div className="w-full max-w-5xl flex justify-between mt-10 px-10">
        {/* Botón Cancelar */}
        <AlertDialog open={cancelOpen} onOpenChange={setCancelOpen}>
          <AlertDialogTrigger asChild>
            <Button
              variant="secondary"
              className="w-[160px] h-12 text-lg font-semibold"
            >
              CANCELAR
            </Button>
          </AlertDialogTrigger>
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

        {/* Botón Siguiente */}
        <Button
          variant="default"
          className="w-40 h-12 text-lg font-semibold text-white bg-gray-800"
          onClick={() => router.push("/host/home/add/inputimagen")}
        >
          SIGUIENTE
        </Button>
      </div>
    </div>
  );
}