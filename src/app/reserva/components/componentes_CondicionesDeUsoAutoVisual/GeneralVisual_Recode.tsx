"use client";

import React, { memo } from "react";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";
import { CondicionesGeneralesVisual } from "@/app/reserva/interface/CondicionesUsoVisual_interface_Recode";

export interface GeneralVisualProps {
  condiciones: CondicionesGeneralesVisual;
}

const condicionesLabels: Record<keyof Omit<CondicionesGeneralesVisual, "edad_minima" | "edad_maxima" | "kilometraje_max_dia">, string> = {
  fumar: "Está permitido fumar",
  mascota: "Se permiten mascotas",
  dev_mismo_conb: "Debe devolverse con mismo tipo de combustible",
  uso_fuera_ciudad: "Se permite uso fuera de la ciudad",
  multa_conductor: "Multas son responsabilidad del conductor",
  dev_mismo_lugar: "Debe devolverse en el mismo lugar",
  uso_comercial: "Se permite uso comercial",
};

function GeneralVisual_Recode({ condiciones }: GeneralVisualProps) {
  const { edad_minima, edad_maxima, kilometraje_max_dia } = condiciones;

  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-6 text-sm text-gray-800">
      {/* Rango y kilometraje */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
        <div className="bg-gray-100 rounded p-3">
          <p className="font-medium text-gray-600">Edad mínima</p>
          <p className="text-black font-semibold">{edad_minima} años</p>
        </div>
        <div className="bg-gray-100 rounded p-3">
          <p className="font-medium text-gray-600">Edad máxima</p>
          <p className="text-black font-semibold">{edad_maxima} años</p>
        </div>
        <div className="bg-gray-100 rounded p-3">
          <p className="font-medium text-gray-600">Km máximo por día</p>
          <p className="text-black font-semibold">{kilometraje_max_dia} km</p>
        </div>
      </div>

      {/* Condiciones adicionales */}
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

export default memo(GeneralVisual_Recode);
