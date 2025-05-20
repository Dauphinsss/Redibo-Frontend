"use client";

import React, { memo } from "react";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";
import { EntregaAutoVisual } from "@/app/reserva/interface/CondicionesUsoVisual_interface_Recode";

export interface EntregaVisualProps {
  condiciones: EntregaAutoVisual;
}

const condicionesLabels: Record<keyof Omit<EntregaAutoVisual, "estado_combustible">, string> = {
  esterior_limpio: "Exterior limpio",
  inter_limpio: "Interior limpio",
  rayones: "Tiene rayones visibles",
  llanta_estado: "Llantas en buen estado",
  interior_da_o: "Interior sin daños",
};

function EntregaVisual_Recode({ condiciones }: EntregaVisualProps) {
  const { estado_combustible, ...rest } = condiciones;

  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-6 text-sm text-gray-800">
      {/* Combustible */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <p className="font-medium text-black">Estado del combustible:</p>
        <span className="inline-block bg-black text-white text-xs font-semibold px-3 py-1 rounded-full">
          {estado_combustible}
        </span>
      </div>

      {/* Condiciones */}
      <ul className="divide-y divide-gray-200 pt-4">
        {Object.entries(condicionesLabels).map(([key, label]) => {
          const valor = rest[key as keyof typeof rest];
          return (
            <li key={key} className="flex justify-between items-center py-2">
              <span>{label}</span>
              <span className="flex items-center">
                {valor ? (
                  <CheckCircleIcon className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircleIcon className="h-5 w-5 text-red-500" />
                )}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default memo(EntregaVisual_Recode);
