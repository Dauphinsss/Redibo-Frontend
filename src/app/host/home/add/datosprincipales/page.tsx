"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { useFormContext } from "../context/FormContext";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";

import CampoVin from "../../../components/DatosPrincipales/CampoVin";
import CampoAnio from "../../../components/DatosPrincipales/CampoAnio";
import CampoMarca from "../../../components/DatosPrincipales/CampoMarca";
import CampoModelo from "../../../components/DatosPrincipales/CampoModelo";
import CampoPlaca from "../../../components/DatosPrincipales/CampoPlaca";
import BotonesFormulario from "../../../components/DatosPrincipales/BotonesFormulario";

export default function DatosPrincipales() {
  const router = useRouter();
  const { updateDatosPrincipales } = useFormContext();
  const currentYear = 2025;

  // Campos
  const [vin, setVin] = useState("");
  const [anio, setAnio] = useState("");
  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [placa, setPlaca] = useState("");

  // Errores
  const [vinError, setVinError] = useState("");
  const [anioError, setAnioError] = useState("");
  const [marcaError, setMarcaError] = useState("");
  const [modeloError, setModeloError] = useState("");
  const [placaError, setPlacaError] = useState("");

  const [isFormValid, setIsFormValid] = useState(false);

  // Handlers optimizados
  const handleVinChange = useCallback((value: string) => {
    setVin(value);
    setVinError(value ? "" : "El VIN es obligatorio");
  }, []);

  const handleAnioChange = useCallback((value: string) => {
    setAnio(value);
    setAnioError(value ? "" : "El año es obligatorio");
  }, []);

  const handleMarcaChange = useCallback((value: string) => {
    setMarca(value);
    setMarcaError(value ? "" : "La marca es obligatoria");
  }, []);

  const handleModeloChange = useCallback((value: string) => {
    setModelo(value);
    setModeloError(value ? "" : "El modelo es obligatorio");
  }, []);

  const handlePlacaChange = useCallback((value: string) => {
    setPlaca(value);
    setPlacaError(value ? "" : "La placa es obligatoria");
  }, []);

  // Validación del formulario
  useEffect(() => {
    const isValid = (
      vinError === "" && vin.trim() !== "" &&
      anioError === "" && anio.trim() !== "" &&
      marcaError === "" && marca.trim() !== "" &&
      modeloError === "" && modelo.trim() !== "" &&
      placaError === "" && placa.trim() !== ""
    );
    setIsFormValid(isValid);
  }, [vin, anio, marca, modelo, placa, vinError, anioError, marcaError, modeloError, placaError]);

  // Actualización optimizada del contexto
  useEffect(() => {
    const timer = setTimeout(() => {
      if (vin || anio || marca || modelo || placa) {
        updateDatosPrincipales({
          vim: vin, // Se asigna 'vin' al campo 'vim'
          anio: Number(anio),
          marca,
          modelo,
          placa,
        });
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [vin, anio, marca, modelo, placa, updateDatosPrincipales]);

  return (
    <div className="p-6 flex flex-col items-start min-h-screen bg-gray-100">
      <Link href="/host/home/add/direccion">
        <Button
          variant="secondary"
          className="flex items-center gap-1 self-start justify-start cursor-pointer w-32 h-10 text-base font-medium transition-all duration-200 hover:bg-gray-100 hover:brightness-90"
        >
          <ChevronLeft className="h-3 w-3" />
          Volver
        </Button>
      </Link>

      <div className="w-full max-w-5xl flex justify-start">
        <h1 className="text-4xl font-bold my-5 pl-7">Datos Principales</h1>
      </div>

      <div className="w-full max-w-5xl pl-9 space-y-6">
        <CampoVin 
          vin={vin} 
          onVinChange={handleVinChange} 
          vinError={vinError} 
          setVinError={setVinError} 
        />
        <CampoAnio 
          anio={anio} 
          onAnioChange={handleAnioChange} 
          anioError={anioError} 
          setAnioError={setAnioError} 
          currentYear={currentYear}
        />
        <CampoMarca 
          marca={marca} 
          onMarcaChange={handleMarcaChange} 
          marcaError={marcaError} 
          setMarcaError={setMarcaError} 
        />
        <CampoModelo 
          modelo={modelo} 
          onModeloChange={handleModeloChange} 
          modeloError={modeloError} 
          setModeloError={setModeloError} 
        />
        <CampoPlaca 
          placa={placa} 
          onPlacaChange={handlePlacaChange} 
          placaError={placaError} 
          setPlacaError={setPlacaError} 
        />
      </div>

      <div className="w-full max-w-5xl flex justify-between mt-10 px-10">
        <BotonesFormulario 
          isFormValid={isFormValid}
          onNext={() => router.push("/host/home/add/carcoche")}
        />
      </div>
    </div>
  );
}