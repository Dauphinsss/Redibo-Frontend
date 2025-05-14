"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import FormularioCobertura from "@/components/recodeComponentes/cobertura/FormularioRecode";
import TablaCoberturas from "@/components/recodeComponentes/cobertura/TablaRecode";
import PopupCobertura from "@/components/recodeComponentes/cobertura/PopUpCobertura";
import BotonValidar from "@/components/recodeComponentes/cobertura/BotonValidacion";
import { CoberturaInterface } from "@/interface/CoberturaForm_Interface_Recode";

export default function CoberturaRecodeClient() {
  const params = useSearchParams();
  const idCarro = parseInt(params.get("id") || "0", 10);

  const [coberturas, setCoberturas] = useState<CoberturaInterface[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [coberturaActual, setCoberturaActual] = useState<CoberturaInterface>({
    tipodaño: "",
    descripcion: "",
    valides: "",
    id_carro: idCarro,
  });

  const agregarCobertura = () => {
    if (isEditing) {
      const index = coberturas.findIndex((c) =>
        c.tipodaño === coberturaActual.tipodaño &&
        c.valides === coberturaActual.valides
      );
      const nuevas = [...coberturas];
      nuevas[index] = coberturaActual;
      setCoberturas(nuevas);
    } else {
      setCoberturas([...coberturas, coberturaActual]);
    }

    setShowPopup(false);
    setCoberturaActual({
      tipodaño: "",
      descripcion: "",
      valides: "",
      id_carro: idCarro,
    });
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Cobertura de uso del auto</h1>
      <div className="border rounded shadow">
        <div className="bg-black text-white p-2 font-semibold">Cobertura de seguro</div>
        <div className="p-4 space-y-4">
          <FormularioCobertura />

          <TablaCoberturas
            coberturas={coberturas}
            onEditar={(idx) => {
              setCoberturaActual(coberturas[idx]);
              setIsEditing(true);
              setShowPopup(true);
            }}
            onEliminar={(idx) => {
              const nuevas = [...coberturas];
              nuevas.splice(idx, 1);
              setCoberturas(nuevas);
            }}
            onAgregar={() => {
              setCoberturaActual({
                tipodaño: "",
                descripcion: "",
                valides: "",
                id_carro: idCarro,
              });
              setIsEditing(false);
              setShowPopup(true);
            }}
          />

          <div className="mt-6 flex justify-center">
            <BotonValidar coberturas={coberturas} />
          </div>
        </div>
      </div>

      {showPopup && (
        <PopupCobertura
          cobertura={coberturaActual}
          setCobertura={setCoberturaActual}
          onClose={() => setShowPopup(false)}
          onSave={agregarCobertura}
          isEditing={isEditing}
        />
      )}
    </div>
  );
}
