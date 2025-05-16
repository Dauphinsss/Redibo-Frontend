'use client';

import { useState } from "react";
import FechasAlquiler from "@/components/recodeComponentes/mostrarCobertura/filtroIni";
import TablaCoberturas from "@/components/recodeComponentes/mostrarCobertura/tablaCoberShow";
import PrecioDesglosado from "@/components/recodeComponentes/mostrarCobertura/precioDesglosado";

export default function FechasWrapper({ id_carro }: { id_carro: number }) {
  const [fechas, setFechas] = useState<{ inicio: string; fin: string }>({
    inicio: '',
    fin: ''
  });

  return (
    <div className="flex flex-col gap-4">
      <FechasAlquiler onFechasSeleccionadas={setFechas} />

      <div className="flex flex-col sm:flex-row sm:items-stretch justify-between gap-4">
        <div className="flex-1">
          <TablaCoberturas id_carro={id_carro} />
        </div>
        <div className="w-full sm:w-80">
          <PrecioDesglosado id_carro={id_carro} fechas={fechas} />
        </div>
      </div>
    </div>
  );
}
