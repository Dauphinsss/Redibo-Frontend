'use client';

import TablaComponentes_Recode from "@/components/recodeComponentes/condicionesDeUsoAuto/TablaComponentes_Recode";
import BotonVolver from "@/components/recodeComponentes/condicionesDeUsoAuto/BotonVolver";

export default function CondicionesUsoAutoHome() {
  return (
    <div className="min-h-screen flex flex-col justify-between p-4">
      <TablaComponentes_Recode />

      <div className="w-full py-4 flex justify-center border-t mt-6">
        <BotonVolver to="/formularioCobertura_Recode" />
      </div>
    </div>
  );
}
