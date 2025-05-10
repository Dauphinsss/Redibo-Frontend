"use client";

import React, { memo } from "react";
import { CondicionesGeneralesVisual } from "@/interface/CondicionesUsoVisual_interface_Recode";

export interface GeneralVisualProps {
  condiciones: CondicionesGeneralesVisual;
}

const condicionesLabels: Record<keyof Omit<CondicionesGeneralesVisual, "edad_minima" | "edad_maxima" | "kilometraje_max_dia">, string> = {
  fumar: "Está permitido fumar",
  mascota: "Se permiten mascotas",
  dev_mismo_conb: "Debe devolverse con mismo nivel de combustible",
  uso_fuera_ciudad: "Se permite uso fuera de la ciudad",
  multa_conductor: "Multas son responsabilidad del conductor",
  dev_mismo_lugar: "Debe devolverse en el mismo lugar",
  uso_comercial: "Se permite uso comercial",
};

function GeneralVisual_Recode({ condiciones }: GeneralVisualProps) {
  const { edad_minima, edad_maxima, kilometraje_max_dia } = condiciones;

  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-6">
      <div className="space-y-2 text-sm text-gray-700">
        <p><strong>Edad mínima del conductor:</strong> {edad_minima} años</p>
        <p><strong>Edad máxima del conductor:</strong> {edad_maxima} años</p>
        <p><strong>Kilometraje máximo por día:</strong> {kilometraje_max_dia} km</p>
      </div>

      <ul className="space-y-2 pt-4 text-sm">
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

export default memo(GeneralVisual_Recode);
