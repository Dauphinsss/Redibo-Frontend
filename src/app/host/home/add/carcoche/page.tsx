"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { useFormContext } from "../context/FormContext";
import { Button } from "@/components/ui/button";
import CampoCombustible from "../../../components/CarCoche/CampoCombustible";
import CampoAsientos from "../../../components/CarCoche/CampoAsientos";
import CampoPuertas from "../../../components/CarCoche/CampoPuertas";
import CampoTransmision from "../../../components/CarCoche/CampoTransmision";
import CampoSeguro from "../../../components/CarCoche/CampoSeguro";
import BotonesFormulario from "../../../components/CarCoche/BotonesFormulario";

export default function CaracteristicasCoche() {
  const router = useRouter();
  const { formData, updateCaracteristicas } = useFormContext();
  const { caracteristicas } = formData;

  // Estados locales
  const [combustibles, setCombustibles] = useState<number[]>(caracteristicas?.combustibleIds || []);
  const [asientos, setAsientos] = useState<number>(caracteristicas?.asientos || 0);
  const [puertas, setPuertas] = useState<number>(caracteristicas?.puertas || 0);
  const [transmision, setTransmision] = useState<string>(caracteristicas?.transmicion || "");
  const [seguro, setSeguro] = useState<boolean>(caracteristicas?.soat || false);

  // Estados de error
  const [combustiblesError, setCombustiblesError] = useState<string>("");
  const [asientosError, setAsientosError] = useState<string>("");
  const [puertasError, setPuertasError] = useState<string>("");
  const [transmisionError, setTransmisionError] = useState<string>("");
  const [seguroError, setSeguroError] = useState<string>("");

  const [isFormValid, setIsFormValid] = useState<boolean>(false);

  // Handlers optimizados
  const handleCombustiblesChange = useCallback((value: number[]) => {
    setCombustibles(value);
    setCombustiblesError(value.length > 0 ? "" : "Seleccione al menos un tipo de combustible");
  }, []);

  const handleAsientosChange = useCallback((value: number) => {
    setAsientos(value);
    setAsientosError(value > 0 ? "" : "El número de asientos es obligatorio");
  }, []);

  const handlePuertasChange = useCallback((value: number) => {
    setPuertas(value);
    setPuertasError(value > 0 ? "" : "El número de puertas es obligatorio");
  }, []);

  const handleTransmisionChange = useCallback((value: string) => {
    setTransmision(value);
    setTransmisionError(value ? "" : "La transmisión es obligatoria");
  }, []);

  const handleSeguroChange = useCallback((value: boolean) => {
    setSeguro(value);
    setSeguroError(value ? "" : "El seguro SOAT es obligatorio");
  }, []);

  // Validación del formulario
  useEffect(() => {
    const valid =
      combustibles.length > 0 &&
      asientos > 0 &&
      puertas > 0 &&
      transmision !== "" &&
      seguro === true &&
      !combustiblesError &&
      !asientosError &&
      !puertasError &&
      !transmisionError &&
      !seguroError;
    setIsFormValid(Boolean(valid));
  }, [combustibles, asientos, puertas, transmision, seguro, combustiblesError, asientosError, puertasError, transmisionError, seguroError]);

  // Load data from context on initial render
  useEffect(() => {
    if (caracteristicas) {
      setCombustibles(caracteristicas.combustibleIds || []);
      setAsientos(caracteristicas.asientos || 0);
      setPuertas(caracteristicas.puertas || 0);
      setTransmision(caracteristicas.transmicion || "");
      setSeguro(caracteristicas.soat || false);
    }
  }, [caracteristicas]);

  // Actualización del contexto
  useEffect(() => {
    const timer = setTimeout(() => {
      updateCaracteristicas({
        combustibleIds: combustibles,
        asientos,
        puertas,
        transmicion: transmision as "automatica" | "manual",
        soat: seguro,
      });
    }, 100);

    return () => clearTimeout(timer);
  }, [combustibles, asientos, puertas, transmision, seguro, updateCaracteristicas]);

  return (
    <main className="p-6 min-h-screen bg-gray-100">
      {/* HEADER: Botón Volver y Título apilados y centrados */}
      <header className="flex flex-col items-start max-w-5xl mx-auto">
        <Link href="/host/home/add/datosprincipales">
          <Button
            variant="secondary"
            className={
              `w-auto sm:w-40 h-10 ` + // ⬅ ancho adaptativo y altura ajustada
              `flex items-center gap-1 ` +
              `text-base font-medium ` +
              `transition-transform duration-200 ease-in-out transform ` +
              `hover:scale-105 hover:bg-gray-100 hover:brightness-90`
            }
          >
            <ChevronLeft className="h-4 w-4" />
            Volver
          </Button>
        </Link>
        <h1 className="text-5xl font-bold my-5">Características del Coche</h1> {/* título aumentado */}
      </header>

      {/* SECTION: Campos centrados con padding y separación */}
      <section className="w-full max-w-5xl mx-auto mt-6 space-y-6 px-4 sm:px-9">
        <CampoCombustible
          combustibles={combustibles}
          onCombustiblesChange={handleCombustiblesChange}
          error={combustiblesError}
          setError={setCombustiblesError}
        />
        <CampoAsientos
          asientos={asientos}
          onAsientosChange={handleAsientosChange}
          error={asientosError}
          setError={setAsientosError}
        />
        <CampoPuertas
          puertas={puertas}
          onPuertasChange={handlePuertasChange}
          error={puertasError}
          setError={setPuertasError}
        />
        <CampoTransmision
          transmision={transmision}
          onTransmisionChange={handleTransmisionChange}
          error={transmisionError}
          setError={setTransmisionError}
        />
        <CampoSeguro
          seguro={seguro}
          onSeguroChange={handleSeguroChange}
          error={seguroError}
          setError={setSeguroError}
        />
      </section>

      {/* FOOTER: Botón Siguiente alineado a la derecha */}
      <div className="w-full max-w-5xl mx-auto mt-10 px-4 sm:px-10 flex justify-end pr-10">
        <BotonesFormulario
          isFormValid={isFormValid}
          onNext={() => router.push("/host/home/add/caradicional")}
        />
      </div>
    </main>
  );
}
