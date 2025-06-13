"use client";

import React, { useEffect, useState } from "react";
import GeneralVisual_Recode from "./GeneralVisual_Recode";
import EntregaVisual_Recode from "./EntregaVisual_Recode";
import DevolucionVisual_Recode from "./DevolucionVisual_Recode";
import NotificacionEnvioExitoso_recode from "@/app/reserva/components/componentes_InfoAuto_Recode/notificacionSoli/Notificacion_envio_exitoso_Recode";


import { getCondicionesUsoVisual_Recode } from "@/app/reserva/services/services_reserva";
import { CondicionesUsoResponse } from "@/app/reserva/interface/CondicionesUsoVisual_interface_Recode";

type Tab = "generales" | "entrega" | "devolucion";
const tabs: { key: Tab; label: string;}[] = [
  {
    key: "generales",
    label: "Condiciones generales",
  },
  {
    key: "entrega",
    label: "Entrega del auto",
  },
  {
    key: "devolucion",
    label: "Devolución del auto",
  },
];

interface TablaCondicionesVisualProps {
  id_carro: number;
}

export default function TablaCondicionesVisual_Recode({ id_carro }: TablaCondicionesVisualProps) {
  const [activeTab, setActiveTab] = useState<Tab>("generales");
  const [condiciones, setCondiciones] = useState<CondicionesUsoResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const data = await getCondicionesUsoVisual_Recode(id_carro);
        setCondiciones(data);

        if (!data) {
          console.log("Este auto no tiene condiciones de uso definidas.");
        } else {
          setError(null);
        }

      } catch (err) {
        // Este bloque ahora solo se activará para errores de red reales.
        console.error("Error al cargar condiciones:", err);
        setError("No se pudieron cargar las condiciones de uso.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id_carro]);

  const renderContent = () => {
    if (loading) return <p className="text-center text-gray-600 py-4">Cargando condiciones...</p>;
    if (error) return <p className="text-center text-red-600 py-4">{error}</p>;
    if (!condiciones) return <p className="text-center text-gray-500 py-4">No hay condiciones de uso disponibles.</p>;

    switch (activeTab) {
      case "generales":
        return <GeneralVisual_Recode condiciones={condiciones.condiciones_generales} />;
      case "entrega":
        return <EntregaVisual_Recode condiciones={condiciones.entrega_auto} />;
      case "devolucion":
        return <DevolucionVisual_Recode condiciones={condiciones.devolucion_auto} />;
    }
  };

  return (
    <>
      {showNotification && (
        <NotificacionEnvioExitoso_recode 
          onClose={() => setShowNotification(false)}
          hostNombre="Nombre del Host"
          fechaInicio="2025-06-01"
          fechaFin="2025-06-05"
        />
      )}

      <div className="w-full max-w-[760px] mx-auto border border-black rounded-xl overflow-hidden">
        {/* Tabs */}
        <div className="sticky top-0 z-10 bg-white border-b border-black">
          <div className="flex">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 text-sm font-medium py-2 px-2 flex items-center justify-center transition-colors
                  ${activeTab === tab.key
                    ? "bg-black text-white"
                    : "bg-white text-black hover:bg-gray-100"
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Contenido */}
        <div className="bg-white p-4 min-h-[300px]">{renderContent()}</div>
      </div>
    </>
  );
}
