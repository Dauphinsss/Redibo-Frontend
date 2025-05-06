import React, { memo, useState } from "react";
import General_Recode from "./condicioneGenerales/General_Recode";
import Entrada_Recode from "./condionesEntrada/Entrega_Recode";
import Devueltas_Recode from "./condicionesDevueltas/Devolucion_Recode";

type Tab = "generales" | "entrega" | "devolucion";

const tabs: { key: Tab; label: string }[] = [
  { key: "generales", label: "Condiciones generales" },
  { key: "entrega", label: "Entrega del auto" },
  { key: "devolucion", label: "Devolución del auto" },
];

function TablaComponentes_Recode(){
  const [activeTab, setActiveTab] = useState<Tab>("generales");

  const renderTabContent = () => {
    switch (activeTab) {
      case "generales":
        return <General_Recode />;
      case "entrega":
        return <Entrada_Recode />;
      case "devolucion":
        return <Devueltas_Recode />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-3xl mx-auto border border-black rounded-[10px] overflow-hidden">
      <div className="flex">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 text-sm font-medium py-2 border-r border-black last:border-r-0 ${
              activeTab === tab.key ? "bg-black text-white" : "bg-white text-black"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="h-[1px] bg-black" />

      <div className="bg-white min-h-[300px] border-t border-black p-4">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default memo(TablaComponentes_Recode);
