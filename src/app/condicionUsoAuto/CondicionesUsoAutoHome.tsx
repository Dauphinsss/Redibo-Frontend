'use client';

import TablaComponentes_Recode from "@/components/recodeComponentes/condicionesDeUsoAuto/TablaComponentes_Recode";
import BotonVolver from "@/components/recodeComponentes/condicionesDeUsoAuto/BotonVolver";

export default function CondicionesUsoAutoHome() {
  return (
    <div className="min-h-screen flex flex-col justify-between p-4">
      
      {/* Encabezado sticky */}
      <div className="sticky top-0 z-20 bg-white pb-2">
        <h2 className="ttext-base font-semibold text-left text-black mb-2">
          Condiciones de uso del auto
        </h2>

      </div>

      {/* Tabla de condiciones */}
      <div className="overflow-y-auto">
        <TablaComponentes_Recode />
      </div>

      {/* Botón volver */}
      <div className="w-full py-4 flex justify-center border-t mt-6">
        <BotonVolver to="/formularioCobertura_Recode" />
      </div>
    </div>
  );
}