"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { useFormContext } from "../context/FormContext";
import { Button } from "@/components/ui/button";

import CampoVin from "../../../components/DatosPrincipales/CampoVin";
import CampoAnio from "../../../components/DatosPrincipales/CampoAnio";
import CampoMarca from "../../../components/DatosPrincipales/CampoMarca";
import CampoModelo from "../../../components/DatosPrincipales/CampoModelo";
import CampoPlaca from "../../../components/DatosPrincipales/CampoPlaca";
import BotonesFormulario from "../../../components/DatosPrincipales/BotonesFormulario";

export default function DatosPrincipales() {
  const router = useRouter();
  const { formData, updateDatosPrincipales } = useFormContext();
  const { datosPrincipales } = formData;
  const currentYear = new Date().getFullYear();

  // Campos
  const [vin, setVin] = useState(datosPrincipales?.vim || "");
  const [año, setAño] = useState<string>(datosPrincipales?.año?.toString() || "");
  const [marca, setMarca] = useState(datosPrincipales?.marca || "");
  const [modelo, setModelo] = useState(datosPrincipales?.modelo || "");
  const [placa, setPlaca] = useState(datosPrincipales?.placa || "");

  // Errores
  const [vinError, setVinError] = useState("");
  const [añoError, setAñoError] = useState("");
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
    setAño(value);
    setAñoError(value ? "" : "El año es obligatorio");
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
  }, []);

  // Validación del formulario
  useEffect(() => {
    const isValid =
      vinError === "" && vin.trim() &&
      añoError === "" && año.trim() &&
      marcaError === "" && marca.trim() &&
      modeloError === "" && modelo.trim() &&
      placaError === "" && placa.trim();
    setIsFormValid(Boolean(isValid));
  }, [vin, año, marca, modelo, placa, vinError, añoError, marcaError, modeloError, placaError]);

  // Carga inicial de datos
  useEffect(() => {
    if (datosPrincipales) {
      setVin(datosPrincipales.vim || "");
      setAño(datosPrincipales.año?.toString() || "");
      setMarca(datosPrincipales.marca || "");
      setModelo(datosPrincipales.modelo || "");
      setPlaca(datosPrincipales.placa || "");
    }
  }, [datosPrincipales]);

  // Sincronización con contexto
  useEffect(() => {
    const timer = setTimeout(() => {
      if (vin || año || marca || modelo || placa) {
        updateDatosPrincipales({
          vim: vin,
          año: Number(año),
          marca,
          modelo,
          placa,
        });
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [vin, año, marca, modelo, placa, updateDatosPrincipales]);

  return (
    <main className="p-6 min-h-screen bg-gray-100">
      {/* HEADER: Volver + Título apilados */}
      <header className="flex flex-col items-start max-w-5xl mx-auto">
        <Link href="/host/home/add/direccion">
          <Button
            variant="secondary"
            className="
              w-auto sm:w-40 h-10              /* ancho adaptativo, altura */
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
        <h1 className="text-5xl font-bold my-5">Datos Principales</h1> {/* Título más grande */}
      </header>

      {/* SECTION: Campos del formulario, centrados y con espacio */}
      <section className="w-full max-w-5xl mx-auto mt-6 space-y-6 px-4 sm:px-9">
        <CampoVin
          vin={vin}
          onVinChange={handleVinChange}
          vinError={vinError}
          setVinError={setVinError}
        />
        <CampoAnio
          año={año}
          onAnioChange={handleAnioChange}
          añoError={añoError}
          setAnioError={setAñoError}
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
      </section>

      {/* FOOTER: Botón siguiente alineado a la derecha */}
      <div className="w-full max-w-5xl mx-auto mt-10 px-4 sm:px-10 flex justify-end">
        <BotonesFormulario
          isFormValid={isFormValid}
          onNext={() => router.push("/host/home/add/carcoche")}
        />
      </div>
    </main>
  );
}