"use client";

import React, { memo } from "react";
import { EntregaAutoVisual } from "@/interface/CondicionesUsoVisual_interface_Recode";

export interface EntregaVisualProps {
  condiciones: EntregaAutoVisual;
}

const condicionesLabels: Record<keyof Omit<EntregaAutoVisual, "estado_combustible">, string> = {
  esterior_limpio: "Exterior limpio",
  rayones: "Tiene rayones visibles",
  inter_limpio: "Interior limpio",
  llanta_estado: "Llantas en buen estado",
  interior_da_o: "Interior sin daños",
};

function EntregaVisual_Recode({ condiciones }: EntregaVisualProps) {
  const { estado_combustible, ...rest } = condiciones;

  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-6">
      <p className="text-sm text-gray-700">
        <strong>Estado del combustible:</strong> {estado_combustible}
      </p>

      <ul className="space-y-2 pt-4 text-sm">
        {Object.entries(condicionesLabels).map(([key, label]) => (
          <li
            key={key}
            className="flex justify-between items-center border-b border-gray-200 pb-2 last:border-none"
          >
            <span>{label}</span>
            <span className={rest[key as keyof typeof rest] ? "text-green-600 font-bold" : "text-red-600 font-bold"}>
              {rest[key as keyof typeof rest] ? "✓" : "✗"}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default memo(EntregaVisual_Recode);
