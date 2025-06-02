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
        <div>
            <label className="font-bold block mb-2">{label}</label>
            <div className="w-full max-w-md border rounded-lg p-2 bg-gray-50">
                <ul className = "max-h-20 overflow-y-auto space-y-1">
                    {conductores.map((c) => (
                        <li key={c.id} className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id={`conductor-${c.id}`}
                            checked={seleccionados.includes(c.id)}
                            onChange={() => {
                            if (seleccionados.includes(c.id)) {
                                onChange(seleccionados.filter((id) => id !== c.id));
                            } else {
                                onChange([...seleccionados, c.id]);
                            }
                            }}
                            className="accent-black"
                        />
                        <label
                            htmlFor={`conductor-${c.id}`}
                            className="select-none cursor-pointer"
                        >
                            {c.nombre}
                        </label>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default SeleccionarConductores;