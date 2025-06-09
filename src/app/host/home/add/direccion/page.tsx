// src/app/host/home/add/direccion/page.tsx
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import dynamic from "next/dynamic";
import { useFormContext } from "../context/form";
import { Button } from "@/components/ui/button";
import CampoPais from "../../../components/Direccion/CampoPais";
import CampoDepartamento from "../../../components/Direccion/CampoDepartamento";
import CampoProvincia from "../../../components/Direccion/CampoProvincia";
import CampoCalle from "../../../components/Direccion/CampoCalle";
import CampoNumCasa from "../../../components/Direccion/CampoNumCasa";
import BotonesFormulario from "../../../components/Direccion/BotonesFormulario";
import { Loader2 } from "lucide-react";

// Carga dinámica de CampoMapa para SSR-safe
const CampoMapa = dynamic(
  () => import("../../../components/Direccion/CampoMapa"),
  { 
    ssr: false,
    loading: () => (
      <div className="h-96 w-full flex items-center justify-center bg-gray-100">
        <Loader2 className="animate-spin h-8 w-8 text-gray-500" />
        <span className="ml-2">Cargando mapa...</span>
      </div>
    )
  }
);

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
const API_BASE_URL = `${API_URL}/api/v1`;
export default function AddDireccion() {
  const router = useRouter();
  const { formData, updateDireccion } = useFormContext();
  const { direccion } = formData;

  // Estados de campos
  const [pais, setPais] = useState(direccion?.ciudadId?.toString() || "");
  const [departamento, setDepartamento] = useState(direccion?.zona || "");
  const [provincia, setProvincia] = useState(direccion?.id_provincia?.toString() || "");
  const [calle, setCalle] = useState(direccion?.calle || "");
  const [numCasa, setNumCasa] = useState(direccion?.num_casa || "");
  const [ubicacion, setUbicacion] = useState<{ latitud: number | null; longitud: number | null }>({
    latitud: direccion?.latitud || null,
    longitud: direccion?.longitud || null,
  });
  const [mapaError, setMapaError] = useState<string>("");
  const [isFormValid, setIsFormValid] = useState(false);
  const [selectedDepartmentName, setSelectedDepartmentName] = useState("");

  // Errores individuales
  const [paisError, setPaisError] = useState("");
  const [departamentoError, setDepartamentoError] = useState("");
  const [provinciaError, setProvinciaError] = useState("");
  const [calleError, setCalleError] = useState("");
  const [numCasaError, setNumCasaError] = useState("");

  // manejadores
  const handlePaisChange = useCallback((value: string) => {
    setPais(value);
    setPaisError(value ? "" : "Debe seleccionar un país");
    // reset restante
    setDepartamento(""); setDepartamentoError("");
    setProvincia(""); setProvinciaError("");
    setUbicacion({ latitud: null, longitud: null });
    setMapaError("");
  }, []);

  const handleDepartamentoChange = useCallback((value: string) => {
    setDepartamento(value);
    setDepartamentoError(value ? "" : "Debe seleccionar un departamento");
    // reset provincia y mapa
    setProvincia(""); setProvinciaError("");
    setUbicacion({ latitud: null, longitud: null });
    setMapaError("");
  }, []);

  const handleProvinciaChange = useCallback((value: string) => {
    setProvincia(value);
    setProvinciaError(value ? "" : "Debe seleccionar una provincia");
    // reset mapa
    setUbicacion({ latitud: null, longitud: null });
    setMapaError("");
  }, []);

  const handleCalleChange = useCallback((value: string) => {
    setCalle(value);
    setCalleError(value ? "" : "La calle es obligatoria");
  }, []);

  const handleNumCasaChange = useCallback((value: string) => {
    setNumCasa(value);
    setNumCasaError(value ? "" : "El número de casa es obligatorio");
  }, []);

  // solo actualiza ubicación si ambos valores válidos
  const handleUbicacionSelect = useCallback((lat: number | null, lng: number | null) => {
    if (lat != null && lng != null) {
      setUbicacion({ latitud: lat, longitud: lng });
      setMapaError("");
    }
  }, []);

  // valida relación ubicación <-> provincia
  const handleMapaValidation = useCallback((isValid: boolean) => {
    if (!isValid && provincia) {
      setMapaError("La ubicación no coincide con el departamento seleccionado");
    } else {
      setMapaError("");
    }
  }, [provincia]);

  // validación general del formulario
  useEffect(() => {
    const valid =
      pais && !paisError &&
      departamento && !departamentoError &&
      provincia && !provinciaError &&
      calle && !calleError &&
      numCasa && !numCasaError &&
      ubicacion.latitud != null && ubicacion.longitud != null;
    setIsFormValid(!!valid);
  }, [pais, departamento, provincia, calle, numCasa, ubicacion, paisError, departamentoError, provinciaError, calleError, numCasaError]);

  // sincroniza contexto
  useEffect(() => {
    const id = setTimeout(() => {
      updateDireccion({
        ciudadId: pais ? Number(pais) : null,
        id_provincia: provincia ? Number(provincia) : null,
        calle, zona: departamento, num_casa: numCasa,
        latitud: ubicacion.latitud, longitud: ubicacion.longitud,
      });
    }, 100);
    return () => clearTimeout(id);
  }, [pais, departamento, provincia, calle, numCasa, ubicacion, updateDireccion]);

  return (
    <main className="p-6 min-h-screen bg-gray-100">
      <header className="flex flex-col items-start max-w-5xl mx-auto">
        <Link href="/host/pages">
          <Button variant="ghost" className="w-auto h-10 p-0">
            <ChevronLeft className="h-4 w-4" />Volver
          </Button>
        </Link>
        <h1 className="text-3xl font-bold mt-4">Dirección</h1>
        <p className="text-gray-600 mt-2">Ingrese una ubicación específica</p>
      </header>
      <section className="w-full max-w-5xl mx-auto mt-6 space-y-6 px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
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
              setSelectedDepartmentName={setSelectedDepartmentName}
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
          <CampoMapa
            onLocationSelect={handleUbicacionSelect}
            onValidationChange={handleMapaValidation}
            initialPosition={
              ubicacion.latitud !== null && ubicacion.longitud !== null
                ? [ubicacion.latitud, ubicacion.longitud]
                : null
            }
            departamento={departamento}
            provincia={provincia}
            selectedDepartmentName={selectedDepartmentName}
          />
        </div>
      </section>
      <div className="w-full max-w-5xl mx-auto mt-10 px-4 sm:px-6">
        {mapaError && <p className="text-red-600 mb-2">{mapaError}</p>}
        <BotonesFormulario isFormValid={isFormValid} onNext={()=>router.push("/host/home/add/datosprincipales")} />
      </div>
    </main>
  );
}
