'use client';

import { useState } from "react";
import FormularioCobertura from "@/components/recodeComponentes/cobertura/FormularioRecode";
import TablaCoberturas from "@/components/recodeComponentes/cobertura/TablaRecode";
import PopupCobertura from "@/components/recodeComponentes/cobertura/PopUpCobertura";
import BotonValidar from "@/components/recodeComponentes/cobertura/BotonValidacion";
import { CoberturaInterface, ValidarInterface } from "@/interface/CoberturaForm_Interface_Recode";

interface Props {
  initialData: ValidarInterface;
}

export default function CoberturaRecodeClient({ initialData }: Props) {
  const idCarro = initialData.id_carro;

  const [coberturas, setCoberturas] = useState<CoberturaInterface[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [coberturaActual, setCoberturaActual] = useState<CoberturaInterface>(
    crearCoberturaVacia(idCarro)
  );

  function crearCoberturaVacia(id: number): CoberturaInterface {
    return {
      tipodaño: "",
      descripcion: "",
      valides: "",
      id_carro: id,
    };
  }

  function agregarCobertura() {
    if (isEditing) {
      const index = coberturas.findIndex(
        (c) =>
          c.tipodaño === coberturaActual.tipodaño &&
          c.valides === coberturaActual.valides
      );

      if (index !== -1) {
        const nuevas = [...coberturas];
        nuevas[index] = coberturaActual;
        setCoberturas(nuevas);
      }
    } else {
      setCoberturas([...coberturas, coberturaActual]);
    }

    cerrarPopup();
  }

  function cerrarPopup() {
    setShowPopup(false);
    setCoberturaActual(crearCoberturaVacia(idCarro));
    setIsEditing(false);
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Cobertura de uso del auto</h1>

      <div className="border rounded shadow">
        <div className="bg-black text-white p-2 font-semibold">
          Cobertura de seguro
        </div>

        <div className="p-4 space-y-4">
          <FormularioCobertura initialDataFor={initialData} />

          <TablaCoberturas
            coberturas={coberturas}
            onEditar={(idx) => {
              setCoberturaActual(coberturas[idx]);
              setIsEditing(true);
              setShowPopup(true);
            }}
            onEliminar={(idx) => {
              const nuevas = coberturas.filter((_, i) => i !== idx);
              setCoberturas(nuevas);
            }}
            onAgregar={() => {
              setCoberturaActual(crearCoberturaVacia(idCarro));
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
          onClose={cerrarPopup}
          onSave={agregarCobertura}
          isEditing={isEditing}
        />
      )}
    </div>
  );
}
