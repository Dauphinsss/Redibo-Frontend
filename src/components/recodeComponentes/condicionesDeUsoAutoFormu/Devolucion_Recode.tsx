"use client";

import React, { memo } from "react";

export interface DevolucionRecodeProps {
    respuestas: Record<string, boolean>;
    onCheckboxChange: (key: string) => void;
}

function Devolucion_Recode({ respuestas, onCheckboxChange }: DevolucionRecodeProps) {
    const condiciones = [
        { label: "Interior limpio", key: "interior_limpio" },
        { label: "Exterior limpio", key: "exterior_limpio" },
        { label: "Tiene rayones", key: "rayones" },
        { label: "Herramientas devueltas", key: "herramientas" },
        { label: "Cobrar daños adicionales presentes", key: "cobrar_da_os" },
        { label: "Nivel de combustible igual al entregado", key: "combustible_igual" },
    ];
    const allChecked = condiciones.every(({ key }) => respuestas[key]);
    const toggleAll = () => {
        condiciones.forEach(({ key }) => {
        const shouldBe = !allChecked;
        if (respuestas[key] !== shouldBe) {
            onCheckboxChange(key);
        }
        });
    };
    return (
        <div className="space-y-4 px-4 py-4 bg-white rounded-lg shadow">
            
            <div className="mb-2">
                <label 
                    className="inline-flex items-center space-x-2">
                    <input
                    type="checkbox"
                    checked={allChecked}
                    onChange={toggleAll}
                    className="h-4 w-4 accent-black border-black rounded focus:ring-black"
                    />
                    <span className="font-semibold text-sm text-black">Seleccionar todos</span>
                </label>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
                {condiciones.map(({ label, key }) => {
                const checked = !!respuestas[key];
                    return (
                        <label
                            key={key}
                            className={`flex items-center space-x-2 p-2 rounded transition-all duration-150 transform
                                ${checked ? "scale-105 shadow-md bg-gray-50" : "scale-100"}
                            `}
                        >
                            <input
                                type="checkbox"
                                checked={checked}
                                onChange={() => onCheckboxChange(key)}
                                className="h-4 w-4 accent-black border-black rounded focus:ring-black"
                            />
                            <span className="font-semibold text-sm text-gray-900">{label}</span>
                        </label>
                    );
                })}
            </div>
        </div>
    );
}

export default memo(Devolucion_Recode);
