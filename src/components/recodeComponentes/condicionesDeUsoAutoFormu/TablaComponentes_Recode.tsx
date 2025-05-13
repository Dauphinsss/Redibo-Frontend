"use client";

import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  memo,
  useRef,
  useEffect,
} from "react";

import General_Recode from "./General_Recode";
import Entrada_Recode from "./Entrega_Recode";
import Devolucion_Recode from "./Devolucion_Recode";

import ModalRecode from "./ModalRecode";
import { postCondicionesUso_Recode } from "@/service/services_Recode";
import { transformCondicionesUso_Recode } from "@/utils/transformCondicionesUsoFormu_Recode";
import {
  CondicionesGenerales_Recode,
  EntregaAuto_Recode,
  DevolucionAuto_Recode,
} from "@/interface/CondicionesUsoFormu_interface_Recode";

type Tab = "generales" | "entrega" | "devolucion";
const tabs: { key: Tab; label: string }[] = [
  { key: "generales", label: "Condiciones generales" },
  { key: "entrega", label: "Entrega del auto" },
  { key: "devolucion", label: "Devolución del auto" },
];

interface TablaComponentesProps {
  id_carro: number;
  setIsSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
}

const TablaComponentes_Recode = forwardRef<{ enviarFormulario: () => void }, TablaComponentesProps>(
  ({ id_carro, setIsSubmitting }, ref) => {
    const [activeTab, setActiveTab] = useState<Tab>("generales");
    const [modalSuccess, setModalSuccess] = useState(false);
    const [modalError, setModalError] = useState(false);
    const [mostrarAdvertencia, setMostrarAdvertencia] = useState(false);

    // Ref para enfocar el dropdown
    const dropdownRef = useRef<HTMLButtonElement | null>(null);

    // Enfoca el input del dropdown al cerrar el modal de advertencia
    useEffect(() => {
      if (!mostrarAdvertencia && dropdownRef.current) {
        dropdownRef.current.focus();
      }
    }, [mostrarAdvertencia]);

    type OptionString = { value: string; label: string };
    const placeholder: OptionString = { value: "", label: "Seleccionar estado" };
    const estadosEntrega: OptionString[] = [
      placeholder,
      { value: "Lleno", label: "Lleno" },
      { value: "Medio", label: "Medio" },
      { value: "Vacío", label: "Vacío" },
    ];

    const [entCombustible, setEntCombustible] = useState<OptionString>(placeholder);

    const [entCheckboxes, setEntCheckboxes] = useState<Record<string, boolean>>({
      esterior_limpio: false,
      inter_limpio: false,
      rayones: false,
      llanta_estado: false,
      interior_da_o: false,
    });

    const [devCheckboxes, setDevCheckboxes] = useState<Record<string, boolean>>({
      interior_limpio: false,
      exterior_limpio: false,
      rayones: false,
      herramientas: false,
      cobrar_da_os: false,
      combustible_igual: false,
    });

    const [genCheckboxes, setGenCheckboxes] = useState<Record<string, boolean>>({
      fumar: false,
      mascota: false,
      dev_mismo_conb: false,
      uso_fuera_ciudad: false,
      multa_conductor: false,
      dev_mismo_lugar: false,
      uso_comercial: false,
    });

    const [genEdadRango, setGenEdadRango] = useState<[number, number]>([18, 70]);
    const [genKmMax, setGenKmMax] = useState<number>(0);

    const handleEnviar = async () => {
      if (!entCombustible.value || entCombustible.value === "") {
        setMostrarAdvertencia(true);
        return;
      }

      setIsSubmitting(true);

      const condiciones_generales: CondicionesGenerales_Recode = {
        edad_minima: genEdadRango[0],
        edad_maxima: genEdadRango[1],
        kilometraje_max_dia: genKmMax,
        fumar: genCheckboxes.fumar,
        mascota: genCheckboxes.mascota,
        dev_mismo_conb: genCheckboxes.dev_mismo_conb,
        uso_fuera_ciudad: genCheckboxes.uso_fuera_ciudad,
        multa_conductor: genCheckboxes.multa_conductor,
        dev_mismo_lugar: genCheckboxes.dev_mismo_lugar,
        uso_comercial: genCheckboxes.uso_comercial,
      };

      const entrega_auto: EntregaAuto_Recode = {
        estado_combustible: entCombustible.value,
        esterior_limpio: entCheckboxes.esterior_limpio,
        inter_limpio: entCheckboxes.inter_limpio,
        rayones: entCheckboxes.rayones,
        llanta_estado: entCheckboxes.llanta_estado,
        interior_da_o: entCheckboxes.interior_da_o,
      };

      const devolucion_auto: DevolucionAuto_Recode = {
        interior_limpio: devCheckboxes.interior_limpio,
        exterior_limpio: devCheckboxes.exterior_limpio,
        rayones: devCheckboxes.rayones,
        herramientas: devCheckboxes.herramientas,
        cobrar_da_os: devCheckboxes.cobrar_da_os,
        combustible_igual: devCheckboxes.combustible_igual,
      };

      const payload = transformCondicionesUso_Recode(
        id_carro,
        condiciones_generales,
        entrega_auto,
        devolucion_auto
      );

      try {
        await postCondicionesUso_Recode(payload);
        setModalSuccess(true);
      } catch (error) {
        console.error("Error al guardar condiciones:", error);
        setModalError(true);
      } finally {
        setIsSubmitting(false);
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
              ref={dropdownRef}
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
      <>
        <ModalRecode
          isOpen={modalSuccess}
          onClose={() => setModalSuccess(false)}
          title="¡Guardado exitoso!"
          description="Las condiciones fueron guardadas correctamente."
          variant="success"
          autoCloseAfter={3000}
        />

        <ModalRecode
          isOpen={modalError}
          onClose={() => setModalError(false)}
          title="Error al guardar"
          description="Ocurrió un problema al guardar. Intenta nuevamente."
          variant="error"
        />

        <ModalRecode
          isOpen={mostrarAdvertencia}
          onClose={() => setMostrarAdvertencia(false)}
          title="Información incompleta"
          description="Debes seleccionar el estado del combustible antes de continuar."
          variant="warning"
        />

        <div className="w-full max-w-[760px] mx-auto border border-black rounded-[10px] overflow-hidden">
          <div className="sticky top-0 z-10 bg-white">
            <div className="flex">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex-1 text-sm font-medium py-2 border-r border-black last:border-r-0
                    first:rounded-tl-[10px] last:rounded-tr-[10px]
                    ${activeTab === tab.key ? "bg-black text-white" : "bg-white text-black"}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="h-[1px] bg-black" />
          </div>

          <div className="bg-white p-4 min-h-[300px]">{renderTabContent()}</div>
        </div>
      </>
    );
  }
);

TablaComponentes_Recode.displayName = "TablaComponentes_Recode";
export default memo(TablaComponentes_Recode);
