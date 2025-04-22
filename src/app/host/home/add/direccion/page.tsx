"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { useFormContext } from "../context/FormContext";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";

import CampoPais from "../../../components/Direccion/CampoPais";
import CampoDepartamento from "../../../components/Direccion/CampoDepartamento";
import CampoProvincia from "../../../components/Direccion/CampoProvincia";
import CampoCalle from "../../../components/Direccion/CampoCalle";
import CampoNumCasa from "../../../components/Direccion/CampoNumCasa";
import BotonesFormulario from "../../../components/Direccion/BotonesFormulario";

// Definimos la constante API_URL aquí
const API_BASE_URL = "http://localhost:4000/api";

export default function AddDireccion() {
  const router = useRouter();
  const [cancelOpen, setCancelOpen] = useState(false);
  const { formData, updateDireccion } = useFormContext();
  const { direccion } = formData; // Acceder a 'direccion' desde el contexto

  // Campos
  const [pais, setPais] = useState(direccion?.ciudadId?.toString() || ""); // Usar datos del contexto si están disponibles
  const [departamento, setDepartamento] = useState(direccion?.zona || ""); // Usar datos del contexto si están disponibles
  const [provincia, setProvincia] = useState(direccion?.provinciaId?.toString() || ""); // Usar datos del contexto si están disponibles
  const [calle, setCalle] = useState(direccion?.calle || ""); // Usar datos del contexto si están disponibles
  const [numCasa, setNumCasa] = useState(direccion?.num_casa || ""); // Usar datos del contexto si están disponibles

  // Errores
  const [paisError, setPaisError] = useState("");
  const [departamentoError, setDepartamentoError] = useState("");
  const [provinciaError, setProvinciaError] = useState("");
  const [calleError, setCalleError] = useState("");
  const [numCasaError, setNumCasaError] = useState("");

  const [isFormValid, setIsFormValid] = useState(false);

  // Handlers optimizados
  const handlePaisChange = useCallback((value: string) => {
    setPais(value);
    setDepartamento("");
    setProvincia("");
    setPaisError(value ? "" : "Debe seleccionar un país");
  }, []);

  const handleDepartamentoChange = useCallback((value: string) => {
    setDepartamento(value);
    setProvincia("");
    setDepartamentoError(value ? "" : "Debe seleccionar un departamento");
  }, []);

  const handleProvinciaChange = useCallback((value: string) => {
    setProvincia(value);
    setProvinciaError(value ? "" : "Debe seleccionar una provincia");
  }, []);

  const handleCalleChange = useCallback((value: string) => {
    setCalle(value);
    setCalleError(value ? "" : "La calle es obligatoria");
  }, []);

  const handleNumCasaChange = useCallback((value: string) => {
    setNumCasa(value);
    setNumCasaError(value ? "" : "El número de casa es obligatorio");
  }, []);

  // Validación del formulario
  useEffect(() => {
    const isValid = (
      paisError === "" && pais.trim() !== "" &&
      departamentoError === "" && departamento.trim() !== "" &&
      provinciaError === "" && provincia.trim() !== "" &&
      calleError === "" && calle.trim() !== "" &&
      numCasaError === "" && numCasa.trim() !== ""
    );
    setIsFormValid(isValid);
  }, [pais, departamento, provincia, calle, numCasa, paisError, departamentoError, provinciaError, calleError, numCasaError]);

  // Cargar datos del contexto al renderizar inicialmente
  useEffect(() => {
    if (direccion) {
      setPais(direccion.ciudadId?.toString() || "");
      setDepartamento(direccion.zona || "");
      setProvincia(direccion.provinciaId?.toString() || "");
      setCalle(direccion.calle || "");
      setNumCasa(direccion.num_casa || "");
    }
  }, [direccion]);

  // Actualización optimizada del contexto
  useEffect(() => {
    const timer = setTimeout(() => {
      if (pais || departamento || provincia || calle || numCasa) {
        updateDireccion({
          ciudadId: pais ? Number(pais) : null, // Asegurar 'null' si está vacío
          provinciaId: provincia ? Number(provincia) : null, // Asegurar 'null' si está vacío
          calle,
          zona: departamento,
          num_casa: numCasa,
        });
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [pais, departamento, provincia, calle, numCasa, updateDireccion]);

  const handleConfirmExit = () => {
    router.push("/host/pages");
  };

  return (
    <div className="p-6 flex flex-col items-start min-h-screen bg-gray-100">
      <Link href="/host/pages">
        <Button
          variant="secondary"
          className="flex items-center gap-1 self-start justify-start cursor-pointer w-32 h-10 text-base font-medium transition-all duration-200 hover:bg-gray-100 hover:brightness-90"
        >
          <ChevronLeft className="h-3 w-3" />
          Volver
        </Button>
      </Link>

      <div className="w-full max-w-5xl flex justify-start">
        <h1 className="text-4xl font-bold my-5 pl-7">Dirección</h1>
      </div>

      <div className="w-full max-w-5xl pl-9 space-y-6">
        <CampoPais
          pais={pais}
          onPaisChange={handlePaisChange}
          paisError={paisError}
          setPaisError={setPaisError}
          setDepartamento={setDepartamento}
          setProvincia={setProvincia}
          apiUrl={API_BASE_URL}
        />
        <CampoDepartamento
          departamento={departamento}
          onDepartamentoChange={handleDepartamentoChange}
          departamentoError={departamentoError}
          setDepartamentoError={setDepartamentoError}
          pais={pais}
          setProvincia={setProvincia}
          apiUrl={API_BASE_URL}
        />
        <CampoProvincia
          provincia={provincia}
          onProvinciaChange={handleProvinciaChange}
          provinciaError={provinciaError}
          setProvinciaError={setProvinciaError}
          departamento={departamento}
          apiUrl={API_BASE_URL}
        />
        <CampoCalle
          calle={calle}
          onCalleChange={handleCalleChange}
          calleError={calleError}
          setCalleError={setCalleError}
        />
        <CampoNumCasa
          numCasa={numCasa}
          onNumCasaChange={handleNumCasaChange}
          numCasaError={numCasaError}
          setNumCasaError={setNumCasaError}
        />
      </div>

      <div className="w-full max-w-5xl flex justify-between mt-10 px-10">
        <BotonesFormulario
          isFormValid={isFormValid}
          onNext={() => router.push("/host/home/add/datosprincipales")}
        />
      </div>
    </div>
  );
}