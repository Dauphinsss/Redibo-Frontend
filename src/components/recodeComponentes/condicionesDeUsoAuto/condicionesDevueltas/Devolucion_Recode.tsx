"use client";

import React, { memo } from 'react';

export interface DevolucionRecodeProps {
    respuestas: Record<string, boolean>;
    onCheckboxChange: (key: string) => void;
}

function Devolucion_Recode({ respuestas, onCheckboxChange }: DevolucionRecodeProps) {
    // Lista de condiciones para devolución
    const condiciones = [
        { label: "Interior limpio", key: "interior_limpio" },
        { label: "Exterior limpio", key: "exterior_limpio" },
        { label: "Tiene rayones", key: "rayones" },
        { label: "Herramientas devueltas", key: "herramientas_devueltas" },
        { label: "Cobrar daños adicionales presentes", key: "danios" },
        { label: "Nivel de combustible igual al entregado", key: "combustible_igual" }
    ];

    return (
        <div className="space-y-4 px-4 py-4 bg-white rounded-lg shadow">
            {/* Grid responsive: 1 columna en mobile, 2 en md+ */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                {condiciones.map(({ label, key }) => (
                    <label key={key} className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            checked={respuestas[key]}
                            onChange={() => onCheckboxChange(key)}
                            className="h-4 w-4 accent-black border-black rounded"
                        />
                        <span className="font-semibold">{label}</span>
                    </label>
                ))}
            </div>
        </div>
    );
}

export default memo(Devolucion_Recode);
