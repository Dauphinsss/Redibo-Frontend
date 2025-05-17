"use client";

import React, { useEffect, useState } from "react";
import GeneralVisual_Recode from "./GeneralVisual_Recode";
import EntregaVisual_Recode from "./EntregaVisual_Recode";
import DevolucionVisual_Recode from "./DevolucionVisual_Recode";
import NotificacionEnvioExitoso_recode from "../notificacionSoli/Notificacion_envio_exitoso_Recode";
import { getCondicionesUsoVisual_Recode } from "@/service/services_Recode";
import { CondicionesUsoResponse } from "@/interface/CondicionesUsoVisual_interface_Recode";

type Tab = "generales" | "entrega" | "devolucion";
const tabs: { key: Tab; label: string }[] = [
  { key: "generales", label: "Condiciones generales" },
  { key: "entrega", label: "Entrega del auto" },
  { key: "devolucion", label: "Devolución del auto" },
];

interface TablaCondicionesVisualProps {
  id_carro: number;
  showNotification: boolean;
  setShowNotification: (value: boolean) => void;
}

export default function TablaCondicionesVisual_Recode({
  id_carro,
  showNotification,
  setShowNotification
}: TablaCondicionesVisualProps) {
  const [activeTab, setActiveTab] = useState<Tab>("generales");
  const [condiciones, setCondiciones] = useState<CondicionesUsoResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const data = await getCondicionesUsoVisual_Recode(id_carro);
        if (!data) throw new Error("No se encontraron condiciones.");
        setCondiciones(data);
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Error al cargar condiciones.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id_carro]);

  const renderContent = () => {
    if (loading) return <p>Cargando condiciones...</p>;
    if (error) return <p className="text-red-600">{error}</p>;
    if (!condiciones) return <p>No hay condiciones.</p>;

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
    <div className="w-full border-t border-gray-400 mt-4">
      <div className="flex justify-center gap-4 mb-2">
        {tabs.map(({ key, label }) => (
          <button
            key={key}
            className={`py-2 px-4 font-bold uppercase ${
              activeTab === key ? "border-b-2 border-black" : ""
            }`}
            onClick={() => setActiveTab(key)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="mb-6">{renderContent()}</div>

      {showNotification && (
        <NotificacionEnvioExitoso_recode 
          onClose={() => setShowNotification(false)}
          hostNombre=""
          fechaInicio=""
          fechaFin=""
        />
      )}
    </div>
  );
}