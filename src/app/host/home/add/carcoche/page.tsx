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
  const { updateCaracteristicas } = useFormContext();

  // Estados locales
  const [combustibles, setCombustibles] = useState<string[]>([]);
  const [asientos, setAsientos] = useState<number>(0);
  const [puertas, setPuertas] = useState<number>(0);
  const [transmision, setTransmision] = useState<string>("");
  const [seguro, setSeguro] = useState<boolean>(false);

  // Estados de error
  const [combustiblesError, setCombustiblesError] = useState<string>("");
  const [asientosError, setAsientosError] = useState<string>("");
  const [puertasError, setPuertasError] = useState<string>("");
  const [transmisionError, setTransmisionError] = useState<string>("");
  const [seguroError, setSeguroError] = useState<string>("");

  const [isFormValid, setIsFormValid] = useState<boolean>(false);

  // Handlers optimizados
  const handleCombustiblesChange = useCallback((value: string[]) => {
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
    const isValid = (
      combustibles.length > 0 &&
      asientos > 0 &&
      puertas > 0 &&
      transmision !== "" &&
      seguro === true &&
      !combustiblesError &&
      !asientosError &&
      !puertasError &&
      !transmisionError &&
      !seguroError
    );
    setIsFormValid(isValid);
  }, [combustibles, asientos, puertas, transmision, seguro, combustiblesError, asientosError, puertasError, transmisionError, seguroError]);

  // Actualización del contexto
  useEffect(() => {
    const timer = setTimeout(() => {
      updateCaracteristicas({
        combustible: combustibles.join(", "),
        asientos,
        puertas,
        transmision,
        seguro 
      });
    }, 100);

    return () => clearTimeout(timer);
  }, [combustibles, asientos, puertas, transmision, seguro, updateCaracteristicas]);

  return (
    <div className="p-6 flex flex-col items-start min-h-screen bg-gray-100">
      <Link href="/host/home/add/datosprincipales">
        <Button
          variant="secondary"
          className="flex items-center gap-1 self-start justify-start cursor-pointer w-32 h-10 text-base font-medium transition-all duration-200 hover:bg-gray-100 hover:brightness-90"
        >
          <ChevronLeft className="h-3 w-3" />
          Volver
        </Button>
      </Link>

      <div className="w-full max-w-5xl flex justify-start">
        <h1 className="text-4xl font-bold my-5 pl-7">Características del Coche</h1>
      </div>

      <div className="w-full max-w-5xl pl-9 space-y-6">
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
      </div>

      <div className="w-full max-w-5xl flex justify-between mt-10 px-10">
        <BotonesFormulario 
          isFormValid={isFormValid}
          onNext={() => router.push("/host/home/add/caradicional")}
        />
      </div>
    </div>
  );
}