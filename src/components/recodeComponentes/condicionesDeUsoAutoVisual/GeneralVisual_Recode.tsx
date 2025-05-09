"use client";

import React, { memo } from "react";

interface GeneralVisualProps {
  edadMin: number;
  edadMax: number;
  kmMax: number;
  condiciones: Record<string, boolean>;
}

const condicionesLabels: Record<string, string> = {
  fumar: "Está permitido fumar",
  mascota: "Se permiten mascotas",
  dev_mismo_conb: "Debe devolverse con mismo nivel de combustible",
  uso_fuera_ciudad: "Se permite uso fuera de la ciudad",
  multa_conductor: "Multas son responsabilidad del conductor",
  dev_mismo_lugar: "Debe devolverse en el mismo lugar",
  uso_comercial: "Se permite uso comercial",
};

function GeneralVisual_Recode({ edadMin, edadMax, kmMax, condiciones }: GeneralVisualProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-6">
      
      <div className="space-y-2 text-sm text-gray-700">
        <p><strong>Edad mínima del conductor:</strong> {edadMin} años</p>
        <p><strong>Edad máxima del conductor:</strong> {edadMax} años</p>
        <p><strong>Kilometraje máximo por día:</strong> {kmMax} km</p>
      </div>

      <ul className="space-y-2 pt-4 text-sm">
        {Object.entries(condicionesLabels).map(([key, label]) => (
          <li
            key={key}
            className="flex justify-between items-center last:border-b-0 pb-2"
          >
            <span>{label}</span>
            <span className={condiciones[key] ? "text-green-600 font-bold" : "text-red-600 font-bold"}>
              {condiciones[key] ? "✓" : "✗"}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default memo(GeneralVisual_Recode);
