"use client";

import React, { forwardRef } from "react";
import CustomDropdown_Recode, { Option } from "./CustomDropdown_Recode";

export interface EntradaRecodeProps {
  opciones: Option<string>[];
  valorCombustible: Option<string>;
  onChangeCombustible: (opt: Option<string>) => void;
  respuestas: Record<string, boolean>;
  onCheckboxChange: (key: string) => void;
  errorCombustible?: boolean;
}

const Entrada_Recode = forwardRef<HTMLButtonElement, EntradaRecodeProps>(
  (
    {
      opciones,
      valorCombustible,
      onChangeCombustible,
      respuestas,
      onCheckboxChange,
      errorCombustible = false,
    },
    ref
  ) => {
    const condiciones = [
      { label: "Exterior limpio", key: "esterior_limpio" },
      { label: "Interior limpio", key: "inter_limpio" },
      { label: "Rayones visibles", key: "rayones" },
      { label: "Buen estado de llantas", key: "llanta_estado" },
      { label: "Daños en interior", key: "interior_da_o" },
    ];

    return (
      <div className="space-y-6">
        {/* Estado del combustible */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Estado del combustible
          </label>
          <CustomDropdown_Recode
            ref={ref}
            options={opciones}
            value={valorCombustible}
            onChange={onChangeCombustible}
            error={errorCombustible}
          />
        </div>

        {/* Checkboxes de condiciones */}
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {condiciones.map(({ label, key }) => {
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
);

Entrada_Recode.displayName = "Entrada_Recode";
export default Entrada_Recode;