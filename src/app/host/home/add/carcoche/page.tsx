"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import CampoCombustible from "../../../components/CarCoche/CampoCombustible";
import CampoAsientos from "../../../components/CarCoche/CampoAsientos";
import CampoPuertas from "../../../components/CarCoche/CampoPuertas";
import CampoTransmision from "../../../components/CarCoche/CampoTransmision";
import CampoSeguro from "../../../components/CarCoche/CampoSeguro";
import BotonesFormulario from "../../../components/CarCoche/BotonesFormulario";

export default function CaracteristicasCoche() {
  const router = useRouter();

  const [combustibles, setCombustibles] = useState<string[]>([]);
  const [asientos, setAsientos] = useState<string>("");
  const [puertas, setPuertas] = useState<string>("");
  const [transmision, setTransmision] = useState<string>("");
  const [seguro, setSeguro] = useState<boolean>(false);

  const [asientosError, setAsientosError] = useState<string>("");
  const [combustiblesError, setCombustiblesError] = useState<string>("");

  const [isFormValid, setIsFormValid] = useState<boolean>(false);

  useEffect(() => {
    const combustiblesValid = combustibles.length > 0 && combustibles.length <= 2;
    const asientosValid = asientos.trim() !== "" && parseInt(asientos) > 0 && asientosError === "";
    const areAllFieldsValid =
      combustiblesValid &&
      asientosValid &&
      puertas !== "" &&
      transmision !== "" &&
      seguro === true &&
      combustiblesError === "";

    setIsFormValid(areAllFieldsValid);
  }, [combustibles, asientos, puertas, transmision, seguro, asientosError, combustiblesError]);

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
          setCombustibles={setCombustibles}
          error={combustiblesError}
          setError={setCombustiblesError}
        />
        <CampoAsientos
          asientos={asientos}
          setAsientos={setAsientos}
          error={asientosError}
          setError={setAsientosError}
        />
        <CampoPuertas puertas={puertas} setPuertas={setPuertas} />
        <CampoTransmision transmision={transmision} setTransmision={setTransmision} />
        <CampoSeguro seguro={seguro} setSeguro={setSeguro} />
      </div>

      <BotonesFormulario isFormValid={isFormValid} />
    </div>
  );
}
