"use client";

import React, { useRef, useMemo, useState } from "react";
import { notFound, useParams } from "next/navigation";
import Header from "@/components/ui/Header";
import TablaComponentes_Recode from "@/components/recodeComponentes/condicionesDeUsoAutoFormu/TablaComponentes_Recode";
import BotonVolver from "@/components/recodeComponentes/condicionesDeUsoAutoFormu/BotonVolver";

export default function CondicionesUsoAutoHome() {
  const tablaRef = useRef<{ enviarFormulario: () => void }>(null);
  const params = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const id_carro = useMemo(() => {
    const raw = params?.id;
    if (typeof raw !== "string") notFound();
    const parsed = Number(raw);
    if (isNaN(parsed)) notFound();
    return parsed;
  }, [params]);

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

      {/* Formulario */}
      <main>
        <TablaComponentes_Recode
          ref={tablaRef}
          id_carro={id_carro}
          setIsSubmitting={setIsSubmitting}
        />

        {/* Botón Guardar */}
        <div className="w-full flex justify-center mt-4">
          <button
            onClick={handleGuardar}
            className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition disabled:opacity-50"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <svg
                  className="animate-spin h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8z"
                  ></path>
                </svg>
                Guardando...
              </span>
            ) : (
              "Guardar condiciones"
            )}
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