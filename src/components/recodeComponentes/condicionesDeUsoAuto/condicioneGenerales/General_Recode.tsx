"use client";

import React, { memo } from "react";
import SliderRangeDualRecode from "../SliderRangeDual_Recode";
import SliderRangeSimple_Recode from "../SliderRangeSimple_Recode";

export interface GeneralRecodeProps {
  respuestas: Record<string, boolean>;
  onCheckboxChange: (key: string) => void;
  edadRango: [number, number];
  onEdadChange: (values: [number, number]) => void;
  kmMax: number;
  onKmChange: (values: [number]) => void;
}

function General_Recode({
  respuestas,
  onCheckboxChange,
  edadRango,
  onEdadChange,
  kmMax,
  onKmChange
}: GeneralRecodeProps) {
  return (
    <div className="space-y-6 px-4 py-4 bg-white rounded-lg shadow">
      {/* Slider dual para rango de edad */}
      <SliderRangeDualRecode
        min={18}
        max={70}
        label="Edad mínima y máxima de los conductores"
        unit=" años"
        values={edadRango}
        onChange={onEdadChange}
      />

      {/* Slider simple para kilometraje */}
      <SliderRangeSimple_Recode
        min={0}
        max={900}
        label="Kilometraje permitido"
        unit=" km"
        values={[kmMax]}
        onChange={onKmChange}
      />

      {/* Resumen de valores seleccionados */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-4 gap-y-1 text-sm text-gray-700 px-2">
        <div className="flex items-center space-x-2">
          <span className="text-lg">🧍</span>
          <span>
            Desde: <strong>{edadRango[0]}</strong> años
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-lg">👴</span>
          <span>
            Hasta: <strong>{edadRango[1]}</strong> años
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-lg">🚗</span>
          <span>
            Km máx.: <strong>{kmMax}</strong> km
          </span>
        </div>
      </div>

      {/* Checkboxes en grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-4">
        {[
          { label: "Fumar", key: "fumar" },
          { label: "Mascotas permitidas", key: "mascotas" },
          { label: "Devolver mismo combustible", key: "combustible" },
          { label: "Uso fuera de la ciudad permitido", key: "fuera_ciudad" },
          { label: "Multas por cuenta del conductor", key: "multas" },
          { label: "Devolver auto en mismo lugar", key: "lugar_entrega" },
          { label: "Uso comercial permitido", key: "uso_comercial" }
        ].map(({ label, key }) => (
          <label key={key} className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={respuestas[key]}
              onChange={() => onCheckboxChange(key)}
              className="h-4 w-4 accent-black border-black rounded"
            />
            <span className="font-semibold">{label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

export default memo(General_Recode);
