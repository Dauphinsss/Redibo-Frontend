"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/ui/Header";
import FormularioCobertura from "@/app/ValidarSeguro/components/cobertura/FormularioRecode";
import TablaRecode from "@/app/ValidarSeguro/components/cobertura/TablaRecode";
import PopUpCobertura from "@/app/ValidarSeguro/components/cobertura/PopUpCobertura";
import BotonValidacion from "@/app/ValidarSeguro/components/cobertura/BotonValidacion";
import { useSeguroCoberturas } from "@/app/ValidarSeguro/hooks/useSeguroCoberturas";

interface Props {
  id_carro: string;
}

export default function CoberturaRecodeClient({ id_carro }: Props) {
  const router = useRouter();
  const { data: seguro, isLoading } = useSeguroCoberturas(id_carro);

  useEffect(() => {
    if (!id_carro || isNaN(Number(id_carro))) {
      router.replace("/not-found");
    }
  }, [id_carro, router]);

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
                <FormularioCobertura initialDataFor={seguro} />
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