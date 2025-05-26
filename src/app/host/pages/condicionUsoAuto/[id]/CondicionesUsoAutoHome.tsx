"use client";

import React, { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "@/components/ui/Header";
import TablaComponentes_Recode from "@/app/host/components/condicionesDeUsoAutoFormu/TablaComponentes_Recode";
import { getCarById } from "@/app/host/services/condicionesUsoForm";
export default function CondicionesUsoAutoHome() {
  const tablaRef = useRef<{ enviarFormulario: () => void }>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const params = useParams();
  const router = useRouter();

  const id_carro = (() => {
    const raw = params?.id;
    if (typeof raw !== "string") return null;
    const parsed = Number(raw);
    return isNaN(parsed) ? null : parsed;
  })();

  useEffect(() => {
    if (id_carro === null) {
      router.replace("/not-found");
      return;
    }

    const fetchCar = async () => {
      try {
        const data = await getCarById("" + id_carro);
        if (!data) {
          router.replace("/not-found");
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching car data:", error);
        router.replace("/not-found");
      }
    };

    fetchCar();
  }, [id_carro, router]);

  if (id_carro === null) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="text-gray-600 text-lg">Cargando datos del auto...</span>
      </div>
    );
  }

  const handleGuardar = () => {
    tablaRef.current?.enviarFormulario();
  };

  return (
    <div className="flex flex-col justify-between gap-2">
    
      <div className="sticky top-0 z-50 bg-white shadow overflow-visible">
          <div className="border-b px-4 sm:px-6 lg:px-8 py-7">
            <Header />
          </div>
          <div className="border-t px-4 sm:px-6 lg:px-8 py-3 flex justify-center">
            <div className="w-full max-w-2xl">
              <h2 className="text-3xl font-semibold text-center text-black">
                Condiciones de uso del auto
              </h2>
            </div>
          </div>
        </div>

      {/* Formulario */}
      <main className="mt-2">
        <TablaComponentes_Recode
          ref={tablaRef}
          id_carro={id_carro}
          setIsSubmitting={setIsSubmitting}
        />

        {/* Botón Guardar */}
        <div className="w-full flex justify-center mt-4">
          <button
            onClick={handleGuardar}
            className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition disabled:opacity-50 flex items-center gap-2"
            disabled={isSubmitting}
          >
            {isSubmitting && (
              <svg
                className="animate-spin h-5 w-5 text-white"
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
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                />
              </svg>
            )}
            {isSubmitting ? "Guardando..." : "Guardar condiciones"}
          </button>
        </div>
      </main>
    </div>
  );
}