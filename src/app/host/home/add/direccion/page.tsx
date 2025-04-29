"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { useFormContext } from "../context/FormContext";
import { Button } from "@/components/ui/button";
import CampoPais from "../../../components/Direccion/CampoPais";
import CampoDepartamento from "../../../components/Direccion/CampoDepartamento";
import CampoProvincia from "../../../components/Direccion/CampoProvincia";
import CampoCalle from "../../../components/Direccion/CampoCalle";
import CampoNumCasa from "../../../components/Direccion/CampoNumCasa";
import BotonesFormulario from "../../../components/Direccion/BotonesFormulario";

// Definimos la constante API_URL aquí
const API_BASE_URL = "https://redibo-backend-sprinteros1.onrender.com/api";

export default function AddDireccion() {
  const router = useRouter();
  const { formData, updateDireccion } = useFormContext();
  const { direccion } = formData;

  // Campos
  const [pais, setPais] = useState(direccion?.ciudadId?.toString() || "");
  const [departamento, setDepartamento] = useState(direccion?.zona || "");
  const [provincia, setProvincia] = useState(direccion?.id_provincia?.toString() || "");
  const [calle, setCalle] = useState(direccion?.calle || "");
  const [numCasa, setNumCasa] = useState(direccion?.num_casa || "");

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
    const valid =
      pais && !paisError &&
      departamento && !departamentoError &&
      provincia && !provinciaError &&
      calle && !calleError &&
      numCasa && !numCasaError;
    setIsFormValid(Boolean(valid));
  }, [pais, departamento, provincia, calle, numCasa, paisError, departamentoError, provinciaError, calleError, numCasaError]);

  // Carga inicial desde el contexto
  useEffect(() => {
    if (direccion) {
      setPais(direccion.ciudadId?.toString() || "");
      setDepartamento(direccion.zona || "");
      setProvincia(direccion.id_provincia?.toString() || "");
      setCalle(direccion.calle || "");
      setNumCasa(direccion.num_casa || "");
    }
  }, [direccion]);

  // Sincronización con contexto
  useEffect(() => {
    const timer = setTimeout(() => {
      if (pais || departamento || provincia || calle || numCasa) {
        updateDireccion({
          ciudadId: pais ? Number(pais) : null,
          id_provincia: provincia ? Number(provincia) : null,
          calle,
          zona: departamento,
          num_casa: numCasa,
        });
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [pais, departamento, provincia, calle, numCasa, updateDireccion]);

  return (
    <main className="p-6 min-h-screen bg-gray-100">
      {/* HEADER: Botón Volver y título apilados */}
      <header className="flex flex-col items-start max-w-5xl mx-auto">
        <Link href="/host/pages">
          <Button
            variant="secondary"
            className="
              w-auto sm:w-40 h-10          /* ancho adaptativo, altura reducida */
              flex items-center gap-1
              text-base font-medium
              transition-transform duration-200 ease-in-out transform
              hover:scale-105 hover:bg-gray-100 hover:brightness-90
            "
          >
            <ChevronLeft className="h-4 w-4" />
            Volver
          </Button>
        </Link>
        <h1 className="text-5xl font-bold my-5">Dirección</h1> {/* título aumentado */}
      </header>

      {/* SECCIÓN: Campos centrados con padding y separación */}
      <section className="w-full max-w-5xl mx-auto mt-6 space-y-6 px-4 sm:px-9">
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
      </section>

      {/* FOOTER: Botón siguiente alineado a la derecha */}
      <div className="w-full max-w-5xl mx-auto mt-10 px-4 sm:px-10 flex justify-end pr-10">
        <BotonesFormulario
          isFormValid={isFormValid}
          onNext={() => router.push("/host/home/add/datosprincipales")}
        />
      </div>
    </main>
  );
}
