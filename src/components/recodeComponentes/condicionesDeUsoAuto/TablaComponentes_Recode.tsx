"use client";

import React, { memo, useState } from "react";
import General_Recode from "./condicioneGenerales/General_Recode";
import Entrada_Recode from "./condionesEntrada/Entrega_Recode";
import Devolucion_Recode from "./condicionesDevueltas/Devolucion_Recode";

type Tab = "generales" | "entrega" | "devolucion";
const tabs: { key: Tab; label: string }[] = [
  { key: "generales", label: "Condiciones generales" },
  { key: "entrega", label: "Entrega del auto" },
  { key: "devolucion", label: "Devolución del auto" },
];

function TablaComponentes_Recode() {
  const [activeTab, setActiveTab] = useState<Tab>("generales");

  // --- Estados para GENERALES ---
  const [genCheckboxes, setGenCheckboxes] = useState<Record<string, boolean>>({
    fumar: false,
    mascotas: false,
    combustible: false,
    fuera_ciudad: false,
    multas: false,
    lugar_entrega: false,
    uso_comercial: false,
  });
  const [genEdadRango, setGenEdadRango] = useState<[number, number]>([18, 70]);
  const [genKmMax, setGenKmMax] = useState<number>(0);

  // --- Estados para ENTREGA ---
  type OptionString = { value: string; label: string };
  const placeholder: OptionString = { value: "", label: "Seleccionar estado" };
  const estadosEntrega: OptionString[] = [
    placeholder,
    { value: "lleno", label: "Lleno" },
    { value: "medio", label: "Medio" },
    { value: "vacio", label: "Vacío" },
  ];
  const [entCombustible, setEntCombustible] =
    useState<OptionString>(placeholder);
  const [entCheckboxes, setEntCheckboxes] = useState<Record<string, boolean>>({
    exteriorLimpio: false,
    interiorLimpio: false,
    rayones: false,
    llantas: false,
    interiorSinDanios: false,
  });

  // --- Estados para DEVOLUCIÓN ---
  const [devCheckboxes, setDevCheckboxes] = useState<Record<string, boolean>>({
    interior_limpio: false,
    exterior_limpio: false,
    rayones: false,
    herramientas_devueltas: false,
    danios: false,
    combustible_igual: false,
  });

  // Renderizado por pestaña
  const renderTabContent = () => {
    switch (activeTab) {
      case "generales":
        return (
          <General_Recode
            respuestas={genCheckboxes}
            onCheckboxChange={(k) =>
              setGenCheckboxes((p) => ({ ...p, [k]: !p[k] }))
            }
            edadRango={genEdadRango}
            onEdadChange={setGenEdadRango}
            kmMax={genKmMax}
            onKmChange={([km]) => setGenKmMax(km)}
          />
        );
      case "entrega":
        return (
          <Entrada_Recode
            opciones={estadosEntrega}
            valorCombustible={entCombustible}
            onChangeCombustible={setEntCombustible}
            respuestas={entCheckboxes}
            onCheckboxChange={(k) =>
              setEntCheckboxes((p) => ({ ...p, [k]: !p[k] }))
            }
          />
        );
      case "devolucion":
        return (
          <Devolucion_Recode
            respuestas={devCheckboxes}
            onCheckboxChange={(k) =>
              setDevCheckboxes((p) => ({ ...p, [k]: !p[k] }))
            }
          />
        );
    }
  };

  return (
    <div className="w-full max-w-[760px] mx-auto border border-black rounded-[10px] overflow-hidden">
      {/* Tabs */}
      <div className="flex">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`
              flex-1 text-sm font-medium py-2 border-r border-black last:border-r-0
              first:rounded-tl-[10px] last:rounded-tr-[10px]
              ${activeTab === tab.key ? "bg-black text-white" : "bg-white text-black"}
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Divider */}
      <div className="h-[1px] bg-black" />

      {/* Content */}
      <div className="bg-white p-4 min-h-[300px]">{renderTabContent()}</div>
    </div>
  );
}

export default memo(TablaComponentes_Recode);
