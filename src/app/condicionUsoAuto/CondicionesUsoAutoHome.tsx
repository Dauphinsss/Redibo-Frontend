"use client";
import React from "react";

import Header from "@/components/ui/Header"; // ajusta esta ruta según dónde esté
import TablaComponentes_Recode from "@/components/recodeComponentes/condicionesDeUsoAuto/TablaComponentes_Recode";
import BotonVolver from "@/components/recodeComponentes/condicionesDeUsoAuto/BotonVolver";

export default function CondicionesUsoAutoHome() {
  return (
    <div className="flex flex-col justify-between gap-2">
      
      {/* Header global con navegación y login */}
      <div className="sticky top-0 z-50 bg-white shadow">
        <Header />
      </div>

      {/* Título */}
      <div className="w-full max-w-[760px] mx-auto mt-4">
        <h2 className="text-3xl font-semibold text-center text-black py-2">
          Condiciones de uso del auto
        </h2>
      </div>

      {/* Contenido principal */}
      <main>
        {/* Tabla de condiciones */}
        <TablaComponentes_Recode />

        {/* Botón volver */}
        <div className="w-full py-4 flex justify-center border-t mt-6">
          <BotonVolver to="/formularioCobertura_Recode" />
        </div>
      </main>
    </div>
  );
}
