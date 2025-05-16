"use client";

import React, { useEffect, useState } from "react";
import GeneralVisual_Recode from "./GeneralVisual_Recode";
import EntregaVisual_Recode from "./EntregaVisual_Recode";
import DevolucionVisual_Recode from "./DevolucionVisual_Recode";
import NotificacionEnvioExitoso_recode from "../notificacionSoli/Notificacion_envio_exitoso_Recode";
import FormularioSolicitud from "../notificacionSoli/Notificacion_envio_host_Recode";

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
  fechas: { inicio: string; fin: string };
}

export default function TablaCondicionesVisual_Recode({
  id_carro,
  fechas,
}: TablaCondicionesVisualProps) {
  const [activeTab, setActiveTab] = useState<Tab>("generales");
  const [condiciones, setCondiciones] = useState<CondicionesUsoResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showNotification, setShowNotification] = useState(false);
  const [precioEstimado, setPrecioEstimado] = useState(0);

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

  useEffect(() => {
    const cargarPrecio = async () => {
      const datos = await import("@/service/services_Recode").then((m) =>
        m.getCarById(id_carro.toString())
      );
      if (!fechas.inicio || !fechas.fin) return setPrecioEstimado(0);
      if (datos?.precio_por_dia) {
        const dias =
          (new Date(fechas.fin).getTime() -
            new Date(fechas.inicio).getTime()) /
          (1000 * 60 * 60 * 24);
        setPrecioEstimado(dias * datos.precio_por_dia);
      }
    };
    cargarPrecio();
  }, [id_carro, fechas]);

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


      <FormularioSolicitud
        id_carro={id_carro}
        precioEstimado={precioEstimado}
        fechas={fechas}
        onSolicitudExitosa={() => setShowNotification(true)}
      />

      {showNotification && (
        <NotificacionEnvioExitoso_recode onClose={() => setShowNotification(false)} />
      )}
    </div>
  );
}
