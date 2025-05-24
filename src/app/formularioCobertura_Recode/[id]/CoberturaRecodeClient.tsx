"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/ui/Header";
import FormularioCobertura from "@/components/recodeComponentes/cobertura/FormularioRecode";
import TablaRecode from "@/components/recodeComponentes/cobertura/TablaRecode";
import PopUpCobertura from "@/components/recodeComponentes/cobertura/PopUpCobertura";
import BotonValidacion from "@/components/recodeComponentes/cobertura/BotonValidacion";
import { getInsuranceByID } from "@/service/services_Recode";
import { useCoberturasStore } from "@/hooks/useCoberturasStore";
import { SeguroConCoberturas_Interface_Recode } from "@/interface/SeguroConCoberturas_Interface_Recode";

interface Props {
  id_carro: string;
}

export default function CoberturaRecodeClient({ id_carro }: Props) {
  const router = useRouter();
  const setLista = useCoberturasStore((s) => s.setLista);
  const [seguro, setSeguro] = useState<SeguroConCoberturas_Interface_Recode | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      if (isNaN(Number(id_carro))) {
        router.replace("/not-found");
        return;
      }

      try {
        const resultado = await getInsuranceByID(id_carro);
        if (!resultado) {
          router.replace("/not-found");
          return;
        }

        setSeguro(resultado);

        // Convertir a CoberturaInterface para Zustand
        setLista(
          resultado.coberturas.map((cob) => ({
            id: cob.id_cobertura,
            id_carro: resultado.id_carro,
            tipodaño: cob.tipodanio_cobertura,
            descripcion: cob.descripcion_cobertura ?? "",
            valides: cob.cantida_cobertura,
          }))
        );
      } catch (error) {
        console.error("Error al cargar seguro:", error);
        router.replace("/error");
      } finally {
        setLoading(false);
      }
    };

    cargar();
  }, [id_carro, router, setLista]);

  if (loading) return <p className="text-center py-10">Cargando datos del seguro...</p>;

  return (
    <div className="border-b px-4 sm:px-6 lg:px-8 py-7">
      <Header />

      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Registro de coberturas</h1>

        <div className="border rounded shadow">
          <div className="bg-black text-white p-2 font-semibold">Datos del seguro</div>

          <div className="p-4 space-y-4">
            {seguro && <FormularioCobertura initialDataFor={seguro} />}
            <TablaRecode />
            <div className="mt-6 flex justify-center">
              <BotonValidacion />
            </div>
          </div>
        </div>
      </div>

      <PopUpCobertura />
    </div>
  );
}