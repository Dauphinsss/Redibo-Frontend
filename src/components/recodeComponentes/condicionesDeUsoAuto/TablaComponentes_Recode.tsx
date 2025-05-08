import React, { memo, useState } from "react";
import General_Recode from "./condicioneGenerales/General_Recode";
import Entrada_Recode from "./condionesEntrada/Entrega_Recode";
import Devueltas_Recode from "./condicionesDevueltas/Devolucion_Recode";

// Definimos los tabs disponibles y sus etiquetas
type Tab = "generales" | "entrega" | "devolucion";
const tabs: { key: Tab; label: string }[] = [
  { key: "generales", label: "Condiciones generales" },
  { key: "entrega", label: "Entrega del auto" },
  { key: "devolucion", label: "Devolución del auto" }
];

function TablaComponentes_Recode() {
  const [activeTab, setActiveTab] = useState<Tab>("generales");

  // Renderiza el contenido según la pestaña activa
  const renderTabContent = () => {
    switch (activeTab) {
      case "generales":  return <General_Recode />;
      case "entrega":    return <Entrada_Recode />;
      case "devolucion": return <Devueltas_Recode />;
      default:            return null;
    }
  };

  return (
    <div className="w-full max-w-[760px] mx-auto border border-black rounded-[10px] overflow-hidden">
      {/* Pestañas */}
      <div className="flex">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={
              `
                flex-1 text-sm font-medium py-2 border-r border-black last:border-r-0
                first:rounded-tl-[10px] last:rounded-tr-[10px]
                ${activeTab === tab.key ? "bg-black text-white" : "bg-white text-black"}
              `
            }
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Separador horizontal */}
      <div className="h-[1px] bg-black" />

      {/* Contenido de la pestaña */}
      <div className="bg-white min-h-[300px] p-4">
        {renderTabContent()}
      </div>
    </div>
  );
}

export default memo(TablaComponentes_Recode);
