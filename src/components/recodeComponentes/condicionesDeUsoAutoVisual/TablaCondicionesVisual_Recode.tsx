"use client";

import React, { useEffect, useState } from "react";
import GeneralVisual_Recode from "./GeneralVisual_Recode";
import EntregaVisual_Recode from "./EntregaVisual_Recode";
import DevolucionVisual_Recode from "./DevolucionVisual_Recode";
import { getCondicionesUsoVisual_Recode } from "@/service/services_Recode";
import { CondicionesUsoResponse } from "@/interface/CondicionesUsoVisual_interface_Recode";

type Tab = "generales" | "entrega" | "devolucion";

const tabs: { key: Tab; label: string }[] = [
  { key: "generales", label: "Condiciones generales" },
  { key: "entrega", label: "Entrega del auto" },
  { key: "devolucion", label: "Devolución del auto" },
];

interface Props {
  id_carro: number;
}

export default function TablaCondicionesVisual_Recode({ id_carro }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("generales");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<CondicionesUsoResponse | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getCondicionesUsoVisual_Recode(id_carro);
        setData(response);
        console.log("📦 Datos recibidos:", response);
      } catch (error) {
        console.error("Error al obtener condiciones:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id_carro]);

  if (loading) return <p className="text-center py-8">Cargando condiciones...</p>;
  if (!data) return <p className="text-center py-8 text-red-600">No se encontraron condiciones.</p>;

  const { generales, entrega, devolucion } = data;

  return (
    <div className="w-full max-w-3xl mx-auto border border-black rounded-[10px] overflow-hidden bg-white shadow-md">
      {/* Tabs */}
      <div className="bg-white border-b border-black">
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 py-3 text-sm font-medium border-r border-black last:border-r-0
                ${activeTab === tab.key ? "bg-black text-white" : "bg-white text-black hover:bg-gray-100"}
              `}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Contenido */}
      <div className="p-6 min-h-[300px] bg-white">
        {activeTab === "generales" && generales && (
          <GeneralVisual_Recode
            edadMin={generales.edad_minima}
            edadMax={generales.edad_maxima}
            kmMax={generales.kilometraje_max_dia}
            condiciones={{
              fumar: generales.fumar,
              mascota: generales.mascota,
              dev_mismo_conb: generales.dev_mismo_conb,
              uso_fuera_ciudad: generales.uso_fuera_ciudad,
              multa_conductor: generales.multa_conductor,
              dev_mismo_lugar: generales.dev_mismo_lugar,
              uso_comercial: generales.uso_comercial,
            }}
          />
        )}

        {activeTab === "entrega" && entrega && (
          <EntregaVisual_Recode
            estadoCombustible={entrega.estado_combustible}
            condiciones={{
              exteriorLimpio: entrega.esterior_limpio,
              rayones: entrega.rayones,
              interiorLimpio: entrega.inter_limpio,
              llantas: entrega.llanta_estado,
              interiorSinDanios: !entrega.interior_da_o,
            }}
          />
        )}

        {activeTab === "devolucion" && devolucion && (
          <DevolucionVisual_Recode
            condiciones={{
              interior_limpio: devolucion.interior_limpio,
              exterior_limpio: devolucion.exterior_limpio,
              rayones: devolucion.rayones,
              herramientas_devueltas: devolucion.herramientas,
              danios: devolucion.cobrar_da_os,
              combustible_igual: devolucion.combustible_igual,
            }}
          />
        )}
      </div>
    </div>
  );
}
