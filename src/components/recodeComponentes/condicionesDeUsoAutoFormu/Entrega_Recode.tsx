"use client";

import React, { memo } from "react";
import CustomDropdown_Recode, { Option } from "./CustomDropdown_Recode";

export interface EntradaRecodeProps {
  opciones: Option<string>[];
  valorCombustible: Option<string>;
  onChangeCombustible: (opt: Option<string>) => void;
  respuestas: Record<string, boolean>;
  onCheckboxChange: (key: string) => void;
}

function Entrada_Recode({
  opciones,
  valorCombustible,
  onChangeCombustible,
  respuestas,
  onCheckboxChange,
}: EntradaRecodeProps) {
  return (
    <div className="space-y-4 px-4 py-4 bg-white rounded-lg shadow">
      {/* Dropdown: estado del combustible */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
        <label className="font-semibold mb-2 md:mb-0">
          Estado del combustible:
        </label>
        <div className="w-full md:w-1/3">
          <CustomDropdown_Recode
            options={opciones}
            value={valorCombustible}
            onChange={onChangeCombustible}
          />
        </div>
      </div>

      {/* Checkboxes: estado físico del auto */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
        {[
          { label: "Exterior limpio", key: "esterior_limpio" },
          { label: "Interior limpio", key: "inter_limpio" },
          { label: "Tiene rayones", key: "rayones" },
          { label: "Llantas en buen estado", key: "llanta_estado" },
          { label: "Interior dañado", key: "interior_da_o" },
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

export default memo(Entrada_Recode);
