"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";

import CampoVin from "../../../components/CampoVin";
import CampoAnio from "../../../components/CampoAnio";
import CampoMarca from "../../../components/CampoMarca";
import CampoModelo from "../../../components/CampoModelo";
import CampoPlaca from "../../../components/CampoPlaca";
import BotonesFormulario from "../../../components/BotonesFormulario";


export default function DatosPrincipales() {
  const router = useRouter();
  const [cancelOpen, setCancelOpen] = useState(false);
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

  useEffect(() => {
    const vinIsValid = vinError === "" && vin.trim() !== "";
    const anioIsValid = anioError === "" && anio.trim() !== "";
    const marcaIsValid = marcaError === "" && marca.trim() !== "";
    const modeloIsValid = modeloError === "" && modelo.trim() !== "";
    const placaIsValid = placaError === "" && placa.trim() !== "";

    setIsFormValid(vinIsValid && anioIsValid && marcaIsValid && modeloIsValid && placaIsValid);
  }, [vin, anio, marca, modelo, placa, vinError, anioError, marcaError, modeloError, placaError]);

  const handleConfirmExit = () => {
    router.push("/host/pages");
  };

  return (
    <div className="p-6 flex flex-col items-start min-h-screen bg-gray-100">
      <Link href="/host/home/add">
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
        <CampoVin vin={vin} setVin={setVin} vinError={vinError} setVinError={setVinError} />
        <CampoAnio anio={anio} setAnio={setAnio} anioError={anioError} setAnioError={setAnioError} currentYear={currentYear} />
        <CampoMarca marca={marca} setMarca={setMarca} marcaError={marcaError} setMarcaError={setMarcaError} />
        <CampoModelo modelo={modelo} setModelo={setModelo} modeloError={modeloError} setModeloError={setModeloError} />
        <CampoPlaca placa={placa} setPlaca={setPlaca} placaError={placaError} setPlacaError={setPlacaError} />
      </div>

      <div className="w-full max-w-5xl flex justify-between mt-10 px-10">
        

        <BotonesFormulario isFormValid={isFormValid} />
      </div>
    </div>
  );
}
