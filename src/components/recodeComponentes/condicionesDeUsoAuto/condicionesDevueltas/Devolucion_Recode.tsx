"use client";

import React, { memo, useState } from 'react';

// Lista de condiciones para devolver el auto
const conditions: { label: string; key: string }[] = [
    { label: "Interior limpio", key: "interior_limpio" },
    { label: "Exterior limpio", key: "exterior_limpio" },
    { label: "Tiene rayones", key: "rayones" },
    { label: "Herramientas devueltas", key: "herramientas_devueltas" },
    { label: "Cobrar daños adicionales presentes", key: "danios" },
    { label: "Nivel de combustible igual al entregado", key: "combustible_igual" }
];

function Devueltas_Recode() {
    // Estado booleano para cada condición (true = sí, false = no)
    const [respuestas, setRespuestas] = useState<Record<string, boolean>>({
        interior_limpio: true,
        exterior_limpio: true,
        rayones: true,
        herramientas_devueltas: true,
        danios: true,
        combustible_igual: true
    });

    // Alterna el valor booleano al hacer clic
    const handleToggle = (key: string) => {
        setRespuestas(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div className="px-4 py-4 bg-white rounded-lg shadow">
            {/* Grid responsive */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-4">
                {conditions.map(({ label, key }) => (
                    <label key={key} className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            checked={respuestas[key]}
                            onChange={() => handleToggle(key)}
                            className="h-4 w-4 accent-black border-black rounded"
                        />
                        <span className="font-semibold">{label}</span>
                    </label>
                ))}
            </div>
        </div>
    );
}

export default memo(Devueltas_Recode);
