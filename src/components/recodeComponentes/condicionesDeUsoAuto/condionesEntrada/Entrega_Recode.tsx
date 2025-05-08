"use client";

import React, { useState, memo } from 'react';
import CustomDropdown_Recode, { Option } from '../CustomDropdown_Recode';

function Entrada_Recode() {
  // Placeholder + opciones reales
  const placeholder: Option<string> = { value: "", label: "Seleccionar estado" };
  const estados: Option<string>[] = [
    placeholder,
    { value: "lleno", label: "Lleno" },
    { value: "medio", label: "Medio" },
    { value: "vacio", label: "Vacío" }
  ];

  // Estado seleccionado empieza en placeholder
  const [combustible, setCombustible] = useState<Option<string>>(placeholder);

  // Condiciones como booleanos
  const [respuestas, setRespuestas] = useState<Record<string, boolean>>({
    exteriorLimpio: false,
    interiorLimpio: false,
    rayones: false,
    llantas: false,
    interiorSinDanios: false
  });

  const handleCheckboxChange = (key: string) => {
    setRespuestas(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-4 px-4 py-4 bg-white rounded-lg shadow">
      {/* Dropdown: columna en mobile, fila en md+ */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
        <label className="font-semibold mb-2 md:mb-0">
          Estado del combustible:
        </label>
        <div className="w-full md:w-1/3">
          <CustomDropdown_Recode
            options={estados}
            value={combustible}
            onChange={setCombustible}
          />
        </div>
      </div>

      {/* Checkboxes: grid 1 columna mobile/tablet, 2 columnas md+ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
        {[
          { label: "Exterior limpio", key: "exteriorLimpio" },
          { label: "Interior limpio", key: "interiorLimpio" },
          { label: "Tiene rayones", key: "rayones" },
          { label: "Llantas en buen estado", key: "llantas" },
          { label: "Interior sin daños", key: "interiorSinDanios" }
        ].map(({ label, key }) => (
          <label key={key} className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={respuestas[key]}
              onChange={() => handleCheckboxChange(key)}
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
