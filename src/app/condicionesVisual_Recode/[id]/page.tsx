'use client';

import { useState } from "react";
import { notFound } from "next/navigation";
import TablaCondicionesVisual_Recode from "@/components/recodeComponentes/condicionesDeUsoAutoVisual/TablaCondicionesVisual_Recode";
import TablaCoberturas from "@/components/recodeComponentes/mostrarCobertura/tablaCoberShow";
import PrecioDesglosado from "@/components/recodeComponentes/mostrarCobertura/precioDesglosado";
import Header from "@/components/ui/Header";
import FechasAlquiler from "@/components/recodeComponentes/mostrarCobertura/filtroIni";

export default function CondicionVisualPage({ params }: { params: { id: string } }) {
  const id_carro = parseInt(params.id, 10);
  const [fechas, setFechas] = useState<{ inicio: string; fin: string }>({
    inicio: '',
    fin: ''
  });

  if (isNaN(id_carro) || id_carro <= 0) {
    notFound();
  }

  return (
    <main className="p-4 max-w-4xl mx-auto">
      <Header />

      <h1 className="text-2xl font-bold mb-6 text-center">
        Condiciones de Uso del Auto
      </h1>

      <div className="mb-6">
        <FechasAlquiler onFechasSeleccionadas={setFechas} />

        <div className="flex flex-col sm:flex-row justify-between gap-4 mt-4">
          <TablaCoberturas id_carro={id_carro} />
          <PrecioDesglosado id_carro={id_carro} fechas={fechas} />
        </div>
      </div>

      <TablaCondicionesVisual_Recode id_carro={id_carro} fechas={fechas} />
    </main>
  );
}
