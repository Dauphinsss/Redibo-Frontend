"use client";

import React, { useState, useEffect, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

export default function DatosPrincipales() {
  const router = useRouter();
  const [cancelOpen, setCancelOpen] = useState<boolean>(false);
  const currentYear = 2025; // Año actual

  // Estados para los campos
  const [vin, setVin] = useState<string>("");
  const [anio, setAnio] = useState<string>("");
  const [marca, setMarca] = useState<string>("");
  const [modelo, setModelo] = useState<string>("");
  const [placa, setPlaca] = useState<string>("");

  // Estados para errores
  const [vinError, setVinError] = useState<string>("");
  const [anioError, setAnioError] = useState<string>("");
  const [marcaError, setMarcaError] = useState<string>("");
  const [modeloError, setModeloError] = useState<string>("");
  const [placaError, setPlacaError] = useState<string>("");
  
  // Estado para controlar si el formulario es válido
  const [isFormValid, setIsFormValid] = useState<boolean>(false);

  // Validación del VIN
  const validateVin = (vinValue = vin): boolean => {
    const vinRegex = /^[A-HJ-NPR-Z0-9]{17}$/;
    if (!vinValue) {
      setVinError("El VIN es obligatorio.");
      return false;
    }
    if (!vinRegex.test(vinValue)) {
      setVinError("El VIN debe tener exactamente 17 caracteres válidos.");
      return false;
    }
    setVinError("");
    return true;
  };

  // Validación del año (solo números entre 1900 y año actual)
  const handleAnioChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    
    // Solo permite números
    if (value === "" || /^\d+$/.test(value)) {
      setAnio(value);
      
      // Validar que el año esté en el rango permitido
      const yearValue = parseInt(value, 10);
      if (value !== "" && (yearValue < 1900 || yearValue > currentYear)) {
        setAnioError(`El año debe estar entre 1900 y ${currentYear}.`);
      } else {
        setAnioError("");
      }
    } else {
      setAnioError("Solo se permiten números en este campo.");
    }
  };

  // Handler para el cambio de marca (convertir a mayúsculas)
  const handleMarcaChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value.toUpperCase();
    setMarca(value);
    
    // Validar que solo contiene letras mayúsculas y espacios
    const marcaRegex = /^[A-Z\s]*$/;
    if (!marcaRegex.test(value) && value !== "") {
      setMarcaError("Solo se permiten letras mayúsculas.");
    } else {
      setMarcaError("");
    }
  };

  // Validación del modelo (máximo 50 caracteres y mayúsculas)
  const handleModeloChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value.toUpperCase();
    setModelo(value);
    
    // Validar longitud
    if (value.length > 50) {
      setModeloError("El modelo no puede exceder los 50 caracteres.");
    } else {
      // Validar contenido
      const modeloRegex = /^[A-Z0-9\s.-]*$/;
      if (!modeloRegex.test(value) && value !== "") {
        setModeloError("Solo se permiten letras mayúsculas, números y caracteres especiales básicos.");
      } else {
        setModeloError("");
      }
    }
  };

  // Handler para el cambio de VIN con tipado correcto y validación inmediata
  const handleVinChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const newVin = e.target.value.toUpperCase();
    setVin(newVin);
    validateVin(newVin); // Validamos inmediatamente cuando cambia el valor
  };

  // Handler para el cambio de placa (convertir a mayúsculas)
  const handlePlacaChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value.toUpperCase();
    setPlaca(value);
    
    // Validar que solo contiene letras mayúsculas y números
    const placaRegex = /^[A-Z0-9-]*$/;
    if (!placaRegex.test(value) && value !== "") {
      setPlacaError("Solo se permiten letras mayúsculas, números y guiones.");
    } else {
      setPlacaError("");
    }
  };

  // Verificar si todos los campos están llenos para habilitar el botón siguiente
  useEffect(() => {
    const vinIsValid = vinError === "" && vin.trim() !== "";
    const anioIsValid = anioError === "" && anio.trim() !== "";
    const marcaIsValid = marcaError === "" && marca.trim() !== "";
    const modeloIsValid = modeloError === "" && modelo.trim() !== "";
    const placaIsValid = placaError === "" && placa.trim() !== "";
    
    const areAllFieldsValid = 
      vinIsValid && 
      anioIsValid && 
      marcaIsValid && 
      modeloIsValid && 
      placaIsValid;
    
    setIsFormValid(areAllFieldsValid);
  }, [vin, anio, marca, modelo, placa, vinError, anioError, marcaError, modeloError, placaError]);

  const handleNext = async (): Promise<void> => {
    if (!validateVin()) return;

    /*try {
      const res = await fetch("http://localhost:3001/api/cars", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vin, anio, marca, modelo, placa }),
      });

      const data = await res.json();

      if (!res.ok) {
        setVinError(data.error || "Error al registrar el VIN.");
        return;
      }

      // Si todo está bien, ir a la siguiente sección
      */router.push("/host/home/add/carcoche");/*
    } catch (error) {
      setVinError("Error de conexión con el servidor.");
    }*/
  };

  // Función para manejar la confirmación de salida
  const handleConfirmExit = (): void => {
    router.push("/host/pages");
  };

  return (
    <div className="p-6 flex flex-col items-start min-h-screen bg-gray-100">
      {/* Botón Volver */}
      <Link href="/host/home/add">
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
        <h1 className="text-4xl font-bold my-5 pl-7">Datos Principales</h1>
      </div>

      {/* Formulario */}
      <div className="w-full max-w-5xl pl-9 space-y-6">
        {/* VIN */}
        <div className="flex flex-col">
          <label className="text-base font-medium mb-1">
            Número de VIN (Número de Identificación Vehicular):
          </label>
          <Input
            type="text"
            value={vin}
            onChange={handleVinChange}
            placeholder="17 Caracteres"
            maxLength={17}
            className="w-full max-w-md"
          />
          {vinError && <p className="text-sm text-red-600 mt-1">{vinError}</p>}
        </div>

        {/* Año */}
        <div className="flex flex-col">
          <label className="text-base font-medium mb-1">Año:</label>
          <Input
            type="text"
            value={anio}
            onChange={handleAnioChange}
            placeholder={`Entre 1900 y ${currentYear}`}
            className="w-full max-w-md"
            maxLength={4}
          />
          {anioError && <p className="text-sm text-red-600 mt-1">{anioError}</p>}
        </div>

        {/* Marca */}
        <div className="flex flex-col">
          <label className="text-base font-medium mb-1">Marca:</label>
          <Input
            type="text"
            value={marca}
            onChange={handleMarcaChange}
            placeholder="Introduzca la marca del vehículo"
            className="w-full max-w-md"
          />
          {marcaError && <p className="text-sm text-red-600 mt-1">{marcaError}</p>}
        </div>

        {/* Modelo */}
        <div className="flex flex-col">
          <label className="text-base font-medium mb-1">Modelo:</label>
          <Input
            type="text"
            value={modelo}
            onChange={handleModeloChange}
            placeholder="Introduzca el modelo del vehículo"
            maxLength={50}
            className="w-full max-w-md"
          />
          {modeloError && <p className="text-sm text-red-600 mt-1">{modeloError}</p>}
          <p className="text-xs text-gray-500 mt-1">{modelo.length}/50 caracteres</p>
        </div>

        {/* Placa */}
        <div className="flex flex-col">
          <label className="text-base font-medium mb-1">Placa:</label>
          <Input
            type="text"
            value={placa}
            onChange={handlePlacaChange}
            placeholder="Ej: 1234XYZ"
            className="w-full max-w-md"
          />
          {placaError && <p className="text-sm text-red-600 mt-1">{placaError}</p>}
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
          onClick={handleNext}
          disabled={!isFormValid}
        >
          SIGUIENTE
        </Button>
      </div>
    </div>
  );
}