"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/ui/Header";
import BotonValidacion from "@/app/validarSeguro1/components/cobertura/BotonValidacion";
import PopUpCobertura from "@/app/validarSeguro1/components/cobertura/PopUpCobertura";
import TablaRecode from "@/app/validarSeguro1/components/cobertura/TablaRecode";
import { useSeguroCoberturas } from "@/app/validarSeguro1/hooks/useSeguroCoberturas";
import FormularioRecode from "@/app/validarSeguro1/components/cobertura/FormularioRecode";

interface Props {
  id_seguro: number;
}

export default function CoberturaRecodeClient({ id_seguro }: Props) {
  const router = useRouter();
  const { data: seguro, isLoading } = useSeguroCoberturas(id_seguro);

  useEffect(() => {
    if (!id_seguro || isNaN(Number(id_seguro))) {
      console.error("ID de seguro inválido:", id_seguro);
      router.replace("/not-found");
    }
  }, [id_seguro, router]);

  useEffect(() => {
    if (!isLoading && !seguro) {
      router.replace("/not-found");
    }
  }, [seguro, isLoading, router]);

  if (isLoading) return <p className="text-center py-10">Cargando datos del seguro...</p>;

  return (
    <div className="border-b px-4 sm:px-6 lg:px-8 py-7">
      <Header />

      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Registro de coberturas</h1>

        <div className="border rounded shadow">
          <div className="bg-black text-white p-2 font-semibold">Datos del seguro</div>

          <div className="p-4 space-y-4">
            {seguro && (
              <>
                <FormularioRecode initialDataFor={seguro} />
                <TablaRecode />
                <div className="mt-6 flex justify-center">
                  <BotonValidacion idSeguro={seguro.id_seguro} />
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <PopUpCobertura />
    </div>
  );
}