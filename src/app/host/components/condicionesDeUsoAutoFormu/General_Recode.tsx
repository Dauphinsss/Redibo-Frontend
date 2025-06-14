"use client";

import React, { memo } from "react";
import SliderRangeDual_Recode from "./SliderRangeDual_Recode";
import SliderRangeSimple_Recode from "./SliderRangeSimple_Recode";

export interface GeneralRecodeProps {
  respuestas: Record<string, boolean>;
  onCheckboxChange: (key: string) => void;
  edadRango: [number, number];
  onEdadChange: (rango: [number, number]) => void;
  kmMax: number;
  onKmChange: (val: [number]) => void;
}

const condicionesGenerales = [
  { label: "Fumar", key: "fumar" },
  { label: "Mascotas permitidas", key: "mascota" },
  { label: "Devolver mismo tipo de combustible", key: "dev_mismo_conb" },
  { label: "Uso fuera de la ciudad permitido", key: "uso_fuera_ciudad" },
  { label: "Multas por cuenta del conductor", key: "multa_conductor" },
  { label: "Devolver auto en mismo lugar", key: "dev_mismo_lugar" },
  { label: "Uso comercial permitido", key: "uso_comercial" },
];

function General_Recode({
  respuestas,
  onCheckboxChange,
  edadRango,
  onEdadChange,
  kmMax,
  onKmChange,
}: GeneralRecodeProps) {
  const allChecked = condicionesGenerales.every(({ key }) => respuestas[key]);
  const toggleAll = () => {
    condicionesGenerales.forEach(({ key }) => {
      const shouldBe = !allChecked;
      if (respuestas[key] !== shouldBe) {
        onCheckboxChange(key);
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Rango de edad */}
      <div>
        <SliderRangeDual_Recode
          min={18}
          max={70}
          step={1}
          values={edadRango}
          onChange={onEdadChange}
        />
      </div>

      {/* Kilometraje por día */}
      <div>
        <SliderRangeSimple_Recode
          min={100}
          max={15000}
          step={10}
          values={[kmMax]}
          onChange={([km]) => onKmChange([km])}
        />
      </div>

      {/* Texto resumen debajo de sliders */}
      <div className="flex justify-between px-2 text-sm font-medium text-gray-800">
        <span>🧍 Desde: {edadRango[0]}</span>
        <span>😐 Hasta: {edadRango[1]}</span>
        <span>🚗 Km máx: {kmMax} km</span>
      </div>

      {/* Checkboxes generales */}
      <div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          <label className="flex items-center space-x-2 p-2 rounded">
            <input
              type="checkbox"
              checked={allChecked}
              onChange={toggleAll}
              className="h-4 w-4 accent-black border-black rounded focus:ring-black"
            />
            <span className="font-semibold text-sm text-black">Seleccionar todos</span>
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {condicionesGenerales.map(({ label, key }) => {
            const checked = !!respuestas[key];
            return (
              <label
                key={key}
                className={`flex items-center space-x-2 p-2 rounded transition-all duration-150 transform
                  ${checked ? "scale-105 shadow-md bg-gray-50" : "scale-100"}
                `}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => onCheckboxChange(key)}
                  className="h-4 w-4 accent-black border-black rounded focus:ring-black"
                />
                <span className="font-semibold text-sm text-gray-900">{label}</span>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default memo(General_Recode);
