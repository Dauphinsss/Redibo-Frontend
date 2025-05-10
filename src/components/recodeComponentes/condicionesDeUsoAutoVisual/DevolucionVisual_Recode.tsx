"use client";

import React, { memo } from "react";
import { DevolucionAutoVisual } from "@/interface/CondicionesUsoVisual_interface_Recode";

export interface DevolucionVisualProps {
  condiciones: DevolucionAutoVisual;
}

const condicionesLabels: Record<keyof DevolucionAutoVisual, string> = {
  interior_limpio: "Interior limpio",
  exterior_limpio: "Exterior limpio",
  rayones: "Tiene rayones visibles",
  herramientas: "Herramientas devueltas",
  cobrar_da_os: "Cobrar daños adicionales presentes",
  combustible_igual: "Combustible igual al recibido",
};

function DevolucionVisual_Recode({ condiciones }: DevolucionVisualProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-6">
      <ul className="space-y-2 text-sm">
        {Object.entries(condicionesLabels).map(([key, label]) => (
          <li
            key={key}
            className="flex justify-between items-center border-b border-gray-200 pb-2 last:border-none"
          >
            <span>{label}</span>
            <span className={condiciones[key as keyof typeof condiciones] ? "text-green-600 font-bold" : "text-red-600 font-bold"}>
              {condiciones[key as keyof typeof condiciones] ? "✓" : "✗"}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default memo(DevolucionVisual_Recode);
