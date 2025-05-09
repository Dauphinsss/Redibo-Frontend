"use client";

import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  memo,
} from "react";

import General_Recode from "./condicioneGenerales/General_Recode";
import Entrada_Recode from "./condionesEntrada/Entrega_Recode";
import Devolucion_Recode from "./condicionesDevueltas/Devolucion_Recode";

import { postCondicionesUso_Recode } from "@/service/services_Recode";
import { transformCondicionesUso_Recode } from "@/utils/transformCondicionesUso_Recode";
import {
  CondicionesGenerales_Recode,
  EntregaAuto_Recode,
  DevolucionAuto_Recode,
} from "@/interface/CondicionesUso_interface_Recode";

type Tab = "generales" | "entrega" | "devolucion";
const tabs: { key: Tab; label: string }[] = [
  { key: "generales", label: "Condiciones generales" },
  { key: "entrega", label: "Entrega del auto" },
  { key: "devolucion", label: "Devolución del auto" },
];

interface TablaComponentesProps {
  id_carro: number;
}

const TablaComponentes_Recode = forwardRef(
  ({ id_carro }: TablaComponentesProps, ref) => {
    const [activeTab, setActiveTab] = useState<Tab>("generales");

    // --- GENERALES ---
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

    // --- ENTREGA ---
    type OptionString = { value: string; label: string };
    const placeholder: OptionString = { value: "", label: "Seleccionar estado" };
    const estadosEntrega: OptionString[] = [
      placeholder,
      { value: "lleno", label: "Lleno" },
      { value: "medio", label: "Medio" },
      { value: "vacio", label: "Vacío" },
    ];
    const [entCombustible, setEntCombustible] = useState<OptionString>(placeholder);
    const [entCheckboxes, setEntCheckboxes] = useState<Record<string, boolean>>({
      exteriorLimpio: false,
      interiorLimpio: false,
      rayones: false,
      llantas: false,
      interiorSinDanios: false,
    });

    // --- DEVOLUCIÓN ---
    const [devCheckboxes, setDevCheckboxes] = useState<Record<string, boolean>>({
      interior_limpio: false,
      exterior_limpio: false,
      rayones: false,
      herramientas_devueltas: false,
      danios: false,
      combustible_igual: false,
    });

    // --- Enviar a API ---
    const handleEnviar = async () => {
      const generales: CondicionesGenerales_Recode = {
        edad_minima: genEdadRango[0],
        edad_maxima: genEdadRango[1],
        kilometraje_max_dia: genKmMax,
        fumar: genCheckboxes.fumar,
        mascota: genCheckboxes.mascotas,
        dev_mismo_conb: genCheckboxes.combustible,
        uso_fuera_ciudad: genCheckboxes.fuera_ciudad,
        multa_conductor: genCheckboxes.multas,
        dev_mismo_lugar: genCheckboxes.lugar_entrega,
        uso_comercial: genCheckboxes.uso_comercial,
      };

      const entrega: EntregaAuto_Recode = {
        estado_combustible: entCombustible.value,
        esterior_limpio: entCheckboxes.exteriorLimpio,
        inter_limpio: entCheckboxes.interiorLimpio,
        rayones: entCheckboxes.rayones,
        llanta_estado: entCheckboxes.llantas,
        interior_da_o: !entCheckboxes.interiorSinDanios,
        herramientas_basicas: [
          { nombre: "Gato hidráulico", cantidad: 1 },
          { nombre: "botiquin", cantidad: 1 },
          { nombre: "Prueba", cantidad: 1 },
          { nombre: "Prueba1", cantidad: 1 },
        ],
      };

      const devolucion: DevolucionAuto_Recode = {
        interior_limpio: devCheckboxes.interior_limpio,
        exterior_limpio: devCheckboxes.exterior_limpio,
        rayones: devCheckboxes.rayones,
        herramientas: devCheckboxes.herramientas_devueltas,
        cobrar_da_os: devCheckboxes.danios,
        combustible_igual: devCheckboxes.combustible_igual,
      };

      const payload = transformCondicionesUso_Recode(id_carro, generales, entrega, devolucion);

      try {
        await postCondicionesUso_Recode(payload);
        alert("Condiciones guardadas con éxito.");
      } catch (error) {
        console.error("Error al guardar condiciones:", error);
        alert("Error al guardar condiciones.");
      }
    };

    useImperativeHandle(ref, () => ({
      enviarFormulario: handleEnviar,
    }));

    const renderTabContent = () => {
      switch (activeTab) {
        case "generales":
          return (
            <General_Recode
              respuestas={genCheckboxes}
              onCheckboxChange={(k) => setGenCheckboxes((p) => ({ ...p, [k]: !p[k] }))}
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
              onCheckboxChange={(k) => setEntCheckboxes((p) => ({ ...p, [k]: !p[k] }))}
            />
          );
        case "devolucion":
          return (
            <Devolucion_Recode
              respuestas={devCheckboxes}
              onCheckboxChange={(k) => setDevCheckboxes((p) => ({ ...p, [k]: !p[k] }))}
            />
          );
      }
    };

    return (
      <div className="w-full max-w-[760px] mx-auto border border-black rounded-[10px] overflow-hidden">
        {/* Tabs */}
        <div className="sticky top-0 z-10 bg-white">
          <div className="flex">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 text-sm font-medium py-2 border-r border-black last:border-r-0
                  first:rounded-tl-[10px] last:rounded-tr-[10px]
                  ${activeTab === tab.key ? "bg-black text-white" : "bg-white text-black"}
                `}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="h-[1px] bg-black" />
        </div>

        {/* Contenido de la pestaña */}
        <div className="bg-white p-4 min-h-[300px]">{renderTabContent()}</div>
      </div>
    );
  }
);

TablaComponentes_Recode.displayName = "TablaComponentes_Recode";

export default memo(TablaComponentes_Recode);
