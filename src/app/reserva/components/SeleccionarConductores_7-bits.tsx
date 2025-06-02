"use client"
import React from "react";

export interface Conductor {
    id: number;
    nombre: string;
}

interface SeleccionarConductoresProps {
    conductores: Conductor[];
    seleccionados: number[];
    onChange: (ids: number[]) => void;
    label?: string;
}

const SeleccionarConductores: React.FC<SeleccionarConductoresProps> = ({
    conductores,
    seleccionados,
    onChange,
    label = "Selecciona uno o más conductores",
}: SeleccionarConductoresProps) => {
    const handleCheckboxChange = (id: number) => {
        const nuevosSeleccionados = seleccionados.includes(id)
            ? seleccionados.filter((selectedId) => selectedId !== id)
            : [...seleccionados, id];
        onChange(nuevosSeleccionados);
    };

    return (
        <div className="mb-4">
            <label className="font-bold block mb-2">{label}</label>
            <div className="flex flex-col gap-2 border p-3 rounded bg-gray-50">
                {conductores.map((c) => (
                    <label key={c.id} className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={seleccionados.includes(c.id)}
                            onChange={() => handleCheckboxChange(c.id)}
                            className="accent-black"
                        />
                        <span className="text-sm">{c.nombre}</span>
                    </label>
                ))}
            </div>
        </div>
    )
}

export default SeleccionarConductores;