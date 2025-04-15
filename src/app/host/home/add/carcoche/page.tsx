"use client";

import React, { useState, useEffect, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  const [cancelOpen, setCancelOpen] = useState<boolean>(false);

  // Estados para los campos
  const [combustibles, setCombustibles] = useState<string[]>([]);
  const [asientos, setAsientos] = useState<string>("");
  const [puertas, setPuertas] = useState<string>("");
  const [transmision, setTransmision] = useState<string>("");
  const [seguro, setSeguro] = useState<boolean>(false);
  
  // Estado para errores
  const [asientosError, setAsientosError] = useState<string>("");
  const [combustiblesError, setCombustiblesError] = useState<string>("");
  
  // Estado para controlar si el formulario es válido
  const [isFormValid, setIsFormValid] = useState<boolean>(false);

  // Manejo de cambio en checkbox de combustibles
  const handleCombustibleChange = (value: string) => {
    setCombustibles(prev => {
      // Si ya está seleccionado, lo quitamos
      if (prev.includes(value)) {
        const newCombustibles = prev.filter(item => item !== value);
        setCombustiblesError(""); // Limpiamos el error siempre que quitamos un elemento
        return newCombustibles;
      }
      
      // Si ya tenemos 2 seleccionados y queremos agregar otro, mostramos error pero no modificamos el estado
      if (prev.length >= 2) {
        setCombustiblesError("Solo puede seleccionar máximo 2 tipos de combustible");
        return prev;
      }
      
      // Agregamos el nuevo valor y limpiamos el error
      setCombustiblesError("");
      return [...prev, value];
    });
  };

  // Validación de asientos (solo números positivos)
  const handleAsientosChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Solo permitir números
    if (value === "" || /^\d+$/.test(value)) {
      setAsientos(value);
      
      if (value === "") {
        setAsientosError("El número de asientos es obligatorio");
      } else if (parseInt(value) <= 0) {
        setAsientosError("El número de asientos debe ser mayor a 0");
      } else {
        setAsientosError("");
      }
    } else {
      setAsientosError("Solo se permiten números en este campo");
    }
  };

  // Manejo de cambio en select de puertas
  const handlePuertasChange = (value: string) => {
    setPuertas(value);
  };

  // Manejo de cambio en select de transmisión
  const handleTransmisionChange = (value: string) => {
    setTransmision(value);
  };

  // Verificar si todos los campos están llenos para habilitar el botón siguiente
  useEffect(() => {
    // Validar combustibles
    const combustiblesValid = combustibles.length > 0 && combustibles.length <= 2;
    
    // Validar asientos (debe tener un valor y ser un número positivo)
    const asientosValid = asientos.trim() !== "" && 
                          parseInt(asientos) > 0 && 
                          asientosError === "";
    
    const areAllFieldsValid = 
      combustiblesValid && 
      asientosValid && 
      puertas !== "" && 
      transmision !== "" && 
      seguro === true && 
      combustiblesError === "";
    
    setIsFormValid(areAllFieldsValid);
  }, [combustibles, asientos, puertas, transmision, seguro, asientosError, combustiblesError]);

  // Función para manejar la confirmación de salida
  const handleConfirmExit = () => {
    router.push("/host/pages");
  };

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
        {/* Tipo de combustible (ahora con checkbox, máximo 2) */}
        <div className="flex flex-col">
          <label className="text-base font-medium mb-2">
            Tipo de combustible (seleccione máximo 2):
          </label>
          <div className="ml-4 space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="gasolina" 
                checked={combustibles.includes("gasolina")}
                onCheckedChange={() => handleCombustibleChange("gasolina")}
              />
              <Label htmlFor="gasolina">Gasolina</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="gnv" 
                checked={combustibles.includes("gnv")}
                onCheckedChange={() => handleCombustibleChange("gnv")}
              />
              <Label htmlFor="gnv">GNV (Gas Natural Vehicular)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="electrico" 
                checked={combustibles.includes("electrico")}
                onCheckedChange={() => handleCombustibleChange("electrico")}
              />
              <Label htmlFor="electrico">Eléctrico</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="diesel" 
                checked={combustibles.includes("diesel")}
                onCheckedChange={() => handleCombustibleChange("diesel")}
              />
              <Label htmlFor="diesel">Diesel</Label>
            </div>
          </div>
          {combustiblesError && (
            <p className="text-sm text-red-600 mt-1">{combustiblesError}</p>
          )}
          {combustibles.length === 0 && (
            <p className="text-sm text-red-600 mt-1">Debe seleccionar al menos un tipo de combustible</p>
          )}
        </div>

        {/* Asientos (obligatorio y solo números positivos) */}
        <div className="flex flex-col">
          <label className="text-base font-medium mb-1">
            Asientos: <span className="text-red-600">*</span>
          </label>
          <Input
            type="text"
            value={asientos}
            onChange={handleAsientosChange}
            placeholder="Introduzca la cant. de asientos en su vehículo"
            className="w-full max-w-md"
          />
          {asientosError && (
            <p className="text-sm text-red-600 mt-1">{asientosError}</p>
          )}
        </div>

        {/* Puertas */}
        <div className="flex flex-col">
          <label className="text-base font-medium mb-1">
            Puertas: <span className="text-red-600">*</span>
          </label>
          <Select value={puertas} onValueChange={handlePuertasChange}>
            <SelectTrigger className="w-full max-w-md">
              <SelectValue placeholder="Seleccione" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1</SelectItem>
              <SelectItem value="2">2</SelectItem>
              <SelectItem value="3">3</SelectItem>
              <SelectItem value="4">4</SelectItem>
              <SelectItem value="5">5</SelectItem>
            </SelectContent>
          </Select>
          {puertas === "" && (
            <p className="text-sm text-red-600 mt-1">Debe seleccionar la cantidad de puertas</p>
          )}
        </div>

        {/* Transmisión */}
        <div className="flex flex-col">
          <label className="text-base font-medium mb-1">
            Transmisión: <span className="text-red-600">*</span>
          </label>
          <Select value={transmision} onValueChange={handleTransmisionChange}>
            <SelectTrigger className="w-full max-w-md">
              <SelectValue placeholder="Seleccione" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="manual">Manual</SelectItem>
              <SelectItem value="automatico">Automático</SelectItem>
              <SelectItem value="semiautomatico">Semi-automático</SelectItem>
            </SelectContent>
          </Select>
          {transmision === "" && (
            <p className="text-sm text-red-600 mt-1">Debe seleccionar el tipo de transmisión</p>
          )}
        </div>

        {/* Seguro (obligatorio) */}
        <div className="flex flex-col">
          <label className="text-base font-medium mb-1">
            Seguro: <span className="text-red-600">*</span>
          </label>
          <div className="flex items-center space-x-2 ml-4">
            <Checkbox 
              id="soat" 
              checked={seguro}
              onCheckedChange={(checked) => setSeguro(checked === true)}
            />
            <Label htmlFor="soat">SOAT (Seguro Obligatorio de Accidentes de Tránsito)</Label>
          </div>
          {!seguro && (
            <p className="text-sm text-red-600 mt-1">El seguro SOAT es obligatorio</p>
          )}
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
                onClick={handleConfirmExit}
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
          disabled={!isFormValid}
        >
          SIGUIENTE
        </Button>
      </div>
    </div>
  );
}