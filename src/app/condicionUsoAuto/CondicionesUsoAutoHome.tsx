"use client";
import React, { useRef } from "react";

import Header from "@/components/ui/Header";
import TablaComponentes_Recode from "@/components/recodeComponentes/condicionesDeUsoAuto/TablaComponentes_Recode";
import BotonVolver from "@/components/recodeComponentes/condicionesDeUsoAuto/BotonVolver";

export default function CondicionesUsoAutoHome() {
  const tablaRef = useRef<{ enviarFormulario: () => void }>(null);

  const handleGuardar = () => {
    if (tablaRef.current) {
      tablaRef.current.enviarFormulario();
    }
  };

  return (
    <div className="flex flex-col justify-between gap-2">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white shadow">
        <Header />
      </div>

      {/* Título */}
      <div className="w-full max-w-[760px] mx-auto mt-4">
        <h2 className="text-3xl font-semibold text-center text-black py-2">
          Condiciones de uso del auto
        </h2>
      </div>

      {/* Formulario de condiciones */}
      <main>
        <TablaComponentes_Recode ref={tablaRef} id_carro={1} />

        {/* Botón Guardar */}
        <div className="w-full flex justify-center mt-4">
          <button
            onClick={handleGuardar}
            className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition"
          >
            Guardar condiciones
          </button>
        </div>

        {/* Botón volver */}
        <div className="w-full py-4 flex justify-center border-t mt-6">
          <BotonVolver to="/formularioCobertura_Recode" />
        </div>
      </main>
    </div>
  );
}