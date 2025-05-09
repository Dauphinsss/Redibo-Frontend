"use client";

import React, { memo } from "react";

interface DevolucionVisualProps {
  condiciones: Record<string, boolean>;
}

const condicionesLabels: Record<string, string> = {
  interior_limpio: "Interior limpio",
  exterior_limpio: "Exterior limpio",
  rayones: "Tiene rayones visibles",
  herramientas_devueltas: "Herramientas devueltas",
  danios: "Cobrar daños adicionales presentes",
  combustible_igual: "Combustible igual al recibido",
};

function DevolucionVisual_Recode({ condiciones }: DevolucionVisualProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-6">

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

export default memo(DevolucionVisual_Recode);