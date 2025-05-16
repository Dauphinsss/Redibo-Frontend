"use client";

import React, { memo } from "react";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";
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
    <div className="bg-white rounded-lg shadow p-6 space-y-6 text-sm text-gray-800">
      <ul className="divide-y divide-gray-200">
        {Object.entries(condicionesLabels).map(([key, label]) => {
          const valor = condiciones[key as keyof typeof condiciones];
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

export default memo(DevolucionVisual_Recode);
