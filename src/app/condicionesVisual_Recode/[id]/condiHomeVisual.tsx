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
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <TablaCoberturas id_carro={id_carro} />
        <PrecioDesglosado id_carro={id_carro} fechas={fechas} />
      </div>
    </div>
  );
}
