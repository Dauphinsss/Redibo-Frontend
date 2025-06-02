"use client"
import React from "react";

export interface Conductor {
    id: number | string;
    nombre: string;
}

interface SeleccionarConductoresProps {
    conductores: Conductor[];
    seleccionados: [];
    setSeleccionados: (ids: string[]) => void;
    label?: string;
}

const SeleccionarConductores: React.FC<SeleccionarConductoresProps> = ({
    conductores,
    seleccionados,
    setSeleccionados,
    label = "Selecciona uno o más conductores",
}) => {
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const values = Array.from(e.target.selectedOptions, (opt) => opt.value);
        setSeleccionados(values);
    };

    return (
        <div>
            <label className="font-bold mb-2 block">{label}</label>
            <select
                multiple
                className="w-full p-2 border rounded"
                value={seleccionados}
                onChange={handleChange}
                size={Math.min(4, conductores.length)}
            >
                {conductores.map((c) => (
                    <option key={c.id} value={c.id}>
                    {c.nombre}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default SeleccionarConductores;