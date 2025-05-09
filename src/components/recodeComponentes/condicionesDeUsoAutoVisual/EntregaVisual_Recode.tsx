"use client";

import React, { memo } from "react";

interface EntregaVisualProps {
  estadoCombustible: string;
  condiciones: Record<string, boolean>;
}

const condicionesLabels: Record<string, string> = {
  exteriorLimpio: "Exterior limpio",
  rayones: "Tiene rayones visibles",
  interiorLimpio: "Interior limpio",
  llantas: "Llantas en buen estado",
  interiorSinDanios: "Interior sin daños",
};

function EntregaVisual_Recode({ estadoCombustible, condiciones }: EntregaVisualProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-6">

      <div className="text-sm text-gray-700">
        <p><strong>Estado del combustible:</strong> {estadoCombustible || "No especificado"}</p>
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

export default memo(EntregaVisual_Recode);
